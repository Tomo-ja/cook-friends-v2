import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { StyledLink, StyledImage} from '../../styles'
import StyledHeader from "./header.styles";

import useLogInOut from '../../customHooks/useLogInOut';

import logo from "../../public/logo.png"
import { getPageNameFromUrl } from '../../helpers/functions'

const Header = () => {
	const { logout, user } = useLogInOut()
	const router = useRouter()

	return (
		<StyledHeader>
			<div>
				<Link href="/">
					<StyledImage width='132px' ratio={2.64} scale={0.7}>
						<Image
							src={ logo }
							alt='application logo'
							layout='fill'
							objectFit='contain'
						/>
					</StyledImage>
				</Link>
				<h1>{getPageNameFromUrl(router.asPath)}</h1>
			</div>
			<ul>
				{ (user && router.asPath !== "/login") && 
				<>
					<li>
						<Link href="/fridge" passHref>
							<StyledLink animeBorder={true}>Your Fridge</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="/shoppingList" passHref>
							<StyledLink animeBorder={true}>Shopping List</StyledLink>
						</Link>
					</li>
				</>
				}
				<li>
						<Link href="/login" passHref >
							<StyledLink onClick={logout} animeBorder={true}>{user ? "Log out" : "Log in"}</StyledLink>
						</Link>
				</li>
			</ul>
		</StyledHeader>
	)
}

export default Header