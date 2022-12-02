import type { GetServerSideProps, NextPage } from 'next'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Head from 'next/head'

import { SearchBarSection, Alert} from '../components'
import { StyledExplore, StyledPagination} from '../components/Explore'
import { StyledMainContent, StyledSubContent} from '../styles'

import useLimitedRecipesList from '../customHooks/useLimitedRecipesList';

import { User, Fridge, RecipeSearchResult, RecipeSearchParams, RecipeMinimize, AlertInfo, } from '../helpers/typesLibrary'
import { getUserFromCookie, convertFetchDataToFridgeType } from '../helpers/functions'
import appAxios, { spoonacularApiAxios } from '../constants/axiosBase';
import { complexSearchData, errorSearchResultData } from '../sampleApiData'

const NUMBER_ITEMS_AT_ONE_FETCH = 3

type Props = {
  user: User | null,
  fridge: Fridge,
  initSearchResult: RecipeSearchResult,
  searchParams: RecipeSearchParams | null,
  recipeIds: number[] | null,
  isFakeData: AlertInfo | null
}

const DynamicFridgeSection = dynamic(() => import('../components/FridgeSection/index'),
{ssr: true})

const DynamicRecipeSection = dynamic(() => import('../components/RecipesSection/index'), 
{ssr: true})


const Explore: NextPage<Props> = ({ user, fridge, initSearchResult, searchParams, recipeIds, isFakeData }: Props) => {
  const router = useRouter()

  const { handlePagination, getRecipesForDisplay, initPagination, handleIngredientLimitation, page } = useLimitedRecipesList({initSearchResult, fetchLimitation: NUMBER_ITEMS_AT_ONE_FETCH, searchParams, recipeIds })
  const [alert, setAlert] = useState<AlertInfo | null>(isFakeData)

  const handleClickRecipe = (id: number) => {
    router.push(`/recipe/${id}`)
  }

  useEffect(() => {
    initPagination()
  }, [initSearchResult])

	return (
		<StyledExplore>
      <Head>
        <title>Recipes | Cookit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchBarSection />
      <StyledMainContent>
        {recipeIds ? 
          <></> : 
          <h2>Found {initSearchResult.totalResults} Recipes by &quot;{router.query.keyword}&quot;</h2>
        }
        <DynamicRecipeSection 
          recipesSearchResult={getRecipesForDisplay()} 
          user={user}
          handleClickRecipe={handleClickRecipe}
        />
        <StyledPagination>
          {page > 1 &&
            <button onClick={() => handlePagination(-1)}>Previous</button>
          }
          {page * NUMBER_ITEMS_AT_ONE_FETCH < initSearchResult.totalResults && 
            <button onClick={() => handlePagination(1)}>Next</button>
          }
        </StyledPagination>
      </StyledMainContent>
      <StyledSubContent isOpen={false}>
        <h3>Use Food in Your Fridge?</h3>
        <DynamicFridgeSection 
          fridge={fridge} 
          useAsFilter={true} 
          handleIngredientLimitation={handleIngredientLimitation}
          urlQuery={router.query}
        />
      </StyledSubContent>
      {alert && 
				<Alert isError={alert.isError} message={alert.message} setAlert={setAlert} />
			}
    </StyledExplore>
	)
}

export default Explore

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const user: User | null = getUserFromCookie(req.headers.cookie)

  let fridge: Fridge = []
  let initSearchResult: RecipeSearchResult
  let params: RecipeSearchParams | null = null
  let recipeIds: number[] | null = null
  let isFakeData: AlertInfo | null = null

  if(query.keyword) {
    params = {
      query: query.keyword,
      number: NUMBER_ITEMS_AT_ONE_FETCH,
      offset: 0,
      sort: 'popularity',
      includeIngredients: ''
    }
    try {
      const response = await spoonacularApiAxios.get('/recipes/complexSearch', {params: params})
      initSearchResult = response.data as RecipeSearchResult
    } catch {
      isFakeData = {isError: true, message:'Reached Api call Limitation. Displaying Fake Data'}
      initSearchResult = complexSearchData.data
    }
  } else if (query.favorite) {
    recipeIds = user!.favoriterecipe.map(id => Number(id))
    const ids = recipeIds.slice(0, NUMBER_ITEMS_AT_ONE_FETCH)
    try{
      const allRes = await Promise.all(ids.map(async id => {
        const response = await spoonacularApiAxios.get(`/recipes/${id}/information`, 
          {params: {
            includeNutrition: false
          }}
        )
        return response.data as RecipeMinimize
      }))
      initSearchResult = {
        results: allRes.map(recipe => ({id: recipe.id, title: recipe.title, image: recipe.image})),
        offset: 0,
        number: NUMBER_ITEMS_AT_ONE_FETCH,
        totalResults: recipeIds.length
      }
    } catch {
      isFakeData = {isError: true, message:'Reached Api call Limitation. Displaying Fake Data'}
      initSearchResult = errorSearchResultData
    }
  } else {
    console.error('ERROR: coming explore page without keyword nor history nor favorite')
    initSearchResult = errorSearchResultData
  }

  if (user) {
    const fridgeData = await appAxios.post('/api/fridge/show', {
      user_id: user.id
    })
    fridge = convertFetchDataToFridgeType(fridgeData.data)
  }

  return {
    props: {
      user,
      fridge,
      initSearchResult,
      searchParams: params,
      recipeIds,
      isFakeData
    }
  }
}
