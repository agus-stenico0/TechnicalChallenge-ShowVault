import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

const Navbar = () => {
  
  const { isAuthenticated, user, logout } = useAuth()
    
  return (
    <nav 
      className='bg-cyan-800 w-full p-3 text-xl text-white font-normal border-b border-cyan-100 flex items-center justify-center gap-5'
    >
      <Link to='/'>Inicio</Link>
      <Link to='/shows'>Programas TV</Link>
      <Link to='/my-list'>Mi Lista</Link>

      {isAuthenticated ? (
        <div className='absolute right-8 flex items-center gap-4'>
          <span>{user?.name}</span>

          <button
            onClick={logout}
            className="bg-gray-500 text-white px-4 cursor-pointer rounded-md"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-gray-500 text-white px-4 absolute right-8 cursor-pointer rounded-md"
        >
          Ingresar
        </Link>
      )}
    </nav>
  )
}

export default Navbar