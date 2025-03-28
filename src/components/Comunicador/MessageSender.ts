import { useCallback, useContext, useEffect, useState } from "react";
import {
  query,
  collectionGroup,
  where,
  getDocs,
  updateDoc,
  collection,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, database } from "@/lib/utils/firebase";
import { UserContext } from "@/lib/context/UserContext";
import {
  addMessageToQueue,
  uploadMessageWithImage,
} from "@/services/messageService";
import { clientService } from "@/services/clientService";
import { SelectedPhonesContext } from "@/lib/context/SelectedPhonesContext";
import { all } from "bluebird";

interface SentMessage {
  phone: string;
  date: string;
}

interface MessageSenderProps {
  selectedPhones: string[];
  setSelectedPhones: React.Dispatch<React.SetStateAction<string[]>>;
  setStatusMessages: React.Dispatch<React.SetStateAction<string[]>>;
  setLog: React.Dispatch<React.SetStateAction<string[]>>;
  setSentMessages: React.Dispatch<React.SetStateAction<SentMessage[]>>;
  setColorMap: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  colorMap: { [key: string]: string };
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSent: React.Dispatch<React.SetStateAction<boolean>>;
  setLoaderMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const useMessageSender = ({
  selectedPhones,
  setIsSending,
}: MessageSenderProps) => {
  const { instanceId } = useContext(UserContext);
  const [messageId, setMessageId] = useState<string>("");
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const { lastSelectedPhone, setLastSelectedPhone } = useContext(
    SelectedPhonesContext
  );

  const handleSend = useCallback(
    async (message: string, image: File | null) => {
      setIsSending(true);
      setMessageId("");

      try {
        if (!instanceId) {
          throw new Error("instanceId o waapiApiKey no están definidos");
        }

        const rawData = await clientService.getInformation({ instanceId });
        const { formattedNumber } = rawData.me.data;

        const messageId = await uploadMessageWithImage(
          message,
          instanceId,
          auth.currentUser!.uid,
          image
        );
        setMessageId(messageId);

        const getPhones = await Promise.all(
          selectedPhones.map(async (phone, index) => {
            const q = query(
              collection(database, "contacts", auth.currentUser!.uid, "phones"),
              where("id", "==", phone)
            );

            const querySnapshot = await getDocs(q);
            const phoneNumbers: { phone: string; id: string }[] = [];

            for (const docSnap of querySnapshot.docs) {
              const { phone } = docSnap.data();
              phoneNumbers.push({ phone, id: docSnap.id });
            }

            return phoneNumbers;
          })
        );

        const allUpdatedPhones = getPhones.flat();
        setTotalMessages(allUpdatedPhones.length);

        const isSave = await addMessageToQueue(
          allUpdatedPhones,
          messageId,
          instanceId,
          formattedNumber,
          auth.currentUser!.uid
        );

        await setDoc(
          doc(database, "users", auth.currentUser!.uid),
          {
            isSending: true,
            dataSending: {
              instanceId,
              messageId,
            },
          },
          { merge: true }
        );

        setLastSelectedPhone((prev) => ({
          ...prev,
          sent: prev.index,
        }));

        if (!isSave) {
          throw new Error("Error al guardar los mensajes en la cola");
        }
      } catch (error) {
        let errorMessage = "Error desconocido";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setIsSending(false);
        console.error("Error durante el envío de mensajes:", errorMessage);
      }
    },
    [selectedPhones, instanceId]
  );

  return { handleSend, messageId, totalMessages };
};
