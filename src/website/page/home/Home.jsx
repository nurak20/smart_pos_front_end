import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POSColumn } from '../../extension/ExtensionComponents';
import POSSilder from '../../components/Slide/Silder';
import POSText from '../../components/pos_text/POSText';
import POSProductCard from '../../components/pos_card/POSProductCard';
import CategoriesView from './CategoriesView';
import { getAllProductV1 } from '../../service/ProductService';
import './home.css';
import POSCarousel from '../../components/carousel/POSCarousel';
import { StyleColors, Translate } from '../../extension/Extension';
import SectionHeader from '../../components/section_header/SectionHeader';
import { km } from 'date-fns/locale';
import PromoGrid from '../../components/img_card/ImageCard';
import { POS_GET } from '../../service/ApiService';

const sliderItems = [
    {
        image:
            'https://img.lazcdn.com/us/domino/792be80e-429e-459e-afc2-410cdffe96ac_TH-1976-688.jpg_2200x2200q80.jpg_.avif',
        alt: 'Slide 1',
    },
    {
        image:
            'https://img.lazcdn.com/us/domino/fdb8d5dd-c039-4a5c-a7cb-6ad491904677_TH-1976-688.jpg_2200x2200q80.jpg_.avif',
        alt: 'Slide 2',
    },
];

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sections, setSections] = useState([]);
    const navigate = useNavigate();

    // First useEffect for fetching products
    useEffect(() => {
        (async () => {
            try {
                const data = await getAllProductV1();
                setProducts(data.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Second useEffect for fetching sections
    useEffect(() => {
        async function fetchSections() {
            try {
                const res = await POS_GET('v1/list-titles/products');
                console.log(res);

                setSections(res.data.item);
            } catch (err) {
                setError('Unable to load product sections');
            } finally {
                setLoading(false);
            }
        }
        fetchSections();
    }, []);

    if (loading) {
        return <div className="text-center py-5">Loading products…</div>;
    }

    // if (error) {
    //     return (
    //         <div className="alert alert-danger text-center py-5">
    //             {error}
    //         </div>
    //     );
    // }

    const items = [
        {
            src: 'https://cdn.pixabay.com/photo/2022/05/28/21/44/carpathians-7228042_1280.jpg',
            alt: 'First slide',
            caption: 'First Slide Label',
            description: 'This is the description for the first slide.',
        },
        {
            src: 'https://cdn.pixabay.com/photo/2014/10/15/15/14/man-489744_1280.jpg',
            alt: 'Second slide',
            caption: 'Second Slide Label',
            description: 'This is the description for the second slide.',
        },
        {
            src: 'https://cdn.pixabay.com/photo/2022/04/08/21/04/buildings-7120297_1280.jpg',
            alt: 'Third slide',
            caption: 'Third Slide Label',
            description: 'This is the description for the third slide.',
        },
    ];

    const promoItems = [
        {
            image: 'https://i.pinimg.com/736x/c5/16/1f/c5161fe4625ee10730821a13c74e2193.jpg',
            label: 'cleaned up the CSS, ensured proper comment closures, and maintained the hover-zoom effect plus responsive grid behavior. Let me know if you need ',
            title: 'Revitalizing Vitamin C Serum',
            subtitle: 'Brighten Dull Skin & Fade Dark Spots',
            underline: true,
            align: 'top-start',
            maxWidth: '100%',
            maxHeight: 'auto',
        },
        {
            image: 'https://i.pinimg.com/736x/2c/19/da/2c19daf366aa054e6f1a4ea77605acf5.jpg',
            label: 'cleaned up the CSS, ensured proper comment closures, and maintained the hover-zoom effect plus responsive grid behavior. Let me know if you need ',
            title: 'Ultra-Moisture Hyaluronic Cream',
            subtitle: 'Lock in Moisture for 24-Hour Softness',
            underline: false,
            align: 'top-start',
            maxWidth: '100%',
            maxHeight: 'auto',
        },
        {
            image: 'https://i.pinimg.com/736x/cf/2a/51/cf2a51c7981aa460686a48611564b2cc.jpg',
            label: 'Firm & Lift',
            title: 'Collagen Power Night Mask',
            subtitle: 'Renew & Tighten While You Sleep',
            underline: true,
            align: 'bottom-end',
            maxWidth: '100%',
            maxHeight: 'auto',
        },
        {
            image: 'https://i.pinimg.com/736x/d7/70/4e/d7704e96bb78aed8a00086e936e1f478.jpg',
            label: 'SPF 50+',
            title: 'Mineral Sunscreen Lotion',
            subtitle: 'Broad-Spectrum Protection, Non-Greasy',
            underline: false,
            align: 'bottom-start',
            maxWidth: '100%',
            maxHeight: 'auto',
        },
    ];

    return (
        <div className="py-3">
            {/* <POSSilder items={sliderItems} animation="bounce" height='500' /> */}
            <POSCarousel items={items} id="pos-slider" interval={5000} maxSlideHeight="500px" />

            <CategoriesView />


            <div className="py-3">
                {sections != null ? sections.map((section) => (
                    <div key={section.id} className="mb-5">
                        <SectionHeader text={section.title} />

                        <div className="row">
                            {section.product.items.map((listing) => {
                                const { product } = listing;
                                return (
                                    <div
                                        className="col-6 col-sm-6 col-md-3 col-lg-3"
                                        key={listing.productListingId}
                                    >
                                        <POSProductCard
                                            product={product}
                                            onClick={() =>
                                                navigate(
                                                    `/product-details?code=${product.product_id}&group=${product.group_code}`
                                                )
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )) : null}

            </div>
        </div>
    );
}