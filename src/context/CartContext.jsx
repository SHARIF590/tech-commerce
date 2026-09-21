import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false)

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === product.id)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + qty,
        }
        return updated
      }
      return [...prev, { ...product, qty }]
    })

    setLastAddedItem(product)
    setIsCartPopupOpen(true)
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }, [items])

  const count = useMemo(() => {
    return items.reduce((sum, i) => sum + i.qty, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        count,
        isCartPopupOpen,
        setIsCartPopupOpen,
        lastAddedItem,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
