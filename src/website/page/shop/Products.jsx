import React, { useState } from 'react'
import { useEffect } from 'react'
import { POS_GET } from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/pos_card/POSProductCard';
const Products = () => {

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProduct = async () => {
            const res = await POS_GET('v1/products');
            console.log(res.data);
            setProduct(res.data);
            setLoading(false);
        }

        fetchProduct();

    }, [])
    const navigate = useNavigate();
    if (!product) {
        return "Loading.."
    }

    if (loading) {
        return "Loading..."
    }


    return (
        <>

            <div className="container">
                <div className="row">
                    {
                        product.map(p =>

                            <div className="col-sm-6 col-md-3 col-6">
                                <ProductCard product={p} onClick={() =>
                                    navigate(
                                        `/product-details?code=${p.product_id}&group=${p.group_code}`
                                    )
                                } />
                            </div>
                        )
                    }
                </div>

            </div>

        </>
    )
}

export default Products
