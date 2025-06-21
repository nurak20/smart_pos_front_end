import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { userObject } from '../../../api/AppConfig';
import { Button } from '@mui/material';
import { IoFastFoodOutline } from "react-icons/io5";

const OrderTable = () => {
    const [orderLine, setOrderLine] = useState([]);
    const [order, setOrder] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const item = JSON.parse(Cookies.get("order") || '[]');
            setOrderLine(item);
        } catch (error) {
            console.error("Error parsing 'order' cookie:", error);
        }
    }, []);

    // useEffect(() => {
    //     try {
    //         const orderTables = JSON.parse(Cookies.get("table-order") || '{}');
    //         console.log(orderTables);
    //         if (orderTables) {
    //             setOrder([orderTables]);
    //         } else {
    //             console.error("table-order is not an array:", orderTables);
    //             setOrder([]);
    //         }
    //     } catch (error) {
    //         console.error("Error parsing 'table-order' cookie:", error);
    //         setOrder([]);
    //     }
    // }, []);
    useEffect(() => {
        try {
            const orderTables = JSON.parse(Cookies.get("table-order") || '[]'); // Default to empty array
            console.log(orderTables);

            // Check if `orderTables` is an array
            if (Array.isArray(orderTables)) {
                const orderInBranch = orderTables.filter(o => o.branch == userObject().branch);
                setOrder(orderInBranch);
            } else {
                console.error("table-order is not an array:", orderTables);
                setOrder([]); // Reset to an empty array
            }
        } catch (error) {
            console.error("Error parsing 'table-order' cookie:", error);
            setOrder([]); // Reset to an empty array on error
        }
    }, []);


    const countOrderLineByTable = (data) => {
        if (data) {
            return data.length;
        } else {
            return "Error"
        }

    };

    return (
        <div className="container-fluid p-2">
            <div className="row">
                {Array.isArray(order) && order.map(o => (
                    <div
                        key={o.id} // Unique key for each table order
                        className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 p-3"
                    >
                        <Button variant='contained' className='w-100' color='success' sx={{ height: '105px' }} onClick={() => navigate(`/order-history/${o.id}`)}>
                            <div className="card-body p-0 center">
                                <div className="f-20 w-100 text-badges-warning">
                                    {o.id}
                                </div>
                                <span className="position-absolute top-0 start-100 translate-middle text-badges-danger text-light rounded-pill bg-danger px-3">
                                    {/* Dynamic count */}

                                    {countOrderLineByTable(o.data)}
                                </span>
                            </div>
                        </Button>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default OrderTable;
