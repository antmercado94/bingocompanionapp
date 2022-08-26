/**
 * Custom hook for fetching api data
 */

import { useEffect, useState } from 'react';

export default function useFetch(url) {
	const [data, setData] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);
	const controller = new AbortController();

	useEffect(() => {
		fetch(url, { signal: controller.signal })
			.then((res) => {
				if (!res.ok) {
					throw Error('An error has occurred, could not fetch data.');
				}
				return res.json();
			})
			.then((data) => {
				setData(data); // json obj
				setIsPending(false);
				setError(null);
			})
			.catch((err) => {
				if (err.name === 'AbortError') {
					console.log('fetch aborted');
				} else {
					setError(err.message);
					setIsPending(false);
				}
			});
	}, [url]);

	return { data, isPending, error };
}
