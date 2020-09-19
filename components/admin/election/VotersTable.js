import { useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const VotersTable = props => {
  const data = useMemo(() => {
    return props.voters.map(({ id, data }) => {
      return {
        id: id,
        name: data.name,
        address: data.address,
      };
    });
  }, [props.voters]);
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

export default VotersTable;
