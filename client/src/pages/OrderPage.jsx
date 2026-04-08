import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUserFromCookie } from "../utils/cookie.js";
import { GetMyOrders, GetOrderById } from "../Api.js";
import toast from "react-hot-toast";

const OrderPage = ({ darkMode = false }) => {
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
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <button
            onClick={() => {
              navigate(-1);
              setSelectedOrder(null);
            }}
            className="mb-4 text-blue-500 hover:underline"
          >
            ← Back to Orders
          </button>

          <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Order Details</h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Order #{selectedOrder._id?.slice(-8)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                selectedOrder.isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {selectedOrder.isPaid ? "Paid" : "Pending Payment"}
              </span>
            </div>

            <div className={`border-t pt-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h2 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Items</h2>
              <div className="space-y-4">
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={item.image || item.product?.image || "https://via.placeholder.com/100"}
                      alt={item.name || item.product?.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{item.name || item.product?.name}</p>
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                        {item.qty || item.quantity} x ₹{(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`border-t pt-6 mt-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex justify-between mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Subtotal</span>
                <span className={darkMode ? "text-white" : "text-gray-900"}>₹{selectedOrder.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                <span className={darkMode ? "text-white" : "text-gray-900"}>₹{selectedOrder.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Tax</span>
                <span className={darkMode ? "text-white" : "text-gray-900"}>₹{selectedOrder.taxPrice?.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between pt-2 border-t font-bold text-lg ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <span className={darkMode ? "text-white" : "text-gray-800"}>Total</span>
                <span className={darkMode ? "text-white" : "text-gray-800"}>₹{selectedOrder.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            <div className={`border-t pt-6 mt-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h2 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Shipping Address</h2>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{selectedOrder.shippingAddress?.name}</p>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{selectedOrder.shippingAddress?.street}</p>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
              </p>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{selectedOrder.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>My Orders</h1>

        {orders.length === 0 ? (
          <div className={`rounded-lg shadow-md p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>You haven't placed any orders yet.</p>
            <Link to="/shop" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Order #{order._id?.slice(-8)}
                    </p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                    <Link to={`/orders/${order._id}`} className="text-blue-500 hover:underline text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className={`mt-4 pt-4 flex justify-between items-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {order.orderItems?.length || 0} items
                  </p>
                  <p className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
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