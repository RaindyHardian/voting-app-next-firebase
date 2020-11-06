import { useState, useEffect } from "react";
import useAuth, { ProtectUserRoute } from "../../context/auth";
import firebaseApp from "../../utils/firebaseConfig";
import { format } from "date-fns";
import firebase from "firebase";
import Layout from "../../components/Layout";
import { Spinner, useToast } from "@chakra-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

const vote = () => {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  const [elections, setElections] = useState({});
  const [eLoading, setELoading] = useState(true);

  const [candidates, setCandidates] = useState([]);
  const [cLoading, setCLoading] = useState(true);

  const [voted, setVoted] = useState(true);
  const [vLoading, setVLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // get election info
      firebaseApp
        .firestore()
        .collection("elections")
        .doc(id)
        .get()
        .then(item => {
          setElections({
            id: item.id,
            data: item.data()
          });
          setELoading(false);
        });
      // get candidates info
      firebaseApp
        .firestore()
        .collection(`elections/${id}/candidates`)
        .get()
        .then(items => {
          setCandidates(
            items.docs.map(item => {
              return {
                id: item.id,
                data: item.data()
              };
            })
          );
          setCLoading(false);
        })
        .catch(err => {
          toast({
            title: "Connection Failed",
            description: "Please retry in a second",
            status: "error",
            duration: 8000,
            isClosable: true
          });
        });
      // get current user vote status
      firebaseApp
        .firestore()
        .collection(`elections/${id}/voter`)
        .doc(user.id)
        // .get()
        .onSnapshot(item => {
          console.log(item.data());
          if (item.data() !== undefined) {
            setVoted(true);
          } else {
            setVoted(false);
          }
          setVLoading(false);
        });
    }
  }, [id]);
  const voteCandidate = e => {
    if (user) {
      if (voted) {
        alert("ANDA SUDAH MEMILIH");
      } else {
        const c_id = e.target.attributes.c_id.value;
        firebaseApp
          .firestore()
          .collection(`elections/${id}/voter`)
          .doc(user.id)
          .set({
            user: firebaseApp.firestore().doc("users/" + user.id),
            name: user.data.fullName,
            address: user.data.address
          })
          .then(() => {
            firebaseApp
              .firestore()
              .collection(`elections/${id}/candidates`)
              .doc(c_id)
              .update({
                vote_count: firebase.firestore.FieldValue.increment(1)
              })
              .then(() => {
                console.log("success");
              })
              .catch(err => {
                toast({
                  title: "Action Failed.",
                  description: "Please retry in a second",
                  status: "error",
                  duration: 8000,
                  isClosable: true
                });
              });
          })
          .catch(err => {
            toast({
              title: "Action Failed.",
              description: "Please retry in a second",
              status: "error",
              duration: 8000,
              isClosable: true
            });
          });
      }
    }
  };
  return (
    <Layout>
      <Head>
        <title>Choose Candidates</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-5">
        <div className="flex flex-row items-center justify-center text-2xl mt-3 mb-3 md:mb-6">
          {!eloading ? <div>{elections.data.title}</div> : null}
          <div className="mr-3">Choose Candidates</div>
          {cLoading ? <Spinner /> : null}
        </div>
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-3 md:gap-4 lg:gap-x-4 lg:gap-y-6 lg:grid-cols-4">
          {/* CARD */}
          {!cLoading && !vLoading && !eLoading
            ? candidates.map(({ id, data }) => (
                <div
                  key={id}
                  className="rounded border border-gray-400 overflow-hidden shadow-lg flex flex-col justify-between py-5"
                >
                  <div className="px-6">
                    <div className="flex flex-row justify-center items-center">
                      <img
                        style={{ width: "100px", objectFit: "contain" }}
                        src="/svg/undraw_male_avatar_323b.svg"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center mt-5">
                      <div className="font-bold text-gray-900 text-lg mb-1 text-center">
                        {data.name}
                      </div>
                      <div className="text-lg text-gray-800 mb-1 text-center">
                        {data.address}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center mt-10">
                    {voted || elections.data.finished ? (
                      <button className="bg-indigo-300 hover:bg-indigo-300 text-white tracking-wide py-2 px-10 rounded inline-block cursor-not-allowed">
                        {elections.data.finished
                          ? "Election is Finished"
                          : "You're already vote"}
                      </button>
                    ) : (
                      <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white tracking-wide py-2 px-10 rounded inline-block"
                        c_id={id}
                        onClick={voteCandidate}
                      >
                        Choose
                      </button>
                    )}
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </Layout>
  );
};

export default ProtectUserRoute(vote);
