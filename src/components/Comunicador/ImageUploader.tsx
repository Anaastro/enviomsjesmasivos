import React, { useState } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/utils/firebase";

interface ImageUploaderProps {
  setStatusMessages: React.Dispatch<React.SetStateAction<string[]>>;
  setLog: React.Dispatch<React.SetStateAction<string[]>>;
  phones: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setStatusMessages,
  setLog,
  phones,
}) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Error al subir la imagen:", error);
        },
        () => {
          setLog((prev) => [...prev, `Imagen subida: ${image.name}`]);

          phones.forEach((phone) => {
            const status = `Imagen enviada a ${phone}`;
            setStatusMessages((prev) => [...prev, status]);
          });
        }
      );
    }
  };

  return (
    <div className="border p-4 bg-white shadow rounded">
      <h3 className="text-lg font-semibold mb-2">Subir Imagen</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setImage(e.target.files[0])}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleImageUpload}
        className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
      >
        Enviar Imagen
      </button>
    </div>
  );
};

export default ImageUploader;
