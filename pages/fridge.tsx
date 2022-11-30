import { useEffect, useState } from "react"
import { GetServerSideProps } from "next"

import { FridgeSection, Alert} from '../components'
import FontAwesomeButton, { IconKind } from "../components/FontAwesomeButton"
import FridgeForm from "../components/Form/FormInFridge"
import { StyledContainer, StyledMainContent, StyledSubContent } from '../styles'

import { Fridge, User, AlertInfo } from "../helpers/typesLibrary"
import { convertFetchDataToFridgeType } from '../helpers/functions'
import appAxios from "../constants/axiosBase"

import { getUserFromCookie } from '../helpers/functions'


type Props = {
	user: User,
}

const FridgeList = ({ user }: Props) => {

	const [fridgeUpdateTrigger, setFridgeUpdateTrigger] = useState(0)

	const [displayedFridge, setDisplayedFridge] = useState<Fridge>([])
	const [switchModal, setSwitchModal] = useState<boolean>(false)
	const [alert, setAlert] = useState<AlertInfo | null>(null)

	const handleSwitch = () => {
		setSwitchModal(!switchModal)
	}

	useEffect(() => {
		const fetchFridgeData = async () => {
			const data = await appAxios.post('/api/fridge/show', {
				user_id: user.id
			})
			const fridge: Fridge = convertFetchDataToFridgeType(data)
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
					isButtonSquare={true}
					displayOnlyMobile={true}
				/>
			</StyledMainContent>
			{alert && 
				<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
			}
		</StyledContainer>
	)
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



