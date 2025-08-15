import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

const trimString = (value) => (typeof value === "string" ? value.trim() : value)

const UserSchema = (isEditing) =>
  Yup.object().shape({
    name: Yup.string()
      .required("El nombre es requerido")
      .test("no-leading-trailing-spaces", "No puede tener espacios al inicio o final", (val) => val === val?.trim()),
    lastName: Yup.string()
      .required("Los apellidos son requeridos")
      .test("no-leading-trailing-spaces", "No puede tener espacios al inicio o final", (val) => val === val?.trim()),
    email: Yup.string()
      .email("Email inválido")
      .required("El email es requerido")
      .test("no-leading-trailing-spaces", "No puede tener espacios al inicio o final", (val) => val === val?.trim()),
    username: isEditing
      ? Yup.string()
          .required("El nombre de usuario es requerido")
          .test("no-leading-trailing-spaces", "No puede tener espacios al inicio o final", (val) => val === val?.trim())
      : Yup.string(),
  })

const UserForm = ({ user, onSubmit, onCancel, availableStorages }) => {
  const isEditing = !!user

  const initialValues = {
    id: user?.id || null,
    name: user?.name || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || ""
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const cleanedValues = {
      ...values,
      name: trimString(values.name),
      lastName: trimString(values.lastName),
      email: trimString(values.email),
      username: trimString(values.username),
    }

    await onSubmit(cleanedValues)
    setSubmitting(false)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={UserSchema(isEditing)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <div className="w-full max-w-5xl mx-auto">
          <Form className="space-y-6 text-black">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nombres:</label>
                <Field type="text" name="name" placeholder="Escribe los nombres del usuario" className="input-field" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Apellidos:</label>
                <Field type="text" name="lastName" placeholder="Escribe los apellidos del usuario" className="input-field" />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nombre de usuario:</label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  className="input-field w-full"
                  disabled={!isEditing}
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email:</label>
              <Field type="email" name="email" placeholder="Escribe el email del usuario" className="input-field w-full" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {availableStorages && availableStorages.storageIdentifier && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">A cargo del almacén:</label>
                <p className="text-gray-700">
                  <strong>{availableStorages.storageIdentifier}</strong> — {availableStorages.category?.categoryName || "Sin categoría"}
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onCancel} className="flex-1 btn-outline">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50">
                {isEditing ? "Guardar" : "Crear Usuario"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default UserForm
