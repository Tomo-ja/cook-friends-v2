import React from "react";
import { StyledContainer } from "../styles";
import LoginForm from "../components/Form/login";

const Login = () => {
	return (
		<div>
			<StyledContainer>
				<LoginForm btn={'Login'}/>
			</StyledContainer>
		</div>
	);
};

export default Login;
