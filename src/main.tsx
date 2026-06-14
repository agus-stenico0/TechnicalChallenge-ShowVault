// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { LoginPage } from './Pages/LoginPage.tsx'
import { MainLayout } from './layout/MainLayout.tsx'
import { ProtectedRoute } from './Components/ProtectedRoute.tsx'
import { HomePage } from './Pages/HomePage.tsx'
import { ShowDetailPage } from './Pages/ShowDetailPage.tsx'
import { BrowsePage } from './Pages/BrowsePage.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'

const router = createBrowserRouter ([
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      },
      {
        path: 'shows',
        element: <BrowsePage/>
      },
      {
        path: 'shows/:id',
        element: <ShowDetailPage/>
      },
      {
        path: 'my-list',
        element: <ProtectedRoute/>
      }
    ]
  },
  {
    path: 'login',
    element: <LoginPage/>
  },
])
createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
