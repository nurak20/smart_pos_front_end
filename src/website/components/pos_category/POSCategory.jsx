

export default function POSCategory({ category }) {
    console.log(category);
    return (
        <div className="flex flex-col items-center justify-center p-2 border rounded hover:shadow-md transition">
            <img
                src={category.imageUrl}
                alt={category.name}
                className="w-20 h-20 object-contain"
            />
            <p className="text-center mt-2 text-sm font-medium">
                {category.name}
            </p>
        </div>
    );
}

// src/data.js
export
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
        {
            id: 9,
            name: 'T-Shirts & Tanks',
            imageUrl: '/images/tshirts.jpg'
        },
        {
            id: 10,
            name: 'Water Systems & Garden Hoses',
            imageUrl: '/images/garden-hoses.jpg'
        },
        {
            id: 11,
            name: 'SIM Tools',
            imageUrl: '/images/sim-tools.jpg'
        },
        {
            id: 12,
            name: 'Portable Chairs',
            imageUrl: '/images/portable-chairs.jpg'
        },
        {
            id: 13,
            name: "Men's Sneakers",
            imageUrl: '/images/mens-sneakers.jpg'
        },
        {
            id: 14,
            name: 'In-Ear Headphones',
            imageUrl: '/images/ear-headphones.jpg'
        },
        {
            id: 15,
            name: 'Auto Bulbs, LEDs & HIDs',
            imageUrl: '/images/auto-bulbs.jpg'
        },
        {
            id: 16,
            name: 'Fairy Lights',
            imageUrl: '/images/fairy-lights.jpg'
        }
    ];
