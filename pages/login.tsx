import React, { useRef, useState } from "react";

import { Alert } from '../components'

import { StyledContainer, StyledForm, StyledInput, StyledLink } from "../styles";
import StyledFormButton from "../components/Form/button";
import useUserEntry from "../customHooks/useUserEntry";


const Login = () => {
	const { alert, setAlert, isRequiredInfoFilled, tryLogin } = useUserEntry()
	const userEmailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		if(!userEmailInputRef.current || !passwordInputRef.current) return
		if (!isRequiredInfoFilled(userEmailInputRef.current.value, passwordInputRef.current.value)) return

		tryLogin(userEmailInputRef.current.value, passwordInputRef.current.value)
	}

	return (
		<StyledContainer>
			<StyledForm>
				<>
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
				</>
				<StyledFormButton onClick={handleSubmit}>
					Log In
				</StyledFormButton>
				<p className="guide-for-sign-up">
					You don&apos;t have an account yet?
					<StyledLink href='/signUp' className='sign-up'>
						Sign Up
					</StyledLink>{" "}
				</p>
			</StyledForm>
			{alert && 
				<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
			}
		</StyledContainer>
	);
};

export default Login;
