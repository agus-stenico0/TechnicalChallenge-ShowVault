import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    return (
        <>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}