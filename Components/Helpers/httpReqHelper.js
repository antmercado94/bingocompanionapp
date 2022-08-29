/**
 * Functions for various http requests
 */

/* post req (also used for delete req) */
export async function post(options) {
	const controller = new AbortController();
	const endpoint = options.endpoint,
		method = options.method,
		headers = options.headers,
		data = options.data;
	try {
		/** fetch */
		const result = await fetch(endpoint, {
			signal: controller.signal,
			method: method,
			headers: headers,
			body: data,
		});
		/** 500 error handling */
		if (result.status === 504 || result.status === 500)
			throw Error('Server error: could not send data.');

		return await result.json();
	} catch (err) {
		if (err.name === 'AbortError') {
			console.log('fetch aborted');
		} else {
			return { errors: { server: err.message } };
		}
	}
}

/* put req */
export async function put(options) {
	const endpoint = options.endpoint,
		method = options.method;
	/** fetch */
	await fetch(endpoint, {
		method: method,
	});
}

/* get req delete jwt */
export async function logout() {
	const result = await (await fetch('/api/logout')).json();

	return result.isCleared;
}
