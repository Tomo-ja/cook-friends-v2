import React from "react";

import Form from "../components/Form/Form";
import LoginForm from "../components/Form/login";

import StyledContainer from "../styles/container.styles";

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
