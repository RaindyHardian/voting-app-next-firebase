import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import firebaseApp from "../utils/firebaseConfig";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        firebaseApp
          .firestore()
          .collection("users")
          .doc(authUser.uid)
          .get()
          .then((doc) => {
            if (doc.data().isAdmin == "1") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
            setUser({
              id: doc.id,
              data: doc.data(),
            });
            setIsLoggedIn(true);
            setUserLoading(false);
          })
          .catch((error) => {
            setIsLoggedIn(false);
            setUserLoading(false);
          });
      } else {
        // user has logged out
        setUser(null);
        setIsLoggedIn(false);
        setUserLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isAdmin,
        userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export function ProtectRoute(Component) {
  return () => {
    const { isLoggedIn, userLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn && !userLoading) {
        router.push("/");
      }
      if (isLoggedIn && !isAdmin) {
        router.push("/");
      }
    }, [userLoading, isLoggedIn, isAdmin]);

    return userLoading ? null : <Component {...arguments} />;
  };
}

export function ProtectUserRoute(Component) {
  return () => {
    const { isLoggedIn, userLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn && !userLoading) router.push("/auth/login");
    }, [userLoading, isLoggedIn]);

    return userLoading ? null : <Component {...arguments} />;
  };
}

export function ProtectAuthRoute(Component) {
  return () => {
    const { isLoggedIn, userLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!userLoading && isLoggedIn) router.push("/");
    }, [userLoading, isLoggedIn]);

    return userLoading ? null : <Component {...arguments} />;
  };
}
