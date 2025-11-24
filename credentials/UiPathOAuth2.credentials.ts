import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class UiPathOAuth2 implements ICredentialType {
	name = 'uiPathOAuth2';

	displayName = 'UiPath OAuth2 API';

	documentationUrl = 'https://docs.uipath.com/orchestrator/latest/api-guide';

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Mode',
			name: 'authMode',
			type: 'options',
			required: true,
			options: [
				{
					name: 'UiPath Cloud',
					value: 'cloud',
				},
				{
					name: 'On-Premise / External App',
					value: 'onPrem',
				},
			],
			default: 'cloud',
		},

		{
			displayName: 'Tenant Name',
			name: 'tenantName',
			type: 'string',
			description: 'UiPath cloud instance (e.g., cloud.uipath.com). For cloud mode only.',
			required: true,
			placeholder: 'e.g., cloud.uipath.com',
			default: '',
			displayOptions: {
				show: {
					authMode: ['cloud'],
				},
			},
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Organization Unit ID',
			name: 'organizationUnitId',
			type: 'string',
			description: 'Optional: Folder/OrganizationUnit ID for request headers',
			required: false,
			default: '',
		},
		{
			displayName: 'Account Logical Name',
			name: 'accountLogicalName',
			type: 'string',
			description: 'Your UiPath account logical name (found in your instance URL). For cloud mode only.',
			required: true,
			placeholder: 'e.g., youraccountname',
			default: '',
			displayOptions: {
				show: {
					authMode: ['cloud'],
				},
			},
		},
		{
			displayName: 'Tenant Logical Name',
			name: 'tenantLogicalName',
			type: 'string',
			description: 'Your UiPath tenant logical name. For cloud mode only.',
			required: true,
			placeholder: 'e.g., DefaultTenant',
			default: '',
			displayOptions: {
				show: {
					authMode: ['cloud'],
				},
			},
		},
		// On-premise fields
		{
			displayName: 'Server URL (On-Premise)',
			name: 'serverUrl',
			type: 'string',
			description: 'Base server URL for on-premise UiPath Orchestrator (e.g., https://orchestrator.mycompany.com). For On-Premise mode only.',
			required: true,
			placeholder: 'e.g., https://orchestrator.mycompany.com',
			default: '',
			displayOptions: {
				show: {
					authMode: ['onPrem'],
				},
			},
		},
		{
			displayName: 'OAuth Token URL (Optional)',
			name: 'oauthTokenUrl',
			type: 'string',
			description: 'Custom OAuth token endpoint URL. For cloud (default: https://cloud.uipath.com/identity_/connect/token), for on-prem (default: https://<serverUrl>/identity/connect/token)',
			required: false,
			placeholder: 'e.g., https://cloud.uipath.com/identity_/connect/token',
			default: '',
		},
		{
			displayName: 'OAuth Authorization URL (Optional)',
			name: 'oauthAuthorizationUrl',
			type: 'string',
			description: 'Custom OAuth authorization endpoint URL (used for interactive authorization-code flows). For cloud (default: https://cloud.uipath.com/identity_/connect/authorize). Not required for client_credentials (server-to-server) flow.',
			required: false,
			placeholder: 'e.g., https://cloud.uipath.com/identity_/connect/authorize',
			default: '',
			displayOptions: {
				show: {
					authMode: ['cloud'],
				},
			},
		},
		{
			displayName: 'API Base URL (Optional, On-Premise)',
			name: 'apiBaseUrl',
			type: 'string',
			description: 'Custom full API base URL for On-Premise mode (e.g., https://orchestrator.mycompany.com/DefaultTenant/orchestrator_). If empty, Server URL + default path will be used.',
			required: false,
			placeholder: 'e.g., https://orchestrator.mycompany.com/DefaultTenant/orchestrator_',
			default: '',
			displayOptions: {
				show: {
					authMode: ['onPrem'],
				},
			},
		},
		{
			displayName: 'Additional Scopes (Optional)',
			name: 'scopes',
			type: 'string',
			description: 'Space-separated OAuth2 scopes (default: OR.Administration OR.Execution OR.Assets OR.Users OR.Folders)',
			required: false,
			placeholder: 'e.g., OR.Settings OR.Monitoring',
			default: '',
		},
		{
			displayName: 'Ignore SSL',
			name: 'ignoreSsl',
			type: 'boolean',
			required: false,
			default: false
		}
	];

}
