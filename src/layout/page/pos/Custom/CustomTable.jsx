import React, { useState } from 'react';
import './TablePositioning.css'; // Import CSS for styling

const CustomTable = () => {
    const [tables, setTables] = useState([
        { id: 1, name: "Table 1", x: 50, y: 50 },
        { id: 2, name: "Table 2", x: 200, y: 50 },
        { id: 3, name: "Table 3", x: 50, y: 200 },
        { id: 4, name: "Table 4", x: 200, y: 200 },
    ]);

    const [selectedTable, setSelectedTable] = useState({
        x: '',
        y: ''
    }); // Track the table being moved
    const [selectTableId, setSelectTableId] = useState()
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    // Handle drag start
    const handleMouseDown = (e, tableId) => {
        const table = tables.find(table => table.id === tableId);
        setSelectedTable(table); // Set the table to be moved
        setMouseOffset({
            x: e.clientX - table.x,
            y: e.clientY - table.y,
        });
        setSelectTableId(tableId)

    };

    // Handle mouse move to drag table
    const handleMouseMove = (e) => {
        if (!selectedTable) return;
        setSelectedTable((prevData) => ({
            ...prevData,
            ["x"]: e.clientX - mouseOffset.x,
            ["y"]: e.clientY - mouseOffset.y,

        }));
        const newX = e.clientX - mouseOffset.x;
        const newY = e.clientY - mouseOffset.y;

        // Update table position in state
        setTables(prevTables =>
            prevTables.map(table =>
                table.id === selectedTable.id
                    ? { ...table, x: newX, y: newY }
                    : table
            )
        );
    };
    const selectTable = (e) => {
        if (!selectedTable) return;
        setSelectedTable((prevData) => ({
            ...prevData,
            ["x"]: e.clientX - mouseOffset.x,
            ["y"]: e.clientY - mouseOffset.y,

        }));
        const newX = e.clientX - mouseOffset.x;
        const newY = e.clientY - mouseOffset.y;

        // Update table position in state
        setTables(prevTables =>
            prevTables.map(table =>
                table.id === selectedTable.id
                    ? { ...table, x: newX, y: newY }
                    : table
            )
        );
    };

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setSelectedTable({
            x: '',
            y: ''
        }); // Clear the selected table when mouse is released
    };

    // Update form input fields when table is moved
    const handlePositionChange = (e) => {
        // if (!selectedTable) return;

        const { name, value } = e.target;
        setSelectedTable(prevTable => ({
            ...prevTable,
            [name]: parseInt(value, 10), // Update x or y position
        }));
    };

    // Submit the form to update table position
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectTableId) {
            setTables(prevTables =>
                prevTables.map(table =>
                    table.id === selectTableId
                        ? { ...table, x: selectedTable.x, y: selectedTable.y }
                        : table
                )
            );
        }

        // setSelectedTable(null); // Reset the selected table
    };

    return (
        <div className="fixed-top bg-dark h-100 w-100">
            {/* Tables Grid */}
            <div

            >
                {tables.map(table => (
                    <>
                        <div
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onClick={selectTable}
                            key={table.id}
                            className="table-custom "
                            style={{ left: `${table.x}px`, top: `${table.y}px` }}
                            onMouseDown={(e) => handleMouseDown(e, table.id)}
                        >
                            {/* {table.name} */}
                        </div>

                    </>
                ))}
            </div>

            {/* Position Update Form */}
            {/* {selectedTable && (
                
            )} */}
            <form onSubmit={handleSubmit} className="position-form">
                <h3>Edit  Position</h3>
                <div>
                    <label>X Position:</label>
                    <input
                        type="number"
                        name="x"
                        value={selectedTable.x}
                        onChange={handlePositionChange}
                    />
                </div>
                <div>
                    <label>Y Position:</label>
                    <input
                        type="number"
                        name="y"
                        value={selectedTable.y}
                        onChange={handlePositionChange}
                    />
                </div>
                <button type="submit">Update Position</button>
            </form>
        </div>
    );
};

export default CustomTable;
