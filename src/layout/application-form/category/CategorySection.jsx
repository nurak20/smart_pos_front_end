import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { IoMdAddCircleOutline } from 'react-icons/io';
import { StyleColors, Translate } from '../../../website/extension/Extension';
import { Button } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import CategoryCreationForm from './CategoryCreationForm';
import CategoriesTable from './CategoriesTable';
import website from '../../../website/json/website.json';
import { FaListAlt } from 'react-icons/fa';
import PanelSection from '../../../components/panel/PanelForm';

const CategorySection = () => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <PanelSection
            title={website.Label.ManageCategories}
            titleIcon={FaListAlt}
            formComponent={CategoryCreationForm}
            tableComponent={CategoriesTable}
            addButtonText={"Added New"}
            isLoading={isLoading}
            shimmerCount={4}
            onFormSuccess={() => console.log('Category created successfully!')}
        />
    );
};

export default CategorySection;