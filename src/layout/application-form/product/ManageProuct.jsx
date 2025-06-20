import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import ProductCreationForm from './ProductCreationForm'
import ProductTable from './ProductTable'
import website from '../../../website/json/website.json';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Translate } from '../../../website/extension/Extension';
import { Button } from '@mui/material';
import { Add, AddIcCall, Close, NewReleases } from '@mui/icons-material';
import { ShimmerTable } from '../../../website/components/animation/Shimmer';
import ShimmerDemo, { ButtonShimmer, FormFieldsShimmer } from '../../../components/animation/Shimmer';
import Shimmer from '../../../components/animation/FormFieldsShimmer';
import PanelSection from '../../../components/panel/PanelForm';
const ManageProuct = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);


    return (
        <PanelSection
            title={website.Label.ManageProducts}
            titleIcon={IoMdAddCircleOutline}
            formComponent={ProductCreationForm}
            tableComponent={ProductTable}
            addButtonText={website.Label.AddProduct}
            isLoading={isLoading}
            onFormSuccess={() => console.log('Product created successfully!')}
        />
    );
}

export default ManageProuct
