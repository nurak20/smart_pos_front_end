import { HiOutlineHome, HiOutlineCube, HiOutlineTag, HiOutlineViewList } from "react-icons/hi";
import { POSRoute } from "../routes/Routes";

export const navbarItems = [
    {
        type: "link",
        href: POSRoute.home,
        icon: HiOutlineHome, // Home icon (Outline)
        text: {
            en: "Home",
            km: "ទំព័រដើម",
            ch: "主页",
            th: "หน้าหลัก",
        }
    },
    {
        type: "link",
        href: POSRoute.allProducts,
        icon: HiOutlineCube, // Open box icon (Outline)
        text: {
            en: "All Products",
            km: "ផលិតផលទាំងអស់",
            ch: "所有产品",
            th: "สินค้าทั้งหมด",
        }
    },
    {
        type: "link",
        href: "/promotion",
        icon: HiOutlineTag, // Tag icon (Outline)
        text: {
            en: "Promotion",
            km: "ការផ្សព្វផ្សាយ",
            ch: "促销",
            th: "โปรโมชั่น",
        }
    },
    {
        type: "dropdown", // Dropdown link
        text: {
            en: "Category",
            km: "ប្រភេទ",
            ch: "类别",
            th: "หมวดหมู่",
        }, // Display text
        icon: HiOutlineViewList, // Icon name (from react-icons/fa)
        items: [
            {
                text: {
                    en: "Fast Food",
                    km: "អាហារជាន់លឿន",
                    ch: "快餐",
                    th: "ฟาสต์ฟู้ด",
                },
                code: "fast-food",
            },
            {
                text: {
                    en: "Drinks",
                    km: "ភេសជ្ជៈ",
                    ch: "饮料",
                    th: "เครื่องดื่ม",
                },
                code: "drinks",
            },
            {
                text: {
                    en: "Desserts",
                    km: "បង្អែម",
                    ch: "甜点",
                    th: "ของหวาน",
                },
                code: "desserts",
            },
            {
                text: {
                    en: "Snacks",
                    km: "អាហារសម្រន់",
                    ch: "零食",
                    th: "ขนมขบเคี้ยว",
                },
                code: "snacks",
            },
            {
                text: {
                    en: "Special Offers",
                    km: "ការផ្តល់ជូនពិសេស",
                    ch: "特价优惠",
                    th: "ข้อเสนอพิเศษ",
                },
                code: "special-offers",
            }]
    },
];


export const slideItem = [
    {
        "image": "https://zandokh.com/image/catalog/banner/2024/v-day/ten11-V-Day.png",
        "title": "Foodpanda",
    },
    {
        "image": "https://zandokh.com/image/catalog/banner/2024/1st-purchase-ten11-App-Baner.jpg",
        "title": "Foodpanda",
    },
    {
        "image": "https://tkaccessoriescambo.com/_next/image?url=https%3A%2F%2Fapi.krubkrong.com%2Fcdn%2Fimage%2Ffc434d13-58a3-4a82-95e2-7de6e38530c8.webp&w=1920&q=100",
        "title": "Foodpanda",
    },
]

