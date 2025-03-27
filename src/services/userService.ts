import { database } from "@/lib/utils/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default class UserService {
  static fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Error fetching users");

    const { users } = await response.json();
    return users;
  };

  static fetchPaginatedUsers = async (pageSize = 10) => {
    const usersRef = collection(database, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(usersRef);
    const firestoreData = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        code: docData.code,
        used: docData.used,
        instanceId: docData.instanceId ? docData.instanceId : "No asignado",
        rol: docData.rol ? docData.rol : "No asignado",
      };
    });

    const authUsers = await UserService.fetchUsers();

    const data = firestoreData.map((user) => {
      const authUser = authUsers.find((auth: any) => auth.uid === user.id);
      return {
        ...user,
        email: authUser?.email || "No registrado",
      };
    });

    return { data };
  };

  static fetchUser = async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error("Error fetching user");

    const { user } = await response.json();
    return user;
  };
}
