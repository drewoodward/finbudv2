import React from 'react'
import Link from 'next/link'

const auth = () => {
  return (
    <div>
        <Link href="/auth/login">
          <button type="button">Login</button>
        </Link>
        <Link href="/auth/signup">
          <button type="button">Sign Up</button>
        </Link>
    </div>
  )
}

export default auth
