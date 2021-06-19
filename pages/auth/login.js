import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout";
import firebaseApp from "../../utils/firebaseConfig";
import { ProtectAuthRoute } from "../../context/auth";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/core";

export default ProtectAuthRoute(function login() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        toast({
          title: "Login Success",
          status: "success",
          duration: 8000,
          isClosable: true,
        });
        router.push("/");
      })
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          setEmailErr(err.message);
          setPasswordErr("");
          setLoginError("");
        } else if (err.code === "auth/weak-password") {
          setPasswordErr(err.message);
          setEmailErr("");
          setLoginError("");
        } else {
          setLoginError(err.message);
          setPasswordErr("");
          setEmailErr("");
        }
        setPassword("");
      });
  };

  return (
    <Layout>
      <Head>
        <title>Login to your account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-6 px-8">
        <div className="w-8 mb-3 bg-blue-500 text-white rounded-full hover:bg-blue-700">
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
        <div className="text-xl font-bold">Login to your account</div>
        <form className="bg-white rounded  pt-6 pb-8 mb-4" onSubmit={signIn}>
          {loginError !== "" ? (
            <div className="text-red-500 text-sm mb-3">{loginError}</div>
          ) : null}
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
});
