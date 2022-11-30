import React, { useRef } from "react";

import { Alert } from '../components'

import { StyledContainer, StyledForm, StyledInput, } from "../styles";
import StyledFormButton from "../components/Form/button";

import useUserEntry from "../customHooks/useUserEntry";

const SignIn = () => {
	const { alert, setAlert, isRequiredInfoFilled, isPasswordValidated, bothPasswordsMatched, trySignUp } = useUserEntry()
	const userNameInputRef = useRef<HTMLInputElement>(null)
	const userEmailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const conformPasswordInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		if (!userNameInputRef.current || !userEmailInputRef.current || !passwordInputRef.current || !conformPasswordInputRef.current) return
		if (!isRequiredInfoFilled(userEmailInputRef.current.value, passwordInputRef.current.value, userNameInputRef.current.value, conformPasswordInputRef.current.value)) return
		if (!bothPasswordsMatched(passwordInputRef.current.value, conformPasswordInputRef.current.value)) return
		if (!isPasswordValidated(passwordInputRef.current.value)) return

		trySignUp(
			userNameInputRef.current.value,
			userEmailInputRef.current.value,
			passwordInputRef.current.value
		)
	}


	return (
		<StyledContainer>
			<StyledForm>
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
				<StyledFormButton onClick={handleSubmit} >
					Sign Up
				</StyledFormButton>
			</StyledForm>
			{alert && 
				<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
			}
		</StyledContainer>
	);
}

export default SignIn