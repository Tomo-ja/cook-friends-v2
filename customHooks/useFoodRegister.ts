import React, { Dispatch, useState, SetStateAction, RefObject } from "react";

import appAxios from "../constants/axiosBase";
import { AlertInfo, Food } from "../helpers/typesLibrary";

export enum FormFor {
	Fridge = 'fridge',
	ShoppingList ='shoppingList'
}

type Props = {
	formFor: FormFor,
	setAlert: Dispatch<SetStateAction<AlertInfo | null>>,
	foodAmountRef: RefObject<HTMLInputElement>,
	otherRef: RefObject<HTMLInputElement>,
}

const useFoodRegister = ({ formFor, setAlert, foodAmountRef, otherRef }: Props) => {
	const [selectedFood, setSelectedFood] = useState<Food>()

	const tryRegisterFood = async (data: any) => {
		if (data.amount.trim() === "") {
			setAlert({ isError: true, message: 'Amount is Required'})
			return false
		}


		try{
			const res = await appAxios.post(`/api/${formFor}/add`, data)
			foodAmountRef.current!.value = ""
			otherRef.current!.value = ""
			return res
		} catch {
			setAlert({ isError: true, message: 'Failed To Add Food'})
			return false
		}
	}


	return { selectedFood, setSelectedFood, tryRegisterFood }
}

export default useFoodRegister