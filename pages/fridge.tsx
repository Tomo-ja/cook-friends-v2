import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

import { FridgeSection, Alert} from '../components'
import FontAwesomeButton, { IconKind } from "../components/FontAwesomeButton";
import FridgeForm from "../components/Form/FormInFridge";
import { StyledContainer, StyledMainContent, StyledSubContent } from '../styles'

import { Fridge, User, AlertInfo } from "../helpers/typesLibrary";
import { stringToDate } from "../helpers";
import appAxios from "../constants/axiosBase";

import { getUserFromCookie } from '../helpers/functions'


type Props = {
	user: User,
}

const FridgeList = ({ user }: Props) => {

	const [fridgeUpdateTrigger, setFridgeUpdateTrigger] = useState(0)

	const [displayedFridge, setDisplayedFridge] = useState<Fridge>([])
	const [switchModal, setSwitchModal] = useState<boolean>(false);
	const [alert, setAlert] = useState<AlertInfo | null>(null)

	const handleSwitch = () => {
		setSwitchModal(!switchModal);
	}

	useEffect(() => {
		const fetchFridgeData = async () => {
			const fridge: Fridge = []
			const fridgeData = await appAxios.post('/api/fridge/show', {
				user_id: user.id
			})
			Object.values(fridgeData.data).forEach((value: any) => {
				fridge.push(
					{
						ingredient_api_id: value.ingredient_api_id,
						name: value.name,
						amount: value.amount,
						unit: value.unit,
						stored_at: stringToDate(value.stored_at).toString()
					}
				)
			})
			setDisplayedFridge(fridge)
		}

		fetchFridgeData()

	}, [fridgeUpdateTrigger])

	return (
		<StyledContainer>
			<StyledSubContent isOpen={switchModal}>
				<FontAwesomeButton
					handleClick={handleSwitch}
					target={null}
					iconKind={IconKind.XMark}
					displayOnlyMobile={true}
					isButtonSquare={true}
					bcColor='black'
				/>
				<FridgeForm
					userId={user.id}
					setTrigger={setFridgeUpdateTrigger}
					setAlert={setAlert}
				/>
			</StyledSubContent>
			<StyledMainContent>
				<FridgeSection
					setTrigger={setFridgeUpdateTrigger}
					fridge={displayedFridge}
					useAsFilter={false}
					userId={user.id}
					setAlert={setAlert}
				/>
				<FontAwesomeButton
					handleClick={handleSwitch}
					target={null}
					iconKind={IconKind.Plus}
					displayOnlyMobile={true}
				/>
			</StyledMainContent>
			{alert && 
				<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
			}
		</StyledContainer>
	);
}

export default FridgeList

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const user: User = getUserFromCookie(req.headers.cookie!)

	return { 
		props: {
			user,
		}
	}
}



