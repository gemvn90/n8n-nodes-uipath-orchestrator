import { INodeProperties } from 'n8n-workflow';

export const directoryServiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['directoryService'],
			},
		},
		options: [
			{
				name: 'Get Directory Permissions',
				value: 'getDirectoryPermissions',
				description: 'Get directory permissions for a user',
				action: 'Get directory permissions',
			},
			{
				name: 'Get Domains',
				value: 'getDomains',
				description: 'Get list of available domains',
				action: 'Get domains',
			},
			{
				name: 'Search Users and Groups',
				value: 'searchUsersAndGroups',
				description: 'Search for users and groups in the directory',
				action: 'Search users and groups',
			},
		],
		default: 'getDomains',
	},
];

export const directoryServiceFields: INodeProperties[] = [
	// Get Directory Permissions fields
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['directoryService'],
				operation: ['getDirectoryPermissions'],
			},
		},
		default: '',
		required: true,
		description: 'The username to get permissions for',
	},
	// Search Users and Groups fields
	{
		displayName: 'Search Context',
		name: 'searchContext',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['directoryService'],
				operation: ['searchUsersAndGroups'],
			},
		},
		options: [
			{
				name: 'All',
				value: 'All',
			},
			{
				name: 'Users',
				value: 'Users',
			},
			{
				name: 'Groups',
				value: 'Groups',
			},
			{
				name: 'Robots',
				value: 'Robots',
			},
			{
				name: 'External Applications',
				value: 'ExternalApplications',
			},
		],
		default: 'All',
		description: 'Type of directory objects to search for',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['directoryService'],
				operation: ['searchUsersAndGroups'],
			},
		},
		default: '',
		description: 'Optional: Domain to search in',
	},
	{
		displayName: 'Prefix/Search Text',
		name: 'prefix',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['directoryService'],
				operation: ['searchUsersAndGroups'],
			},
		},
		default: '',
		description: 'Prefix or search text to filter results',
	},
];
