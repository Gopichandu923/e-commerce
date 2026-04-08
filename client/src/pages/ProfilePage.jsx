import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserFromCookie } from "../utils/cookie.js";
import { GetMyOrders, GetAddresses, AddAddress, UpdateAddress, DeleteAddress, SetMainAddress } from "../Api.js";
import { logout } from "../redux/auth/authActions";
import toast from "react-hot-toast";

const ProfilePage = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state) => state.auth);
  const currentUser = reduxUser || getUserFromCookie();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isMain: false,
    label: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia",
    "Germany", "France", "Japan", "China", "Brazil", "Mexico", "Spain",
    "Italy", "Netherlands", "Singapore", "UAE", "Other"
  ];

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
        setAddresses(addressesRes.data?.addresses || addressesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
      isMain: false,
      label: "",
    });
    setEditingAddress(null);
  };

  const handleOpenAddModal = () => {
    resetAddressForm();
    setShowAddressModal(true);
  };

  const handleOpenEditModal = (address) => {
    setAddressForm({
      fullName: address.fullName || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "United States",
      phone: address.phone || "",
      isMain: address.isMain || false,
      label: address.label || "",
    });
    setEditingAddress(address._id);
    setShowAddressModal(true);
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
    resetAddressForm();
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateAddressForm = () => {
    const errors = [];
    if (!addressForm.fullName.trim() || addressForm.fullName.trim().length < 2) {
      errors.push("Full name must be at least 2 characters");
    }
    if (!addressForm.street.trim() || addressForm.street.trim().length < 5) {
      errors.push("Street address must be at least 5 characters");
    }
    if (!addressForm.city.trim() || addressForm.city.trim().length < 2) {
      errors.push("City is required");
    }
    if (!addressForm.state.trim()) {
      errors.push("State is required");
    }
    const zip = addressForm.zipCode.trim();
    if (!zip || !/^\d{6}$/.test(zip)) {
      errors.push("Enter a valid 6-digit PIN code (e.g., 500001)");
    }
    if (addressForm.phone && addressForm.phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(addressForm.phone.trim())) {
      errors.push("Invalid phone number");
    }
    return errors;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!currentUser?.token) return;

    const errors = validateAddressForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setSavingAddress(true);
    try {
      const addressData = {
        fullName: addressForm.fullName.trim(),
        street: addressForm.street.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        zipCode: addressForm.zipCode.trim(),
        country: addressForm.country.trim() || "United States",
        phone: addressForm.phone.trim(),
        isMain: addressForm.isMain,
        label: addressForm.label || null,
      };

      let response;
      if (editingAddress) {
        response = await UpdateAddress(currentUser.token, editingAddress, addressData);
        setAddresses(response.data.addresses || response.data || []);
        toast.success("Address updated successfully");
      } else {
        response = await AddAddress(currentUser.token, addressData);
        setAddresses(response.data.addresses || response.data || []);
        toast.success("Address added successfully");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!currentUser?.token) return;
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await DeleteAddress(currentUser.token, addressId);
      setAddresses(addresses.filter((addr) => addr._id !== addressId));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetMainAddress = async (addressId) => {
    if (!currentUser?.token) return;
    try {
      const response = await SetMainAddress(currentUser.token, addressId);
      setAddresses(response.data.addresses || response.data || []);
      toast.success("Default address set");
    } catch (err) {
      toast.error("Failed to set default address");
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
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Name</label>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{currentUser.name || "N/A"}</p>
                </div>
                <div>
                  <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</label>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{currentUser.email || "N/A"}</p>
                </div>
                <div>
                  <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Phone</label>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{currentUser.phone || "N/A"}</p>
                </div>
                <div>
                  <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Account Type</label>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {currentUser.isAdmin ? "Admin" : "Customer"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? "bg-red-600 text-white hover:bg-red-700" 
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              Logout
            </button>
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
              <div className={`p-8 rounded-lg shadow-md text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No orders yet</p>
                <Link to="/shop" className="text-blue-500 hover:underline">Start Shopping</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Order #{order._id?.slice(-8)}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${order.isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Total: ${order.totalPrice?.toFixed(2)}</p>
                    <Link to={`/orders/${order._id}`} className="text-blue-500 hover:underline text-sm">View Details</Link>
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
              <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>My Addresses</h3>
              <button onClick={handleOpenAddModal} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Add New Address
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className={`p-8 rounded-lg shadow-md text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No addresses saved</p>
                <button onClick={handleOpenAddModal} className="text-blue-500 hover:underline">Add your first address</button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                  <div key={address._id} className={`p-6 rounded-lg shadow-md relative ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    {address.isMain && (
                      <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default</span>
                    )}
                    {address.label && (
                      <span className={`inline-block text-xs px-2 py-1 rounded mb-2 ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                        {address.label}
                      </span>
                    )}
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{address.fullName}</p>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{address.street}</p>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{address.city}, {address.state} {address.zipCode}</p>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{address.country}</p>
                    {address.phone && <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>📞 {address.phone}</p>}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => handleOpenEditModal(address)} className="text-blue-500 hover:underline text-sm">Edit</button>
                      {!address.isMain && (
                        <button onClick={() => handleSetMainAddress(address._id)} className="text-green-500 hover:underline text-sm">Set as Default</button>
                      )}
                      <button onClick={() => handleDeleteAddress(address._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>My Account</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`p-6 text-center border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                  <span className="text-2xl">{currentUser.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <h2 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{currentUser.name}</h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{currentUser.email}</p>
              </div>
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${
                      activeTab === tab.id ? "bg-blue-50 text-blue-600" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button onClick={handleCloseModal} className={darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}>✕</button>
              </div>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Full Name *</label>
                  <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressFormChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Street Address *</label>
                  <input type="text" name="street" value={addressForm.street} onChange={handleAddressFormChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="123 Main Street, Apt 4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>City *</label>
                    <input type="text" name="city" value={addressForm.city} onChange={handleAddressFormChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                      placeholder="New York" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>State *</label>
                    <input type="text" name="state" value={addressForm.state} onChange={handleAddressFormChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                      placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>PIN Code *</label>
                    <input type="text" name="zipCode" value={addressForm.zipCode} onChange={handleAddressFormChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                      placeholder="500001" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Country</label>
                    <select name="country" value={addressForm.country} onChange={handleAddressFormChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Phone</label>
                  <input type="text" name="phone" value={addressForm.phone} onChange={handleAddressFormChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Label</label>
                  <select name="label" value={addressForm.label} onChange={handleAddressFormChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}>
                    <option value="">None</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isMain" id="isMain" checked={addressForm.isMain} onChange={handleAddressFormChange} className="rounded" />
                  <label htmlFor="isMain" className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Set as default address</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={savingAddress}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                    {savingAddress ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                  </button>
                  <button type="button" onClick={handleCloseModal}
                    className={`flex-1 py-2 px-4 rounded-md ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;