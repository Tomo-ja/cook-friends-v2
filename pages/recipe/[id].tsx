import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head';
import Image from 'next/image'
import { useState } from 'react';

import { Alert } from '../../components'
import { IngredientSection, HowToSection, AddListModal, ReduceFridgeModal, FeedbackSection, StyledTagSection, StyledRecipe, RecipeContainer} from '../../components/Recipe'
import FontAwesomeButton, { IconKind } from '../../components/FontAwesomeButton';
import { StyledImage } from '../../styles'

import { stringToDate, getUserFromCookie, convertFetchDataToFridgeType } from '../../helpers/functions'
import { User, RecipeInfo, Fridge, Ingredient, AlertInfo } from '../../helpers/typesLibrary'
import appAxios, { spoonacularApiAxios } from '../../constants/axiosBase'
import { recipeDetailsData } from '../../sampleApiData';


type Props = {
	user: User | null,
	fridge: Fridge | null,
	recipeInfo: RecipeInfo | null
	isFakeData: AlertInfo | null
}

const emptyIngredient: Ingredient = {id:0, name: '', amount: 0, unit: ""}

const Recipe: NextPage<Props> = ({user, fridge, recipeInfo, isFakeData }: Props) => {

	const [showAddListModal, setShowAddListModal] = useState(false)
	const [showReduceFridgeModal, setShowReduceFridgeModal] = useState(false)
	const [addIngredient, setAddIngredient] = useState<Ingredient>(emptyIngredient)
	const [alert, setAlert] = useState<AlertInfo | null>(isFakeData)


	if(recipeInfo === null) { return <></>}

	const handleClickAdd = (item: Ingredient) => {
		setAddIngredient(item)
		setShowAddListModal(true)
	}

	const handleClickReduce = () => {
		setShowReduceFridgeModal(true)
	}

	const handleModalClose = (isAddList: boolean) => {
		if (isAddList) {
			setShowAddListModal(false)
		} else {
			setShowReduceFridgeModal(false)
		}
	}

	return (
		<RecipeContainer>
			<Head>
				<title>Recipe | Cookit</title>
        <link rel="icon" href="/favicon.ico" />
			</Head>
			<StyledRecipe>
				{user && showAddListModal && 
					<AddListModal 
						handleModalClose={handleModalClose} 
						addItem={addIngredient} 
						user={user} 
						title={recipeInfo.title}
						setAlert={setAlert}
					/>
				}
				{user && showReduceFridgeModal && 
					<ReduceFridgeModal 
						handleModalClose={handleModalClose} 
						reduceItems={recipeInfo.extendedIngredients}
						user={user!}
						setAlert={setAlert}
					/>
				}

				<h2>{recipeInfo.title}</h2>
				<StyledTagSection>
					<FontAwesomeButton 
						handleClick={()=>{}}
						target={null}
						iconKind={IconKind.TimeGlass}
						iconColor='black'
						bcColor='white'
					/>
					<p>{recipeInfo.readyInMinutes} min</p>
				</StyledTagSection>

				<StyledImage width='100%' ratio={2} radius='10px'>
					<Image 
						src={recipeInfo.image}
						alt={recipeInfo.title}
						layout='fill'
						objectFit='cover'
					/>
				</StyledImage>

				<IngredientSection 
					ingredients={recipeInfo.extendedIngredients} 
					fridge={fridge} 
					handleClick={handleClickAdd}
				/>
				<HowToSection instruction={recipeInfo.analyzedInstructions[0].steps} />

				<FeedbackSection 
					handleReduceModalOpen={handleClickReduce} 
					user={user} 
					recipeId={recipeInfo.id}
					setAlert={setAlert}
				/>
			</StyledRecipe>
			{alert && 
				<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
			}
		</RecipeContainer>
	)
}

export default Recipe

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
	const user: User | null = getUserFromCookie(req.headers.cookie)

	let fridge: Fridge = []
	let recipeInfo: RecipeInfo | null = null
	let isFakeData: AlertInfo | null = null


	if(query.id) {
		const recipeId: number = Number(query.id)
		try {
			const response = await spoonacularApiAxios.get(`/recipes/${recipeId}/information`, 
			{params: {
				includeNutrition: false
			}}
		)
		recipeInfo = response.data as RecipeInfo
		} catch {
			isFakeData = {isError: true, message:'Reached Api call Limitation. Displaying Fake Data'}
			recipeInfo = recipeDetailsData
		}
	} else {
		if(res){
			res.statusCode = 404
			res.end('not found')
		}
	}

	if (user) {
		const fridgeData = await appAxios.post('/api/fridge/show', {
      user_id: user.id
    })
		fridge = convertFetchDataToFridgeType(fridgeData.data)
	}

	return {
		props: {
			user,
			fridge,
			recipeInfo,
			isFakeData
		}
	}
}