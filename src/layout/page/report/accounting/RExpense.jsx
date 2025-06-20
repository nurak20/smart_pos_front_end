import React, { useEffect, useState } from 'react'
import { DataGrid, Tr, Thead, Tbody, Th, Td } from '../../../../components/table/DataGrid'
import { getExpenseReport } from '../../../../api/Reporting';
import ExpenseChart from './ExpenseChart';
const RExpense = () => {

    const [expense, setExpense] = useState([]);
    useEffect(() => {
        const obj = {
            "startDate": "24-11-2024",
            "endDate": "30-11-2024"

        }
        getExpenseReport(obj).then((response) => {
            setExpense(response.data);
        })
    }, [])
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...expense].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setExpense(sortedData);
    };

    function listTable() {
        return (
            <>
                <DataGrid>
                    <table>
                        <Thead>
                            <Th
                                onSort={() => handleSort("id")}
                                sortDirection={sortConfig.key === "id" ? sortConfig.direction : ""}
                                resizable
                                columnWidth={50}
                            >
                                No
                            </Th>
                            <Th
                                onSort={() => handleSort("datejournal")}
                                sortDirection={
                                    sortConfig.key === "datejournal" ? sortConfig.direction : ""
                                }
                                resizable
                            >
                                Datejournal
                            </Th>
                            <Th
                                onSort={() => handleSort("totalExpense")}
                                sortDirection={
                                    sortConfig.key === "totalExpense" ? sortConfig.direction : ""
                                }
                                resizable
                            >
                                TotalExpense
                            </Th>
                            <Th
                                onSort={() => handleSort("reference")}
                                sortDirection={
                                    sortConfig.key === "reference" ? sortConfig.direction : ""
                                }

                                resizable
                            >
                                ProductName
                            </Th>
                        </Thead>
                        <Tbody>
                            {expense.map((e, i) => (
                                <tr key={i} className='f-10 p-0'>
                                    <td>{i + 1}</td>
                                    <td>{e.datejournal}</td>
                                    <td>{e.totalExpense}</td>
                                    <td>{e.reference}</td>

                                </tr>
                            ))}
                        </Tbody>
                    </table>
                </DataGrid>
            </>
        )
    }
    return (
        <>
            <ExpenseChart data={expense} />
            {listTable()}
        </>
    )
}

export default RExpense
