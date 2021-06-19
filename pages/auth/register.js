import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import firebaseApp from "../../utils/firebaseConfig";
import { useToast } from "@chakra-ui/core";
import { ProtectAuthRoute } from "../../context/auth";

export default ProtectAuthRoute("register", function register() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");

  const [fullNameErr, setFullNameErr] = useState("");
  const [addressErr, setAddressErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    if (fullName === "") {
      return setFullNameErr("Please fill this input");
    }
    if (address === "") {
      return setAddressErr("Please fill this input");
    }
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: fullName,
        });
        firebaseApp.firestore().collection("users").doc(authUser.user.uid).set({
          fullName: fullName,
          address: address,
          email: authUser.user.email,
          isAdmin: 0,
        });
        toast({
          title: "Account has been registered successfully",
          status: "success",
          duration: 8000,
          isClosable: true,
        });
        router.push("/");
      })
      .catch((err) => {
        // console.log(err);
        if (err.code === "auth/invalid-email") {
          setEmailErr(err.message);
          setPasswordErr("");
        } else if (err.code === "auth/weak-password") {
          setPasswordErr(err.message);
          setEmailErr("");
        }
        alert(err.message);
      });
  };
  return (
    <div>
      <Head>
        <title>Create new account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-6 px-8">
        <div className="w-8 mb-3 bg-green-500 text-white rounded-full hover:bg-green-700">
          <Link href="/">
            <svg
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="text-xl font-bold">Create new account</div>
        <form className="bg-white rounded  pt-6 pb-8 mb-4" onSubmit={signUp}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {fullNameErr !== "" ? (
              <p className="text-red-500 text-xs italic">{fullNameErr}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {addressErr !== "" ? (
              <p className="text-red-500 text-xs italic">{addressErr}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailErr !== "" ? (
              <p className="text-red-500 text-xs italic">{emailErr}</p>
            ) : null}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordErr !== "" ? (
              <p className="text-red-500 text-xs italic">{passwordErr}</p>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
            <Link href="/auth/login">
              <a className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800">
                Already have an account?
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
});
