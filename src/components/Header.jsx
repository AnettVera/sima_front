import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LogOut, ChevronLeft } from "lucide-react";
import { User } from "lucide-react";
import { useState, useRef } from "react";
import Modal from "./Modal";
import UserForm from "./forms/UserForm";
import { useUsers } from "../hooks/useUsers";
import { userService } from "../config/api";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { users } = useUsers(); // Solo usamos users, no updateUser
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const originalUsernameRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
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
      setLoggingOut(true);

      // Mostrar loading con mensaje
      const loadingAlert = Swal.fire({
        title: "Cerrando sesión...",
        text: "Por favor espera un momento",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-lg",
        },
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Simular un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      logout();

      // Cerrar el loading alert antes de navegar
      Swal.close();
      setLoggingOut(false);
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    if (user.role === "ADMIN") {
      navigate("/");
    } else {
      navigate("/dashboard/user");
    }
  };

  const handleEditUser = async () => {
    if (user) {
      setLoadingUser(true);
      let currentUser = users?.find((u) => u.id === user.id);
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
      // Guardar el username original
      originalUsernameRef.current = currentUser.username;
      setIsModalOpen(true);
      setLoadingUser(false);
    }
  };

  const handleSubmitUser = async (userData) => {
    if (editingUser && originalUsernameRef.current !== undefined) {
      setLoadingUser(true);

      // Verificar si el username cambió ANTES de hacer la actualización
      const usernameChanged = originalUsernameRef.current !== userData.username;

      try {
        // Llamar directamente a la API sin usar el hook
        await userService.update(editingUser.id, userData);

        setLoadingUser(false);
        setIsModalOpen(false);
        setEditingUser(null);
        originalUsernameRef.current = null;

        if (usernameChanged) {
          // Username cambió - mostrar alert y redirigir
          await Swal.fire({
            icon: "info",
            title: "Nombre de usuario cambiado",
            text: "Debes volver a iniciar sesión.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16423C",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          logout();
          navigate("/login");
        } else {
          // Username NO cambió - solo actualizar localStorage y mostrar éxito
          const updatedUser = { ...user, ...userData };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          await Swal.fire({
            icon: "success",
            title: "Usuario actualizado",
            text: "Los datos se han actualizado correctamente.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16423C",
          });
        }
      } catch (error) {
        setLoadingUser(false);
        console.error("Error updating user:", error);

        // Verificar el tipo específico de error
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 409: // Conflicto - usuario/email ya existe
              await Swal.fire({
                icon: "warning",
                title: "Datos duplicados",
                text:
                  data.message ||
                  "El nombre de usuario o email ya están en uso.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#16423C",
              });
              break;

            case 400: // Bad Request - datos inválidos
              await Swal.fire({
                icon: "error",
                title: "Datos inválidos",
                text:
                  data.message || "Los datos proporcionados no son válidos.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#16423C",
              });
              break;

            case 404: // Not Found - usuario no encontrado
              await Swal.fire({
                icon: "error",
                title: "Usuario no encontrado",
                text: "El usuario que intentas actualizar no existe.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#16423C",
              });
              break;

            case 500: // Error interno del servidor
              await Swal.fire({
                icon: "error",
                title: "Error del servidor",
                text: "Hubo un problema interno. Inténtalo más tarde.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#16423C",
              });
              break;

            default:
              await Swal.fire({
                icon: "error",
                title: "Error",
                text:
                  data.message || "Hubo un problema al actualizar el usuario.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#16423C",
              });
          }
        } else if (error.request) {
          // Error de red/conexión
          await Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16423C",
          });
        } else {
          // Error desconocido
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16423C",
          });
        }
      }
    }
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <ChevronLeft
            className="text-white"
            onClick={() => navigate(roleRoutes[user.role])}
          />
          <div
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-opacity hover:opacity-70"
            onClick={async (e) => {
              e.stopPropagation();
              await handleEditUser();
            }}
            title="Editar mi usuario"
            style={{ border: "2px solid #16423C" }}
          >
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold">SIMA</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Hola, {user?.name || user?.username}</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              loggingOut
                ? "bg-white/10 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {loggingOut ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogOut className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          originalUsernameRef.current = null;
        }}
        title="Editar Usuario"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingUser(null);
            originalUsernameRef.current = null;
          }}
          availableStorages={null}
        />
        {loadingUser && (
          <div className="text-center py-2 text-primary">
            Guardando cambios...
          </div>
        )}
      </Modal>
    </header>
  );
};

export default Header;
