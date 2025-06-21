import React from 'react'
import PaymentMethodChart from './PaymentMethodChart'
import { DataGrid, Tr, Thead, Tbody, Th, Td } from '../../../../components/table/DataGrid'
const PaymentMethod = () => {
    const paymentData = [
        {
            "month": "January",
            "paymentMethods": {
                "KHQR": 1200,
                "Credit Card": 800,
                "Cash": 500
            }
        },
        {
            "month": "February",
            "paymentMethods": {
                "KHQR": 1300,
                "Credit Card": 900,
                "Cash": 600
            }
        },
        {
            "month": "May",
            "paymentMethods": {
                "KHQR": 120,
                "Credit Card": 1300,
                "Cash": 137
            }
        },

        // Add more months as needed
    ];
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
                            <Th resizable>No</Th>
                            <Th resizable>Months</Th>
                            <Th resizable>Cash</Th>
                            <Th resizable>Credit</Th>
                            <Th resizable>Kh QR</Th>
                        </Thead>
                        <Tbody>
                            {paymentData.map((e, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{e.month}</td>
                                    <td>{e.paymentMethods.Cash}</td>
                                    <td>{e.paymentMethods['Credit Card']}</td>
                                    <td>{e.paymentMethods.KHQR}</td>

                                </tr>
                            ))}
                        </Tbody>
                    </table>
                </DataGrid>
            </>
        )
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        <div className="fs-4 border-start ps-4 mb-3">Report Chart Customer Use payment method</div>
                        <PaymentMethodChart data={paymentData} />
                    </div>
                    <div className="col-6">
                        <div className="fs-4 border-start ps-4 mb-3">Report Table Customer Use payment method</div>
                        {listTable()}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PaymentMethod
