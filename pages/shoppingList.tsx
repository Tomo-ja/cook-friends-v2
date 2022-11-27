import React, { useContext, useEffect, useState } from "react";
import { NextPageContext } from "next";
import { parseCookies} from "nookies";

import { ItemToBuy, Alert } from '../components'
import FontAwesomeButton, { IconKind } from "../components/FontAwesomeButton";
import ShoopingForm from "../components/Form/shopping";
import { StyledContainer, StyledMainContent, StyledSubContent} from '../styles'

import appAxios from "../constants/axiosBase";
import { AlertInfo, ItemOnList, User } from "../helpers/typesLibrary";
import ContextShopping, { shoppingContext } from "../useContext/useShoppingList";

type Props = {
	user: User
}


export default function ShoppingList( { user }: Props ) {

	const context = useContext(shoppingContext);
	const [shoppingList, setShoppingList] = useState<ItemOnList[]>([]);
	const [switchModal, setSwitchModal] = useState<boolean>(false);
	const [alert, setAlert] = useState<AlertInfo | null>(null)


	useEffect(() => {
		const fetchShoppingList = async () => {
			await appAxios
				.post("/api/shoppingList/show", {
					user_id: user.id,
				})
				.then((res) => {
					setShoppingList(res.data.shoppingList.list);
				});
		};
		fetchShoppingList();
	}, [context?.shoppingList]);

	const handleSwitch = () => {
		setSwitchModal(!switchModal);
	};

	return (
		<ContextShopping>
			<StyledContainer>
				<StyledSubContent isOpen={switchModal} >
					<FontAwesomeButton
						handleClick={handleSwitch}
						target={null}
						iconKind={IconKind.XMark}
						displayOnlyMobile={true}
						isButtonSquare={true}
						bcColor='black'
					/>
					<ShoopingForm btn={"shopping"} signUp={false} userId={user.id} setAlert={setAlert} />
				</StyledSubContent>
				<StyledMainContent>
					<ItemToBuy list={shoppingList} userId={user.id} setAlert={setAlert}/>
				</StyledMainContent>
				<FontAwesomeButton
					handleClick={handleSwitch}
					target={null}
					iconKind={IconKind.Plus}
					displayOnlyMobile={true}
				/>
				{alert && 
					<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
				}
			</StyledContainer>
		</ContextShopping>
	);
}
export async function getServerSideProps(ctx?: NextPageContext) {
	const cookie = parseCookies(ctx);
	const cookieData: User = JSON.parse(cookie.user);
	return {
		props: {
			user: cookieData
		},
	};
}