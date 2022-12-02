import { spoonacularApiAxios } from '../constants/axiosBase'
import { RecipeInfo } from './typesLibrary'

export const getRecipesByIdsSimultaneously = async (recipeIds: string[] | number[]): Promise<RecipeInfo[]>  => {
	try{
		const allPromises = await Promise.all (
			recipeIds.map( async ( id ) => {
				const response = await spoonacularApiAxios.get(`/recipes/${Number(id)}/information`, {
					params: { includeNutrition: false }
				})
				return response.data as RecipeInfo
			})
		)
		return allPromises
	} catch {
		return []
	}
}

