import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { StyleColors } from '../../extension/Extension';
import './shop.css';
import { useCartCount } from '../../provider/Provider';
import GuestOrderForm from '../form/GuestOrderForm';
import PaymentModal from '../../components/modal/PaymentModal';

export default function ShoppingCartPage() {
  const [activeTab, setActiveTab] = useState('cart');
  const [isShowPaymentModal, setIsShowPaymentModal] = useState(false);

  // Initialize cartItems from 'cartItems' cookie or empty array
  const [cartItems, setCartItems] = useState(() => {
    const raw = Cookies.get('cartItems');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
  const { countCart, increment, decrement, refreshCard, getCartSubtotal, getCartSummary } = useCartCount();
  const { subtotal, discountAmount, delivery, total } = getCartSummary();

  // Persist cartItems to cookie whenever it changes
  useEffect(() => {
    Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7, path: '/' });
  }, [cartItems]);

  // Calculate cart totals
  // const subtotal = cartItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = 9.99;
  // const total = subtotal + tax + shipping;

  // Remove an item from cart
  const removeItem = id =>
    setCartItems(items => items.filter(item => item.itemId !== id));
  // Change item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.itemId === id
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * Number(item.unitPrice) }
          : item
      )
    );
  };

  return (
    <div className="w-100">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          Cart
        </button>
        <button
          className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Order Information
        </button>
      </div>

      <div className="main-content">
        <div className="content-left">
          {activeTab === 'cart' && (
            <div className="p-3 rounded" style={{ background: StyleColors.appBackground }}>
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added any items yet.</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.itemId} className="cart-item">
                        <img src={item.image_url} alt={item.itemId} className="item-image" />
                        <div className="item-details">
                          <div className="item-header">
                            <h3>{item.product_name}</h3>
                            <p className="item-total">${item.totalPrice.toFixed(2)}</p>
                          </div>
                          <p className="item-price">${item.unitPrice} each</p>
                          <div className="item-actions">
                            <div className="quantity-controls">
                              <div className="quantity-controls border-0">
                                <button
                                  className="quantity-btn"
                                  onClick={async () => {
                                    await updateQuantity(item.itemId, item.quantity - 1)
                                    refreshCard()
                                  }}
                                >

                                  -
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button
                                  className="quantity-btn"
                                  onClick={async () => {
                                    await updateQuantity(item.itemId, item.quantity + 1);
                                    refreshCard();
                                  }}
                                >
                                  +
                                </button>
                              </div>

                            </div>
                            <button className="remove-btn" onClick={async () => {
                              await removeItem(item.itemId);
                              refreshCard();
                            }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-actions">
                    <button className="continue-btn" style={{ color: StyleColors.componentsColor }}>Continue Shopping</button>
                    <button className="primary-btn" onClick={() => setActiveTab('payment')} style={{ background: StyleColors.componentsColor }}>
                      Proceed to Payment with Guest account
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="p-2">
              <GuestOrderForm
                onSubmit={(orderData) => {
                  console.log('Submitted order:', orderData);
                }}

                onClick={() => {
                  setIsShowPaymentModal(true);
                }}
              />

            </div>
          )}
        </div>

        <div className="content-right">
          <div className="p-3 rounded" style={{ background: StyleColors.appBackground, border: '1px solid var(--app-border)' }}>
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>DiscountAmount</span>
              <span>${discountAmount.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Delivery</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span style={{ color: StyleColors.componentsColor }}>Total</span>
              <span style={{ color: StyleColors.componentsColor }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        id="paymentModal"
        show={isShowPaymentModal}
        totalPay={total}
        onClose={() => setIsShowPaymentModal(false)}
        message="Please confirm your order before proceeding."
        qrValue="https://payment.example.com/order/12345"
      />
    </div>
  );
}

