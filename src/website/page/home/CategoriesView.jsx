import React from 'react'
import POSCategory from '../../components/pos_category/POSCategory'
import { POSColumn } from '../../extension/ExtensionComponents';
import POSText from '../../components/pos_text/POSText';
import { StyleColors } from '../../extension/Extension';
import SectionHeader from '../../components/section_header/SectionHeader';

const CategoriesView = () => {
    const categoriesList = [
        {
            id: 1,
            name: 'Outdoor Lighting',
            imageUrl: '/images/outdoor-lighting.jpg'
        },
        {
            id: 2,
            name: 'Electrical Circuits & Parts',
            imageUrl: '/images/electrical-circuits.jpg'
        },
        {
            id: 3,
            name: 'Storage Bins & Baskets',
            imageUrl: '/images/storage-bins.jpg'
        },
        {
            id: 4,
            name: 'Electrical Batteries',
            imageUrl: '/images/electrical-batteries.jpg'
        },
        {
            id: 5,
            name: 'LED Bulbs',
            imageUrl: '/images/led-bulbs.jpg'
        },
        {
            id: 6,
            name: 'Christmas Ornaments & Decor',
            imageUrl: '/images/christmas-ornaments.jpg'
        },
        {
            id: 7,
            name: 'Tents',
            imageUrl: '/images/tents.jpg'
        },
        {
            id: 8,
            name: 'Monitors',
            imageUrl: '/images/monitors.jpg'
        },

    ];

    return (
        <>
            <SectionHeader text='Shop by Category' />


            <div className=''>
                <div className="row rounded p-0 m-0 py-4" > {
                    categoriesList.map((category, i) => (
                        <POSColumn key={category.id} only={12} sm={6} md={3} lg={2} xl={2} xxl={2} className=''>
                            <div className='center hover:shadow-md transition pointer m-2 rounded p-2' style={{ height: 160, }}>
                                <div className=''>
                                    <div className='center p-2  overflow-hidden' style={{ width: '100%', height: '100px', objectFit: 'contain', margin: 'auto', }}>
                                        <img src={i % 2 == 0 ? 'https://img.lazcdn.com/g/p/f52fe2b7dc7a40444d905db92c3d5312.jpg_170x170q80.jpg_.avif' : 'https://img.lazcdn.com/g/p/4852717e5979584ad725072ba5604a2e.jpg_170x170q80.jpg_.avif'} alt="" className='img-fluid' />
                                    </div>
                                    <div className='text-center p-0 pt-2' style={{ height: 60 }}>
                                        <p className='' style={{ fontSize: '14px' }}>{`${category.name} ${category.id}`}</p>
                                    </div>
                                </div>
                            </div>
                        </POSColumn>
                    ))}
                </div>
            </div>





        </>
    )
}

export default CategoriesView
