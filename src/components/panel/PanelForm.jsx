import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { StyleColors, Translate } from '../../website/extension/Extension';
import Shimmer from '../animation/FormFieldsShimmer';
import { km } from 'date-fns/locale';

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

    const toggleForm = () => setShowForm(!showForm);

    return (
        <div className="bg-white">
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
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table Section with Loading State */}
            <div className="p-4">
                {isLoading ? (
                    <Shimmer
                        count={shimmerCount}
                        className="h-12 rounded-md"
                    />
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
                        <TableComponent />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PanelSection;