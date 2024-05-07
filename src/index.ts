const apiRequest = <R>(
	props: { url: string; token: string } & (
		| { method: "GET"; params?: { [key: string]: string } }
		| { method: "POST"; params: { [key: string]: unknown } }
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
	const getSequences = (token: string) => {
		const url = `${OutreachBaseURL}/sequences`
		return apiRequest({ url, token, method: "GET" })
	}

	const createNewProspect = (token: string) => {
		const url = `${OutreachBaseURL}/prospects`
		return apiRequest({ url, token, method: "POST", params: {} })
	}

	return {
		getSequences,
		createNewProspect,
	}
}

export default OutreachClient
export * from "./types"
