import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserFromCookie } from "../utils/cookie.js";
import { GetMyOrders, GetAddresses, AddAddress, UpdateAddress, DeleteAddress, SetMainAddress, GetMyProducts, UpdateProduct, DeleteProduct, UploadProductImage, CreateProduct } from "../Api.js";
import { logout } from "../redux/auth/authActions";
import toast from "react-hot-toast";
import AddProductPage from "./AddProductPage.jsx";

// eslint-disable-next-line no-unused-vars
let mapplsGlobal;

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
  const [showMapModal, setShowMapModal] = useState(false);
  const mapContainerRef = useRef(null);
  const mapObjectRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    category: "",
    countInStock: "",
  });
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [productUploadedUrl, setProductUploadedUrl] = useState("");
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

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

  useEffect(() => {
    if (activeTab === "myProducts" && currentUser?.token) {
      const fetchMyProducts = async () => {
        setProductsLoading(true);
        try {
          const res = await GetMyProducts(currentUser.token);
          setMyProducts(res.data || []);
        } catch (err) {
          console.error("Error fetching products:", err);
        } finally {
          setProductsLoading(false);
        }
      };
      fetchMyProducts();
    }
  }, [activeTab, currentUser]);

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

  const loadMapplsScripts = useCallback(async () => {
    if (window.mappls && window.mappls.Map) return;

    const existingScript = document.querySelector('script[src*="sdk.mappls.com"]') ||
      document.querySelector('script[src*="apis.mappls.com"]');
    if (existingScript) return;

    await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=rjossmnfkadlbcnveqfjiscqbjqavtabikmo";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }, []);

  const handleMapClick = useCallback(async (lat, lng) => {
    setMapLoading(true);
    try {
      const response = await fetch(`http://localhost:4040/api/reverse-geocode?latitude=${lat}&longitude=${lng}`);
      const data = await response.json();

      if (data?.results?.[0]) {
        const loc = data.results[0];
        setAddressForm(prev => ({
          ...prev,
          street: loc.formatted_address || loc.address || prev.street,
          city: loc.locality || loc.village || prev.city,
          state: loc.state || prev.state,
          zipCode: loc.pincode || prev.zipCode,
          country: "India",
        }));
        setSelectedLocation({ lat, lng, ...loc });
      }

      if (mapObjectRef.current && window.mappls) {
        if (markerRef.current && typeof markerRef.current.remove === "function") {
          try { markerRef.current.remove(); } catch { }
        }
        markerRef.current = new window.mappls.Marker({
          map: mapObjectRef.current,
          position: { lat, lng },
        });
        mapObjectRef.current.setCenter({ lat, lng });
        mapObjectRef.current.setZoom(15);
      }
    } catch (err) {
      toast.error("Failed to get location details");
    } finally {
      setMapLoading(false);
    }
  }, []);

  const initMap = useCallback(async (lat = 28.633, lng = 77.2194) => {
    if (!mapContainerRef.current || !window.mappls || !window.mappls.Map) return;

    if (mapObjectRef.current && typeof mapObjectRef.current.remove === "function") {
      try { mapObjectRef.current.remove(); } catch { }
    }

    mapObjectRef.current = new window.mappls.Map("profile-map", {
      center: [lng, lat],
      zoom: 12,
      zoomControl: true,
    });

    mapObjectRef.current.on("click", (e) => {
      const { lng: clickLng, lat: clickLat } = e.lngLat;
      handleMapClick(clickLat, clickLng);
    });
  }, [handleMapClick]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setMapLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleMapClick(position.coords.latitude, position.coords.longitude);
      },
      () => {
        toast.error("Unable to get location");
        setMapLoading(false);
      }
    );
  }, [handleMapClick]);

  const openMapModal = () => {
    setShowMapModal(true);
    setTimeout(() => {
      loadMapplsScripts().then(() => {
        setMapReady(true);
        setTimeout(() => initMap(), 500);
      });
    }, 100);
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

  const resetProductForm = () => {
    setProductForm({ name: "", price: "", description: "", brand: "", category: "", countInStock: "" });
    setProductImagePreview(null);
    setProductUploadedUrl("");
    setEditingProduct(null);
  };

  const handleOpenEditProduct = (product) => {
    setProductForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      brand: product.brand || "",
      category: product.category || "",
      countInStock: product.countInStock?.toString() || "",
    });
    setProductImagePreview(product.image);
    setProductUploadedUrl(product.image);
    setEditingProduct(product._id);
    setShowProductModal(true);
  };

  const handleProductImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser?.token) return;
    setProductImagePreview(URL.createObjectURL(file));
    setUploadingProductImage(true);
    try {
      const res = await UploadProductImage(currentUser.token, file);
      setProductUploadedUrl(res.data.imageUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingProductImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!currentUser?.token) return;
    if (!productForm.name.trim() || !productForm.price || !productForm.description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSavingProduct(true);
    try {
      const data = {
        name: productForm.name.trim(),
        price: parseFloat(productForm.price),
        description: productForm.description.trim(),
        brand: productForm.brand.trim(),
        category: productForm.category,
        countInStock: parseInt(productForm.countInStock) || 0,
        image: productUploadedUrl || productImagePreview,
      };
      if (editingProduct) {
        await UpdateProduct(currentUser.token, editingProduct, data);
        toast.success("Product updated");
      } else {
        await CreateProduct(currentUser.token, data);
        toast.success("Product added");
      }
      setShowProductModal(false);
      resetProductForm();
      const res = await GetMyProducts(currentUser.token);
      setMyProducts(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteMyProduct = async (productId) => {
    if (!currentUser?.token) return;
    if (!window.confirm("Delete this product?")) return;
    try {
      await DeleteProduct(currentUser.token, productId);
      setMyProducts(myProducts.filter(p => p._id !== productId));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (!currentUser) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "orders", label: "My Orders", icon: "📦" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "myProducts", label: "My Products", icon: "🛍️" },
    { id: "addProduct", label: "Sell Product", icon: "➕" },
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
              className={`w-full py-3 rounded-lg font-medium transition-colors ${darkMode
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

      case "myProducts":
        return (
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>My Products</h3>
            {productsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : myProducts.length === 0 ? (
              <div className={`p-8 rounded-lg shadow-md text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>You haven't added any products yet</p>
                <button onClick={() => setActiveTab("addProduct")} className="text-blue-500 hover:underline">Add your first product</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((product) => (
                  <div key={product._id} className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{product.name}</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{product.brand}</p>
                    <p className={`text-lg font-bold text-green-600`}>₹{product.price}</p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Stock: {product.countInStock}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleOpenEditProduct(product)} className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">Edit</button>
                      <button onClick={() => handleDeleteMyProduct(product._id)} className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "addProduct":
        return <AddProductPage darkMode={darkMode} />;

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
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${activeTab === tab.id ? "bg-blue-50 text-blue-600" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-50"
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
                  <div className="flex gap-2">
                    <input type="text" name="street" value={addressForm.street} onChange={handleAddressFormChange}
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                      placeholder="123 Main Street, Apt 4" />
                    <button type="button" onClick={openMapModal}
                      className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm whitespace-nowrap">
                      📍 Pick from Map
                    </button>
                  </div>
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

      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Select Location from Map
              </h2>
              <button onClick={() => setShowMapModal(false)} className={darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}>✕</button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={handleGetCurrentLocation} disabled={mapLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 flex items-center gap-2">
                  {mapLoading ? "Getting..." : "📍 Use Current Location"}
                </button>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Click on map to select location
                </p>
              </div>
              <div id="profile-map" ref={mapContainerRef} className="h-[400px] w-full rounded-lg" style={{ minHeight: '400px' }} />
              {selectedLocation && (
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => {
                    setShowMapModal(false);
                    toast.success("Location selected!");
                  }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Confirm Location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <button onClick={() => { setShowProductModal(false); resetProductForm(); }} className={darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}>✕</button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Product Image</label>
                  <div className="flex items-center gap-4">
                    {productImagePreview && <img src={productImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />}
                    <input type="file" accept="image/*" onChange={handleProductImageSelect} className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
                    {uploadingProductImage && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Product Name *</label>
                  <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="Product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Price (₹) *</label>
                    <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="0.00" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Stock</label>
                    <input type="number" value={productForm.countInStock} onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Brand</label>
                    <input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="Brand" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Category</label>
                    <input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="Category" />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>Description *</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3}
                    className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="Description" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={savingProduct}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                    {savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button type="button" onClick={() => { setShowProductModal(false); resetProductForm(); }}
                    className={`flex-1 py-2 px-4 rounded-md ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"}`}>
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