import React, { useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import { ItemToBuy, Alert } from '../components'
import FontAwesomeButton, { IconKind } from "../components/FontAwesomeButton";
import FormInShoppingList from "../components/Form/FormInShoppingList";
import { StyledContainer, StyledMainContent, StyledSubContent} from '../styles'

import appAxios from "../constants/axiosBase";
import { AlertInfo, ItemOnList, User } from "../helpers/typesLibrary";
import ContextShopping, { shoppingContext } from "../useContext/useShoppingList";

import { getUserFromCookie } from '../helpers/functions'

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
					<FormInShoppingList userId={user.id} setAlert={setAlert} />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const user: User = getUserFromCookie(req.headers.cookie!)

	return { 
		props: {
			user,
		}
	}
}