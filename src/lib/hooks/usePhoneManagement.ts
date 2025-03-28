import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { auth, database } from "@/lib/utils/firebase";
import { Phone } from "@/lib/interfaces/phone";

export const usePhoneManagement = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const phonesCollectionRef = collection(
          database,
          "contacts",
          userId,
          "phones"
        );
        const querySnapshot = await getDocs(phonesCollectionRef);
        const loadedPhones: Phone[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedPhones.push({
            id: data.id,
            name: data.name,
            phone: data.phone,
            mensajeEnviado: data.isSending || false,
          });
        });

        setPhones(loadedPhones);
      } catch (error) {
        console.error("Error fetching phones:", error);
        setLog((prevLog) => [...prevLog, "Error fetching phones."]);
      }
    };

    fetchPhones();
  }, []);

  return {
    phones,
    setPhones,
    selectedPhones,
    setSelectedPhones,
    log,
    setLog,
  };
};
