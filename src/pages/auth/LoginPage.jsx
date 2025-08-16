"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../auth/AuthContext"
import Swal from "sweetalert2"
import { Eye, EyeOff } from "lucide-react"

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("El correo electrónico es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values) => {
    setIsLoading(true)

    const result = await Swal.fire({
      title: "Iniciar Sesión",
      text: "¿Deseas iniciar sesión con estas credenciales?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16423C",
      cancelButtonColor: "#6A9C89",
      confirmButtonText: "Sí, iniciar sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },


    })

    if (result.isConfirmed) {

      const response = await login(values)

      const storedUser = JSON.parse(localStorage.getItem("user"))

      if (storedUser?.tp === false) {
        return navigate("/changePassword", { state: { id: storedUser.id } });
      }

      if (storedUser?.role) {

        switch (storedUser?.role) {
          case "ADMIN":
            navigate("/dashboard")
            break
          case "USER":
            navigate("/dashboard/user")
            break
          default:
            navigate("/unauthorized")
            break
        }
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">SIMA</span>
          </div>
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-white mb-2">Inicio de Sesión</h1>
        </div>

        <div className="card  text-black">
          <Formik initialValues={{ username: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Nombre de Usuario:</label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Escribe aquí tu nombre de usuario"
                    className="input-field"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Contraseña:</label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Escribe aquí tu contraseña"
                      className="input-field pr-10" // espacio para el icono
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      tabIndex={-1} // evita que el tab se enfoque aquí
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}
                </button>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-secondary hover:text-primary transition-colors text-sm">
                    He olvidado mi contraseña
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
