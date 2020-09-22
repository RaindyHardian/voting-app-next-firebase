import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ProtectRoute } from "../../../context/auth";
import firebaseApp from "../../../utils/firebaseConfig";
import AddCandidates from "../../../components/AddCandidates";
import AdminLayout from "../../../components/AdminLayout";
import CandidatesTable from "../../../components/admin/election/CandidatesTable";
import VotersTable from "../../../components/admin/election/VotersTable";
import { Skeleton, useToast } from "@chakra-ui/core";
import EditElection from "../../../components/admin/election/EditElection";
import { format } from "date-fns";
// const fetcher = async (...args) => {
//   const res = await fetch(...args);
//   return res.json();
// };
function Election() {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const [election, setElection] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [eLoading, setELoading] = useState(true);
  const [cLoading, setCLoading] = useState(true);
  const [vLoading, setVLoading] = useState(true);

  // const { data } = useSWR(`/api/election/${id}`, fetcher);
  // if (!data) {
  //   console.log("LOADING")
  // } else {
  //   console.log(data)
  // }
  useEffect(() => {
    console.log(id);
    if (id) {
      // election data
      firebaseApp
        .firestore()
        .collection(`elections`)
        .doc(id)
        .onSnapshot(item => {
          setElection(item.data());
          setELoading(false);
        });
      // candidates
      firebaseApp
        .firestore()
        .collection(`elections/${id}/candidates`)
        .onSnapshot(items => {
          setCandidates(
            items.docs.map(item => {
              return {
                id: item.id,
                data: item.data()
              };
            })
          );
          setCLoading(false);
        });
      // Voters
      firebaseApp
        .firestore()
        .collection(`elections/${id}/voter`)
        // .get()
        .onSnapshot(async items => {
          setVoters(
            await Promise.all(
              items.docs.map(async item => {
                const user = await item.data().user.get();
                return {
                  id: item.id,
                  data: item.data(),
                  user: user.data()
                };
              })
            )
          );
          setVLoading(false);
        });
    }
  }, [id]);

  const del = e => {
    // alert(election.id)
    firebaseApp
      .firestore()
      .collection(`elections/${id}/candidates`)
      .doc(e.target.attributes.user_id.value)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };

  const finishElection = e => {
    firebaseApp
      .firestore()
      .collection("elections")
      .doc(id)
      .update({
        finished: true
      })
      .then(() => {
        toast({
          title: "Action succeded.",
          description: "The election is finished",
          status: "success",
          duration: 8000,
          isClosable: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="overflow-x-auto mb-6 ">
          {/* NAV BUTTON CONTAINER */}
          <div className="flex flex-row justify-between mb-3 px-3 md:px-0">
            {/* BACK BUTTON */}
            <div className="w-8 md:w-10 text-gray-700 hover:text-gray-900 inline-block">
              <Link href="/admin/election">
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
            {/* EDIT BUTTON */}
            {!eLoading ? <EditElection e_id={id} election={election} /> : null}
          </div>
          {eLoading ? (
            <div>
              <Skeleton height="20px" my="10px" />
              <Skeleton height="20px" my="10px" />
            </div>
          ) : (
            <div className="px-3 md:px-0">
              <div className="text-2xl text-gray-800 md:text-3xl font-bold ">
                {election.title}
              </div>
              <div className="text-gray-800">{election.description}</div>
              <div className="text-gray-800">
                <span className="font-bold">Start </span>
                {format(election.start.toDate(), "eeee, dd MMMM yyyy HH:mm:ss")}
              </div>
              <div className="text-gray-800">
                <span className="font-bold">End </span>
                {format(election.end.toDate(), "eeee, dd MMMM yyyy HH:mm:ss")}
              </div>
              <div className="mt-2">
                <span className="font-bold text-gray-800 mr-2">Status</span>
                {election.active == 1 ? (
                  <div className="inline-block text-white bg-green-600 rounded py-1 px-3">
                    Active
                  </div>
                ) : (
                  <div className="inline-block text-white bg-yellow-500 rounded py-1 px-3">
                    Non Active
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className="font-bold text-gray-800 mr-2">Action</span>
                {election.finished ? (
                  <div className="inline-block text-white bg-green-600 rounded py-1 px-3">
                    Election finished
                  </div>
                ) : (
                  <button
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 rounded text-white tracking-wide py-2 px-6 "
                    onClick={finishElection}
                  >
                    Finish this election
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-6 md:shadow-lg">
          <div className="font-bold text-gray-800 text-lg mb-4">
            Candidates Data
          </div>
          {cLoading && eLoading ? (
            <div>
              <Skeleton height="10px" my="10px" />
              <Skeleton height="10px" my="10px" />
              <Skeleton height="10px" my="10px" />
            </div>
          ) : (
            <div>
              <div className="mb-2">
                {election.finished ? null : (
                  <AddCandidates election_id={id} candidates={candidates} />
                )}
              </div>
              <CandidatesTable
                finished={election.finished}
                del={del}
                candidates={candidates}
              />
            </div>
          )}
        </div>
        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-4 md:shadow-lg">
          <div className="font-bold text-gray-800 text-lg mb-4">
            Voters Data
          </div>
          {vLoading ? (
            <div>
              <Skeleton height="10px" my="10px" />
              <Skeleton height="10px" my="10px" />
              <Skeleton height="10px" my="10px" />
            </div>
          ) : (
            <VotersTable voters={voters} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
export default ProtectRoute(Election);
