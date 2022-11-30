import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

import { StyledContainer, StyledForm, StyledInput, StyledButton } from "../styles";

import { ErrorsForSignUpFormAt } from '../helpers/typesLibrary'
import appAxios from "../constants/axiosBase";

const SignIn = () => {
	const router = useRouter()
	const userNameInputRef = useRef<HTMLInputElement>(null)
	const userEmailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const conformPasswordInputRef = useRef<HTMLInputElement>(null)

	const [errors, setErrors] = useState<ErrorsForSignUpFormAt>({
		nameField: false, emailField: false, passwordField: false, account: false, password: false, validation: false
	})

	const isFormMissingRequiredField = (name: string, email: string, password: string, confirmPassword: string): boolean => {
		if (name.trim() === '') {
			setErrors({
				nameField: true, emailField: false, passwordField: false, account: false, password: false, validation: false
			})
			return true
		}
		if (email.trim() === '') {
			setErrors({
				nameField: false, emailField: true, passwordField: false, account: false, password: false, validation: false
			})
			return true
		}
		if (password.trim() === '' || confirmPassword.trim() === '') {
			setErrors({
				nameField: false, emailField: false, passwordField: true, account: false, password: false, validation: false
			})
			return true
		}
		return false
	}

	const bothPasswordsMatched = (psw1: string, psw2: string): boolean => {
		setErrors({
			nameField: false, emailField: false, passwordField: false, account: false, password: false, validation: false
		})
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
		if (isFormMissingRequiredField(userNameInputRef.current.value, userEmailInputRef.current.value, passwordInputRef.current.value, conformPasswordInputRef.current.value)) return
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
				{errors.nameField && <p className="error-message">Name is Required</p>}
				{errors.emailField && <p className="error-message">Email is Required</p>}
				{errors.passwordField && <p className="error-message">Password is Required</p>}
				{errors.account && <p className="error-message">This email has already registered</p>}
				{errors.password && <p className="error-message">Password is not matched</p>}
				{errors.validation &&
					<div className="error-message">
						<p>Must contain at least one capital case and number</p>
						<p>And password must be more than 8 characters long</p>
					</div>
				}
				<>
					<div>
						<label htmlFor="Name">Name</label>
						<StyledInput
							id="Email"
							type={'text'}
							ref={userNameInputRef}
						/>
					</div>
					<div>
						<label htmlFor="Email">Email</label>
							<StyledInput
								id="Email"
								type={'email'}
								ref={userEmailInputRef}
							/>
					</div>
					<div>
						<label htmlFor="Password">Password</label>
						<StyledInput
							id="Password"
							type={'password'}
							ref={passwordInputRef}
						/>
					</div>
					<div>
						<label htmlFor="confirmPassword">Confirm Password</label>
						<StyledInput
							id="confirmPassword"
							type={'password'}
							ref={conformPasswordInputRef}
						/>
					</div>
				</>
				<StyledButton
					width="300px"
					fontSize="14px"
					fontThin={true}
					onClick={handleSubmit}
				>
					Sign Up
				</StyledButton>
			</StyledForm>
		</StyledContainer>
	);
}

export default SignIn