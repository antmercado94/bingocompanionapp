/**
 * Check auth on load
 */

import { useEffect, useState } from 'react';

export default function useCheckUserAuth() {
	const [userStatus, setUserStatus] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch('/api/check_user')
			.then((res) => {
				if (!res.ok) {
					throw Error('An error has occurred, could not fetch data.');
				}
				if (res.status === 204) {
					return { isUser: false };
				}
				return res.json();
			})
			.then((data) => {
				setUserStatus(data);
				setIsPending(false);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setIsPending(false);
			});
	}, []);

	return { userStatus, isPending, error };
}
