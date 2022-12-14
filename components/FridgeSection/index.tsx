import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import Amount from "./amount";

import StyledItemInFridge, {classNames} from "./itemInFridge.styles";
import { StyledLink } from '../../styles'

import { defineExpireDate, initFilter } from "../../helpers/functions";
import { AlertInfo, Fridge } from "../../helpers/typesLibrary";
import { LimitationActionType } from "../../customHooks/useLimitedRecipesList";

type Props = {
	setTrigger?: Dispatch<SetStateAction<number>>,
	useAsFilter: boolean,
	fridge?: Fridge,
	urlQuery?: ParsedUrlQuery,
	handleIngredientLimitation?: (targetFood: string, actionType: LimitationActionType) => void,
	userId?: string,
	setAlert?: Dispatch<SetStateAction<AlertInfo | null>>,

}

const FridgeSection = ({ fridge, useAsFilter, handleIngredientLimitation , urlQuery, userId, setTrigger, setAlert }: Props) => {

	const router = useRouter()

	const [selectedAsFilter, setSelectedAsFilter] = useState<boolean[]>([])

	useEffect(()=> {
		setSelectedAsFilter(()=> {
			if (!fridge) {
				return []
			} else {
				const init = initFilter(fridge.length)
				return init
			}
		})
	}, [urlQuery, fridge])

	if (!fridge) return <div>Loading...</div>


	const handleClickFilter = (idx: number) => {
		if(useAsFilter){
			const isFilterOut = selectedAsFilter[idx]
			setSelectedAsFilter(prev => {
				const changing = [...prev]
				changing[idx] = !prev[idx]
				return changing
			})
			if(handleIngredientLimitation){
				if (isFilterOut) {
					handleIngredientLimitation(fridge[idx].name, LimitationActionType.Remove)
				} else {
					handleIngredientLimitation(fridge[idx].name, LimitationActionType.Add)
				}
			}
		}
	}

	const handleClickLink = (ingredient: string) => {
		if(useAsFilter){return}
		router.push({
			pathname: '/explore',
			query: {keyword: ingredient}
		})
	}

	if (!fridge || fridge.length < 1)
		return <h2 >fridge is empty</h2>;

	return(
		<div>
			{fridge.map((item, idx) => (
				<StyledItemInFridge 
					useAsFilter={useAsFilter}
					key={item.ingredient_api_id} 
					className={selectedAsFilter[idx] ? classNames.selected : ""}
					onClick={() => handleClickFilter(idx)}
				>
					<div className={classNames.itemFridgeLeft}>
						{useAsFilter ?
							<p className={classNames.foodName}>
								{item.name}
							</p>
						:
						<StyledLink 
							hoverColor="#ffaa4e"
							onClick={() => handleClickLink(item.name)}
						>
							{item.name}
						</StyledLink>
						}
						<p className={classNames.expireDate}>
							Bought in {defineExpireDate(item.stored_at) === 0 ? 'Today' : `${defineExpireDate(item.stored_at)} days ago`}
						</p>
					</div>
					<div className={classNames.itemFridgeRight}>
						{useAsFilter ? 
							<p className={classNames.amount}>{item.amount}{item.unit}</p>
						:
							<>
								<Amount 
									userId={userId}
									useAsFilter={false} 
									ingredientId={item.ingredient_api_id} 
									amount={item.amount} 
									unit={item.unit} 
									name={item.name}
									setTrigger={setTrigger}
									setAlert={setAlert}
								/>
							</>
						}
					</div>
				</StyledItemInFridge>
			))}
		</div>
	)
}

export default FridgeSection