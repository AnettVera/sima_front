"use client"

import { useState } from "react"
import { Link , useNavigate} from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../auth/AuthContext"
import Swal from "sweetalert2"

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Ingresa un correo electrónico válido").required("El correo electrónico es requerido"),
})

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = async (values) => {
    setIsLoading(true)

    const result = await Swal.fire({
      title: "Recuperar Contraseña",
      text: "¿Deseas enviar un enlace de recuperación a este correo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16423C",
      cancelButtonColor: "#6A9C89",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    })

    if (result.isConfirmed) {
      const response = await forgotPassword(values.email)

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "¡Correo enviado!",
          text: "Se ha enviado un enlace de recuperación a tu correo electrónico",
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })

        navigate("/login")

      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error,
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 text-black">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-4 h-4 bg-primary rounded-lg flex items-center justify-center mb-4">
          </div>
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-white mb-8">
            Introduce tu dirección de correo electrónico
          </h1>
          <p className="text-white text-sm">
            Se te hará llegar un mensaje a tu correo electrónico con un enlace para que puedas restablecer tu contraseña
          </p>
        </div>

        <div className="card">
          <Formik initialValues={{ email: "" }} validationSchema={ForgotPasswordSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Escribe aquí tu correo electrónico"
                    className="input-field"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "ENVIANDO..." : "ENVIAR"}
                  </button>

                  <Link to="/login" className="w-full btn-outline block text-center">
                    Cancelar
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

export default ForgotPasswordPage
