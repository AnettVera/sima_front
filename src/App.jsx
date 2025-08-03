import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import AppRouter from "./router/AppRouter.jsx"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
       
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
