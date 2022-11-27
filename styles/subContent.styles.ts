import styled from 'styled-components'

interface ISubContent{
	isOpen: boolean
}

const SubContent = styled.aside<ISubContent>`

	width: max(30%, 200px);
	color: #151413;
	overflow: hidden;
	transform-origin: left;
	transition: width 0.5s ease;

	h3{
		margin: 0;

		margin-bottom: 1.25em;
		font-size: 17px;
		font-weight: bold;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 5px;
		text-decoration-color: #ffaa4e;

	}

	@media only screen and (max-width: 768px)  {
			width: 0;
      height: 0;

			h3{
				font-size: 17px;
				text-underline-offset: 3px;
			}

			${props => {
				if( props.isOpen ) {
					return `
						position: absolute;
						top: 60px;
						right: 0;
						width: min(100vw, 460px);
						height: 100vh;
						padding-top: 36px;
						padding-inline: 16px;
						margin: 0;
						background-color: white;
						box-shadow: -11px 1px 12px -4px rgba(0,0,0,0.75);
						z-index: 2;
					`
				}
			}}
  }
`

export default SubContent