import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CART_STORAGE_KEY = 'ecovani-cart'

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

function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart())

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0)

    return {
      items,
      itemCount,
      addItem(product) {
        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.id === product.id)

          if (existingItem) {
            return currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: Number(item.quantity || 0) + 1 }
                : item,
            )
          }

          return [
            ...currentItems,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            },
          ]
        })
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
