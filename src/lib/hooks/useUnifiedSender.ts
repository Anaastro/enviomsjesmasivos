import { useState } from "react";

export const useUnifiedSender = ({
  phones,
  handleSend,
}: {
  phones: string[];
  handleSend: (message: string, mediaFile: File | null) => void;
}) => {
  const [message, setMessage] = useState<string>("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState<number>(0);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setMediaFile(file);
      const fileType = file.type.split("/")[0];

      if (fileType === "image") {
        const reader = new FileReader();
        reader.onload = () => {
          setMediaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview(null);
      }
    }
  };

  const onSendClick = async () => {
    if (phones.length === 0) {
      alert("Selecciona al menos un número de teléfono");
      return;
    }

    handleSend(message, mediaFile);
    setMessage("");
    setMediaPreview(null);
    setMediaFile(null);
    setFormKey((prev) => prev + 1);
  };

  return {
    message,
    setMessage,
    mediaPreview,
    mediaFile,
    handleMediaChange,
    onSendClick,
    formKey,
  };
};
