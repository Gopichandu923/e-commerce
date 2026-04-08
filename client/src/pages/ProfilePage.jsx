import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserFromCookie } from "../utils/cookie.js";
import { GetMyOrders, GetAddresses, DeleteAddress } from "../Api.js";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentUser = user || getUserFromCookie();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.token) return;
      setLoading(true);
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          GetMyOrders(currentUser.token),
          GetAddresses(currentUser.token),
        ]);
        setOrders(ordersRes.data || []);
        setAddresses(addressesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleDeleteAddress = async (addressId) => {
    if (!currentUser?.token) return;
    try {
      await DeleteAddress(currentUser.token, addressId);
      setAddresses(addresses.filter((addr) => addr._id !== addressId));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  if (!currentUser) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "orders", label: "My Orders", icon: "📦" },
    { id: "addresses", label: "Addresses", icon: "📍" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Name</label>
                  <p className="font-medium">{currentUser.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Email</label>
                  <p className="font-medium">{currentUser.email || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{currentUser.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Account Type</label>
                  <p className="font-medium">
                    {currentUser.isAdmin ? "Admin" : "Customer"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link
                  to="/shop"
                  className="text-blue-500 hover:underline"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #{order._id?.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      Total: ${order.totalPrice?.toFixed(2)}
                    </p>
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">My Addresses</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Add New Address
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500 mb-4">No addresses saved</p>
                <button className="text-blue-500 hover:underline">
                  Add your first address
                </button>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address._id}
                  className="bg-white p-6 rounded-lg shadow-md relative"
                >
                  {address.isMain && (
                    <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  <p className="font-medium">{address.name}</p>
                  <p className="text-gray-600">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  <p className="text-gray-500 mt-2">{address.phone}</p>
                  <div className="flex gap-2 mt-4">
                    <button className="text-blue-500 hover:underline text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        My Account
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 text-center border-b">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">
                  {currentUser.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <h2 className="font-semibold">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
            <div className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;