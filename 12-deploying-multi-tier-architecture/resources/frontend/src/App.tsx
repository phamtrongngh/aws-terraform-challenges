import { Routes, Route } from 'react-router'

import routes from '@/pages/routes'
import AuthProvider from '@/context/AuthProvider'
import ProtectedRoute from './pages/ProtectedRoute'
import PublicRoute from './pages/PublicRoute'
import { useEffect } from 'react'


function App() {
  useEffect(() => {
    document.title = 'Task Notes App'
  }, [])

  return (
    <AuthProvider>
      <Routes>
        {routes.map(({ component: Component, layout: Layout, path, isPrivate, isPublic, ...rest }, index) => {
          let element = <Component />

          if (Layout) {
            element = <Layout>{element}</Layout>
          }

          if (isPrivate) {
            element = <ProtectedRoute>{element}</ProtectedRoute>
          }

          if (isPublic) {
            element = <PublicRoute>{element}</PublicRoute>
          }

          return (
            <Route
              key={index}
              path={path}
              element={element}
              {...rest}
            />
          )
        })}
      </Routes>
    </AuthProvider>
  )
}

export default App
