import { useEffect, useState } from 'react';
import './postest.css'
import PrinInvoice from './PrintInvoice';
import Cookies from 'js-cookie';
import { decryptData } from '../../../cryptoJs/Crypto';
const PosDark = () => {
    const items = [
        {
            id: 1,
            name: 'Cheeseburger',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Juicy beef patty with cheddar cheese, lettuce, and tomato.',
            image: 'https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png'
        },
        {
            id: 2,
            name: 'Double Bacon Burger',
            defaultPrice: 5.99,
            sellPrice: 7.99,
            description: 'Double beef patty with crispy bacon, cheddar cheese, and barbecue sauce.',
            image: 'https://png.pngtree.com/png-clipart/20230914/ourmid/pngtree-sausage-cheese-pizza-slice-three-dimensional-3d-gourmet-food-fast-food-png-image_10116852.png'
        },
        {
            id: 3,
            name: 'Veggie Burger',
            defaultPrice: 3.99,
            sellPrice: 5.99,
            description: 'A delicious veggie patty with lettuce, tomato, and vegan mayo.',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/025/064/792/small_2x/fast-food-meal-with-ai-generated-free-png.png'
        },
        {
            id: 4,
            name: 'Chicken Sandwich',
            defaultPrice: 4.49,
            sellPrice: 6.49,
            description: 'Crispy fried chicken with lettuce, tomato, and mayonnaise.',
            image: 'https://static.vecteezy.com/system/resources/previews/021/952/556/non_2x/free-southern-fried-chicken-fried-chicken-transparent-background-free-png.png'
        },
        {
            id: 5,
            name: 'BBQ Pulled Pork Sandwich',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Tender pulled pork with barbecue sauce and coleslaw on a brioche bun.',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/024/108/039/small/crispy-fried-chicken-leg-pieces-on-plate-with-transparent-background-png.png'
        },
        {
            id: 6,
            name: 'Grilled Chicken Burger',
            defaultPrice: 5.49,
            sellPrice: 7.49,
            description: 'Grilled chicken breast with lettuce, tomato, and avocado spread.',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/021/952/442/small/southern-fried-chicken-fried-chicken-transparent-background-png.png'
        },
        {
            id: 7,
            name: 'Fish Sandwich',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Fried fish fillet with tartar sauce and lettuce on a soft bun.',
            image: 'https://img.freepik.com/free-photo/fried-fish-sandwich-with-tartar-sauce_144627-30251.jpg'
        },
        {
            id: 8,
            name: 'Spicy Chicken Sandwich',
            defaultPrice: 5.49,
            sellPrice: 7.49,
            description: 'Crispy fried chicken with spicy mayo, jalapenos, and lettuce.',
            image: 'https://img.freepik.com/free-photo/spicy-chicken-burger_144627-29903.jpg'
        },
        {
            id: 9,
            name: 'Classic Burger',
            defaultPrice: 4.49,
            sellPrice: 6.49,
            description: 'Classic beef patty with ketchup, mustard, pickles, and onions.',
            image: 'https://img.freepik.com/free-photo/classic-burger-side-view_144627-29802.jpg'
        },
        {
            id: 10,
            name: 'Mushroom Swiss Burger',
            defaultPrice: 5.99,
            sellPrice: 7.99,
            description: 'Beef patty topped with sauteed mushrooms and Swiss cheese.',
            image: 'https://img.freepik.com/free-photo/mushroom-swiss-burger-with-sauce_123827-12242.jpg'
        },
        {
            id: 11,
            name: 'Bacon Cheeseburger',
            defaultPrice: 5.49,
            sellPrice: 7.49,
            description: 'Beef patty with crispy bacon, cheddar cheese, and grilled onions.',
            image: 'https://img.freepik.com/free-photo/bacon-cheeseburger_123827-13130.jpg'
        },
        {
            id: 12,
            name: 'Crispy Chicken Wrap',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Crispy chicken tenders, lettuce, tomato, and ranch dressing in a wrap.',
            image: 'https://img.freepik.com/free-photo/chicken-wrap-sandwich-with-lettuce-tomato-ranch_144627-30256.jpg'
        },
        {
            id: 13,
            name: 'Philly Cheesesteak Sandwich',
            defaultPrice: 6.49,
            sellPrice: 8.49,
            description: 'Thinly sliced beef with melted cheese and grilled peppers on a hoagie roll.',
            image: 'https://img.freepik.com/free-photo/philly-cheesesteak-sandwich_144627-29906.jpg'
        },
        {
            id: 14,
            name: 'Turkey Burger',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Grilled turkey patty with lettuce, tomato, and cranberry mayo.',
            image: 'https://img.freepik.com/free-photo/turkey-burger-lettuce-tomato_144627-29849.jpg'
        },
        {
            id: 15,
            name: 'Buffalo Chicken Sandwich',
            defaultPrice: 5.49,
            sellPrice: 7.49,
            description: 'Crispy fried chicken with buffalo sauce, ranch, and lettuce.',
            image: 'https://img.freepik.com/free-photo/buffalo-chicken-sandwich_144627-29848.jpg'
        },
        {
            id: 16,
            name: 'French Dip Sandwich',
            defaultPrice: 6.49,
            sellPrice: 8.49,
            description: 'Roast beef with melted provolone cheese and au jus for dipping.',
            image: 'https://img.freepik.com/free-photo/french-dip-sandwich_144627-29905.jpg'
        },
        {
            id: 17,
            name: 'Shrimp Po Boy',
            defaultPrice: 5.99,
            sellPrice: 7.99,
            description: 'Fried shrimp with lettuce, tomato, and remoulade sauce on a baguette.',
            image: 'https://img.freepik.com/free-photo/shrimp-po-boy-sandwich-with-remoulade_123827-12194.jpg'
        },
        {
            id: 18,
            name: 'Club Sandwich',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Turkey, bacon, lettuce, tomato, and mayonnaise on toasted bread.',
            image: 'https://img.freepik.com/free-photo/club-sandwich-turkey-bacon-lettuce-tomato_144627-29847.jpg'
        },
        {
            id: 19,
            name: 'Falafel Wrap',
            defaultPrice: 4.49,
            sellPrice: 6.49,
            description: 'Crispy falafel with hummus, lettuce, and cucumber in a warm wrap.',
            image: 'https://img.freepik.com/free-photo/falafel-wrap-with-hummus-lettuce_144627-29904.jpg'
        },
        {
            id: 20,
            name: 'BBQ Chicken Burger',
            defaultPrice: 5.49,
            sellPrice: 7.49,
            description: 'Grilled chicken breast with barbecue sauce, cheddar cheese, and onion rings.',
            image: 'https://img.freepik.com/free-photo/bbq-chicken-burger-onion-rings_144627-29850.jpg'
        },
        {
            id: 21,
            name: 'Turkey Club Wrap',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Sliced turkey, bacon, lettuce, tomato, and mayo in a wrap.',
            image: 'https://img.freepik.com/free-photo/turkey-club-wrap_144627-29851.jpg'
        },
        {
            id: 22,
            name: 'Spicy Fish Sandwich',
            defaultPrice: 5.49,
            sellPrice: 7.49,
            description: 'Fried fish fillet with spicy tartar sauce and jalapenos.',
            image: 'https://img.freepik.com/free-photo/spicy-fish-sandwich_144627-29908.jpg'
        },
        {
            id: 23,
            name: 'Cuban Sandwich',
            defaultPrice: 6.49,
            sellPrice: 8.49,
            description: 'Roast pork, ham, Swiss cheese, pickles, and mustard on Cuban bread.',
            image: 'https://img.freepik.com/free-photo/cuban-sandwich-ham-pork-cheese_144627-29853.jpg'
        },
        {
            id: 24,
            name: 'Grilled Veggie Wrap',
            defaultPrice: 4.99,
            sellPrice: 6.99,
            description: 'Grilled vegetables with hummus and feta cheese in a wrap.',
            image: 'https://img.freepik.com/free-photo/grilled-veggie-wrap-hummus-feta_144627-29854.jpg'
        },
        {
            id: 25,
            name: 'Steak Sandwich',
            defaultPrice: 6.99,
            sellPrice: 8.99,
            description: 'Grilled steak with onions, peppers, and melted cheese on a hoagie roll.',
            image: 'https://img.freepik.com/free-photo/steak-sandwich-with-melted-cheese_144627-29909.jpg'
        }
    ];


    function addToCart(id, qty, price, image) {
        try {
            // Try to parse existing cookie or create an empty array if it doesn't exist
            const defaultObj = JSON.parse(Cookies.get("order") || '[]');
            const item = defaultObj.find(i => i.id === id);

            if (item) {
                // Increment quantity and update amount if item already exists
                item.qty += qty;
                item.amounts = item.qty * price;
            } else {
                // Create a new item to add
                const obj = { id, qty, price, amounts: price * qty, image };
                defaultObj.push(obj);
            }

            // Set the updated array back to the cookie
            Cookies.set("order", JSON.stringify(defaultObj));
            console.log(defaultObj);

            // Refresh item if function is defined
            refrestItem();

        } catch (error) {
            // If there was an error, initialize with a new array containing the new item
            const obj = { id, qty, price, amounts: price * qty, image };
            Cookies.set("order", JSON.stringify([obj]));
            console.log(obj);

            // Refresh item if function is defined
            if (typeof refreshItem === 'function') {
                refreshItem();
            }
        }
    }

    function totalPayment() {
        try {
            const item = JSON.parse(Cookies.get("order") || '[]');
            setItemOrder(item);

            let total = 0;
            for (let i = 0; i < item.length; i++) {
                total += item[i].price * item[i].qty; // Calculate item total
            }
            setTotalPay(total);
            console.log(total); // Print the total payment

        } catch (error) {
            console.error("Error calculating total payment:", error);
        }
    }

    const formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const [itemOrder, setItemOrder] = useState([])
    function refrestItem() {
        try {
            const item = JSON.parse(Cookies.get("order") || '[]');
            if (item) {
                setItemOrder(item);
                totalPayment();
            }


        } catch (error) {
            setItemOrder([]);
            totalPayment();
        }
    }
    useEffect(() => {
        refrestItem();
    }, [])
    const [totalPay, setTotalPay] = useState(0);

    function updateQty(btn, id) {
        if (btn == 1) {
            try {
                const item = JSON.parse(Cookies.get("order") || '[]');
                const findItem = item.find(i => i.id == id);
                findItem.qty += 1;
                findItem.amounts = findItem.qty * findItem.price;
                Cookies.set("order", JSON.stringify(item));
                refrestItem();

            } catch (error) {
                refrestItem();
            }
        } else {
            try {
                const item = JSON.parse(Cookies.get("order") || '[]');
                const findItem = item.find(i => i.id == id);
                if (findItem.qty == 1) {
                    const newItem = item.filter(i => i.id != id);
                    Cookies.set("order", JSON.stringify(newItem));
                } else {
                    findItem.qty -= 1;
                    findItem.amounts = findItem.qty * findItem.price;
                    Cookies.set("order", JSON.stringify(item));

                }
                refrestItem();


            } catch (error) {
                refrestItem();
            }
        }
    }

    function listTable() {
        return (
            <div className="card border-0 bg-none">
                <div className="card-body p-0 border-0 bg-none">
                    <table className="text-des w-100" style={{ fontSize: '16px' }}>
                        <thead valign='middle '>
                            <tr className='border-secondary border-bottom'>

                                <td className='py-3'>No</td>
                                <td>Item</td>
                                <td>Price</td>
                                <td>Qty</td>
                                <td>Amount</td>
                                <td>Action</td>



                            </tr>
                        </thead>
                        <tbody>
                            {
                                itemOrder.map((f, i) =>
                                    <tr className="pointer" onClick={() => goto(`/item-detail`)}>

                                        <td className='py-3'>{i + 1}</td>
                                        <td>example item product</td>
                                        <td>{formatCurrency.format(f.price)}</td>
                                        <td>{f.qty}</td>
                                        <td>{formatCurrency.format(f.amounts)}</td>
                                        <td>
                                            <div className='font-12'>
                                                <span className='bg-none font-12  small-i box-shadow' onClick={() => updateQty(2, f.id)}>-</span>
                                                <span className='bg-none small-i mx-1 text-des'>{f.qty}</span>
                                                <span className='bg-none font-12 small-i box-shadow' onClick={() => updateQty(1, f.id)}>+</span>

                                            </div>
                                        </td>



                                    </tr>
                                )
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }
    function btnActionUserView() {
        return (
            <>
                <div className="border-0 border-secondary rounded w-100 d-flex py-1 px-2">


                    <button className="btn bg-red box-shadow px-3 py-3 px-5 text-white me-2"
                        onClick={() => {
                            Cookies.remove("user-data");
                            location.reload();
                        }}
                    >Exit</button>
                    <button className="btn bg-yellow box-shadow px-3 py-3 px-5 text-dark me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">Setting</button>
                    <button className="btn bg-green box-shadow px-3 py-3 px-5 text-dark me-2">Order</button>
                </div>

            </>
        )
    }
    function btnActionAdminView() {
        return (
            <>
                <div className="border-0 border-secondary rounded w-100 d-flex py-1 px-2">


                    <button className="btn bg-red box-shadow px-3 py-3 px-5 text-white me-2"
                        onClick={() => {
                            Cookies.set("admin_viewer", 1);
                            location.reload();
                        }}
                    >Exit</button>
                    <button className="btn bg-yellow box-shadow px-3 py-3 px-5 text-dark me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">Setting</button>
                    <button className="btn bg-green box-shadow px-3 py-3 px-5 text-dark me-2">Order</button>
                </div>

            </>
        )
    }
    const secretkey = "kans983(*93849Jnjsbd@*^@knskldn&^@($*LLjbHHSDuBKJ_)93849uIHUSHD&#%#&^$(@80928()*&*#$&(*"
    function actionViewer() {
        try {
            const dataEncrypt = Cookies.get("user-data");
            if (dataEncrypt) {
                const userData = decryptData(dataEncrypt, secretkey);
                if (userData.role == "USER") {
                    return (
                        <>
                            {btnActionUserView()}
                        </>
                    )
                } else if (userData.role == "ADMIN") {
                    return (
                        <>
                            {btnActionAdminView()}
                        </>
                    )

                } else {
                    return (
                        <>
                            {btnActionUserView()}

                        </>
                    )
                }
            } else {
                return (
                    <>
                        {btnActionUserView()}
                    </>
                )
            }
        } catch (error) {
            return (
                <>
                    {btnActionUserView()}
                </>
            )
        }
    }

    return (
        <>
            <div class=" fixed-top h-100 w-100 bg">

            </div>
            <div className="d-flex pos">

                <div className="pos-info w-100">
                    <div className='p-0 ps-0'>
                        <div className="ps-3 pe-3  py-2 my-2">
                            {actionViewer()}
                        </div>
                        <div className="pos-search d-flex center ps-3 pe-3">
                            <input type="text" className='border-bottom border-0 px-3 rounded border-secondary bg-none w-100 text-des order' placeholder='search' />
                        </div>
                        <div className="pos-cateogry mt-3 d-flex ps-3 pe-3">
                            <button className='btn-category d-block me-3'>
                                <img src="https://demo.foodscan.xyz/images/default/all-category.png" alt="" className='img-btn' />
                                <div className='font-12 fw-bold mt-2'>All Category</div>
                            </button>
                            <button className='btn-category d-block me-3'>
                                <img src="https://demo.foodscan.xyz/storage/27/conversions/appetizers-thumb.png" alt="" className='img-btn' />
                                <div className='font-12 fw-bold mt-2'>All Category</div>
                            </button>
                            <button className='btn-category d-block me-3'>
                                <img src="https://demo.foodscan.xyz/storage/30/conversions/sandwich_from_the_grill-thumb.png" alt="" className='img-btn' />
                                <div className='font-12 fw-bold mt-2'>All Category</div>
                            </button>
                        </div>
                        <div className="pos-product mt-3 p-0 center">
                            <div className="row p-0 w-100">
                                {
                                    items.map(i =>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6" key={i.id}>
                                            <div className='p-2 pe-3'>
                                                <div className="card border-1 rounded card-product mb-3" onClick={() => { addToCart(i.id, 1, i.sellPrice, i.image) }}>
                                                    <div className="card-img center">
                                                        <img src={i.image} alt='img' className="h-100 hover-zoom" />
                                                    </div>
                                                    <div className="card-header rounded" style={{ height: 165 }}>
                                                        <div className="start fs-6 text-product" style={{ height: 40, overflow: 'hidden' }}>{i.name}</div>
                                                        <div className="font-12 text-des hover-line" style={{ height: '60px', overflow: 'hidden' }}>
                                                            {i.description}
                                                        </div>
                                                        <div className="d-flex center" style={{ height: '60px' }}>
                                                            <div className='text-start text-green'>Active</div>
                                                            <div className='end w-100'>
                                                                <button className='btn text-danger center border-bottom rounded-pill'><i class="fa-solid fa-basket-shopping px-2 text-product"></i><span className='text-des fs-5'>{formatCurrency.format(i.sellPrice)}</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className='pos-view-order p-2 ps-0 bg-none  d-none d-xl-block'>
                    <div className="border order border-secondary rounded box-shadow h-100 rounded p-2" style={{ overflow: 'scroll' }}>

                        {
                            itemOrder.map((i, index) =>
                                <>
                                    <div className="w-100 border-2 border-bottom border-secondary " style={{ height: '110px' }}>
                                        <div className="d-flex px-1 border-0 card-product">
                                            <div className='rounded img-pos-order center p-2 pb-2 '>
                                                <img src={i.image} alt="" className="h-100 rounded box-shadow w-100" />
                                            </div>
                                            <div className='d-block ps-2'>
                                                <div className='d-flex' style={{ height: '50px' }}>
                                                    <span className='text-des font-12 pe-3'>Smoke Tenderlion Smoke Tenderlion Smoke</span>
                                                    <i class="fa-solid fa-trash text-secondary pointer"></i>
                                                </div>
                                                <div className='fs-6 d-flex start' style={{ height: '50px' }}>
                                                    <div className='start w-50'>
                                                        <span className='text-des fs-5'>{formatCurrency.format(i.price)}</span>
                                                        <span className='text-product font-12 ps-2'> / unit</span>
                                                    </div>
                                                    <div className='font-12 text-danger end w-50'>
                                                        <span className='bg-none font-12  small-i box-shadow' onClick={() => updateQty(2, i.id)}>-</span>
                                                        <span className='bg-none small-i mx-1 text-des'>{i.qty}</span>
                                                        <span className='bg-none font-12 small-i box-shadow' onClick={() => updateQty(1, i.id)}>+</span>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }




                        <div className="d-block px-3 order border border-secondary py-3 rounded mt-1">
                            {/* <div className="between">
                                <div className='w-100 start'>Sub Total :</div>
                                <div>$10.00</div>
                            </div>
                            <div className="between text-secondary my-2">
                                <div className='w-100 start'>Discount :</div>
                                <div>$1.00</div>
                            </div> */}
                            <div className="between text-des fs-5">
                                <div className='w-100 start fs-6'>Total Payment :</div>
                                <div className='text-ligth'>{formatCurrency.format(totalPay)}</div>
                            </div>
                        </div>
                        <div className='mt-3 d-flex'>
                            <button className="btn bg-red text-white rounded py-3 box-shadow w-25 me-1">Clear</button>
                            <button className="btn bg-green text-white rounded py-3 box-shadow w-75" data-bs-toggle="modal" data-bs-target="#processOrder"
                            // onClick={() => {
                            //     Cookies.remove("order")
                            //     orderItem();
                            // }
                            // }
                            >Payment</button>
                        </div>

                    </div>
                </div>
            </div>
            {/* {shopingCard()} */}
            <div class="modal fade " id="printer" tabindex="-1" aria-labelledby="printer" aria-hidden="true">
                <div class="modal-dialog bg-none">
                    <div class="modal-content bg-none">

                        <div class="modal-body bg-none">
                            <PrinInvoice />
                        </div>

                    </div>
                </div>
            </div>





            <div class="modal slideInLeft " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen bg-none">
                    <div class="modal-content bg-blur-dark">
                        <div class="modal-header between border-secondary">
                            <h1 class="modal-title fs-5 start text-des w-75" id="exampleModalLabel">Setting</h1>
                            <button type="button" class="text-des btn " data-bs-dismiss="modal" aria-label="Close">
                                <i class="fa-solid fa-xmark text-des fs-3"></i>
                            </button>
                        </div>
                        <div class="modal-body d-flex justify-content-center mt-5">
                            <div className="d-block text-light">
                                <form action="" className='' style={{ width: '500px', maxWidth: '700px' }}>
                                    <div className='fs-4 border-secondary input-box w-100 pointer' onClick={() => {
                                        Cookies.set("mode", 1);
                                        location.reload();
                                    }}>
                                        <input type="radio" name="mode" className='pointer' id="dark" value="light" style={{ width: '20px', height: '20px' }} />
                                        <label htmlFor="dark" className='px-3  text-des   w-75 pointer'>Dark Mode</label>
                                    </div>
                                    <div className='fs-4 border-secondary input-box w-100 mt-2 pointer'
                                        onClick={() => {
                                            Cookies.set("mode", 2);
                                            location.reload();
                                        }}>
                                        <input type="radio" className='pointer' name="mode" id="light" value="light" style={{ width: '20px', height: '20px' }} />
                                        <label htmlFor="light" className='px-3 w-75 text-des pointer'>Light Mode</label>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="modal slideInRight " id="processOrder" tabindex="-1" aria-labelledby="processOrderModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen bg-none">
                    <div class="modal-content bg-blur-dark">

                        <div class="modal-body d-flex justify-content-center p-0">
                            <div className="d-block text-light w-75">
                                {listTable()}
                            </div>
                            <div className="w-25">
                                <div className='p-2 ps-0 bg-none  d-none d-xl-block'>
                                    <div className="border order border-secondary rounded box-shadow h-100 rounded p-2" style={{ overflow: 'scroll' }}>
                                        <div className="d-block px-3 order border border-secondary py-3 rounded mt-1">

                                            <div className="between text-des fs-5">
                                                <div className='w-100 start fs-6'>Cash :</div>
                                                <div className='text-ligth'>
                                                    <input type="" className='bg-none border-secondary border-0 border-bottom text-des text-end' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-block px-3 order border border-secondary py-3 rounded mt-1">

                                            <div className="between text-des fs-5">
                                                <div className='w-100 start fs-6'>Exchange :</div>
                                                <div className='text-ligth'>
                                                    <input type="" className='bg-none border-secondary border-0 border-bottom text-des text-end' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-block px-3 order border border-secondary py-3 rounded mt-1">

                                            <div className="between text-des fs-5">
                                                <div className='w-100 start fs-6'>Total Payment :</div>
                                                <div className='text-ligth'>{formatCurrency.format(totalPay)}</div>
                                            </div>
                                        </div>
                                        <div className='mt-3 d-flex'>
                                            <button className="btn bg-red text-white rounded py-3 box-shadow w-25 me-1" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                            <button className="btn bg-green text-white rounded py-3 box-shadow w-75" data-bs-toggle="modal" data-bs-target="#processOrder"
                                            // onClick={() => {
                                            //     Cookies.remove("order")
                                            //     orderItem();
                                            // }
                                            // }
                                            >Order</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default PosDark
