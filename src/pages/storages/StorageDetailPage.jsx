"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { storageService, articleService } from "../../config/api"
import { TableSkeleton } from "../../components/SkeletonLoader"
import Modal from "../../components/Modal"
import { useArticles } from "../../hooks/useArticles"
import Swal from "sweetalert2"
import { Plus } from "lucide-react";

const StorageDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storage, setStorage] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState("")
  const [addQuantity, setAddQuantity] = useState(1)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const { articles: allArticles, assignArticleToStorage, loading: loadingArticles } = useArticles()
  // Filtrar artículos por categoría del almacén y que no estén ya en el almacén
    const availableArticles = storage && allArticles
        ? allArticles.filter(
            (a) =>
                a.category?.id === storage.category?.id &&
                a.quantity > 0
        )
        : []
    const handleAddArticle = async () => {
        if (!selectedArticleId || !addQuantity) return
        const result = await assignArticleToStorage(storage.id, selectedArticleId, addQuantity)
        if (result.success) {
            setIsAddModalOpen(false)
            setSelectedArticleId("")
            setAddQuantity(1)
            await fetchStorageDetails()
        }
    }

    const handleArticleChange = (e) => {
        const id = e.target.value
        setSelectedArticleId(id)
        const found = availableArticles.find(a => a.id === Number(id))
        setSelectedArticle(found || null)
    }


  useEffect(() => {
    fetchStorageDetails()
  }, [id])

  
    const fetchStorageDetails = async () => {
        try {
            setLoading(true)
            const [storageResponse, articlesResponse] = await Promise.all([
                storageService.getById(id),
                articleService.getByStorage(id),
            ])

            setStorage(storageResponse.data.data)
            setArticles(articlesResponse.data.data)
        } catch (error) {
            console.error("Error fetching storage details:", error)
        } finally {
            setLoading(false)
        }
    }

  const handleMoveArticle = async (articleId, articleName) => {
    const { value: quantity } = await Swal.fire({
      title: `Mover ${articleName}`,
      text: "Ingresa la cantidad a mover:",
      input: "number",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonColor: "#16423C",
      cancelButtonColor: "#6A9C89",
      confirmButtonText: "Mover",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "Debes ingresar una cantidad válida"
        }
      },
    })

    if (quantity) {
      try {
        await articleService.removeFromStorage(id, articleId, Number.parseInt(quantity))
        await fetchStorageDetails()

        Swal.fire({
          icon: "success",
          title: "¡Artículo movido!",
          text: `Se han movido ${quantity} unidades de ${articleName}`,
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })
      } catch (error) {
        console.error("Error moving article:", error)
      }
    }
  }

  const groupedArticles = storage?.articles?.reduce((acc, article) => {
    if (!acc[article.id]) {
      acc[article.id] = {
        ...article,
        quantity: 1,
      };
    } else {
      acc[article.id].quantity += 1;
    }
    return acc;
  }, {}) || {};

  const uniqueArticles = Object.values(groupedArticles);
  const totalQuantity = uniqueArticles.reduce((sum, article) => sum + article.quantity, 0);




  if (!storage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsAddModalOpen(false)
              setSelectedArticle(null) // limpia el artículo
              setSelectedArticleId("") // limpia el ID
            }}
            className="btn-primary"
          >
            Agregar
          </button>

        </div>
        <TableSkeleton rows={8} columns={3} />
      </div>
    )
  }

  if (!storage) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Almacén no encontrado</h1>
        <button onClick={() => navigate("/")} className="btn-primary">
          Regresar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Productos</h3>
          <div className="text-3xl font-bold text-secondary">{articles.length}</div>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Responsable</h3>
          <div className="text-lg text-text">
            {storage.responsible ? `${storage.responsible.name} ${storage.responsible.lastName}` : "Sin asignar"}
          </div>
        </div>
           <div className="card text-center" onClick={() => navigate(`/articles/`, { state: { category: storage.category?.categoryName } })}>
                    <button

                    >
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Registrar producto</h3>

                        <div className="text-center">
                            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                            </div>

                        </div>
                    </button>
                </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Estado</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${storage.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {storage.status ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      <div className="card text-black">
        {/* Modal para agregar artículo */}
        <Modal isOpen={isAddModalOpen} onClose={async () => { setIsAddModalOpen(false); await fetchStorageDetails(); }} title="Agregar artículo al almacén">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-primary mb-2">Selecciona un artículo:</label>
            <select
              className="input-field w-full"
              value={selectedArticleId}
              onChange={handleArticleChange}
              disabled={loadingArticles || availableArticles.length === 0}
            >
              <option value="">Selecciona un artículo</option>
              {availableArticles.map(article => (
                <option key={article.id} value={String(article.id)}>

                  {article.articleName}
                </option>
              ))}
            </select>

            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-text-primary mb-2">Cantidad:</label>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Stock: {selectedArticle?.quantity ?? ""}
              </label>
            </div>

            <input
              type="number"
              min={1}
              className="input-field w-full"
              value={addQuantity}
              onChange={e => {
                const value = Number(e.target.value);
                if (!selectedArticle) return;

                // Si supera el stock, se corrige automáticamente
                if (value > selectedArticle.quantity) {
                  setAddQuantity(selectedArticle.quantity);
                } else {
                  setAddQuantity(value);
                }
              }}
              disabled={!selectedArticle}
            />

            <div className="flex gap-2 pt-2">
              <button className="btn-outline flex-1" onClick={() => {
                setIsAddModalOpen(false)
              }} type="button">
                Cancelar
              </button>
              <button
                className="btn-primary flex-1"
                onClick={handleAddArticle}
                type="button"
                disabled={!selectedArticleId || !addQuantity}
              >
                Agregar
              </button>
            </div>
          </div>
        </Modal>
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Artículos en el Almacén</h2>

          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setSelectedArticle(null);
              setSelectedArticleId("");
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white hover:bg-secondary/80 transition"
          >
            <Plus className="w-5 h-5" />
          </button>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Artículo</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Cantidad</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {uniqueArticles.map((article) => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">

                  <td className="py-3 px-4">
                    <div>
                      <div className="text-text-primary font-medium">{article.articleName}</div>
                      <div className="text-text text-sm">{article.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text">{article.quantity}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleMoveArticle(article.id, article.articleName)}
                      className="btn-outline text-sm px-3 py-1"
                      disabled={article.quantity === 0}
                    >
                      Devolver
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

          {articles.length === 0 && <div className="text-center py-8 text-text">No hay artículos en este almacén</div>}
        </div>
      </div>
    </div>
  )
}

export default StorageDetailPage
