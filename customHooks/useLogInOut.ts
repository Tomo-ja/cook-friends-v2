import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { getCookie, deleteCookie } from 'cookies-next'

import { User } from "../helpers/typesLibrary";

const useLogInOut = () => {
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)

	const logout = () => {
		setUser(null)
		deleteCookie('user', {path: '/', domain: 'localhost'})
	}

	useEffect(() => {
		const cookie = getCookie('user')
		if (cookie) {
			setUser(JSON.parse(cookie as string))
		}
	}, [router.asPath])

	return { logout, user }
}

export default useLogInOut