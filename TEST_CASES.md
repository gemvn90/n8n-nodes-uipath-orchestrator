# OAuth2 & Endpoint Configuration - Test Cases

**Project**: n8n-nodes-uipath-orchestrator  
**Date**: November 11, 2025

---

## 🧪 Test Suite

### Test Category 1: Token Caching

#### TC-1.1: Token Cache Hit
**Objective**: Verify token is cached and reused within expiry

**Steps:**
1. Configure credentials with valid OAuth details
2. Execute first operation (e.g., Get Folders)
3. Note OAuth token request timestamp (use network inspector)
4. Immediately execute second operation
5. Check network tab for OAuth requests

**Expected Result:**
- ✅ First operation: 1 OAuth request
- ✅ Second operation: 0 OAuth requests (reuses cached token)
- ✅ Total: 1 OAuth request for 2 operations

**Validation Points:**
- `tokenCache.get(cacheKey)` returns cached token
- `expiresAt > Date.now() + 60000` condition true
- axios.post() to OAuth URL not called

---

#### TC-1.2: Token Cache Expiry
**Objective**: Verify new token requested after cache expiry

**Steps:**
1. Configure credentials
2. Execute operation
3. Wait until cache expiry (60s before token expiry)
4. Execute another operation
5. Check for new OAuth request

**Expected Result:**
- ✅ First operation: Gets token, caches it
- ✅ After wait period: Cache considered expired
- ✅ Second operation: New OAuth request made
- ✅ New token cached again

---

#### TC-1.3: Multiple Credentials
**Objective**: Verify separate cache entries for different credentials

**Steps:**
1. Create credential set A (clientId_A)
2. Create credential set B (clientId_B)
3. Execute operation with credential A
4. Execute operation with credential B
5. Execute another operation with credential A

**Expected Result:**
- ✅ Cache key for A: "tenantName:clientId_A"
- ✅ Cache key for B: "tenantName:clientId_B"
- ✅ Each has separate cache entry
- ✅ 2 OAuth requests total (not 3)

---

### Test Category 2: Endpoint Detection

#### TC-2.1: Cloud UiPath Auto-Detection
**Objective**: Verify cloud.uipath.com detection

**Steps:**
1. Set tenantName = "cloud.uipath.com"
2. Leave oauthTokenUrl empty
3. Execute operation
4. Capture OAuth request URL

**Expected Result:**
- ✅ OAuth URL = `https://cloud.uipath.com/identity_/connect/token`
- ✅ Not using default pattern

**Validation:**
```
Expected: https://cloud.uipath.com/identity_/connect/token
Actual:   [From network inspector]
Match:    ✅ YES
```

---

#### TC-2.2: On-Premise Auto-Detection
**Objective**: Verify on-premise detection when not cloud

**Steps:**
1. Set tenantName = "my-uipath.company.com"
2. Leave oauthTokenUrl empty
3. Execute operation
4. Capture OAuth request URL

**Expected Result:**
- ✅ OAuth URL = `https://my-uipath.company.com/api/oauth/token`

**Validation:**
```
Expected: https://my-uipath.company.com/api/oauth/token
Actual:   [From network inspector]
Match:    ✅ YES
```

---

#### TC-2.3: Custom OAuth Token URL Override
**Objective**: Verify custom oauthTokenUrl takes precedence

**Steps:**
1. Set tenantName = "cloud.uipath.com"
2. Set oauthTokenUrl = "https://custom-auth.internal.com/oauth/token"
3. Execute operation
4. Capture OAuth request URL

**Expected Result:**
- ✅ OAuth URL = `https://custom-auth.internal.com/oauth/token`
- ✅ Auto-detection ignored

**Validation:**
```
Expected: https://custom-auth.internal.com/oauth/token
Actual:   [From network inspector]
Match:    ✅ YES
```

---

### Test Category 3: Base URL Configuration

#### TC-3.1: Default Base URL
**Objective**: Verify default base URL construction

**Steps:**
1. Leave apiBaseUrl empty
2. Set tenantName = "cloud.uipath.com"
3. Set accountLogicalName = "myaccount"
4. Set tenantLogicalName = "DefaultTenant"
5. Execute Get Folders operation
6. Capture API request URL

**Expected Result:**
- ✅ API URL = `https://cloud.uipath.com/myaccount/DefaultTenant/orchestrator_/api/Folders?key=...`

---

#### TC-3.2: Custom Base URL Override
**Objective**: Verify custom apiBaseUrl takes precedence

**Steps:**
1. Set apiBaseUrl = "https://api.mycompany.internal/orchestrator_"
2. Execute Get Folders operation
3. Capture API request URL

**Expected Result:**
- ✅ API URL = `https://api.mycompany.internal/orchestrator_/api/Folders?key=...`
- ✅ Default construction ignored

---

