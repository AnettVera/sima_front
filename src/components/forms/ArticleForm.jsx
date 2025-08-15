"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

// Función para limpiar espacios antes de enviar
const trimString = (value) => (typeof value === "string" ? value.trim() : value)

const ArticleSchema = Yup.object().shape({
  articleName: Yup.string()
    .required("El nombre del artículo es requerido")
    .test(
      "no-leading-trailing-spaces",
      "No puede tener espacios al inicio o al final",
      (val) => val === val?.trim()
    ),
  description: Yup.string()
    .required("La descripción es requerida")
    .test(
      "no-leading-trailing-spaces",
      "No puede tener espacios al inicio o al final",
      (val) => val === val?.trim()
    ),
  quantity: Yup.number()
    .min(0, "La cantidad debe ser mayor o igual a 0")
    .required("La cantidad es requerida"),
  category: Yup.number().required("La categoría es requerida"),
})

const ArticleForm = ({ article, onSubmit, onCancel, categories = [] }) => {
  const isEditing = !!article

  const initialValues = {
    id: article?.id || null,
    articleName: article?.articleName || "",
    description: article?.description || "",
    quantity: article?.quantity || 0,
    category: article?.category?.id || "",
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const cleanedValues = {
      ...values,
      articleName: trimString(values.articleName),
      description: trimString(values.description),
    }

    await onSubmit(cleanedValues)
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ArticleSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Nombre del artículo:</label>
            <Field
              type="text"
              name="articleName"
              placeholder="Escribe el nombre del artículo"
              className="input-field"
            />
            <ErrorMessage name="articleName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Descripción:</label>
            <Field
              as="textarea"
              name="description"
              placeholder="Escribe la descripción del artículo"
              className="input-field h-24 resize-none"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Cantidad:</label>
            <Field type="number" name="quantity" min="0" className="input-field" />
            <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Categoría:</label>
            <Field as="select" name="category" className="input-field">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50">
              {isEditing ? "Guardar" : "Crear Artículo"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default ArticleForm
