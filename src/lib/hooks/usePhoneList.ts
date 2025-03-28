import { getSkNumbers } from "@/services/skService";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";

interface FormLocation {
  country: string;
  region: string;
  pages: number;
  error: string;
}

export const usePhoneList = ({ phones }: { phones: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [skPhones, setSkPhones] = useState<typeof phones>([]);
  const [formLocation, setFormLocation] = useState<FormLocation>({
    country: "",
    region: "",
    pages: 1,
    error: "",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredPhones = [...phones, ...skPhones].filter(({ phone }) =>
    phone.includes(debouncedTerm)
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formLocation.country) {
      setFormLocation({
        ...formLocation,
        error: "Selecciona un país",
      });
      return;
    }

    if (!formLocation.region) {
      setFormLocation({
        ...formLocation,
        error: "Selecciona una región",
      });
      return;
    }

    setLoading(true);
    const fetchedPhones: typeof phones = [];

    const data = await getSkNumbers({
      locationCountryCode: formLocation.country,
      locationRegion: formLocation.region,
      pageNumber: formLocation.pages,
      userId: auth.currentUser?.uid || "",
    });

    if (Array.isArray(data.allResults)) {
      fetchedPhones.push(...data.allResults);
    } else {
      console.warn("getSkNumbers did not return an array:", data.allResults);
    }

    setFormLocation({
      country: "",
      region: "",
      pages: 1,
      error: "",
    });

    setSkPhones(fetchedPhones);
    setLoading(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    loading,
    filteredPhones,
    formLocation,
    setFormLocation,
    handleSubmit,
  };
};
