import React from 'react'
import ProductCard from '../components/ProductCard'
import Link from 'next/link'

const dashboard = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>This the mu'fuckin dahsboard.</p>
      <ProductCard />
      <Link href="../users">
        <button type="button">Manage Users</button>
      </Link>
    </div>
  )
}

export default dashboard
