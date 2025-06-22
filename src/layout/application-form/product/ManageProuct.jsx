import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import ProductCreationForm from './ProductCreationForm'
import ProductTable from './ProductTable'
import website from '../../../website/json/website.json';
import { IoMdAddCircleOutline } from 'react-icons/io';
import PanelSection from '../../../components/panel/PanelForm';
import { Translate } from '../../../website/extension/Extension';
const ManageProuct = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);


    return (
        <PanelSection
            title={{ km: "គ្រប់គ្រងផលិតផល", en: "Manage Product" }}
            titleIcon={IoMdAddCircleOutline}
            formComponent={ProductCreationForm}
            tableComponent={ProductTable}
            addButtonText={website.Label.AddProduct}
            isLoading={isLoading}

        />
    );
}

export default ManageProuct
