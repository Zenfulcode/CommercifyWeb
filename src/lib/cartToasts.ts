export const cartToasts = {
  addedToCart: (productName: string, variant?: string) => ({
    title: "Added to Cart",
    description: `${productName}${variant ? ` (${variant})` : ''} has been added to your cart.`,
  }),
  
  removedFromCart: (productName: string) => ({
    title: "Removed from Cart",
    description: `${productName} has been removed from your cart.`,
  }),
  
  updatedQuantity: (productName: string, quantity: number) => ({
    title: "Updated Quantity",
    description: `${productName} quantity updated to ${quantity}.`,
  }),
  
  cartCleared: () => ({
    title: "Cart Cleared",
    description: "All items have been removed from your cart.",
  })
};