import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import AppRouter from "./router/AppRouter.jsx"

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="bg-primary text-white p-0">
                    <AppRouter />
                </div>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
