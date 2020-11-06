import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectRoute } from "../../../context/auth";
import { useTable, useSortBy } from "react-table";
import Link from "next/link";
import { Skeleton, useToast } from "@chakra-ui/core";

import { useRouter } from "next/router";
import firebaseApp from "../../../utils/firebaseConfig";
import Head from "next/head";

function Admin(props) {
  const router = useRouter();
  const toast = useToast();
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseApp
      .firestore()
      .collection("elections")
      // .get()
      .onSnapshot(elections => {
        setElections(
          elections.docs.map(item => {
            return {
              id: item.id,
              election: item.data()
            };
          })
        );
        setIsLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const setActiveElection = e => {
    // console.log(e.target.attributes.e_id.value)
    let a;
    if (e.target.attributes.activate.value == 1) {
      a = 1;
    } else {
      a = 0;
    }
    firebaseApp
      .firestore()
      .collection("elections")
      .doc(e.target.attributes.e_id.value)
      .update({
        active: a
      })
      .then(() => {
        toast({
          title: "Update succeded.",
          description: "Election updated",
          status: "success",
          duration: 8000,
          isClosable: true
        });
      })
      .catch(err => {
        toast({
          title: "Update failed.",
          description: "Please try again",
          status: "error",
          duration: 8000,
          isClosable: true
        });
      });
  };
  const delElection = e => {
    e.preventDefault();
    firebaseApp
      .firestore()
      .collection("elections")
      .doc(e.target.attributes.e_id.value)
      .delete()
      .then(()=>{
        toast({
          title: "Action succeded.",
          description: "Election Deleted",
          status: "error",
          duration: 8000,
          isClosable: true
        });
      })
      .catch(err=>{
        toast({
          title: "Action failed.",
          description: "Please try again",
          status: "error",
          duration: 8000,
          isClosable: true
        });
      })
  };

  const data = useMemo(() => {
    return elections.map(({ id, election }) => {
      return {
        id: id,
        title: election.title,
        year: election.year,
        action: (
          <div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-2 px-6 rounded inline-block"
              onClick={() => router.push(`/admin/election/${id}`)}
            >
              View
            </button>
            <div className="ml-3 mr-3 inline-block">
              {election.active == 1 ? (
                <button
                  className="bg-yellow-600 hover:bg-yellow-800 text-white tracking-wide py-2 px-6 rounded inline-block"
                  type="button"
                  e_id={id}
                  activate="0"
                  onClick={setActiveElection}
                >
                  Deactivate
                </button>
              ) : (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white tracking-wide py-2 px-6 rounded inline-block"
                  type="button"
                  e_id={id}
                  activate="1"
                  onClick={setActiveElection}
                >
                  Activate
                </button>
              )}
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white tracking-wide py-2 px-6 rounded inline-block"
              e_id={id}
              onClick={delElection}
            >
              Delete
            </button>
          </div>
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

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <div className="px-3 md:px-0 text-2xl text-gray-800 md:text-3xl font-bold ">
          Election
        </div>
        <div className="px-3 md:px-0 text-gray-700 text-lg mb-3">
          Elections page contains all of the election data that you can manage,
          view, or edit
        </div>
        {/* CARD */}
        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-4 md:shadow-lg ">
          <div className="font-bold text-gray-800 text-lg ">Election Data</div>
          <div className="text-gray-700 text-lg mb-3">
            These data below is the entire election data stored in the database
          </div>
          <Link href="/admin/election/create">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-2 px-6 rounded mb-2"
              type="button"
            >
              Add Election
            </button>
          </Link>
          {isLoading ? (
            <div>
              <Skeleton height="20px" my="10px" />
              <Skeleton height="20px" my="10px" />
              <Skeleton height="20px" my="10px" />
            </div>
          ) : (
            <table
              {...getTableProps()}
              className="border-collapse border overflow-x-auto min-w-full"
            >
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-6 py-4 border border-gray-400 text-sm text-left leading-4 text-gray-800 tracking-wider"
                      >
                        <div>
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-100">
                      {row.cells.map(cell => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-2 border border-gray-400 whitespace-no-wrap"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
