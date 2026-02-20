import React from 'react'
import Link from 'next/link'

const login = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold">Login/Sign Up</h1>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <Link href="../../dashboard">
          <button type="button">Submit</button>
        </Link>
      </form>
    </div>
  )
}

export default login
