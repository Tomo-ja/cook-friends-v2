import styled from "styled-components";
import { StyledButton } from '../../styles'

const RecipeButton = styled(StyledButton)`

	width: 25%;
	font-size: 13px;
	padding: 0.5em 1em;


	:hover{
		background-color: #FFCE99;
		opacity: 1;
	}

	:active{
		transform: translateY(5px)
	}
`

export default RecipeButton