import { IDataObject, JsonObject, NodeApiError, NodeOperationError, IExecuteFunctions } from 'n8n-workflow';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Token cache storage (in-memory)
const tokenCache = new Map();

/**
 * Get OAuth token with caching mechanism
 * Reuses tokens until 60 seconds before expiry
 */
async function getOAuthToken(
	tenantName: string,
	clientId: string,
	clientSecret: string,
	customTokenUrl?: string,
	scopes?: string,
	authMode?: string,
	serverUrl?: string,
): Promise<string> {
	// Create cache key (include serverUrl/authMode for uniqueness)
	const cacheKey = `${authMode || tenantName}:${clientId}:${serverUrl || ''}`;

	// Check cache (with 60 second buffer before expiry)
	const cached = tokenCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now() + 60000) {
		return cached.token;
	}

	// Build token URL
	// Priority: customTokenUrl > authMode-based defaults > tenantName-based fallback
	// Cloud: https://${tenantName}/identity_/connect/token (with underscore)
	// On-Prem: https://${serverUrl}/identity/connect/token (no underscore)
	let tokenUrl = customTokenUrl || '';
	if (!tokenUrl) {
		if (authMode === 'cloud') {
			tokenUrl = `https://${tenantName}/identity_/connect/token`;
		} else if (authMode === 'onPrem' && serverUrl) {
			tokenUrl = `${serverUrl.replace(/\/$/, '')}/identity/connect/token`;
		} else {
			// Fallback: try detecting cloud by tenantName
			tokenUrl = tenantName && tenantName.includes('cloud.uipath.com')
				? `https://${tenantName}/identity_/connect/token`
				: `https://${tenantName}/identity/connect/token`;
		}
	}

	// Prepare OAuth token request data
	const tokenParams = {
		grant_type: 'client_credentials',
		client_id: clientId,
		client_secret: clientSecret,
		scope: scopes || 'OR.Administration OR.Execution OR.Assets OR.Users OR.Folders',
	};

	// Convert to URL-encoded string
	const tokenData = Object.keys(tokenParams)
		.map((key) => `${key}=${encodeURIComponent((tokenParams as any)[key])}`)
		.join('&');

	try {
		const response = await axios.post(tokenUrl, tokenData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		const token = response.data.access_token;
		const expiresIn = response.data.expires_in || 3600; // Default 1 hour

		// Cache the token
		tokenCache.set(cacheKey, {
			token,
			expiresAt: Date.now() + expiresIn * 1000,
		});

		return token;
	} catch (error) {
		const errorMsg = axios.isAxiosError(error)
			? `${error.response?.status} ${error.response?.statusText}: ${JSON.stringify(error.response?.data)}`
			: (error as Error).message;
		throw new Error(`Failed to get OAuth token: ${errorMsg}`);
	}
}

async function uiPathApiRequest(
	this: IExecuteFunctions,
	method: string,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	headers?: IDataObject,
	option?: IDataObject,
): Promise<any> {
	const credentials = await this.getCredentials('uiPathOAuth2');
	if (!credentials) {
		throw new NodeOperationError(this.getNode(), 'No credentials provided');
	}

	const {
		tenantName,
		accountLogicalName,
		tenantLogicalName,
		organizationUnitId,
		clientId,
		clientSecret,
		apiBaseUrl,
		oauthTokenUrl,
		scopes,
		authMode,
		serverUrl,
		_oauthAuthorizationUrl,
	} = credentials as {
		tenantName: string;
		accountLogicalName: string;
		tenantLogicalName: string;
		organizationUnitId?: string;
		clientId: string;
		clientSecret: string;
		apiBaseUrl?: string;
		oauthTokenUrl?: string;
		scopes?: string;
		authMode?: string;
		serverUrl?: string;
		_oauthAuthorizationUrl?: string;
	};

	let token: string;
	try {
		token = await getOAuthToken(
			tenantName,
			clientId,
			clientSecret,
			oauthTokenUrl,
			scopes,
			authMode,
			serverUrl,
		);
	} catch (error) {
		throw new NodeOperationError(
			this.getNode(),
			`OAuth authentication failed: ${(error as Error).message}`,
		);
	}

	// Build base URL - support custom endpoints and on-prem serverUrl
	// Prefer explicit apiBaseUrl when provided (useful for custom on-prem deployments)
	let baseUrl = apiBaseUrl || '';
	if (!baseUrl) {
		if (authMode === 'onPrem' && serverUrl) {
			// Default on-prem path when full apiBaseUrl not provided
			const defaultPath = '/DefaultTenant/orchestrator_';
			baseUrl = serverUrl.replace(/\/$/, '') + defaultPath;
		} else {
			// Cloud default path composition
			const path = `/${accountLogicalName}/${tenantLogicalName}/orchestrator_`;
			baseUrl = `https://${tenantName}${path}`;
		}
	}

	const axiosConfig: AxiosRequestConfig = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (organizationUnitId) {
		axiosConfig.headers!['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
	}

	// Add tenant header for cloud mode if available
	if (tenantLogicalName && authMode !== 'onPrem') {
		axiosConfig.headers!['X-UIPATH-TenantName'] = tenantLogicalName;
	}

	if (query) {
		axiosConfig.params = query;
	}

	if (body) {
		axiosConfig.data = body;
	}

	if (option) {
		axiosConfig.data = option;
	}

	try {
		const response: AxiosResponse = await axios(axiosConfig);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new NodeApiError(this.getNode(), error as unknown as JsonObject);
		}
		throw error;
	}
}

async function uiPathApiRequestAllItems(
	this: IExecuteFunctions,
	propertyName: string,
	method: string,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<any[]> {
	const returnData: any[] = [];

	let responseData;
	query = query || {};
	query.take = 100;
	query.skip = 0;

	do {
		responseData = await uiPathApiRequest.call(this, method, endpoint, body, query);
		query.skip = (query.skip || 0) + 100;
		returnData.push(...responseData[propertyName]);
	} while (responseData[propertyName] && responseData[propertyName].length !== 0);

	return returnData;
}

export { uiPathApiRequest, uiPathApiRequestAllItems };


