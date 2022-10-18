import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";


import { classNames } from "./itemInFridge.styles";
import StyledButton from "../Button/button.styles";

import appAxios from "../../constants/axiosBase";
import FontAwesomeButton, { IconKind } from "../FontAwesomeButton";

type Props = {
	name: string,
	ingredientId: string,
	amount: number,
	unit: string,
	useAsFilter: boolean,
	userId?: string,
	setTrigger?: Dispatch<SetStateAction<number>>,
};


const Amount = ({ ingredientId, amount, useAsFilter, userId, unit, name, setTrigger }: Props) => {

	const [value, setValue] = useState(amount)

	const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
		const newValue = e.currentTarget.value
		setValue(parseInt(newValue))
	}

	// need to update 
	const handleUpdate = async () => {
		const differFromOriginal = value - amount
		let url: string
		if (differFromOriginal > 0) {
			url = 'add'
		} else {
			url = 'remove'
		}

		try{
			await appAxios.post(`api/fridge/${url}`, {
				user_id: userId,
				amount: Math.abs(differFromOriginal),
				ingredient_api_id: ingredientId,
				name,
				unit
			}).then(()=> {
				setTrigger!(prev => prev + 1)
			})
		} catch (error) {
			console.log('update amount fail', error)
		}
	};

	// TODO: need to delete from displayed fridge as well
	const handleDelete = async () => {
		try{
			await appAxios.post('api/fridge/delete', {
				user_id: userId,
				ingredient_api_id: ingredientId
			}).then(() => {
				setTrigger!(prev => prev + 1)
			})
		}catch(error){
			console.log('delete item fail', error)
		}
	}

	return (
		<>
			{useAsFilter && (
				<p className={classNames.amount}>
					Amount: {amount}
					{unit}
				</p>
			)}
			{!useAsFilter && (
				<div className={classNames.editContainer}>
					<input
						className={classNames.amount}
						type='number'
						onChange={handleOnChange}
						value={value}
					/>
					<StyledButton
						width="100px"
						fontSize="11px"
						fontThin={true}
						backgroundColor="black"
						onClick={handleUpdate}
						>
							Update
					</StyledButton>
					<FontAwesomeButton
						handleClick={() => handleDelete()}
						target={null}
						iconKind={IconKind.Trash}
						bcColor='#FFAA4E'
						isButtonSquare={true}
					/>
				</div>
			)}
		</>
	);
};

export default Amount;