#### TC-3.3: Base URL with Custom Domain
**Objective**: Test on-premise custom domain

**Steps:**
1. Set tenantName = "uipath.mycompany.com"
2. Set accountLogicalName = "corporate"
3. Set tenantLogicalName = "MainTenant"
4. Leave apiBaseUrl empty
5. Execute operation

**Expected Result:**
- ✅ API URL = `https://uipath.mycompany.com/corporate/MainTenant/orchestrator_/...`

---

### Test Category 4: OAuth Scopes

#### TC-4.1: Default Scopes
**Objective**: Verify default scopes when not specified

**Steps:**
1. Leave scopes empty
2. Execute operation
3. Capture OAuth token request body

**Expected Result:**
- ✅ Scopes = "OR.Administration OR.Execution OR.Assets OR.Users OR.Folders"

**Validation:**
```
POST OAuth token endpoint
Body: {...scope: "OR.Administration OR.Execution OR.Assets OR.Users OR.Folders"...}
```

---

#### TC-4.2: Custom Scopes
**Objective**: Verify custom scopes override default

**Steps:**
1. Set scopes = "OR.Settings OR.Monitoring"
2. Execute operation
3. Capture OAuth token request body

**Expected Result:**
- ✅ Scopes = "OR.Settings OR.Monitoring"
- ✅ Default scopes ignored

---

#### TC-4.3: Restricted Scopes
**Objective**: Verify read-only scope works

**Steps:**
1. Set scopes = "OR.Folders.Read OR.Users.Read"
2. Try read operation (should work)
3. Try write operation (should fail)

**Expected Result:**
- ✅ Read operation succeeds
- ✅ Write operation fails with permission error
- ✅ OAuth/n8n respects scope restrictions

---

### Test Category 5: Backward Compatibility

#### TC-5.1: Existing Credentials Without New Fields
**Objective**: Verify old credentials still work

**Steps:**
1. Load n8n with existing workflow
2. Don't set apiBaseUrl, oauthTokenUrl, scopes
3. Execute workflow
4. Monitor for errors

**Expected Result:**
- ✅ Workflow executes successfully
- ✅ Uses default endpoint pattern
- ✅ Uses default scopes
- ✅ No breaking changes

---

#### TC-5.2: Empty String Values
**Objective**: Verify empty strings treated as unset

**Steps:**
1. Set apiBaseUrl = ""
2. Set oauthTokenUrl = ""
3. Set scopes = ""
4. Execute operation

**Expected Result:**
- ✅ Treated as if not set
- ✅ Falls back to defaults
- ✅ Same as TC-5.1

---

### Test Category 6: Error Handling

#### TC-6.1: Invalid OAuth Endpoint
**Objective**: Verify error when OAuth fails

**Steps:**
1. Set oauthTokenUrl = "https://invalid-endpoint.com/token"
2. Execute operation
3. Check error message

**Expected Result:**
- ✅ Error: "OAuth authentication failed: ..."
- ✅ Detailed error from failed request
- ✅ Graceful error handling

**Error Message Should Contain:**
- Response status code
- Response status text
- Error details from server

---

#### TC-6.2: Invalid API Endpoint
**Objective**: Verify error when API endpoint unreachable

**Steps:**
1. Set apiBaseUrl = "https://invalid-api.com/orchestrator_"
2. Execute operation
3. Check error message

**Expected Result:**
- ✅ Error: NodeApiError with details
- ✅ Contains HTTP status code
- ✅ User sees meaningful error

---

#### TC-6.3: Missing Credentials
**Objective**: Verify error when credentials not provided

**Steps:**
1. Delete credential configuration
2. Execute operation

**Expected Result:**
- ✅ Error: "No credentials provided"
- ✅ Clear message

---

### Test Category 7: Integration Tests

#### TC-7.1: Full Workflow with Token Caching
**Objective**: End-to-end workflow testing

**Steps:**
1. Create workflow:
   - Manual Trigger
   - Get All Folders (Operation 1)
   - Get All Processes (Operation 2)
   - Get All Jobs (Operation 3)
2. Execute workflow
3. Monitor network tab

**Expected Result:**
- ✅ Workflow completes successfully
- ✅ Only 1 OAuth token request (not 3)
- ✅ All 3 operations return data
- ✅ Performance improvement visible (faster than before)

---

#### TC-7.2: Multiple Operations with Different Resources
**Objective**: Test various operations

**Steps:**
1. Create workflow with:
   - Folders: Get All
   - DirectoryService: Get Domains
   - Processes: Get All
   - Jobs: Get All
   - Assets: Get All
2. Execute

**Expected Result:**
- ✅ All operations succeed
- ✅ Correct data returned
- ✅ Only 1 OAuth request
- ✅ Headers set correctly (X-UIPATH-TenantName, etc.)

---

