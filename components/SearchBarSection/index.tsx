import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { spoonacularApiAxios } from "../../constants/axiosBase";
import StyledSearchBarSection from "./searchBarSection.styles";
import SearchBar from "./searchBar.styles";
import SuggestBox from "./suggestBox.styles"; 
import { Food } from "../../helpers/typesLibrary";

interface Props {
	setSelectedFood?:(food: Food) => void
	userId?: string | undefined;
}

const SearchBarSection = ({ setSelectedFood, userId }: Props) => {

	const router = useRouter()
	const inputRef = useRef<HTMLInputElement>(null)
	const [prediction, setPrediction] = useState<{id: number, name: string}[]>([])

	const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
		spoonacularApiAxios
			.get("/food/ingredients/autocomplete", {
				params: {
					number: 10,
					query: e.currentTarget.value,
					metaInformation: true,
				},
			})
			.then((data) => {
				const words: { id: number; name: string }[] = data.data;
				setPrediction(words);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (prediction.length === 0) {
				alert('Sorry we can not find the word as ingredients ')
			} else {
				alert('Please choose word from prediction box by pressing')
			}
		}
	}

	const handleSubmit = (ingredient: string, id: number) => {
		setPrediction([]);
		if (userId) {
		inputRef.current!.value = ingredient;
			return setSelectedFood?.({
				user_id: userId,
				ingredient_api_id: id,
				name: ingredient,
			});
		}
		inputRef.current!.value = "";

		router.push({
			pathname: "/explore",
			query: { keyword: ingredient },
		});
	};

return(
	<StyledSearchBarSection>
		<SearchBar 
			placeholder='Search by Ingredients' 
			onChange={handleOnChange} 
			onKeyDown={handleKeyDown}
			ref={inputRef}
		/>
		{prediction.length !== 0 && 
			<SuggestBox>
			{prediction.map(word => (
				<li 
					key={word.id}
					onClick={() => handleSubmit(word.name, word.id)}
				>{word.name}</li>
			))}
			</SuggestBox>

		}
	</StyledSearchBarSection>
)
}

export default SearchBarSection