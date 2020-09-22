import firebaseAppp from "../../utils/firebaseConfig";
import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import { ProtectRoute } from "../../context/auth";
import { useTable, useSortBy } from "react-table";
import Link from "next/link";
import Head from "next/head";

function Admin(props) {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const data = useMemo(() => {
    return elections.map(({ id, election }) => {
      return {
        id: id,
        title: election.title,
        year: election.year,
        action: (
          <Link href={`/admin/election/${id}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View
            </button>
          </Link>
        )
      };
    });
  }, [elections]);
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id", // accessor is the "key" in the data
        sortType: "basic"
      },
      {
        Header: "Title",
        accessor: "title",
        sortType: "basic"
      },
      {
        Header: "Year",
        accessor: "year",
        sortType: "basic"
      },
      {
        Header: "Action",
        accessor: "action"
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const fetch = async () => {
      try {
        const elections = await firebaseAppp
          .firestore()
          .collection("elections")
          .get();
        console.log("ELECTIONS");
        setElections(
          elections.docs.map(item => {
            return {
              id: item.id,
              election: item.data()
            };
          })
        );
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetch();
  }, []);
  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <div className="px-3 md:px-0 text-2xl text-gray-800 md:text-3xl font-bold mb-3">
          Dashboard
        </div>
        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-4 md:shadow-lg ">
          <div className="font-bold text-gray-800 text-xl mb-2">
            Welcome to your dashboard!
          </div>
          <div className="text-gray-700 text-lg">
            This dashboard is used to manage and control the entire application. You can check all of the page using the navigation bar. This page contains general information about the application. Elections page contains all of the election data that you can manage, view, or edit. Users page contains all of the user data that registered to this app.   
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
export default ProtectRoute(Admin);

// export async function getStaticProps() {
//   const elections = await firebaseAppp
//     .firestore()
//     .collection("elections")
//     .get();
//   const data = elections.docs.map(item => {
//     return {
//       id: item.id,
//       election: item.data()
//     };
//   });
//   return {
//     props: {
//       elections: data
//     }
//   };
// }
