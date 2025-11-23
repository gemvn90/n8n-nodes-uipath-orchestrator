# Quick Start Guide - n8n-nodes-uipath-orchestrator

## 🚀 5-Minute Setup

### Prerequisites
- Node.js v18+
- n8n installed
- UiPath Orchestrator credentials (OAuth2)

### Step 1: Build the Node
```bash
cd d:\Git\n8n\nodes\n8n-nodes-uipath-orchestrator
npm run build
```

### Step 2: Link to n8n (Development)
```bash
npm link
cd /path/to/n8n
npm link n8n-nodes-uipath-orchestrator
npm start
```

Or use the built-in dev server:
```bash
npm run dev
```

### Step 3: Configure Credentials in n8n UI

1. Open n8n in browser (usually http://localhost:5678)
2. Go to Credentials → New → Select "UiPath OAuth2 API"
3. Fill in:
   - **Tenant Name**: `cloud.uipath.com` (or your instance)
   - **Client ID**: From UiPath application
   - **Client Secret**: From UiPath application
   - **Account Logical Name**: Your UiPath account name
   - **Tenant Logical Name**: Usually `DefaultTenant`
   - **Organization Unit ID**: (Optional) Your folder ID

### Step 4: Create Your First Workflow

1. New Workflow
2. Add Manual Trigger
3. Add UiPath Orchestrator node
4. Select Resource: `Folders`
5. Select Operation: `Get All`
6. Execute workflow

## 📋 Common Operations

### Get Folders
- Resource: Folders
- Operation: Get All
- Take: 20 (number of items)
- Skip: 0 (offset)

### Search Users
- Resource: DirectoryService
- Operation: Search Users and Groups
- Search Context: Users
- Prefix: Search text (optional)

### List Processes
- Resource: Processes
- Operation: Get All
- Take: 50

### Monitor Jobs
- Resource: Jobs
- Operation: Get All
- Take: 100

### Access Cloud Files
- Resource: Buckets
- Operation: List Files
- Bucket ID: Your bucket ID
- Prefix: /path/prefix (optional)

## 🔧 Troubleshooting

### Node not appearing in n8n
1. Check `package.json` n8n configuration
2. Rebuild: `npm run build`
3. Restart n8n
4. Clear browser cache

### OAuth token errors
1. Verify credentials are correct
2. Check tenant name format
3. Verify scopes in credentials
4. Test connection before running workflow

### API call failures
1. Check error message in n8n logs
2. Verify endpoint path in GenericFunctions.ts
3. Ensure folder/resource IDs are correct
4. Check response in browser DevTools

## 📚 Files to Know

| File | Purpose |
|------|---------|
| `package.json` | Node metadata and registration |
| `credentials/UiPathOAuth2.credentials.ts` | OAuth2 credential type |
| `nodes/UiPathOrchestrator/UiPathOrchestrator.node.ts` | Main node implementation |
| `nodes/UiPathOrchestrator/GenericFunctions.ts` | API utilities |
| `nodes/UiPathOrchestrator/resources/*.ts` | Operation definitions |
| `dist/` | Compiled JavaScript (run this) |

## 💡 Tips

- Use `npm run build:watch` during development for auto-compilation
- Check n8n logs: `~/.n8n/logs/`
- Use browser DevTools to inspect API responses
- Reference swagger.json for all available endpoints
- Add new operations by creating resource files in `resources/`

## 📖 More Help

- See `SETUP_GUIDE.md` for detailed configuration
- See `EXAMPLES.md` for workflow templates
- See `IMPLEMENTATION_GUIDE.md` for architecture details
- Check UiPath docs: https://docs.uipath.com/orchestrator/latest/api-guide

## 🎯 What's Included

✅ 6 Resources with 12+ operations
✅ Full OAuth2 authentication
✅ Pagination support
✅ Error handling
✅ TypeScript definitions
✅ Complete documentation
✅ Real-world examples

## 📦 Project Structure Summary

```
├── credentials/          - OAuth2 credential type
├── nodes/               - Node implementation
│   └── UiPathOrchestrator/
│       ├── UiPathOrchestrator.node.ts
│       ├── GenericFunctions.ts
│       └── resources/   - Operation definitions
├── dist/                - Compiled output (JavaScript)
└── package.json         - Node registration
```

## ✅ Checklist Before Production

- [ ] Tested with actual UiPath instance
- [ ] Credentials working correctly
- [ ] All operations returning expected data
- [ ] Error handling working
- [ ] Workflows created and tested
- [ ] Updated package.json with your details
- [ ] Updated README.md with your docs
- [ ] Code linted: `npm run lint:fix`

---

**Ready to go!** Start building RPA workflows with n8n and UiPath. 🚀
