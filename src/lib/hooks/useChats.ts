import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Chat, OptionsFilter } from "../interfaces";
import { adminService } from "@/services/adminService";

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>();
  const [filter, setFilter] = useState<OptionsFilter>(OptionsFilter.ALL);
  const { instanceId } = useContext(UserContext);

  useEffect(() => {
    const fetchChats = () => {
      adminService
        .getAllChats({ instanceId })
        .then(({ chats }: any) => {
          setChats(chats);
        })
        .catch((error) => {
          console.error("Error fetching chats:", error);
        });
    };

    fetchChats();
    const intervalId = setInterval(fetchChats, 5000);

    return () => clearInterval(intervalId);
  }, [instanceId]);

  const filteredChats = useMemo(() => {
    if (filter === OptionsFilter.LAST30) return chats?.slice(0, 30);
    if (filter === OptionsFilter.LAST50) return chats?.slice(0, 50);
    return chats;
  }, [filter, chats]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as OptionsFilter);
  };

  return {
    chats,
    filteredChats,
    handleChange,
    filter,
  };
};
