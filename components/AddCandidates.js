import { useState, useEffect, useMemo } from "react";
import firebaseApp from "../utils/firebaseConfig";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/core";
import { useTable, useSortBy } from "react-table";

export default function AddCandidates(props) {
  const [candidateData, setCandidateData] = useState([]);
  const [cLoading, setCLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.election_id) {
      firebaseApp
        .firestore()
        .collection(`elections/${props.election_id}/candidates`)
        .onSnapshot(items => {
          setCandidateData(
            items.docs.map(item => {
              return item.id;
            })
          );
          setCLoading(false);
        });
    }
  }, [props.election_id]);
  useEffect(() => {
    firebaseApp
      .firestore()
      .collection("users")
      .get()
      .then(items => {
        setUserData(
          items.docs.map(item => {
            if (candidateData.includes(item.id)) {
              return {
                id: item.id,
                data: item.data(),
                selected: 1
              };
            } else {
              return {
                id: item.id,
                data: item.data(),
                selected: 0
              };
            }
          })
        );
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, [candidateData]);

  const add = e => {
    setAddLoading(true);
    firebaseApp
      .firestore()
      .collection(`elections/${props.election_id}/candidates`)
      .doc(e.target.attributes.user_id.value)
      .set({
        address: e.target.attributes.address.value,
        name: e.target.attributes.full_name.value,
        user: firebaseApp
          .firestore()
          .doc("users/" + e.target.attributes.user_id.value),
        vote_count: 0
      })
      .then(() => {
        setAddLoading(false);
      });
  };
  const del = e => {
    firebaseApp
      .firestore()
      .collection(`elections/${props.election_id}/candidates`)
      .doc(e.target.attributes.user_id.value)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
  const data = useMemo(() => {
    return userData.map(({ id, data, selected }) => {
      return {
        fullName: data.fullName,
        address: data.address,
        action:
          selected === 0 ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-2 px-6 rounded"
              user_id={id}
              address={data.address}
              full_name={data.fullName}
              onClick={add}
            >
              Add
            </button>
          ) : (
            <button
              className="bg-red-600 hover:bg-red-700 text-white tracking-wide py-2 px-6 rounded"
              user_id={id}
              onClick={del}
            >
              Cancel
            </button>
          )
      };
    });
  }, [userData]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "fullName",
        sortType: "basic"
      },
      {
        Header: "Address",
        accessor: "address",
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
    <>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-2 px-6 rounded"
        type="button"
        onClick={onOpen}
      >
        Add Candidates
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent className="rounded py-5 px-2">
          <ModalHeader>Add Candidates</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="border-collapse  overflow-x-auto min-w-full"
            >
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-4 py-2 border-b-2 border-gray-400 text-sm text-left leading-4 text-blue-500 tracking-wider"
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
                            className="px-4 py-2 border-b border-gray-300 whitespace-no-wrap"
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
            {/* HALO
            {userData.map(({ id, data, active }) => (
              <div>
                <div>{id}</div>
                <div>{data.fullName}</div>
                <div>{data.address}</div>
                <div>{active}</div>
              </div>
            ))} */}
          </ModalBody>

          {/* <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}
