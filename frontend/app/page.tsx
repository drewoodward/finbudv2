import Image from 'next/image'
import Link from 'next/link'
import ProductCard from './components/ProductCard'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold">Welcome to FinBud Insights</h1>
      <Link href="/users">
        Manage Users
      </Link>
      <ProductCard />
    </main>
  )
}
