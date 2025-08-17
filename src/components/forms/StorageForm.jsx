"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

const StorageSchema = Yup.object().shape({
  category: Yup.number().required("La categoría es requerida"),
  uuidresponsible: Yup.string().required("El responsable es requerido"),
})


const StorageForm = ({ storage, onSubmit, onCancel, categories = [], availableManagers = [] }) => {
  const isEditing = !!storage

  const initialValues = {
    id: storage?.id || null,
    category: storage?.category?.id || "",
    uuidresponsible: storage?.responsible?.uuid || "",
  }

  return (
    <Formik initialValues={initialValues} validationSchema={StorageSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Categoría:</label>
            <Field as="select" name="category" className="input-field text-black">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Responsable:</label>
            <Field as="select" name="uuidresponsible" className="input-field text-black">
              <option value="">Selecciona un responsable</option>
              {availableManagers?.map((manager) => (
                <option key={manager.uuid} value={manager.uuid}>
                  {manager.name} {manager.lastName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="uuidresponsible" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50">
              {isEditing ? "Guardar" : "Crear Almacén"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default StorageForm
