import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { useRouter } from "next/router";

import { StyledInput, StyledForm } from '../../styles'
import StyledFormButton from "./button";

import appAxios from "../../constants/axiosBase";
import { shoppingContext } from "../../useContext/useShoppingList";
import SearchBarSection from "../SearchBarSection/index";
import { AlertInfo } from "../../helpers/typesLibrary";


interface props {
	btn: string;
	signUp: boolean;
	userId?: string;
	modal?: boolean;
	setModal?: (arg: boolean) => void;
	setTrigger?: Dispatch<SetStateAction<number>>;
	setAlert: Dispatch<SetStateAction<AlertInfo| null>>,

}

interface firdge {
	user_id: string | undefined;
	ingredient_api_id: number;
	name: string;
}

const ShoopingForm = ({ btn, signUp, userId, setTrigger, setAlert }: props) => {
	const router = useRouter();
	const firstInputRef = useRef<HTMLInputElement>(null!);
	const secondInputRef = useRef<HTMLInputElement>(null!);

	const [addFridge, setAddfridge] = useState<firdge>()
	const contextShoppping = useContext(shoppingContext);

	const connectApi = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
			const Ref = {
				...addFridge,
				amount: firstInputRef.current?.value,
				memo: secondInputRef.current?.value,
			};
			try{
				const res = await appAxios.post("/api/shoppingList/add", Ref)
				firstInputRef.current!.value = "";
				secondInputRef.current!.value = "";

				contextShoppping?.updateShoppingList(res.data.shoppingList.list);

				setAlert({ isError: false, message: 'Successfully Add Item to Shopping List'})
			} catch {
				setAlert({ isError: true, message: 'Failed Add Item to Shopping List'})
			}
	};

	return (
		<StyledForm>
			<>
				<SearchBarSection list={setAddfridge} userId={userId} />
					<div>
						<label htmlFor='Password'>Amount</label>
						<StyledInput id='Amount' type='text' ref={firstInputRef} />
					</div>
					<div>
						<label htmlFor='Password'>Memo</label>
						<StyledInput id='memo' type='text' ref={secondInputRef} />
					</div>
				</>
			<StyledFormButton onClick={connectApi} >
				{btn}
			</StyledFormButton>
		</StyledForm>
	);
};

export default ShoopingForm;
