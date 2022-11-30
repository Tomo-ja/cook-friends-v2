import * as cookie from 'cookie'
import { User } from './typesLibrary'

export const getUserFromCookie = (cookieInfo: string) => {
	const cookieData = cookie.parse(cookieInfo)
	const user: User = JSON.parse(cookieData.user)

	return user
}

export const getFormattedTodaysDateInString = (): string => {
	const today = new Date
	const month = today.getMonth() + 1
	const year = today.getFullYear()
	const date = today.getDate()
	return `${year}-${month}-${date}`
}
