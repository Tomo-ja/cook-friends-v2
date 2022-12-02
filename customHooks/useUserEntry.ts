import { useState } from "react";
import { useRouter } from "next/router";

import { setCookie } from "nookies";

import appAxios from "../constants/axiosBase";
import { AlertInfo } from "../helpers/typesLibrary";

const useUserEntry = () => {
	const [alert, setAlert] = useState<AlertInfo | null>(null)
	const router = useRouter();

	const isRequiredInfoFilled = (email: string, password: string, ...signIn: string[]): boolean => {
		if (email.trim() === '') {
			setAlert({isError: true, message: 'Email is Required'})
			return false
		}
		if (password.trim() === '') {
			setAlert({isError: true, message: 'Password is Required'})
			return false
		}
		for (let i=0; i<signIn.length; i++) {
			if (signIn[i].trim() === '') {
				const message = i === 0 ? 'Name is Required' : 'Password is Required'
				setAlert({isError: true, message})
				return false
			}
		}
		return true
	}

	const isPasswordValidated = (password: string): boolean => {
		if (!password.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/)) {
			setAlert({isError: true, message: 'Password must contain at least one capital letter and number and 8 characters'})
			return false
		}
		return true
	}

	const bothPasswordsMatched = (psw1: string, psw2: string): boolean => {
		if (psw1 !== psw2) {
			setAlert({isError: true, message: 'Password is not matched'})
			return false
		}
		return true
	}

	const tryLogin = (email: string, password: string) => {
		const data = {email, password}
		appAxios.post('/api/auth/login', {data})
			.then(res => {
				if(res.data === 'NotExists') {
					setAlert({isError: true, message: "We can't find the user by this email"})
				} else if ( res.data === 'wrongPassword') {
					setAlert({isError: true, message: "Password is not correct"})
				} else {
					setCookie(null, "user", JSON.stringify(res.data), {
						maxAge: 30 * 24 * 60 * 60,
						path: "/",
					});
					router.push("/");
				}
			})
	}

	const trySignUp = (username: string, email: string, password: string) => {
		const data = {username, email, password}
		appAxios.post('/api/auth/register', { data })
			.then(res => {
				if (res.data === 'exist') {
					setAlert({isError: true, message: 'This email has already registered'})
				} else {
					appAxios.post('/api/fridge/create', { user_id: res.data._id })
					appAxios.post('/api/shoppingList/create', { user_id: res.data._id })
				}
			})
			.then(() => {
				tryLogin(email, password)
			})
	}

	return { alert, setAlert, isRequiredInfoFilled, isPasswordValidated, bothPasswordsMatched, tryLogin, trySignUp }
}

export default useUserEntry