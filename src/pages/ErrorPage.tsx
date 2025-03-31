// src/pages/ErrorPage.tsx
import { useRouteError } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500 mb-8">
        <i>{(error as Error)?.message || 'Unknown error'}</i>
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition"
      >
        Go back home
      </Link>
    </div>
  )
}