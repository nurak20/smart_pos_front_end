import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Fade, Grow, Slide, Snackbar, SnackbarContent } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { StyleColors, Translate } from '../../website/extension/Extension';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonGrid from './ShimmerAnimate';


function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

function GrowTransition(props) {
    return <Grow {...props} />;
}

const PanelSection = ({
    title,
    titleIcon: TitleIcon,
    formComponent: FormComponent,
    tableComponent: TableComponent,
    addButtonText = 'Add New',
    isLoading = false,
    shimmerCount = 5,
    onFormSuccess
}) => {
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefersh] = useState();
    const [state, setState] = React.useState({
        open: false,
        Transition: Fade,
    });
    const handleClick = (Transition) => () => {
        setState({
            open: true,
            Transition,
        });
    };

    const handleClose = () => {
        setState({
            ...state,
            open: false,
        });
    };
    const toggleForm = () => setShowForm(!showForm);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                toggleForm();
            } // This will run after the specified delay
        }, 800); // 1000 ms delay (1 second)

        // Cleanup the timer if the component unmounts before the timeout completes
        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <div className="bg-white rounded-[10px] shadow-md`">
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    {TitleIcon && <TitleIcon size={28} color={StyleColors.appDarkText} />}
                    <h2 className="text-2xl">
                        {Translate(title)}
                    </h2>
                </div>

                <Button
                    variant="outlined"
                    startIcon={showForm ? <Close /> : <Add />}
                    onClick={isLoading ? null : toggleForm}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: showForm ? 'error.main' : StyleColors.componentsColor,
                        color: showForm ? 'error.main' : StyleColors.componentsColor,
                        '&:hover': {
                            borderColor: showForm ? 'error.dark' : StyleColors.buttonLightPink,
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                    }}
                >
                    {showForm ? Translate({ km: 'បោះបង់', en: "Cancel" }) : Translate({ km: 'បង្កើតថ្មី', en: "Add New" })}
                </Button>
            </div>

            {/* Form Section with Animation */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="p-4 border-b">
                            <FormComponent
                                onSuccess={() => {
                                    setShowForm(false);
                                    onFormSuccess?.();
                                    setRefersh((refresh) => refresh + 1);

                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table Section with Loading State */}
            <div className="p-4">
                {isLoading && !showForm ? (
                    <>
                        <div className='d-block'>
                            <SkeletonGrid gap={10} numCols={3} numRows={4} height={60} />
                            <div className='end py-3'>
                                <Skeleton height={50} width={150} />
                            </div>
                            <SkeletonGrid gap={5} numCols={5} numRows={5} height={60} isForm={false} />
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: showForm ? 0.3 : 0,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <TableComponent refresh={refresh} />
                    </motion.div>
                )}
            </div>
            <Snackbar
                open={state.open}
                onClose={handleClose}
                TransitionComponent={state.Transition}
                autoHideDuration={1200}
                key={state.Transition.name}
            >
                <SnackbarContent
                    style={{
                        backgroundColor: "rgb(17, 156, 52)", // or any color you want
                        color: "white"
                    }}
                    message={Translate({ km: "ទិន្នន័យត្រូវបានរក្សាទុកដោយជោគជ័យ!", en: "Data saved successfully!" })}
                />
            </Snackbar>
        </div>
    );
};

export default PanelSection;

