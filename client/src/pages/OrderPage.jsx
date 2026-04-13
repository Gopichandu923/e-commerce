import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUserFromCookie } from "../utils/cookie.js";
import { GetMyOrders, GetOrderById } from "../Api.js";
import toast from "react-hot-toast";

const OrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserFromCookie();
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await GetMyOrders(user.token);
        setOrders(response.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    if (!orderId) return;
    
    const user = getUserFromCookie();
    if (!user) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await GetOrderById(user.token, orderId);
        setSelectedOrder(response.data);
      } catch (err) {
        console.error("Failed to load order details:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-surface-container-lowest">
        <div className="inline-flex justify-center items-center gap-1">
          <span className="dot-bounce bg-primary"></span>
          <span className="dot-bounce delay-150 bg-primary"></span>
          <span className="dot-bounce delay-300 bg-primary"></span>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="min-h-[100dvh] bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <button
            onClick={() => {
              navigate(-1);
              setSelectedOrder(null);
            }}
            className="mb-4 text-secondary hover:text-on-secondary font-label text-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Orders
          </button>

          <div className="rounded-lg shadow-md p-6 bg-surface-container-high">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-headline font-bold text-on-surface">Order Details</h1>
                <p className="text-sm text-on-surface-variant">
                  Order #{selectedOrder._id?.slice(-8)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-label ${
                selectedOrder.isPaid ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
              }`}>
                {selectedOrder.isPaid ? "Paid" : "Pending Payment"}
              </span>
            </div>

            <div className="border-t border-outline-variant pt-6">
              <h2 className="font-headline font-bold text-on-surface mb-4">Items</h2>
              <div className="space-y-4">
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={item.image || item.product?.image || "https://via.placeholder.com/100"}
                      alt={item.name || item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-body font-bold text-on-surface">{item.name || item.product?.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {item.qty || item.quantity} x ₹{(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-outline-variant pt-6 mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-on-surface-variant font-body">Subtotal</span>
                <span className="text-on-surface font-body">₹{selectedOrder.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-on-surface-variant font-body">Shipping</span>
                <span className="text-on-surface font-body">₹{selectedOrder.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-on-surface-variant font-body">Tax</span>
                <span className="text-on-surface font-body">₹{selectedOrder.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant font-headline font-bold text-lg">
                <span className="text-on-surface">Total</span>
                <span className="text-on-surface">₹{selectedOrder.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-outline-variant pt-6 mt-6">
              <h2 className="font-headline font-bold text-on-surface mb-4">Shipping Address</h2>
              <p className="text-on-surface font-body">{selectedOrder.shippingAddress?.name}</p>
              <p className="text-on-surface-variant font-body">{selectedOrder.shippingAddress?.street}</p>
              <p className="text-on-surface-variant font-body">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
              </p>
              <p className="text-on-surface-variant font-body">{selectedOrder.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-primary mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="rounded-lg shadow-md p-8 text-center bg-surface-container-high">
            <p className="mb-4 text-on-surface-variant">You haven't placed any orders yet.</p>
            <Link to="/shop" className="inline-block px-6 py-3 rounded-lg font-label text-sm text-white btn-gradient hover:opacity-90">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-lg shadow-md p-6 bg-surface-container-high">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="font-headline font-bold text-lg text-on-surface">
                      Order #{order._id?.slice(-8)}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-label ${
                      order.isPaid ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
                    }`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                    <Link to={`/orders/${order._id}`} className="text-secondary hover:text-on-secondary font-label text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                  <p className="text-on-surface-variant font-body">
                    {order.orderItems?.length || 0} items
                  </p>
                  <p className="font-headline font-bold text-lg text-on-surface">
                    Total: ₹{order.totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;