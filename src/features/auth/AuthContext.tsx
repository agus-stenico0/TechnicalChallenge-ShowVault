import { createContext, useState, type ReactNode } from "react";
import { MOCK_USERS } from "./mockUsers";
import type { AuthContextValue, User } from "./types";
export { AuthContext };

const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setError(null);
        
        if (email.trim() === '' || password.trim() === '') {
            setError('Debes completar ambos campos');
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundUser = MOCK_USERS.find(
            (user) => user.email === email
        );
       
        if (!foundUser) {
            setError('El usuario no existe');
            return;
        }

        if (foundUser.password !== password) {
            setError('Contraseña incorrecta');
            return;
        }
        
        const loggedUser: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        };

        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setError(null);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
}
