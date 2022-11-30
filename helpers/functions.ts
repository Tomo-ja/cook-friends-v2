import * as cookie from 'cookie'
import { Fridge, User } from './typesLibrary'

const keywords = [
	'Japanese',
	'Chinese',
	'Italian',
	'Spicy',
	'Noodle',
	'Rice',
	'Pasta',
	'Soup',
	'Salad', 
]

export const popupKeywords = (): string[] => {
	return keywords
}

export const getUserFromCookie = (cookieInfo: string) => {
	const cookieData = cookie.parse(cookieInfo)
	const user: User = JSON.parse(cookieData.user)

	return user
}

export const stringToDate = (dateish: string): Date => {
	const date = new Date(dateish)
	return new Date (
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	)
}

export const defineExpireDate = (dayBought: string): number => {
	const diffInSeconds = (new Date()).getTime() - (new Date(dayBought)).getTime()
	return Math.floor(diffInSeconds / (1000 * 3600 * 24))
}

export const getFormattedTodaysDateInString = (): string => {
	const today = new Date
	const month = today.getMonth() + 1
	const year = today.getFullYear()
	const date = today.getDate()
	return `${year}-${month}-${date}`
}

export const convertFetchDataToFridgeType = (fetchData: any): Fridge => {
	const fridge: Fridge = []
	Object.values(fetchData).forEach((value: any) => {
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
	return fridge
}