import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import apiClient from '../../../shared/lib/api/apiClient'
import { getStoredAuthToken } from '../../auth/lib/authStorage'

const CART_STORAGE_KEY = 'ecovani-cart'
const ADD_CART_ENDPOINT = import.meta.env.VITE_ADD_CART_ENDPOINT || 'users/add/cart'
const MY_CART_ENDPOINT = import.meta.env.VITE_MY_CART_ENDPOINT || 'users/mycart'
const DEFAULT_API_TOKEN = (import.meta.env.VITE_API_TOKEN || '')
  .replaceAll('"', '')
  .trim()

const CartContext = createContext(null)

function readStoredCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function syncLocalItem(currentItems, product, quantity) {
  const existingItem = currentItems.find((item) => item.id === product.id)

  if (existingItem) {
    return currentItems.map((item) =>
      item.id === product.id
        ? { ...item, quantity: Number(item.quantity || 0) + quantity }
        : item,
    )
  }

  return [
    ...currentItems,
    {
      id: product.id,
      name: product.name,
      price: product.price,
      rawPrice: Number(product.rawPrice || 0),
      image: product.image,
      category: product.category,
      quantity,
    },
  ]
}

function extractArray(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  if (Array.isArray(payload?.result)) {
    return payload.result
  }

  return []
}

function normalizeServerCartItem(item) {
  return {
    id: item?.product_id || item?.id,
    cartItemId: item?.id,
    name: item?.name || 'Product',
    price: item?.price ? `BDT ${item.price}` : 'BDT 0',
    rawPrice: Number(item?.price || 0),
    image: item?.image || item?.image_url || item?.primary_image || '',
    category: item?.category || 'Store item',
    quantity: Number(item?.quantity || 0),
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart())

  useEffect(() => {
    const authToken = getStoredAuthToken() || DEFAULT_API_TOKEN

    if (!authToken) {
      return
    }

    let isMounted = true

    async function loadServerCart() {
      try {
        const response = await apiClient.get(MY_CART_ENDPOINT)
        const nextItems = extractArray(response.data).map(normalizeServerCartItem)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
      } catch {
        // Keep local cart state when the API is unavailable.
      }
    }

    loadServerCart()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0)
    const subtotal = items.reduce((total, item) => {
      const rawPrice = Number(item.rawPrice ?? item.price?.replace?.(/[^\d.]/g, '') ?? 0)
      return total + rawPrice * Number(item.quantity || 0)
    }, 0)

    return {
      items,
      itemCount,
      subtotal,
      async addItem(product, quantity = 1) {
        const normalizedQuantity = Math.max(1, Number(quantity || 1))
        const authToken = getStoredAuthToken() || DEFAULT_API_TOKEN

        if (authToken) {
          await apiClient.post(ADD_CART_ENDPOINT, [
            {
              product_id: product.id,
              quantity: normalizedQuantity,
            },
          ])

          try {
            const response = await apiClient.get(MY_CART_ENDPOINT)
            const nextItems = extractArray(response.data).map(normalizeServerCartItem)
            setItems(nextItems)
            return
          } catch {
            setItems((currentItems) => syncLocalItem(currentItems, product, normalizedQuantity))
            return
          }
        }

        setItems((currentItems) => syncLocalItem(currentItems, product, normalizedQuantity))
      },
      updateItemQuantity(productId, quantity) {
        setItems((currentItems) =>
          currentItems
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, Number(quantity || 1)) }
                : item,
            ),
        )
      },
      removeItem(productId) {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
      },
      clearCart() {
        setItems([])
      },
      getItemQuantity(productId) {
        const matchingItem = items.find((item) => item.id === productId)
        return Number(matchingItem?.quantity || 0)
      },
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

export { CartProvider, useCart }
