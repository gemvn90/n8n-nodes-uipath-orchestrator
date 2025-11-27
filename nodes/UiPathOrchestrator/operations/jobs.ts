import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeJobsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getAll') {
		const take = this.getNodeParameter('take', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			`/odata/Jobs?$top=${take || 20}&$skip=${skip || 0}`,
		);
		responseData = responseData.value;
	} else if (operation === 'get') {
		const jobId = this.getNodeParameter('jobId', i) as number;
		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/Jobs(${jobId})`);
	} else if (operation === 'startJobs') {
		const releaseKey = this.getNodeParameter('releaseKey', i) as string;
		const strategy = this.getNodeParameter('strategy', i) as string;
		const inputArgumentsStr = this.getNodeParameter('inputArguments', i) as string;
		const noOfRobots = this.getNodeParameter('noOfRobots', i) as number;

		let inputArguments = {};
		try {
			if (inputArgumentsStr && inputArgumentsStr.trim() !== '{}') {
				inputArguments = JSON.parse(inputArgumentsStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Input Arguments: ${(error as Error).message}`,
			);
		}

		const startInfo: IDataObject = {
			ReleaseKey: releaseKey,
			Strategy: strategy,
			InputArguments: JSON.stringify(inputArguments),
			NoOfRobots: noOfRobots || 0,
		};

		if (strategy === 'JobsCount') {
			const jobsCount = this.getNodeParameter('jobsCount', i) as number;
			startInfo.JobsCount = jobsCount;
		} else if (strategy === 'Specific') {
			const robotIdsStr = this.getNodeParameter('robotIds', i) as string;
			const robotIds = robotIdsStr
				.split(',')
				.map((id) => parseInt(id.trim(), 10))
				.filter((id) => !isNaN(id));
			startInfo.RobotIds = robotIds;
		}

		const body: IDataObject = {
			startInfo,
		};

		const qs: IDataObject = {};
		const headers: IDataObject = {};
		
		// Handle optional OData query parameters
		const expand = this.getNodeParameter('$expand', i, '') as string;
		const filter = this.getNodeParameter('$filter', i, '') as string;
		const select = this.getNodeParameter('$select', i, '') as string;
		const orderby = this.getNodeParameter('$orderby', i, '') as string;
		const count = this.getNodeParameter('$count', i, false) as boolean;
		
		if (expand) qs.$expand = expand;
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (orderby) qs.$orderby = orderby;
		if (count) qs.$count = count;

		// Handle organization unit header
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, 0) as number;
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId.toString();
		}

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs',
			body,
			qs,
			headers,
		);
		responseData = responseData.value || responseData;
	} else if (operation === 'stopJobs') {
		const jobIdsStr = this.getNodeParameter('jobIds', i) as string;
		const stopStrategy = this.getNodeParameter('stopStrategy', i) as string;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, 0) as number;

		const jobIds = jobIdsStr
			.split(',')
			.map(id => parseInt(id.trim(), 10))
			.filter(id => !isNaN(id));

		if (jobIds.length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one valid Job ID is required');
		}

		const body = {
			jobIds,
			strategy: stopStrategy,
		};

		const headers = {
			'X-UIPATH-OrganizationUnitId': organizationUnitId.toString(),
		};

		// Fix: Correct parameter order (method, endpoint, body, qs, headers)
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Jobs/UiPath.Server.Configuration.OData.StopJobs',
			body,
			{},
			headers,
		);
	} else if (operation === 'restartJob') {
		const jobId = this.getNodeParameter('jobId', i) as number;

		const body = {
			jobId: jobId,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Jobs/UiPath.Server.Configuration.OData.RestartJob',
			body,
		);
	} else if (operation === 'resumeJob') {
		const jobKey = this.getNodeParameter('jobKey', i) as string;

		const body = {
			jobKey: jobKey,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Jobs/UiPath.Server.Configuration.OData.ResumeJob',
			body,
		);
	} else if (operation === 'export') {
		const filter = this.getNodeParameter('filter', i) as string;
		const orderby = this.getNodeParameter('orderby', i) as string;
		const expand = this.getNodeParameter('$expand', i) as string;
		const select = this.getNodeParameter('$select', i) as string;

		let query = '/odata/Jobs/UiPath.Server.Configuration.OData.Export?';
		const params: string[] = [];
		if (filter) params.push(`$filter=${encodeURIComponent(filter)}`);
		if (orderby) params.push(`$orderby=${encodeURIComponent(orderby)}`);
		if (expand) params.push(`$expand=${encodeURIComponent(expand)}`);
		if (select) params.push(`$select=${encodeURIComponent(select)}`);

		if (params.length > 0) {
			query += params.join('&');
		}

		responseData = await uiPathApiRequest.call(this, 'POST', query);
	} else if (operation === 'validateJob') {
		const releaseKey = this.getNodeParameter('releaseKey', i) as string;
		const inputArgumentsStr = this.getNodeParameter('inputArguments', i) as string;
		const expand = this.getNodeParameter('$expand', i, '') as string;
		const select = this.getNodeParameter('$select', i, '') as string;

		let inputArguments = {};
		try {
			if (inputArgumentsStr && inputArgumentsStr.trim() !== '{}') {
				inputArguments = JSON.parse(inputArgumentsStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Input Arguments: ${(error as Error).message}`,
			);
		}

		const body: IDataObject = {
			startInfo: {
				ReleaseKey: releaseKey,
				InputArguments: JSON.stringify(inputArguments),
			},
		};

		let url = '/odata/Jobs/UiPath.Server.Configuration.OData.ValidateDynamicJob';
		const queryParams: string[] = [];
		if (expand) queryParams.push(`$expand=${encodeURIComponent(expand)}`);
		if (select) queryParams.push(`$select=${encodeURIComponent(select)}`);
		if (queryParams.length) {
			url += `?${queryParams.join('&')}`;
		}

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			url,
			body,
		);
		responseData = responseData.validationResults || responseData;
	} else if (operation === 'stopJob') {
		const jobId = this.getNodeParameter('jobId', i) as number;
		const stopStrategy = this.getNodeParameter('stopStrategy', i) as string;

		// Fix: Don't include jobId in body since it's in the URL
		const body = {
			strategy: stopStrategy,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Jobs(${jobId})/UiPath.Server.Configuration.OData.StopJob`,
			body,
		);
	} else if (operation === 'validateExistingJob') {
		const jobId = this.getNodeParameter('jobId', i) as number;
		const inputArgumentsStr = this.getNodeParameter('inputArguments', i) as string;

		// Add validation for jobId
		if (!jobId || jobId <= 0) {
			throw new NodeOperationError(this.getNode(), 'Valid Job ID is required');
		}

		let inputArguments = {};
		try {
			if (inputArgumentsStr && inputArgumentsStr.trim() !== '{}') {
				inputArguments = JSON.parse(inputArgumentsStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Input Arguments: ${(error as Error).message}`,
			);
		}

		const body: IDataObject = {
			startInfo: {
				InputArguments: JSON.stringify(inputArguments),
			},
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Jobs(${jobId})/UiPath.Server.Configuration.OData.ValidateExistingJob`,
			body,
		);
	}
	// JobTriggers - Deliver payload (API) or Get payload (API)
	else if (operation === 'jobTriggerDeliver') {
		const inboxId = this.getNodeParameter('inboxId', i) as string;
		const payloadStr = this.getNodeParameter('payload', i) as string;
		let payload = {};
		try {
			if (payloadStr && payloadStr.trim() !== '{}') payload = JSON.parse(payloadStr);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON in Payload: ${(error as Error).message}`);
		}

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/api/JobTriggers/DeliverPayload/${encodeURIComponent(inboxId)}`,
			payload,
		);
	} else if (operation === 'jobTriggerGetPayload') {
		const inboxId = this.getNodeParameter('inboxId', i) as string;
		responseData = await uiPathApiRequest.call(this, 'GET', `/api/JobTriggers/GetPayload/${encodeURIComponent(inboxId)}`);
		responseData = responseData || [];
	}
	// JobTriggers - OData
	else if (operation === 'jobTriggerGetAll') {
		const filter = this.getNodeParameter('jobTriggerFilter', i) as string;
		let query = '/odata/JobTriggers';
		const qs: string[] = [];
		if (filter) qs.push(`$filter=${encodeURIComponent(filter)}`);
		if (qs.length) query += `?${qs.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', query);
		responseData = responseData.value || responseData;
	} else if (operation === 'jobTriggerGetByJobKey') {
		const jobKey = this.getNodeParameter('jobKey', i) as string;
		if (!jobKey) throw new NodeOperationError(this.getNode(), 'Job Key is required');
		const path = `/odata/JobTriggers/UiPath.Server.Configuration.OData.GetByJobKey(jobKey=${encodeURIComponent(jobKey)})`;
		responseData = await uiPathApiRequest.call(this, 'GET', path);
		responseData = responseData.value || responseData;
	}

	return responseData;
}
