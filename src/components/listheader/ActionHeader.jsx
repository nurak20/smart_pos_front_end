import React from 'react';
import CustomCommoBox from '../select/CustomCommoBox';
import { LiaSearchSolid } from 'react-icons/lia';
import { FaFileExport, FaPlus, FaPrint, FaThList, FaThLarge } from 'react-icons/fa';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import ComboBox from '../select/ComboBox';
import { Box, Button, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CiBoxList, CiGrid41 } from 'react-icons/ci';
import { IoReader } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';

const ActionHeader = ({
    btnAddName,
    title = 'Header Title',
    subtitle = 'Header Subtitle',
    searchTerm,
    searchChange,
    onCreate,
    onPrint,
    onExport,
    perPage,
    selectPerPage,
    currentPage,
    totalPages,
    handleNext,
    handlePrevious,
    setIsTable,
    isTableAction,
    children, // Allow dynamic children
    length
}) => {
    const [alignment, setAlignment] = React.useState('left');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const btn = [

        <ToggleButton value="left" key="left" onClick={isTableAction} className='px-2 fs-5'>
            <CiGrid41 />
        </ToggleButton>,
        <ToggleButton value="center" key="center" onClick={isTableAction} className='px-2 fs-5'>
            <CiBoxList />
        </ToggleButton>,
    ];

    const control = {
        value: alignment,
        onChange: handleChange,
        exclusive: true,
    };
    return (
        <>
            {/* <Box sx={{ width: '100%', height: '100%' }}>

                <Paper elevation={2} sx={{ width: '100%', height: '70px', background: 'rgb(23, 93, 158)' }} className='center'>

                    <h1 className="display-6 text-center w-100 text-light">Product Listing</h1>

                </Paper>

            </Box> */}
            <div className="list-header-container bg-none">
                {/* Left Section */}
                <div className="list-header-left">

                    <Button variant="contained" onClick={onCreate} startIcon={<IoMdAdd />} className='py-2' color='success'>{btnAddName}</Button>
                    <Button
                        variant='outlined'
                        color='success'
                        onClick={onExport}
                        className='py-2'
                    >
                        <FaFileExport className="list-header-icon" />
                        Export
                    </Button>

                </div>
                <div>
                    <div className="list-header-right w-100 pe-2" style={{ maxWidth: '1000px' }}>
                        <div className="w-100 px-3 start w-100 border rounded-pill py-1 bg-white">
                            <label htmlFor="search" className='pointer fs-5'><LiaSearchSolid /></label>
                            <input
                                id='search'
                                type="text"
                                placeholder='Search'
                                className="border-0 w-100 ms-2"
                                value={searchTerm}
                                onChange={searchChange}
                            />
                        </div>
                    </div>

                </div>
                {/* Right Section */}
                <div className="list-header-right">
                    <span className="page-info f-14">
                        {currentPage} - {totalPages} of {length ? length : '14'}
                    </span>
                    <div className="pagination">
                        <Button
                            color='inherit'
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            <SlArrowLeft style={{ fontSize: 14 }} />
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            <SlArrowRight style={{ fontSize: 14 }} />

                        </Button>

                        <div className='start  f-14'>

                            <ComboBox
                                className='m-0 bg-white f-14'
                                inputClassName='center list-header-button text-dark bg-none border-0 p-1 m-0'

                                options={perPage}
                                key='value'
                                labelKeys={['value']}
                                onSelect={selectPerPage}
                                placeholder={'10'}
                            />
                        </div>
                    </div>
                    <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
                        {btn}
                    </ToggleButtonGroup>
                    {/* <button
                        className="center list-header-button text-dark bg-none border center bg-white"
                        onClick={isTableAction}
                    >
                        <FaThList />
                    </button>
                    <button
                        className="center list-header-button text-dark bg-none border bg-white"
                        onClick={isTableAction}
                    >
                        <FaThLarge />
                    </button> */}
                </div>
            </div>
            {/* Dynamic Children */}
            {children && <div className="dynamic-children">{children}</div>}
        </>
    );
};

export default ActionHeader;
