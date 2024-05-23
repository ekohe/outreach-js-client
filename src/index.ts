export type OutreachResponseItem<T extends string> = {
	type: T
	id: number
	attributes: {
		[key: string]: any
	}
	relationships: {
		[key: string]: any
	}

	[key: string]: any
}

const apiRequest = <R>(
	props: { url: string; token: string } & (
		| { method: "GET"; params?: { [key: string]: string } }
		| { method: "POST" | "PATCH"; params: { [key: string]: unknown } }
	),
): Promise<R> => {
	const { url, token, method, params } = props
	const requestUrl = new URL(url)
	if (method === "GET" && params) {
		requestUrl.search = new URLSearchParams(params).toString()
	}

	return new Promise((resolve, reject) => {
		fetch(requestUrl, {
			method,
			headers: {
				"Content-Type": "application/vnd.api+json",
				Authorization: `Bearer ${token}`,
				"Access-Control-Request-Headers": "Content-Type, Authorization",
			},
			body: method !== "GET" ? JSON.stringify(params) : undefined,
		})
			.then((response) => {
				response
					.json()
					.then((data) => {
						response.ok ? resolve(data) : reject(data)
					})
					.catch(reject)
			})
			.catch(reject)
	})
}

const OutreachBaseURL = "https://api.outreach.io/api/v2"

const OutreachClient = () => {
	const createAccount = (
		params: Partial<{ name: string; domain: string }>,
		token: string,
	): Promise<{
		data: OutreachResponseItem<"account">
	}> => {
		const url = `${OutreachBaseURL}/accounts`
		return apiRequest({
			url,
			token,
			method: "POST",
			params: {
				data: {
					type: "account",
					attributes: {
						...params,
					},
				},
			},
		})
	}

	const updateAccountName = (
		params: { id: number; name: string },
		token: string,
	): Promise<{
		data: OutreachResponseItem<"account">
	}> => {
		const { id, name } = params
		const url = `${OutreachBaseURL}/accounts/${id}`
		return apiRequest({
			url,
			token,
			method: "PATCH",
			params: {
				data: {
					type: "account",
					attributes: {
						name,
					},
				},
			},
		})
	}

	const createProspect = (
		params: {
			emails: string[]
			firstName: string
			middleName: string
			lastName: string
			title: string
			accountId: number
		},
		token: string,
	): Promise<{
		data: OutreachResponseItem<"prospect">
	}> => {
		const { accountId, ...attributes } = params
		const url = `${OutreachBaseURL}/prospects`
		return apiRequest({
			url,
			token,
			method: "POST",
			params: {
				data: {
					type: "prospect",
					attributes,
					relationships: {
						account: {
							data: {
								type: "account",
								id: accountId,
							},
						},
					},
				},
			},
		})
	}

	const updateProspectName = (
		params: {
			id: number
			firstName: string
			middleName: string
			lastName: string
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<"prospect"> }> => {
		const { id, ...attributes } = params
		const url = `${OutreachBaseURL}/prospects/${id}`
		return apiRequest({
			url,
			token,
			method: "PATCH",
			params: { data: { type: "prospect", id, attributes } },
		})
	}

	const getSequences = (
		token: string,
	): Promise<{
		data: OutreachResponseItem<"sequence">[]
	}> => {
		const url = `${OutreachBaseURL}/sequences`
		return apiRequest({ url, token, method: "GET" })
	}

	const addProspectToSequence = (
		params: {
			prospectId: number
			sequenceId: number
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<"sequenceState"> }> => {
		const { prospectId, sequenceId } = params
		const url = `${OutreachBaseURL}/sequenceStates`
		return apiRequest({
			url,
			token,
			method: "POST",
			params: {
				data: {
					type: "sequenceState",
					relationships: {
						prospect: {
							data: {
								type: "prospect",
								id: prospectId,
							},
						},
					},
					sequence: {
						data: {
							type: "sequence",
							id: sequenceId,
						},
					},
				},
			},
		})
	}

	const getMailboxes = (
		params: { userId: number },
		token: string,
	): Promise<{ data: OutreachResponseItem<string>[] }> => {
		const { userId } = params
		const url = `${OutreachBaseURL}/mailboxes?filter[userId]=${userId}`
		return apiRequest({ url, token, method: "GET" })
	}

	const testMailboxSync = (
		params: {
			mailboxId: number
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<string> }> => {
		const { mailboxId } = params
		const url = `${OutreachBaseURL}/mailboxes/${mailboxId}/actions/testSync`
		return apiRequest({ url, token, method: "POST", params: {} })
	}

	return {
		createAccount,
		updateAccountName,
		createProspect,
		updateProspectName,
		getSequences,
		addProspectToSequence,
		getMailboxes,
		testMailboxSync,
	}
}

export default OutreachClient
