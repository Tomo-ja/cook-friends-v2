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

export const popupKeywords = (): string[] => {
	return keywords
}
