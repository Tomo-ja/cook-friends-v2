import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

import SearchBarSection from "../SearchBarSection/index"
import { StyledInput, StyledForm} from '../../styles'
import StyledFormButton from "./button"

import useFoodRegister, { FormFor } from "../../customHooks/useFoodRegister";

import { AlertInfo } from "../../helpers/typesLibrary"
import { getFormattedTodaysDateInString } from '../../helpers/functions'

type Props = {
	userId: string
	setTrigger: Dispatch<SetStateAction<number>>
	setAlert: Dispatch<SetStateAction<AlertInfo | null>>
}

const FridgeForm = ({ userId, setTrigger, setAlert }: Props) => {
	const foodAmountInputRef = useRef<HTMLInputElement>(null)
	const foodDateInputRef = useRef<HTMLInputElement>(null)

	const { tryRegisterFood, selectedFood, setSelectedFood } = useFoodRegister({setAlert, foodAmountRef: foodAmountInputRef, otherRef: foodDateInputRef, formFor: FormFor.Fridge})


	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		if (!foodAmountInputRef.current || !foodDateInputRef.current) return

		const registerData = {
			...selectedFood,
			stored_at: foodDateInputRef.current.value,
			amount: foodAmountInputRef.current.value
		}

		const res = await tryRegisterFood(registerData)
		if (res) {
			setTrigger!((prev) => prev + 1) 
		}
	}

	return (
		<StyledForm>
			<>
				<SearchBarSection setSelectedFood={setSelectedFood} userId={userId} />
				<div>
					<label htmlFor='Amount'>Amount</label>
					<StyledInput 
						id='Amount' 
						type='number' 
						ref={foodAmountInputRef} 
					/>
				</div>
				<div>
					<label htmlFor='Date'>Date</label>
					<StyledInput 
						id='Date' 
						type='date' 
						defaultValue={getFormattedTodaysDateInString()} 
						ref={foodDateInputRef} 
					/>
				</div>
			</>
			<StyledFormButton onClick={handleSubmit} >
				Add to Fridge
			</StyledFormButton>
		</StyledForm>
	)
}

export default FridgeForm
