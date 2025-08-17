"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { storageService } from "../config/api"
import { StatsSkeleton } from "../components/SkeletonLoader"
import { User } from "lucide-react";


const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [storages, setStorages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStorages()
  }, [])

  const fetchStorages = async () => {
    try {
      const response = await storageService.getAll()
      setStorages(response.data.data)
    } catch (error) {
      console.error("Error fetching storages:", error)
    } finally {
      setLoading(false)
    }
  }


  const isAdmin = user?.role === "ADMIN"

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-text-titleText mb-8">
            Hola, {user?.name || user?.username}
          </h1>
        </div>
        <StatsSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
   

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8  text-black">
          <button
            onClick={() => navigate("/users")}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white " />

              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-titleText">Gestión de usuarios</h3>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/categories")}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-titleText">Gestión de categorías</h3>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/storages")}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v8a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-titleText">Gestión de Almacenes</h3>

            </div>
          </button>
        </div>
      )}



      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-black" >
          <button
            onClick={() => navigate("/articles")}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Registrar producto</h3>
              <p className="text-text text-sm">
                Registra todas la entrada de todos los productos que llegan al almacén.
              </p>
            </div>
          </button>


        </div>
      )}

      <div className="space-y-6">
        <button onClick={() => navigate("/articles")} className="w-full btn-outline">
          Ver productos
        </button>
        <div className="text-center mb-8">

          <h2 className="text-xl font-semibold text-primary">Almacenes ({storages.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {storages.map((storage) => (
            <div key={storage.id} className="card text-center">
              <h3 className="text-lg font-semibold text-secondary mb-2"># {storage.storageIdentifier}</h3>
              <p className="text-text-primary font-medium mb-2">{storage.category?.categoryName || "Sin categoría"}</p>
              <p className="text-text text-sm mb-4">Responsable: {storage.responsible?.name || "Sin asignar"}</p>
              <button onClick={() => navigate(`/storages/${storage.id}`)} className="btn-primary w-full">
                Visualizar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
