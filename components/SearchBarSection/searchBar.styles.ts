import styled from 'styled-components'

const StyledSearchBar = styled.input`
	all: unset;
	
  width: 100%;
	height: 46px;
	padding: 0px 4px 0px 40px;
	border: 2px solid #D5D2CD;
	border-radius: 5px;
  background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat 13px center;
	background-color: #EEEEEE;

	box-sizing: border-box;
  color: #151413;
  font-size: 17px;
	transition: all 0.25s;

	:focus {
		border: 2px solid #ffaa4e;
		background-color: #fff;
		caret-color: #ffaa4e;
	}

	::placeholder {
		color: #9C9892;
	}
`

export default StyledSearchBar