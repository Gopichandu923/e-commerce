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

  const currentUser = getUserFromCookie();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    if (!currentUser?.token) return;
    setLoading(true);
    try {
      const response = await GetMyOrders(currentUser.token);
      setOrders(response.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    if (!currentUser?.token) return;
    try {
      const response = await GetOrderById(currentUser.token, id);
      setSelectedOrder(response.data);
    } catch (err) {
      toast.error("Failed to load order details");
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-gray-500">
                Order #{selectedOrder._id?.slice(-8)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                selectedOrder.isPaid
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {selectedOrder.isPaid ? "Paid" : "Pending Payment"}
            </span>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {selectedOrder.orderItems?.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <img
                    src={item.productId?.image || "https://via.placeholder.com/100"}
                    alt={item.productId?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.productId?.name}</p>
                    <p className="text-gray-500">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>${selectedOrder.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>${selectedOrder.shippingPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax</span>
              <span>${selectedOrder.taxPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <span>Total</span>
              <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <p>{selectedOrder.shippingAddress?.name}</p>
            <p>{selectedOrder.shippingAddress?.street}</p>
            <p>
              {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
              {selectedOrder.shippingAddress?.zipCode}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-semibold text-lg">
                    Order #{order._id?.slice(-8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <p className="text-gray-600">
                  {order.orderItems?.length || 0} items
                </p>
                <p className="font-semibold text-lg">
                  Total: ${order.totalPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;