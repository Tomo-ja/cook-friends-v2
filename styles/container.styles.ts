import styled from 'styled-components'

const Container = styled.div`
	display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1024px;
  margin-inline: auto;
  margin-top: 66px;
  padding-top: 36px;
  background-color: white;

  @media screen and (max-width: 1112px) {
    margin-inline: 44px;
}
  @media only screen and (max-width: 768px)  {
      margin-inline: min(44px, 5%);
  }
`

export default Container