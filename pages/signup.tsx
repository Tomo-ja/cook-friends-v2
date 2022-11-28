import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

import SignupFrom from "../components/Form/signup";
import { StyledContainer, StyledForm, StyledInput, StyledButton } from "../styles";

import { ErrorsForFormAt } from './../helpers/typesLibrary'
import appAxios from "../constants/axiosBase";

export default function SignIn() {
	const router = useRouter()
	const userNameInputRef = useRef<HTMLInputElement>(null)
	const userEmailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const conformPasswordInputRef = useRef<HTMLInputElement>(null)

	const [errors, setErrors] = useState<ErrorsForFormAt>({
		account: false, password: false, validation: false, login: false, loginPassword: false
	})

	const bothPasswordsMatched = (psw1: string, psw2: string): boolean => {
		if (psw1 !== psw2) {
			setErrors(otherErrors => ({
				...otherErrors,
				password: true
			}))
			return false
		} else {
			setErrors(otherErrors => ({
				...otherErrors,
				password: false
			}))
			return true
		}
	}

	const isPasswordValidated = (password: string): boolean => {
		if (!password.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/)) {
			setErrors(otherErrors => ({
				...otherErrors,
				validation: true
			}))
			return false
		} else {
			setErrors(otherErrors => ({
				...otherErrors,
				validation: false
			}))
			return true
		}
	}

	const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		if (!userNameInputRef.current || !userEmailInputRef.current || !passwordInputRef.current || !conformPasswordInputRef.current) return
		if (!bothPasswordsMatched(passwordInputRef.current.value, conformPasswordInputRef.current.value)) return
		if (!isPasswordValidated(passwordInputRef.current.value)) return

		const resisterInfo = {
			username: userNameInputRef.current.value,
			email: userEmailInputRef.current.value,
			password: passwordInputRef.current.value
		}

		appAxios.post('/api/auth/register', { data: resisterInfo })
			.then ( (res) => {
				if (res.data === 'exist') {
					return setErrors (otherErrors => ({
						...otherErrors,
						account: true
					}))
				} else {
					appAxios.post('/api/fridge/create', { user_id: res.data._id })
					appAxios.post('/api/shoppingList/create', { user_id: res.data._id })
					router.push('/login')
				}
			})
	}


	return (
		<StyledContainer>
			<StyledForm>
				
			</StyledForm>
			{/* <SignupFrom btn={"signup"}/> */}
		</StyledContainer>
	);
}
