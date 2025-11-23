# n8n-nodes-uipath-orchestrator - Usage Examples

## Workflow Examples

### Example 1: Get All Folders

```yaml
Trigger: Manual
├── Node: UiPath Orchestrator
│   ├── Resource: Folders
│   ├── Operation: Get All
│   ├── Take: 50
│   └── Skip: 0
│
Output: Array of folder objects with names, descriptions, and IDs
```

### Example 2: Search for Users

```yaml
Trigger: Webhook
├── Node: UiPath Orchestrator
│   ├── Resource: DirectoryService
│   ├── Operation: Search Users and Groups
│   ├── Search Context: Users
│   ├── Prefix: {{ $json.searchTerm }}
│   └── Domain: (optional)
│
Output: Array of matching users
```

### Example 3: Monitor Job Status

```yaml
Trigger: Schedule (Every 5 minutes)
├── Node: UiPath Orchestrator
│   ├── Resource: Jobs
│   ├── Operation: Get All
│   ├── Take: 100
│   └── Skip: 0
│
├── Node: Filter
│   └── Keep only jobs where State = "Faulted"
│
├── Node: Execute Query (Database)
│   └── Update error log
│
Output: Updated database
```

### Example 4: Update Folder Details

```yaml
Trigger: Manual
├── Node: UiPath Orchestrator
│   ├── Resource: Folders
│   ├── Operation: Update
│   ├── Key: {{ $json.folderId }}
│   ├── Name: {{ $json.newName }}
│   └── Description: {{ $json.newDescription }}
│
Output: Success/Error status
```

### Example 5: List Files in Bucket

```yaml
Trigger: Manual
├── Node: UiPath Orchestrator
│   ├── Resource: Buckets
│   ├── Operation: List Files
│   ├── Bucket ID: {{ $json.bucketId }}
│   ├── Prefix: /exports/
│   └── Take Hint: 500
│
Output: Array of file objects with paths and URLs
```

## Common Workflow Patterns

### Pagination Pattern

To retrieve all items across multiple API calls:

```typescript
// For operations with pagination support
- take: 100
- skip: 0

// Loop for all pages
While loop:
  - Call API with take=100, skip=$json.skip
  - Append results to array
  - Increment skip by 100
  - Continue if response.length === 100
```

### Error Handling Pattern

```yaml
Node: UiPath Orchestrator
└── Continue on Fail: true

├── If: $json.error
│   └── Execute: Send error notification
│
└── Else
    └── Execute: Process results
```

### Filtering Pattern

```yaml
├── Node: UiPath Orchestrator (Get All)
│
├── Node: Item Lists
│   └── Keep fields: [Id, DisplayName, Description]
│
└── Output: Cleaned data
```

## Node Configuration Examples

### OAuth2 Credential Setup

```javascript
{
  "tenantName": "cloud.uipath.com",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "accountLogicalName": "your-account",
  "tenantLogicalName": "DefaultTenant",
  "organizationUnitId": "1"  // Optional
}
```

### Expression Examples

Get folder ID from previous node:
```
{{ $json.body.key }}
```

Use dynamic values:
```
{{ $json.folderName || 'Default Folder' }}
```

Format search text:
```
{{ $json.searchInput.toLowerCase().trim() }}
```

## Data Transformation Examples

### Transform Folder List

```javascript
// Input from Get All Folders
[
  {
    "id": 1,
    "name": "RPA_Processes",
    "description": "Main RPA folder",
    "key": "uuid-123"
  }
]

// Transform for display
{
  "folders": $response.body.map(f => ({
    value: f.key,
    name: f.name,
    type: "folder"
  }))
}
```

### Extract Job Status

```javascript
// From Get All Jobs
jobs = $response.body;

// Create status summary
{
  "total": jobs.length,
  "successful": jobs.filter(j => j.state === "Successful").length,
  "faulted": jobs.filter(j => j.state === "Faulted").length,
  "running": jobs.filter(j => j.state === "Running").length
}
```

## API Response Examples

### Folders Get All Response

```json
{
  "value": [
    {
      "id": 1,
      "name": "Production",
      "description": "Production RPA processes",
      "key": "8f3c5e2a-1234-5678-9abc-def012345678",
      "parentId": null,
      "organizationUnitId": 1
    }
  ],
  "totalCount": 1,
  "@odata.context": "..."
}
```

### Jobs Get All Response

```json
{
  "value": [
    {
      "id": 12345,
      "state": "Successful",
      "startTime": "2024-01-15T10:30:00Z",
      "endTime": "2024-01-15T10:35:00Z",
      "executionTimeInSeconds": 300,
      "processKey": "process-uuid-123",
      "key": "job-uuid-456"
    }
  ],
  "totalCount": 42,
  "@odata.context": "..."
}
```

### DirectoryService Search Response

```json
[
  {
    "id": "user@domain.com",
    "displayName": "John Doe",
    "objectType": "User"
  },
  {
    "id": "admins",
    "displayName": "Admin Group",
    "objectType": "Group"
  }
]
```

## Troubleshooting Tips

### OAuth Token Issues
- Verify credentials are correct
- Check tenant name format (should be a domain)
- Verify scopes include needed permissions
- Check if token URL is accessible

### API Call Failures
- Verify API endpoint path is correct
- Check required query parameters
- Validate header values
- Review error response for details

### Pagination Issues
- Don't exceed max take value (100)
- Ensure skip increments correctly
- Check if totalCount indicates more results
- Handle empty result sets

### No Results
- Verify credentials have access to resources
- Check organization unit ID if specified
- Try with different search parameters
- Verify folder exists before querying
