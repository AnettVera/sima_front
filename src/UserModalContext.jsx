// UserModalContext.jsx
import React, { createContext, useState, useContext } from "react"

const UserModalContext = createContext()

export const UserModalProvider = ({ children }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userStorage, setUserStorage] = useState(null)

  const openUserModal = (user, storage) => {
    setEditingUser(user)
    setUserStorage(storage)
    setIsUserModalOpen(true)
  }

  const closeUserModal = () => {
    setIsUserModalOpen(false)
    setEditingUser(null)
    setUserStorage(null)
  }

  return (
    <UserModalContext.Provider
      value={{
        isUserModalOpen,
        editingUser,
        userStorage,
        openUserModal,
        closeUserModal,
      }}
    >
      {children}
    </UserModalContext.Provider>
  )
}

export const useUserModal = () => useContext(UserModalContext)