#### TC-7.3: Workflow with Organization Unit ID
**Objective**: Test scoping with Organization Unit

**Steps:**
1. Set Organization Unit ID in credentials
2. Execute operation
3. Capture API request headers

**Expected Result:**
- ✅ Header X-UIPATH-OrganizationUnitId = [value]
- ✅ API respects scoping
- ✅ Returns org-unit-specific data

---

### Test Category 8: Performance Tests

#### TC-8.1: Token Caching Performance
**Objective**: Measure performance improvement

**Steps:**
1. Create workflow with 10 consecutive operations
2. Measure total execution time with OLD code
3. Measure total execution time with NEW code
4. Calculate improvement

**Expected Result:**
- ✅ New code: ~90% faster for token acquisition
- ✅ Total workflow time reduced by ~10-20%
- ✅ Network requests reduced from 10 → 1

**Measurement:**
```
OLD (without caching):
- 10 API calls = 10 OAuth requests
- Time: ~5-10 seconds
- OAuth requests: 10

NEW (with caching):
- 10 API calls = 1 OAuth request
- Time: ~0.5-1 second
- OAuth requests: 1

Improvement: ~5x faster for token acquisition
```

---

#### TC-8.2: Load Test with Concurrent Operations
**Objective**: Test cache with concurrent requests

**Steps:**
1. Create 5 parallel workflows (concurrent)
2. Each makes 3 API calls
3. Measure OAuth requests

**Expected Result:**
- ✅ First operation: Gets token
- ✅ Concurrent operations reuse same token
- ✅ Total OAuth requests: 1 (or 2 if timing issue)
- ✅ No race conditions

---

## 📋 Test Execution Checklist

- [ ] TC-1.1: Token Cache Hit
- [ ] TC-1.2: Token Cache Expiry
- [ ] TC-1.3: Multiple Credentials
- [ ] TC-2.1: Cloud UiPath Auto-Detection
- [ ] TC-2.2: On-Premise Auto-Detection
- [ ] TC-2.3: Custom OAuth Token URL Override
- [ ] TC-3.1: Default Base URL
- [ ] TC-3.2: Custom Base URL Override
- [ ] TC-3.3: Base URL with Custom Domain
- [ ] TC-4.1: Default Scopes
- [ ] TC-4.2: Custom Scopes
- [ ] TC-4.3: Restricted Scopes
- [ ] TC-5.1: Existing Credentials Without New Fields
- [ ] TC-5.2: Empty String Values
- [ ] TC-6.1: Invalid OAuth Endpoint
- [ ] TC-6.2: Invalid API Endpoint
- [ ] TC-6.3: Missing Credentials
- [ ] TC-7.1: Full Workflow with Token Caching
- [ ] TC-7.2: Multiple Operations with Different Resources
- [ ] TC-7.3: Workflow with Organization Unit ID
- [ ] TC-8.1: Token Caching Performance
- [ ] TC-8.2: Load Test with Concurrent Operations

---

## 🔍 Debug Commands

### Check Token Cache State
```typescript
// In browser console while n8n running
// (if exposed to DevTools)
tokenCache.forEach((token, key) => {
    console.log(`${key}: expires in ${token.expiresAt - Date.now()}ms`);
});
```

### Monitor Network Requests
```
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Look for requests to:
   - OAuth endpoint (should see max 1 per credential)
   - API endpoint (should see multiple)
5. Verify pattern matches expected
```

### Check Logs
```bash
# n8n logs location
~/.n8n/logs/

# Look for:
- "OAuth authentication failed" - problems
- "uiPathApiRequest" - successful requests
```

---

## ✨ Test Report Template

```markdown
# Test Report - OAuth2 & Endpoint Configuration

**Date**: [DATE]
**Tester**: [NAME]
**Version**: [VERSION]

## Test Results Summary

| Category | Tests | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| Token Caching | 3 | ? | ? | ? |
| Endpoint Detection | 3 | ? | ? | ? |
| Base URL Configuration | 3 | ? | ? | ? |
| OAuth Scopes | 3 | ? | ? | ? |
| Backward Compatibility | 2 | ? | ? | ? |
| Error Handling | 3 | ? | ? | ? |
| Integration | 3 | ? | ? | ? |
| Performance | 2 | ? | ? | ? |
| **TOTAL** | **22** | **?** | **?** | **?** |

## Issues Found

[List any issues]

## Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| OAuth Requests | ? | ? | ? |
| Total Time | ? | ? | ? |

## Sign-Off

- Tester: ___________
- Date: ___________
- Approved: ___________
```

---

## 🎯 Pass Criteria

**All tests must pass for release:**
- ✅ All 22 test cases passing
- ✅ No regressions in existing workflows
- ✅ Performance improvement verified
- ✅ Error handling works correctly
- ✅ Token caching functional
- ✅ All configurations supported
