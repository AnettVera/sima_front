"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

const StorageSchema = Yup.object().shape({
  category: Yup.number().required("La categoría es requerida"),
  uuidresponsible: Yup.string().required("El responsable es requerido"),
})

const StorageForm = ({ 
  storage, 
  onSubmit, 
  onCancel, 
  categories = [], 
  availableManagers = [],
  managersLoading = false,
  categoriesLoading = false 
}) => {
  const isEditing = !!storage

  const initialValues = {
    id: storage?.id || null,
    category: storage?.category?.id || "",
    uuidresponsible: storage?.responsible?.uuid || "",
  }

  // Debug: Log para verificar los datos recibidos
  console.log("StorageForm - Categories:", categories)
  console.log("StorageForm - Available Managers:", availableManagers)
  console.log("StorageForm - Initial Values:", initialValues)

  return (
    <Formik 
      initialValues={initialValues} 
      validationSchema={StorageSchema} 
      onSubmit={onSubmit}
      enableReinitialize={true} // Permite reinicializar cuando cambian las props
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Categoría:
            </label>
            <Field as="select" name="category" className="input-field text-black">
              <option value="">
                {categoriesLoading ? "Cargando categorías..." : "Selecciona una categoría"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
            
            {/* Mostrar info de debug si no hay categorías */}
            {!categoriesLoading && categories.length === 0 && (
              <div className="text-yellow-600 text-xs mt-1">
                No hay categorías disponibles
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Responsable:
            </label>
            <Field as="select" name="uuidresponsible" className="input-field text-black">
              <option value="">
                {managersLoading ? "Cargando responsables..." : "Selecciona un responsable"}
              </option>
              {availableManagers.map((manager) => (
                <option key={manager.uuid} value={manager.uuid}>
                  {manager.name} {manager.lastName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="uuidresponsible" component="div" className="text-red-500 text-sm mt-1" />
            
            {/* Mostrar info de debug si no hay managers */}
            {!managersLoading && availableManagers.length === 0 && (
              <div className="text-yellow-600 text-xs mt-1">
                No hay responsables disponibles
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 btn-outline">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || managersLoading || categoriesLoading} 
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Procesando..." : (isEditing ? "Guardar" : "Crear Almacén")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default StorageForm