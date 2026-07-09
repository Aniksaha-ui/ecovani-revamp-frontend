import { useEffect, useState } from 'react'
import { fetchHomePageData } from '../api/homeApi'

function useHomePageData() {
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    data: {
      slides: [],
      categories: [],
      collections: [],
      homepage: {
        hero: null,
        categoryRail: [],
        flashDeal: { title: '', tabs: [], products: [] },
        mostLoved: { title: '', products: [] },
        featurePromos: [],
        newLaunch: { title: '', products: [] },
        allProducts: { title: '', tabs: [], products: [] },
        limitedDeal: { title: '', featured: null, topRate: [], topItems: [] },
        categoryFavorites: [],
        beautyCare: { title: '', products: [] },
        latestBlog: [],
        brands: [],
        featureItems: [],
      },
      trustPoints: [],
      usingFallback: false,
      sourceErrors: {},
    },
  })

  useEffect(() => {
    let isMounted = true

    async function loadHomePageData() {
      try {
        const data = await fetchHomePageData()

        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: '',
          data,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState((current) => ({
          ...current,
          isLoading: false,
          error: 'The live homepage feed could not be loaded.',
        }))
      }
    }

    loadHomePageData()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}

export default useHomePageData
