import styled from "styled-components";
import { StyledMainContent, StyledContainer} from '../../styles'

export const RecipeContainer = styled(StyledContainer)`
	justify-content: center;
`


const Recipe = styled(StyledMainContent)`

	position: relative;

	h2{
		margin-bottom: 8px;
	}

	p{
		margin: 0;
	}

`

export default Recipe