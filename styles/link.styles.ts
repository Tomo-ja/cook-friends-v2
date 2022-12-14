import styled from 'styled-components'

interface ILink {
	animeBorder?: boolean
	hoverColor?: string
}

const StyledLink = styled.a<ILink>`
	padding-block: 5px;
	color: inherit;
  cursor: pointer;
  border-bottom: 1px solid transparent;
	transition: all 0.25s ease;

	:hover{
		color: ${props => props.hoverColor ? props.hoverColor : 'inherit'};
		opacity: ${props => props.hoverColor ? 1 : 0.6};
		border-bottom-color: ${props => props.animeBorder ? 'black' : 'transparent'};
	}

	&.sign-up {
		display: inline-block;
		margin-left: 5px;
	}
`

export default StyledLink

