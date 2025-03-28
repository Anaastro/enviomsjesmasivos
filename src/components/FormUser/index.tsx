import { database } from "@/lib/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import Swal from "sweetalert2";
import { User } from "../Dashboard/TableUsers";

interface Props {
  user: User;
  updateList?: (user: User) => void;
  onCloseModal?: () => void;
}

export default function FormUser({ user, updateList, onCloseModal }: Props) {
  const [form, setForm] = useState({
    email: "",
    instanceId: user.instanceId || "",
    rol: user.rol || "",
  });
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchInstances() {
      try {
        const response = await fetch("/api/getInstances");
        const { instances } = await response.json();
        setInstances(instances);
      } catch (error) {
        console.error("Error fetching instances:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstances();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prevForm: any) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user.id) {
        throw new Error("User ID is undefined");
      }

      const userRef = doc(database, "users", user.id);
      const userUpdated =
        form.rol === "admin" ? { instanceId: null, rol: form.rol } : form;

      await setDoc(userRef, { ...userUpdated }, { merge: true });

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        showConfirmButton: false,
        timer: 1500,
      });

      updateList &&
        updateList({
          id: user.id,
          email: user.email,
          lastLogin: user.lastLogin,
          phone: user.phone,
          sessionActive: user.sessionActive,
          instanceId: userUpdated.instanceId,
          rol: userUpdated.rol,
        } as User);

      onCloseModal && onCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-md rounded-xl w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Editar Usuario
      </h2>

      <div className="mb-4">
        <label
          htmlFor="instanceId"
          className="block text-sm font-medium text-gray-600"
        >
          Instancias
        </label>
        <select
          name="instanceId"
          id="instanceId"
          onChange={handleChange}
          value={form.instanceId}
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200"
          disabled={loading || form.rol === "admin"}
        >
          <option value="">Selecciona una instancia</option>
          {loading ? (
            <option>Cargando...</option>
          ) : instances.length > 0 ? (
            instances.map((instance: any) => (
              <option key={instance.id} value={instance.id}>
                {instance.name}
              </option>
            ))
          ) : (
            <option>No hay instancias disponibles</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="rol"
          className="block text-sm font-medium text-gray-600"
        >
          Rol
        </label>
        <select
          name="rol"
          id="rol"
          onChange={handleChange}
          value={form.rol}
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200"
        >
          <option value="">Selecciona un rol</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        className={`w-full bg-blue-700 text-white py-2 rounded-md
        ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {saving ? "Guardando" : "Guardar"}
      </button>
    </form>
  );
}
