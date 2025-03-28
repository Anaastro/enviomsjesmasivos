import { useState } from "react";

export const useModalControler = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return { showModal, openModal, closeModal };
};
