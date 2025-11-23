import { INodeProperties } from 'n8n-workflow';

export const jobsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['jobs'],
			},
		},
		options: [
			{
				name: 'Export',
				value: 'export',
				description: 'Export jobs to CSV',
				action: 'Export jobs',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a job by ID',
				action: 'Get a job',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all jobs',
				action: 'Get all jobs',
			},
			{
				name: 'Restart Job',
				value: 'restartJob',
				description: 'Restart a stopped job',
				action: 'Restart a job',
			},
			{
				name: 'Resume Job',
				value: 'resumeJob',
				description: 'Resume a paused job',
				action: 'Resume a job',
			},
			{
				name: 'Start Jobs',
				value: 'startJobs',
				description: 'Start one or more jobs',
				action: 'Start jobs',
			},
			{
				name: 'Stop Jobs',
				value: 'stopJobs',
				description: 'Stop one or more jobs',
				action: 'Stop jobs',
			},
		{
			name: 'Validate Job',
			value: 'validateJob',
			description: 'Validate job input before starting',
			action: 'Validate job input',
		},
		{
			name: 'Stop Job (by ID)',
			value: 'stopJob',
			description: 'Stop a job by its ID',
			action: 'Stop job by ID',
		},
		{
			name: 'Validate Existing Job',
			value: 'validateExistingJob',
			description: 'Validate input for an existing job',
			action: 'Validate existing job',
		},
			{
				name: 'JobTriggers: Deliver Payload',
				value: 'jobTriggerDeliver',
				description: 'Deliver payload to a JobTrigger inbox (API)',
				action: 'Deliver payload to JobTrigger inbox',
			},
			{
				name: 'JobTriggers: Get Payload',
				value: 'jobTriggerGetPayload',
				description: 'Get payload(s) from a JobTrigger inbox (API)',
				action: 'Get payload from JobTrigger inbox',
			},
			{
				name: 'JobTriggers: Get (OData)',
				value: 'jobTriggerGetAll',
				description: 'Get JobTriggers via OData (queryable)',
				action: 'Get JobTriggers (OData)',
			},
			{
				name: 'JobTriggers: Get By Job Key (OData)',
				value: 'jobTriggerGetByJobKey',
				description: 'Get JobTriggers by job key using OData function',
				action: 'Get JobTriggers by job key',
			},
	],
	default: 'getAll',
	},
];export const jobsFields: INodeProperties[] = [
	// GetAll operation fields
	{
		displayName: 'Take',
		name: 'take',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['getAll'],
			},
		},
		default: 20,
		description: 'Number of items to retrieve (max 100)',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of items to skip',
	},
	// Get operation fields
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['get'],
			},
		},
		required: true,
		default: 0,
		description: 'The ID of the job to retrieve',
	},
	// StartJobs operation fields
	{
		displayName: 'Release Key',
		name: 'releaseKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['startJobs'],
			},
		},
		required: true,
		default: '',
		description: 'The unique identifier (key/GUID) of the process release to start',
	},
	{
		displayName: 'Strategy',
		name: 'strategy',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['startJobs'],
			},
		},
		options: [
			{
				name: 'All Robots',
				value: 'All',
			},
			{
				name: 'Specific',
				value: 'Specific',
			},
			{
				name: 'Job Count',
				value: 'JobsCount',
			},
		],
		default: 'JobsCount',
		description: 'How to allocate jobs to robots',
	},
	{
		displayName: 'Jobs Count',
		name: 'jobsCount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['startJobs'],
				strategy: ['JobsCount'],
			},
		},
		default: 1,
		description: 'Number of jobs to start',
	},
	{
		displayName: 'Robot IDs',
		name: 'robotIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['startJobs'],
				strategy: ['Specific'],
			},
		},
		default: '',
		description: 'Comma-separated list of robot IDs (e.g., 123,456,789)',
	},
	{
		displayName: 'Input Arguments',
		name: 'inputArguments',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['startJobs'],
			},
		},
		default: '{}',
		description: 'Input arguments as JSON object (e.g., {"arg1": "value1", "arg2": 123})',
	},
	{
		displayName: 'No Of Robots',
		name: 'noOfRobots',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['startJobs'],
			},
		},
		default: 0,
		description: 'Number of robots to use. 0 means use all available robots',
	},
	// StopJob operation fields
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['stopJobs'],
			},
		},
		required: true,
		default: 0,
		description: 'The ID of the job to stop',
	},
	{
		displayName: 'Strategy',
		name: 'stopStrategy',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['stopJobs'],
			},
		},
		options: [
			{
				name: 'Soft Stop',
				value: 'SoftStop',
				description: 'Gracefully stop the job',
			},
			{
				name: 'Kill',
				value: 'Kill',
				description: 'Immediately terminate the job',
			},
		],
		default: 'SoftStop',
		description: 'How to stop the job',
	},
	// RestartJob operation fields
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['restartJob'],
			},
		},
		required: true,
		default: 0,
		description: 'The ID of the job to restart',
	},
	// ResumeJob operation fields
	{
		displayName: 'Job Key',
		name: 'jobKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['resumeJob'],
			},
		},
		required: true,
		default: '',
		description: 'The unique key/identifier of the job to resume',
	},
	// Export operation fields
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['export'],
			},
		},
		default: '',
		description: 'OData filter expression (e.g., "State eq \'Successful\'")',
	},
	{
		displayName: 'Order By',
		name: 'orderby',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['export'],
			},
		},
		default: 'StartTime desc',
		description: 'OData order by expression (e.g., "StartTime desc")',
	},
	// ValidateJob operation fields
	{
		displayName: 'Release Key',
		name: 'releaseKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['validateJob'],
			},
		},
		required: true,
		default: '',
		description: 'The unique identifier (key/GUID) of the process release to validate',
	},
	{
		displayName: 'Input Arguments',
		name: 'inputArguments',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['validateJob'],
			},
		},
		default: '{}',
		description: 'Input arguments as JSON object to validate',
	},
	// JobTriggers - API operations fields
	{
		displayName: 'Inbox ID',
		name: 'inboxId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['jobTriggerDeliver','jobTriggerGetPayload'],
			},
		},
		required: true,
		default: '',
		description: 'ID of the JobTrigger inbox',
	},
	{
		displayName: 'Payload (JSON)',
		name: 'payload',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['jobTriggerDeliver'],
			},
		},
		default: '{}',
		description: 'Payload to deliver to the inbox as JSON string',
	},
	// JobTriggers - OData operations fields
	{
		displayName: 'OData Filter',
		name: 'jobTriggerFilter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['jobTriggerGetAll'],
			},
		},
		default: '',
		description: 'OData $filter expression to narrow results',
	},
	{
		displayName: 'Job Key',
		name: 'jobKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['jobs'],
				operation: ['jobTriggerGetByJobKey'],
			},
		},
		default: '',
		description: 'Release/job key GUID to query triggers for',
	},
];

export default jobsOperations;
