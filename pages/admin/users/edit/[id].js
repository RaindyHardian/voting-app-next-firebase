import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ProtectRoute } from "../../../../context/auth";
import firebaseApp from "../../../../utils/firebaseConfig";
import Head from "next/head";
import AdminLayout from "../../../../components/AdminLayout";
import { useToast } from "@chakra-ui/core";

const userEdit = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");

  const [fullNameErr, setFullNameErr] = useState("");
  const [addressErr, setAddressErr] = useState("");

  useEffect(() => {
    if (id) {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(id)
        .get()
        .then(item => {
          setFullName(item.data().fullName);
          setAddress(item.data().address);
          setLoading(false);
          setError(false);
        })
        .catch(err => {
          setLoading(false);
          setError(true);
        });
    }
  }, [id]);

  const submitEdit = e => {
    e.preventDefault();
    if (id) {
      if (fullName === "") {
        return setFullNameErr("Please fill this input");
      }
      if (address === "") {
        return setAddressErr("Please fill this input");
      }
      firebaseApp
        .firestore()
        .collection("users")
        .doc(id)
        .update({
          fullName: fullName,
          address: address
        })
        .then(() => {
          toast({
            title: "Success",
            description: "account updated",
            status: "success",
            duration: 8000,
            isClosable: true
          });
          return router.push("/admin/users");
        })
        .catch(err => {
          toast({
            title: "An error occurred.",
            description: "Unable to update user account.",
            status: "error",
            duration: 8000,
            isClosable: true
          });
        });
    }
  };

  return (
    <AdminLayout>
      <div>
        <Head>
          <title>Edit account</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="px-3 md:px-0 text-2xl text-gray-800 md:text-3xl font-bold md:mb-5 ">
          Edit User
        </div>
        {!loading ? (
          error ? (
            <div>There's an error, please refresh the page</div>
          ) : (
            <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-4 md:shadow-lg ">
              <form onSubmit={submitEdit}>
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
                    onChange={e => setFullName(e.target.value)}
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
                    onChange={e => setAddress(e.target.value)}
                  />
                  {addressErr !== "" ? (
                    <p className="text-red-500 text-xs italic">{addressErr}</p>
                  ) : null}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default ProtectRoute(userEdit);
