import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { setCookie } from "nookies";

import { StyledContainer, StyledForm, StyledInput, StyledButton, StyledLink } from "../styles";
import { ErrorsForLoginFormAt } from './../helpers/typesLibrary'
import appAxios from "../constants/axiosBase";


const Login = () => {
	const router = useRouter();
	const userEmailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const [errors, setErrors] = useState<ErrorsForLoginFormAt>({
		emailField: false, passwordField: false, account: false, password: false
	})

	const isFormMissingRequiredField = (email: string, password: string) => {
		if (email.trim() === '') {
			setErrors({
				emailField: true, passwordField: false, account: false, password: false
			})
			return true
		}
		if (password.trim() === '') {
			setErrors({
				emailField: false, passwordField: true, account: false, password: false
			})
			return true
		}
	}

	const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		setErrors({
			emailField: false, passwordField: false, account: false, password: false
		})
		if(!userEmailInputRef.current || !passwordInputRef.current) return
		if (isFormMissingRequiredField(userEmailInputRef.current.value, passwordInputRef.current.value)) return

		const loginInfo = {
			email: userEmailInputRef.current.value,
			password: passwordInputRef.current.value
		}
		appAxios.post('/api/auth/login', {data: loginInfo})
			.then((res) => {
				if (res.data === 'NotExists') {
					setErrors({
						emailField: false, passwordField: false, account: true, password: false
					})
				} else if ( res.data === 'wrongPassword') {
					setErrors({
						emailField: false, passwordField: false, account: false, password: true
					})
				} else {
					setCookie(null, "user", JSON.stringify(res.data), {
						maxAge: 30 * 24 * 60 * 60,
						path: "/",
					});
					router.push("/");
				}
			})
	}

	return (
		<StyledContainer>
			<StyledForm>
				{errors.emailField && <p className="error-message">Email is Required</p>}
				{errors.passwordField && <p className="error-message">Password is Required</p>}
				{errors.account && <p className="error-message">We can&apos;t find the user by this email</p>}
				{errors.password && <p className="error-message">Password is not correct</p>}
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
				<StyledButton width="300px" fontSize="14px" fontThin={true} onClick={handleSubmit}>
					Log In
				</StyledButton>
				<div style={{"textAlign": "center" ,"marginTop" : "10px"}}>
					You don&apos;t have an account yet?
					<StyledLink href='/signUp' className='sign-up'>
						Sign Up
					</StyledLink>{" "}
				</div>
			</StyledForm>
		</StyledContainer>
	);
};

export default Login;
