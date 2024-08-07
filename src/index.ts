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

export type OutreachResponseResult<T> = {
	data: T

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
		params: Partial<{ name: string; domain: string; ownerId: number }>,
		token: string,
	): Promise<{
		data: OutreachResponseItem<"account">
	}> => {
		const { ownerId, domain, name } = params
		const attributes = {
			name,
			domain,
			websiteUrl: domain,
			companyType: "company",
		}
		const url = `${baseURL}/accounts`
		return apiRequest({
			url,
			token,
			method: "POST",
			params: {
				data: {
					type: "account",
					attributes,
					relationships: {
						owner: {
							data: {
								type: "user",
								id: ownerId,
							},
						},
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
					id,
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

	const getProspectByEmail = (
		email: string,
		token: string,
	): Promise<{ data: OutreachResponseItem<"prospect">[] }> => {
		const url = `${baseURL}/prospects?filter[emails]=${email}`
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
			ownerId: number
		},
		token: string,
	): Promise<{
		data: OutreachResponseItem<"prospect">
	}> => {
		const { accountId, ownerId, ...attributes } = params
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
						owner: {
							data: {
								type: "user",
								id: ownerId,
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

	const getSequenceById = (
		id: number,
		token: string,
	): Promise<OutreachResponseItem<"sequenceState">> => {
		const url = `${baseURL}/sequenceStates/${id}`
		return apiRequest({ url, token, method: "GET" })
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

	const getUserInfo = (
		params: {
			id: string | number
			searchParams?: { [key: string]: string }
		},
		token: string,
	): Promise<{ data: OutreachResponseItem<"user"> }> => {
		const { id, searchParams } = params
		const url = `${baseURL}/users/${id}`
		return apiRequest({ url, params: searchParams, token, method: "GET" })
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

	const getSequenceState = (
		id: number,
		params: { [key: string]: string },
		token: string,
	): Promise<OutreachResponseResult<OutreachResponseItem<"sequenceState">>> => {
		const url = `${baseURL}/sequenceStates/${id}`
		return apiRequest({ url, token, params, method: "GET" })
	}

	const getMailings = (
		params: { [key: string]: string },
		token: string,
	): Promise<OutreachResponseResult<OutreachResponseItem<"mailing">[]>> => {
		const url = `${baseURL}/mailings`
		return apiRequest({ url, token, params, method: "GET" })
	}

	return {
		getAccountById,
		createAccount,
		updateAccountName,
		getProspectById,
		getProspectByEmail,
		createProspect,
		updateProspect,
		getSequences,
		getSequenceById,
		addProspectToSequence,
		getUserInfo,
		getMailboxes,
		testMailboxSync,
		getSequenceState,
		getMailings,
	}
}

export default OutreachClient
