import { useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const CandidatesTable = props => {
  const data = useMemo(() => {
    return props.candidates.map(({ id, data }) => {
      return {
        id: id,
        name: data.name,
        address: data.address,
        count: props.finished?data.vote_count:'Unfinished',
        action: props.finished ? (
          <button className="bg-red-300 text-white tracking-wide py-2 px-6 rounded cursor-not-allowed">
            Delete
          </button>
        ) : (
          <button
            className="bg-red-600 hover:bg-red-700 text-white tracking-wide py-2 px-6 rounded"
            user_id={id}
            onClick={props.del}
          >
            Delete
          </button>
        )
      };
    });
  }, [props.candidates]);
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id", // accessor is the "key" in the data
        sortType: "basic"
      },
      {
        Header: "Name",
        accessor: "name",
        sortType: "basic"
      },
      {
        Header: "Address",
        accessor: "address",
        sortType: "basic"
      },
      {
        Header: "Vote Count",
        accessor: "count",
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
    <div>
      <table
        {...getTableProps()}
        className="border-collapse border overflow-x-auto min-w-full"
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-2 md:py-4 border border-gray-400 text-sm text-left leading-4 text-gray-800 tracking-wider"
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
    </div>
  );
};

export default CandidatesTable;
