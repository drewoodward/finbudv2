// this is a server side rendered component
import React from 'react'
import AddToWatchlist from './AddToWatchlist'
import Stocks from './Stocks'

const ProductCard = () => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
        <AddToWatchlist />
        <Stocks />
    </div>
  )
}

export default ProductCard
