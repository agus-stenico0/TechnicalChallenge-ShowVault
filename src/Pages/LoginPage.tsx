import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { useState, useEffect } from 'react'

export const LoginPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, login, error } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const from = location.state?.from?.pathname ?? '/'

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true);

        await login(email, password);
                   
        setLoading(false);
    }

  return (
    <div className="w-full min-h-screen flex flex-col gap-4">
        <div className='flex-1 flex items-center justify-center'>
            <form onSubmit={handleSubmit} className="w-auto bg-cyan-800 p-6 rounded-2xl flex flex-col gap-5">
                <h1 className="text-white font-medium text-4xl text-center">Ingresar</h1>
                <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email" 
                    className="bg-white border-none w-74 p-1 text-gray-800 rounded-md"
                />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña" 
                    className="bg-white border-none w-74 p-1 text-gray-800 rounded-md"
                />
                {error && (
                    <p className="text-red-600 text-center font-medium">
                        {error}
                    </p>
                )}
                <button 
                    type='submit' 
                    disabled={loading}
                    className='bg-gray-800 text-white p-2 rounded-md text-ls font-medium cursor-pointer'
                >
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default LoginPage