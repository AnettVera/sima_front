import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { LogOut, ChevronLeft } from "lucide-react";
import { User } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import UserForm from "./forms/UserForm";
import { useUsers } from "../hooks/useUsers";
import { userService } from "../config/api";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { updateUser, users } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"))
  const roleRoutes = {
    ADMIN: "/dashboard",
    USER: "/dashboard/user",
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16423C",
      cancelButtonColor: "#6A9C89",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });
    if (result.isConfirmed) {
      logout();
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };


  const handleEditUser = async () => {
    if (user) {
      setLoadingUser(true);
      let currentUser = users?.find(u => u.id === user.id);
      // Si no está en la lista o faltan campos, obtener desde la API
      if (!currentUser || !currentUser.email || !currentUser.lastName) {
        try {
          const response = await userService.getById(user.id);
          currentUser = response.data.data;
        } catch (e) {
          currentUser = user; // fallback
        }
      }
      setEditingUser(currentUser);
      setIsModalOpen(true);
      setLoadingUser(false);
    }
  };

  const handleSubmitUser = async (userData) => {
    if (editingUser) {
      setLoadingUser(true);
      const result = await updateUser(editingUser.id, userData);
      setLoadingUser(false);

      if (result.success) {
        const oldUser = JSON.parse(localStorage.getItem("user"));
        const usernameChanged = oldUser.username !== userData.username;

        setIsModalOpen(false);
        setEditingUser(null);

        if (usernameChanged) {
          await Swal.fire({
            icon: "info",
            title: "Nombre de usuario cambiado",
            text: "Debes volver a iniciar sesión.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16423C",
          });
          logout();
          navigate("/login");
        }
      }
    }
  };



  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>

          <ChevronLeft
            className="text-white"
            onClick={() => navigate(roleRoutes[user.role])}
          />

          <div
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-opacity hover:opacity-70"
            onClick={async e => {
              e.stopPropagation();
              await handleEditUser();
            }}
            title="Editar mi usuario"
            style={{ border: "2px solid #16423C" }}
          >
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold">SIma</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Hola, {user?.name || user?.username}</span>
          <button
            onClick={handleLogout}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        title="Editar Usuario"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onCancel={() => { setIsModalOpen(false); setEditingUser(null); }}
          availableStorages={null}
        />
        {loadingUser && <div className="text-center py-2 text-primary">Guardando cambios...</div>}
      </Modal>
    </header>
  );
};

export default Header;
