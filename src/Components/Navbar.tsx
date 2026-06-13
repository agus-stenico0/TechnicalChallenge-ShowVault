import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='bg-blue-950 w-full p-3 text-xl text-white font-normal border-b border-cyan-100 flex items-center justify-center gap-5'>
        <Link to='/'>Inicio</Link>
        <Link to='/shows'>Programas TV</Link>
        <Link to='/my-list'>Mi Lista</Link>
        <button className='bg-gray-800 text-white px-4 py-1 border-2 border-white rounded-xl text-ls font-normal'>
            <Link to='/login'>Ingresar</Link>
        </button>

        <button className='bg-gray-800 text-white px-4 py-1 border-2 border-white rounded-xl text-ls font-normal'>
            Cerrar sesión
        </button>
    </nav>
  )
}

export default Navbar