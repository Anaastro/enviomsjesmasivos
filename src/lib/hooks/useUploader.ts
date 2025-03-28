import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { auth, database } from "../utils/firebase";
import { Phone } from "../interfaces/phone";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";

export const useUploader = ({ setPhones }: { setPhones: any }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [errorExcel, setErrorExcel] = useState<string | null>(null);
  const [existingPhones, setExistingPhones] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleExcelUpload = (selectedFile: File) => {
    setErrorExcel(null);
    setExistingPhones(null);
    setUploaded(false);
    setFile(selectedFile);
  };

  const handleFileProcess = async () => {
    setExistingPhones(null);

    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async (e) => {
        const bufferArray = e.target?.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const headers: any = data[0];

        if (
          typeof headers[0] === "string" &&
          typeof headers[1] === "string" &&
          headers[0].toLowerCase() === "nombre" &&
          (headers[1].toLowerCase() === "telefono" ||
            headers[1].toLowerCase() === "celular")
        ) {
          setLoading(true);

          const phones: Phone[] = data
            .slice(1)
            .map((row: any) => ({
              id: crypto.randomUUID(),
              name: row[0],
              phone: formatPhoneNumber(row[1]),
              mensajeEnviado: false,
              userId: auth.currentUser?.uid,
            }))
            .filter((phone: Phone) => phone.phone);

          if (auth.currentUser?.uid) {
            const contactsRef = collection(
              database,
              "contacts",
              auth.currentUser.uid,
              "phones"
            );

            let existPhones: string[] = [];

            for (const phone of phones) {
              const phoneQuery = query(
                contactsRef,
                where("phone", "==", phone.phone)
              );
              const phoneSnapshot = await getDocs(phoneQuery);

              if (phoneSnapshot.empty) {
                await addDoc(contactsRef, {
                  ...phone,
                  isSending: false,
                });
              } else {
                const doc = phoneSnapshot.docs[0];
                const docData = doc.data();
                const phoneId = docData.id;

                phone.id = phoneId;

                existPhones.push(phone.phone);
              }

              if (existPhones?.length > 0) setExistingPhones(existPhones);
            }
          }
          setLoading(false);

          setPhones(phones);
          setUploaded(true);
        } else {
          setErrorExcel("El archivo no tiene el formato correcto");
          console.log("Formato incorrecto: ", headers);
        }
      };
    }
  };

  function generateExcelFile() {
    const ws = XLSX.utils.aoa_to_sheet([["Nombre", "Telefono"]]);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
    const filePath = "PlantillaTelefonos.xlsx";
    XLSX.writeFile(wb, filePath);
  }

  return {
    file,
    uploaded,
    errorExcel,
    existingPhones,
    loading,
    handleExcelUpload,
    handleFileProcess,
    generateExcelFile,
  };
};
