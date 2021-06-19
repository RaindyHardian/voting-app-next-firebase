import firebaseAppp from "../../../utils/firebaseConfig";
import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectRoute } from "../../../context/auth";
import { useTable, useSortBy } from "react-table";
import Link from "next/link";
import { Skeleton } from "@chakra-ui/core";
import Head from "next/head";

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const data = useMemo(() => {
    return users.map(({ id, data }) => {
      return {
        id: id,
        fullName: data.fullName,
        email: data.email,
        address: data.address,
        action: (
          <div>
            <Link href={`/admin/users/edit/${id}`}>
              <button className="inline-block bg-teal-500 hover:bg-teal-700 text-white tracking-wide py-2 px-6 rounded mr-2">
                Edit
              </button>
            </Link>
          </div>
        ),
      };
    });
  }, [users]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "fullName",
        sortType: "basic",
      },
      {
        Header: "Email",
        accessor: "email",
        sortType: "basic",
      },
      {
        Header: "Address",
        accessor: "address",
        sortType: "basic",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const fetch = async () => {
      try {
        const elections = await firebaseAppp
          .firestore()
          .collection("users")
          .get();
        setUsers(
          elections.docs.map((item) => {
            return {
              id: item.id,
              data: item.data(),
            };
          })
        );
        setIsLoading(false);
        setError(false);
      } catch (err) {
        setIsLoading(false);
        setError(true);
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
        <div className="px-3 md:px-0 text-2xl text-gray-800 md:text-3xl font-bold ">
          Users
        </div>
        <div className="px-3 md:px-0 text-gray-700 text-lg mb-3">
          Users page contains all of the user data that you can manage, view, or
          edit
        </div>

        {/* CARD */}
        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-4 md:shadow-lg ">
          <div className="font-bold text-gray-800 text-lg ">User Data</div>
          <div className="text-gray-700 text-lg mb-3">
            These data below is the entire user data stored in the database
          </div>
          <Link href="/auth/register">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-2 px-6 rounded mb-2"
              type="button"
            >
              Add User
            </button>
          </Link>
          {isLoading ? (
            <div>
              <Skeleton height="20px" my="10px" />
              <Skeleton height="20px" my="10px" />
              <Skeleton height="20px" my="10px" />
            </div>
          ) : error ? (
            <div>There's an error, please refresh the page</div>
          ) : (
            <table
              {...getTableProps()}
              className="border-collapse border overflow-x-auto min-w-full"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
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
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-100">
                      {row.cells.map((cell) => {
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
export default ProtectRoute(Users);
