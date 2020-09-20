import Head from "next/head";
import Link from "next/link";
import firebaseApp from "../utils/firebaseConfig";
import Layout from "../components/Layout";
import useAuth, { ProtectRoute } from "../context/auth";

function Home() {
  const { user, isAdmin, isLoggedIn, userLoading } = useAuth();
  return (
    <Layout>
      <Head>
        <title>Voting App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="-mt-8 h-screen flex flex-col justify-center items-center px-2">
        <img
          className="px-12 mb-3 md:max-w-md md:mb-6"
          src="/svg/undraw_online_connection_6778.svg"
        />
        <div className="text-xl font-bold text-center md:text-3xl">
          {!userLoading
            ? user
              ? `Hi, ${user.displayName}. `
              : null
            : null}
          Welcome to Resident's Chief Voting
        </div>
        <div className="text-md text-center">
          Click the login button below to start voting
        </div>
        <div className="mt-2">
          {userLoading ? (
            "Please Wait..."
          ) : !isLoggedIn ? (
            <>
              <Link href="/auth/login">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <>
              {isAdmin == "1" ? (
                <Link href="/admin">
                  <button className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded ml-2">
                    Admin
                  </button>
                </Link>
              ) : null}
              <Link href="/vote">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                  Vote
                </button>
              </Link>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={() => firebaseApp.auth().signOut()}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProtectRoute(Home);
