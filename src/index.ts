export type OutreachResponseItem<T extends string> = {
	type: T
	id: number
	attributes: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		[key: string]: any
	}
	relationships: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		[key: string]: any
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
			},
			mode: "cors",
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

const OutreachClient = (props: {
	handleBaseURL?: (baseURL: string) => string
}) => {
	const { handleBaseURL } = props

	const baseURL = handleBaseURL
		? handleBaseURL(OutreachBaseURL)
		: OutreachBaseURL

	const getAccountById = (
		id: number,
		token: string,
	): Promise<{ data: OutreachResponseItem<"account"> }> => {
		const url = `${baseURL}/accounts/${id}`
		return apiRequest({ url, token, method: "GET" })
	}

	const createAccount = (
		params: Partial<{ name: string; domain: string }>,
		token: string,
	): Promise<{
		data: OutreachResponseItem<"account">
	}> => {
		const url = `${baseURL}/accounts`
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
		const url = `${baseURL}/accounts/${id}`
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

	const getProspectById = (
		id: number,
		token: string,
	): Promise<{ data: OutreachResponseItem<"prospect"> }> => {
		const url = `${baseURL}/prospects/${id}`
		return apiRequest({ url, token, method: "GET" })
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
		const url = `${baseURL}/prospects`
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

	const updateProspect = (
		params: {
			id: number
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			[key: string]: any
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<"prospect"> }> => {
		const { id, ...attributes } = params
		const url = `${baseURL}/prospects/${id}`
		return apiRequest({
			url,
			token,
			method: "PATCH",
			params: { data: { type: "prospect", id, attributes } },
		})
	}

	const getSequences = (
		params: { [key: string]: string },
		token: string,
	): Promise<{
		data: OutreachResponseItem<"sequence">[]
	}> => {
		const url = `${baseURL}/sequences`
		return apiRequest({ url, token, method: "GET", params })
	}

	const addProspectToSequence = (
		params: {
			prospectId: number
			sequenceId: number
			mailboxId: number
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<"sequenceState"> }> => {
		const { prospectId, sequenceId, mailboxId } = params
		const url = `${baseURL}/sequenceStates`
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
						sequence: {
							data: {
								type: "sequence",
								id: sequenceId,
							},
						},
						mailbox: {
							data: {
								type: "mailbox",
								id: mailboxId,
							},
						},
					},
				},
			},
		})
	}

	const getMailboxes = (
		params: { userId: number | string },
		token: string,
	): Promise<{ data: OutreachResponseItem<"mailbox">[] }> => {
		const { userId } = params
		const url = `${baseURL}/mailboxes?filter[userId]=${userId}`
		return apiRequest({ url, token, method: "GET" })
	}

	const testMailboxSync = (
		params: {
			mailboxId: number | string
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<"mailbox"> }> => {
		const { mailboxId } = params
		const url = `${baseURL}/mailboxes/${mailboxId}/actions/testSync`
		return apiRequest({ url, token, method: "POST", params: {} })
	}

	return {
		getAccountById,
		createAccount,
		updateAccountName,
		getProspectById,
		createProspect,
		updateProspect,
		getSequences,
		addProspectToSequence,
		getMailboxes,
		testMailboxSync,
	}
}

export default OutreachClient
