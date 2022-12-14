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

export const getPageNameFromUrl = (url: string): string => {
	const urlX = url.slice(1, url.length)
	if (urlX.length === 0 ){
		return "Home"
	}
	let title: string = urlX.split('?')[0]
	title = title.split('/')[0]
	return title.charAt(0).toUpperCase() + title.slice(1)
}

export const popupKeywords = (): string[] => {
	return keywords
}

export const getUserFromCookie = (cookieInfo: string | undefined): User | null => {
	if (cookieInfo === undefined) return null
	const cookieData = cookie.parse(cookieInfo)
	if (!cookieData.user) return null

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

export const getExpiringFood = (fetchData: any): string[] => {
	const expiringFood: string[] = []
	Object.values(fetchData).forEach((value: any) => {
		if (defineExpireDate(value.stored_at) > 5) {
			expiringFood.push(value.name)
		}
	})
	return expiringFood
}

export const initFilter = (length: number): boolean[] => {
	const init: boolean[] = []
	for (let i=0; i<length; i++){
		init.push(false)
	}
	return init
}