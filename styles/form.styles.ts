import styled from "styled-components";

const StyledForm = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 50px auto;

	.error-message {
		margin-bottom: 8px;
		color: #e01111;
		text-align: center;

		p {
			margin: 8px 0;
		}
	}

	label {
		text-align: left;
		padding-bottom: 8px;
	}

	div {
		width: 100%
	}

	button {
		margin-top: 10px;
	}

	a {
		padding-top: 10px;
		color: #ffaa4e;
	}

`
export default StyledForm