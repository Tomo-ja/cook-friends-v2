import styled from "styled-components";

const Item = styled.div`

	width: 30%;
	aspect-ratio: 2;
	color: #151413;
	position: relative;

	h3{
		width: 100%;
		height: 44px;
		font-size: 17px;
		font-weight: bold;
		text-overflow: ellipsis;
		overflow: scroll;
		transition: opacity 0.3s ;
		cursor: pointer;

		:hover{
			opacity: 0.6;
		}
	}

	img{
		transition: opacity 0.3s ;
		cursor: pointer;

		:hover{
		opacity: 0.6;
	}
	}


	> button{
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10;
		border-radius: 2px;
	}

	@media screen and (max-width: 768px) {
		h3{
			font-size: 13px;
		}

		span{
			font-size: 11px;
		}
	}
	@media screen and (max-width: 470px) {
		width: 47.5%
	}
`
export default Item