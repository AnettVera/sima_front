"use client"

import { useState } from "react"

const SearchBar = ({ onSearch, placeholder = "Escribe el nombre del usuario que deseas buscar" }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6 ">
      <div className="flex-1 ">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="input-field "
        />
      </div>
      <button type="submit" className="btn-outline flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}

export default SearchBar
