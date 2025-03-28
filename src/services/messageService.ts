import { database, storage } from "@/lib/utils/firebase";
import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface SentMessages {
  instanceId: string;
  message: string;
  phoneNumbers: string[];
  image?: File | null;
}

export async function uploadMessageWithImage(
  message: string,
  instanceId: string,
  userId: string,
  file?: File | null
) {
  let imageUrl;

  if (file) {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(database, "messages"), {
    message: message,
    imageUrl: imageUrl ? imageUrl : null,
    instanceId: instanceId,
    userId: userId,
    createdAt: new Date(),
  });

  return docRef.id;
}

export async function addMessageToQueue(
  phoneNumbers: { phone: string; id: string }[],
  messageId: string,
  instanceId: string,
  sentBy: string,
  uid: string
) {
  const messageQueueRef = collection(database, "messageQueue");

  try {
    const docRef = await addDoc(messageQueueRef, {
      status: "inProgress",
      lastProcessedPhoneIndex: 0,
      phoneNumbers: phoneNumbers,
      messageId: messageId,
      sentAt: null,
      error: null,
      instanceId: instanceId,
      sentBy,
      uid,
    });

    return true;
  } catch (error) {
    console.error("Error al añadir los destinatarios a la cola:", error);
    return false;
  }
}
