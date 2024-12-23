import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  setDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/utils/firebase";

const firestore = getFirestore(app);
const storage = getStorage(app);

export const addCategory = async (name: string) => {
  const docRef = await addDoc(collection(firestore, "categories"), { name });
  return docRef.id;
};

export const getCategories = (
  callback: (categories: { id: string; name: string }[]) => void
) => {
  const q = query(collection(firestore, "categories"));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as { id: string; name: string }[];
    callback(categories);
  });
};

export const addProduct = async (
  categoryId: string,
  productName: string,
  images: File[]
) => {
  const productRef = doc(
    collection(firestore, "categories", categoryId, "products")
  );
  const imageUrls = await Promise.all(
    images.map(async (image) => {
      const imageRef = ref(storage, `products/${productRef.id}/${image.name}`);
      await uploadBytes(imageRef, image);
      return getDownloadURL(imageRef);
    })
  );

  await setDoc(productRef, {
    name: productName,
    images: imageUrls,
  });
};
