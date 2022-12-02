import { useState, useEffect } from "react"
import { spoonacularApiAxios } from "../constants/axiosBase"
import { getRecipesByIdsSimultaneously } from "../helpers/service"

import { RecipeSearchParams, RecipeSearchResult } from "../helpers/typesLibrary"
import { complexSearchData } from "../sampleApiData"

export enum LimitationActionType {
	Add, Remove
}

type Props = {
	initSearchResult: RecipeSearchResult,
	fetchLimitation: number,
	searchParams: RecipeSearchParams | null,
	recipeIds: number[] | null,
}

const useLimitedRecipesList = ({ initSearchResult, fetchLimitation, searchParams, recipeIds }: Props) => {

	const [recipeList, setRecipeList] = useState(initSearchResult)
	const [ingredientsLimitation, setIngredientsLimitation] = useState<string[]>([])
	const [page, setPage] = useState(1)

	const handlePagination = (nextPage: number) => {
		setPage(prev => prev + nextPage)
	}

	const initPagination = () => {
		setIngredientsLimitation([])
		setRecipeList(initSearchResult)
		setPage(1)
	}

	const handleIngredientLimitation = (targetFood: string, actionType: LimitationActionType) => {
		if (actionType === LimitationActionType.Add) {
			console.log('add')
			setIngredientsLimitation(prev => [...prev, targetFood])
		} else if (actionType === LimitationActionType.Remove) {
			console.log('remove')
			setIngredientsLimitation(prev => [...prev].filter(food => food !== targetFood))
		}
	}

	const getRecipesForDisplay = (): RecipeSearchResult => {
		const allFetchedRecipes = [...recipeList.results]
		const startIndex = Math.max(((page - 1) * fetchLimitation), 0)
		let endIndex = page * fetchLimitation
		
		if( endIndex > recipeList.totalResults) {
			endIndex = recipeList.totalResults
		}
		const recipeForDisplay = allFetchedRecipes.slice(startIndex, endIndex)
		return {
			...recipeList,
			results: recipeForDisplay
		}
	}

	const fetchRecipesByKeywords = async () => {
		if (!searchParams) return
		searchParams.offset = recipeList.offset + fetchLimitation
		try {
			const response = await spoonacularApiAxios.get('/recipes/complexSearch', {params: searchParams})
			setRecipeList(prev => {
				const newState = {...prev}
				newState.offset = prev.offset + fetchLimitation
				newState.results.push(...response.data.results)
				newState.number = response.data.number
				return newState
			})
		} catch {
			const response = complexSearchData
			setRecipeList(prev => {
				const newState = {...prev}
				newState.offset = prev.offset + fetchLimitation
				newState.results.push(...response.data.results)
				newState.number = response.data.number
				return newState
			})
		}
	}

	const fetchRecipesByIngredientLimitation = async() => {
		if (!searchParams) return
		searchParams.includeIngredients = ingredientsLimitation.join()
		try {
			const response = await spoonacularApiAxios.get('/recipes/complexSearch', {params: searchParams})
			setRecipeList(response.data as RecipeSearchResult)
		} catch {
			const response = complexSearchData
			setRecipeList(response.data as RecipeSearchResult)
		}
	}

	const fetchRecipesByIds = async () => {
		if (!recipeIds) return
		const startIndex = recipeList.offset - 1
		const endIndex = recipeList.offset + (fetchLimitation * 2)
		const ids = initSearchResult.totalResults > endIndex ? recipeIds.slice(startIndex, endIndex) : recipeIds.slice(startIndex, recipeIds.length)

		try {
			const responses = await getRecipesByIdsSimultaneously(ids)
			const recipes = responses.map(response => ({id: response.id, title: response.title, image: response.image}))
			setRecipeList(prev => {
				const newState = {...prev}
				newState.offset = prev.offset + fetchLimitation
				newState.results.push(...recipes)
				newState.number = recipes.length
				return newState
			})
		} catch {
		}
	}

	useEffect(() => {
		if ((page * fetchLimitation) <= recipeList.results.length) return
		if (searchParams) {
			fetchRecipesByKeywords()
		} else {
			fetchRecipesByIds()
		}

	}, [page])

	useEffect (() => {
		if(!searchParams) return
		fetchRecipesByIngredientLimitation()
		setPage(1)
	}, [ingredientsLimitation])


	return { handlePagination, getRecipesForDisplay, initPagination, handleIngredientLimitation, page }
}

export default useLimitedRecipesList