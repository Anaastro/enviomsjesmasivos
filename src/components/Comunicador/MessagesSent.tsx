import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  serverTimestamp,
  push,
  off,
  query,
  remove,
} from "firebase/database";
import { auth, databaseRealtime } from "@/lib/utils/firebase";
import DotLoader from "../DotLoader";
import { onAuthStateChanged } from "firebase/auth";

export const MessagesSent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [uid, setUid] = useState<string | null>(null);
  const [form, setForm] = useState({ nota: "" });
  const [notas, setNotas] = useState<
    { id: string; nota: string; createdAt?: string }[]
  >([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const notasRef = ref(databaseRealtime, `notas/${uid}`);

    const unsubscribe = onValue(notasRef, (snapshot) => {
      const notasData = snapshot.val();
      if (!notasData) {
        setNotas([]);
        setLoading(false);
        return;
      }

      const notasArray = Object.keys(notasData).map((id) => ({
        id,
        nota: notasData[id].nota,
        createdAt: notasData[id].createdAt
          ? new Date(notasData[id].createdAt).toLocaleString()
          : "Desconocido",
      }));

      setNotas(notasArray);
      setLoading(false);
    });

    return () => off(notasRef, "value", unsubscribe);
  }, [uid]);

  const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid) return;

    try {
      const notasRef = ref(databaseRealtime, `notas/${uid}`);
      push(notasRef, {
        nota: form.nota,
        createdAt: serverTimestamp(),
      });
      setForm({ nota: "" });
    } catch (error) {
      console.error("Error al guardar la nota:", error);
    }
  };

  const handleDelete = (id: string) => {
    if (!uid) {
      console.log("Error al borrar la nota: No hay un usuario autenticado");
      return;
    }

    try {
      const notaRef = ref(databaseRealtime, `notas/${uid}/${id}`);
      remove(notaRef);
    } catch (error) {
      console.error("Error al borrar la nota:", error);
    }
  };

  return (
    <div className="bg-transparent text-black p-4 rounded-2xl max-h-[50vh] overflow-y-auto border-5 border-purple-700">
      <p className="text-[#efefef] font-extralight text-xl mb-2 text-center">
        Notas
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <textarea
          name="nota"
          id="nota"
          onChange={handleFormChange}
          value={form.nota}
          className="w-full p-2 rounded-lg text-black"
        ></textarea>

        <button className="bg-purple-700 text-white rounded-lg p-2">
          Guardar Nota
        </button>
      </form>

      <div className="h-[85%] overflow-y-auto px-4 py-2 rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <DotLoader />
          </div>
        ) : notas.length === 0 ? (
          <p className="text-center text-gray-400">No hay notas</p>
        ) : (
          notas.map(({ id, nota, createdAt }) => (
            <div
              key={id}
              className="border-b border-gray-500 p-2 text-white flex justify-between items-center"
            >
              <div>
                <p>{nota}</p>
                <p className="text-sm text-gray-400">Fecha: {createdAt}</p>
              </div>
              <button
                className="bg-red-500 text-white rounded-full px-3 py-1"
                onClick={() => handleDelete(id)}
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
