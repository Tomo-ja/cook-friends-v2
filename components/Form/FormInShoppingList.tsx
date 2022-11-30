import { Dispatch, SetStateAction, useContext, useRef } from "react";

import SearchBarSection from "../SearchBarSection/index";
import { StyledInput, StyledForm } from '../../styles'
import StyledFormButton from "./button";

import useFoodRegister, { FormFor } from "../../customHooks/useFoodRegister";

import { shoppingContext } from "../../useContext/useShoppingList";
import { AlertInfo } from "../../helpers/typesLibrary";

type Props = {
	userId: string;
	setAlert: Dispatch<SetStateAction<AlertInfo| null>>,
}


const FormInShoppingList = ({ userId, setAlert }: Props) => {
	const foodAmountInputRef = useRef<HTMLInputElement>(null)
	const foodMemoInputRef = useRef<HTMLInputElement>(null);

	const { tryRegisterFood, selectedFood, setSelectedFood } = useFoodRegister({setAlert, foodAmountRef: foodAmountInputRef, otherRef: foodMemoInputRef, formFor: FormFor.ShoppingList})
	const contextShopping = useContext(shoppingContext);

	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		if(!foodAmountInputRef.current || !foodMemoInputRef.current) return

		const registerData = {
			...selectedFood,
			amount: foodAmountInputRef.current.value,
			memo: foodMemoInputRef.current.value
		}

		const res = await tryRegisterFood(registerData)
		if (res) {
			contextShopping?.updateShoppingList(res.data.shoppingList.list)
		}
	}

	return (
		<StyledForm>
			<>
				<SearchBarSection setSelectedFood={setSelectedFood} userId={userId} />
					<div>
						<label htmlFor='Amount'>Amount</label>
						<StyledInput id='Amount' type='text' ref={foodAmountInputRef} />
					</div>
					<div>
						<label htmlFor='Memo'>Memo</label>
						<StyledInput id='Memo' type='text' ref={foodMemoInputRef} />
					</div>
				</>
			<StyledFormButton onClick={handleSubmit} >
				Add to List
			</StyledFormButton>
		</StyledForm>
	);
};

export default FormInShoppingList;
