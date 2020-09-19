import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import firebaseApp from "../utils/firebaseConfig";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // const [logSuccess, setLogSuccess] = useState(false);
  // const [logLoading, setLogLoading] = useState(false);
  // const [loginError, setLoginError] = useState("");
  // const [emailErr, setEmailErr] = useState("");
  // const [passwordErr, setPasswordErr] = useState("");

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser);
        firebaseApp
          .firestore()
          .collection("users")
          .doc(authUser.uid)
          .get()
          .then(doc => {
            if (doc.data().isAdmin == "1") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
            setIsLoggedIn(true);
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

  // const login = (email, password) => {
  //   setLogLoading(true);
  //   firebaseApp
  //     .auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then(() => {
  //       setEmailErr("");
  //       setPasswordErr("");
  //       setLoginError("");
  //       setLogLoading(false);
  //       setLogSuccess(true);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       if (err.code === "auth/invalid-email") {
  //         setEmailErr(err.message);
  //         setPasswordErr("");
  //         setLoginError("");
  //       } else if (err.code === "auth/weak-password") {
  //         setPasswordErr(err.message);
  //         setEmailErr("");
  //         setLoginError("");
  //       } else {
  //         setLoginError(err.message);
  //         setPasswordErr("");
  //         setEmailErr("");
  //       }
  //       setLogLoading(false);
  //       setLogSuccess(false);
  //       // else if(err.code === "auth/user-not-found")
  //       // alert(err.message);
  //     });
  // };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isAdmin,
        userLoading
        // login,
        // logSuccess,
        // logLoading,
        // loginError,
        // emailErr,
        // passwordErr
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
    const { isLoggedIn, userLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn && !userLoading) router.push("/");
    }, [userLoading, isLoggedIn]);

    return <Component {...arguments} />;
  };
}
