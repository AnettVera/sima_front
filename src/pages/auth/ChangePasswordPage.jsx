import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useAuth } from "../../auth/AuthContext"
import { userService } from "../../config/api"

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Requerido"),
  password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("Requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("Requerido"),
})

const ChangePasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const { user, logout, changePassword } = useAuth()

  const navigate = useNavigate()

  console.log("USER ID EN CHANGE-PASSWORD : ", user.id);

  const handleSubmit = async (values, { setSubmitting }) => {

    try {
      const result = await changePassword(
        user.id,
        values.currentPassword,
        values.password
      )

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "Debes iniciar sesión nuevamente",
          confirmButtonColor: "#16423C",
        })
        logout()
        navigate("/login")  // <- redirigir manualmente si es necesario
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.error,
        })
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      })

    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-white mb-2">Cambiar Contraseña</h1>
          <p className="text-text-secondary text-sm">Por seguridad, necesitas establecer una nueva contraseña.</p>
        </div>

        <div className="card text-black">
          <Formik
            initialValues={{ currentPassword: "", password: "", confirmPassword: "" }}
            validationSchema={ChangePasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Campo: Contraseña actual */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Contraseña actual:</label>
                  <div className="relative">
                    <Field
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="••••••"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Campo: Nueva contraseña */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Nueva Contraseña:</label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Campo: Confirmar contraseña */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Confirmar Contraseña:</label>
                  <div className="relative">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Botón */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage