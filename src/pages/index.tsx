import Comunicador from "@/components/Comunicador";
import Configuracion from "@/components/Login/Configuracion";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { LoggedContext } from "@/lib/context/LoggedContext";
import { app, database } from "@/lib/utils/firebase";
import { UserContext } from "@/lib/context/UserContext";
import ListPhoneNumbers from "@/components/Login/ListPhoneNumbers";
import ParticlesBackgroud from "@/components/ParticlesBackground";
import { doc, getDoc } from "firebase/firestore";
import UserService from "@/services/userService";
import nookies from "nookies";

interface User {
  email: string;
  rol: string;
}

const Home: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const { userLoggedIn, setUserLoggedIn, errorLoggedIn } =
    useContext(LoggedContext);
  const [user, setUser] = useState<User | null>(null);
  const { instanceId, setInstanceId } = useContext(UserContext);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserLoggedIn(true);
        setIsConfigOpen(false);

        const token = await currentUser.getIdToken();

        nookies.set(undefined, "token", token, { path: "/" });
        const uid = currentUser.uid;

        const userRef = doc(database, "users", uid);
        const isMounted = { value: true };

        try {
          const userRaw = await getDoc(userRef);
          const userAuth = await UserService.fetchUser(uid);

          if (isMounted.value) {
            if (userRaw.exists()) {
              const userData = userRaw.data();
              const userRol = userData.rol || "user";

              setUser({
                email: userAuth?.email || userData.email,
                rol: userRol,
              });

              if (userRol !== "admin") {
                setInstanceId(userData.instanceId);
              }
            } else {
              setUser({
                email: userAuth?.email || "",
                rol: "",
              });
            }
            const result = await fetch("/api/setCustomUserClaims", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid }),
            });

            return await result.json();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        nookies.set(undefined, "token", "", { path: "/" });
        setUserLoggedIn(false);
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, setUserLoggedIn, setInstanceId]);

  const handleSignOut = async () => {
    try {
      if (!auth.currentUser) return;

      await signOut(auth);

      // const userDocRef = doc(database, "users", userUid);
      // await setDoc(
      // 	userDocRef,
      // 	{ phone: "", sessionActive: false },
      // 	{ merge: true }
      // );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSignIn = ({ email, rol }: User) => {
    if (errorLoggedIn) return;
    setUserLoggedIn(true);
    setIsConfigOpen(false);
    if (!rol) {
      setUser({ email, rol: "user" });
      return;
    }
    setUser({ email, rol });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black relative">
        <ParticlesBackgroud />
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-6 sm:space-y-0">
          <img
            src="/images/icons-12934.gif"
            alt="Imagen 1"
            className="w-3/4 sm:w-1/3 h-auto"
          />
          <img
            src="/images/whatsapp-2223.gif"
            alt="Imagen 2"
            className="w-3/4 sm:w-1/3 h-auto"
          />
          <img
            src="/images/astro-logo-blanco.png"
            alt="Logo de Astro"
            className="w-60 h-60 animate-pulse"
          />
        </div>

        {!isConfigOpen && !userLoggedIn && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-purple-700 text-white font-extralight py-3 px-6 rounded-lg shadow-lg z-30"
              onClick={() => setIsConfigOpen(true)}
            >
              Haz clic
            </motion.button>
          </>
        )}
        {isConfigOpen && (
          <Configuracion
            onClose={() => setIsConfigOpen(false)}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        )}
        {userLoggedIn && user && !instanceId && user.rol !== "admin" && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>No se le asigno una instancia. Intentelo mas tarde</p>
          </div>
        )}
        {userLoggedIn && user && !instanceId && user.rol === "admin" && (
          <ListPhoneNumbers />
        )}
        {userLoggedIn && user && (
          <div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-purple-700 text-white font-extralight py-3 px-6 rounded-lg shadow-lg z-30"
              onClick={handleSignOut}
            >
              Cerrar Session
            </motion.button>
          </div>
        )}
        {userLoggedIn && user && instanceId && (
          <>
            <Comunicador
              name={user?.email}
              rol={user?.rol}
              signOut={handleSignOut}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
