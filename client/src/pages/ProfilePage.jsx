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

const ProfilePage = () => {
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
            <div className="p-6 rounded-lg shadow-md bg-surface-container-high">
              <h3 className="text-xl font-headline font-bold text-on-surface mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-on-surface-variant">Name</label>
                  <p className="font-body text-on-surface">{currentUser.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant">Email</label>
                  <p className="font-body text-on-surface">{currentUser.email || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant">Phone</label>
                  <p className="font-body text-on-surface">{currentUser.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant">Account Type</label>
                  <p className="font-body text-on-surface">
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
              className="w-full py-3 rounded-lg font-label text-sm tracking-[0.2em] uppercase text-on-error-container bg-error-container hover:bg-error/10 transition-colors"
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
                <div className="inline-flex justify-center items-center gap-1">
                  <span className="dot-bounce bg-primary"></span>
                  <span className="dot-bounce delay-150 bg-primary"></span>
                  <span className="dot-bounce delay-300 bg-primary"></span>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 rounded-lg shadow-md text-center bg-surface-container-high">
                <p className="mb-4 text-on-surface-variant">No orders yet</p>
                <Link to="/shop" className="text-secondary hover:underline">Start Shopping</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="p-6 rounded-lg shadow-md bg-surface-container-high">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-body font-bold text-on-surface">Order #{order._id?.slice(-8)}</p>
                      <p className="text-sm text-on-surface-variant">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-label ${order.isPaid ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"}`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-body font-bold text-on-surface">Total: ₹{order.totalPrice?.toFixed(2)}</p>
                    <Link to={`/orders/${order._id}`} className="px-4 py-2 rounded-md font-label text-sm text-on-primary bg-primary hover:bg-primary/90 transition-colors">
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
              <h3 className="text-xl font-headline font-bold text-on-surface">My Addresses</h3>
              <button onClick={handleOpenAddModal} className="px-4 py-2 rounded-md font-label text-sm text-on-primary bg-primary hover:bg-primary/90 transition-colors">
                Add New Address
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-flex justify-center items-center gap-1">
                  <span className="dot-bounce bg-primary"></span>
                  <span className="dot-bounce delay-150 bg-primary"></span>
                  <span className="dot-bounce delay-300 bg-primary"></span>
                </div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-8 rounded-lg shadow-md text-center bg-surface-container-high">
                <p className="mb-4 text-on-surface-variant">No addresses saved</p>
                <button onClick={handleOpenAddModal} className="text-secondary hover:underline">Add your first address</button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                  <div key={address._id} className="p-6 rounded-lg shadow-md relative bg-surface-container-high">
                    {address.isMain && (
                      <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container text-xs px-2 py-1 rounded font-label">Default</span>
                    )}
                    {address.label && (
                      <span className="inline-block text-xs px-2 py-1 rounded mb-2 bg-surface-container-highest text-on-surface-variant">
                        {address.label}
                      </span>
                    )}
                    <p className="font-body font-bold text-on-surface">{address.fullName}</p>
                    <p className="font-body text-on-surface-variant">{address.street}</p>
                    <p className="font-body text-on-surface-variant">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="font-body text-on-surface-variant">{address.country}</p>
                    {address.phone && <p className="mt-2 text-sm text-on-surface-variant">📞 {address.phone}</p>}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => handleOpenEditModal(address)} className="text-secondary hover:underline text-sm font-label">Edit</button>
                      {!address.isMain && (
                        <button onClick={() => handleSetMainAddress(address._id)} className="text-tertiary hover:underline text-sm font-label">Set as Default</button>
                      )}
                      <button onClick={() => handleDeleteAddress(address._id)} className="text-error hover:underline text-sm font-label">Delete</button>
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
            <h3 className="text-xl font-headline font-bold text-on-surface">My Products</h3>
            {productsLoading ? (
              <div className="text-center py-8">
                <div className="inline-flex justify-center items-center gap-1">
                  <span className="dot-bounce bg-primary"></span>
                  <span className="dot-bounce delay-150 bg-primary"></span>
                  <span className="dot-bounce delay-300 bg-primary"></span>
                </div>
              </div>
            ) : myProducts.length === 0 ? (
              <div className="p-8 rounded-lg shadow-md text-center bg-surface-container-high">
                <p className="mb-4 text-on-surface-variant">You haven't added any products yet</p>
                <button onClick={() => setActiveTab("addProduct")} className="text-secondary hover:underline">Add your first product</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((product) => (
                  <div key={product._id} className="p-4 rounded-lg shadow-md bg-surface-container-high">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h4 className="font-body font-bold text-on-surface">{product.name}</h4>
                    <p className="text-sm text-on-surface-variant">{product.brand}</p>
                    <p className="text-lg font-bold text-primary">₹{product.price}</p>
                    <p className="text-sm text-on-surface-variant">Stock: {product.countInStock}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleOpenEditProduct(product)} className="flex-1 py-2 rounded-md font-label text-sm text-on-primary bg-primary hover:bg-primary/90 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteMyProduct(product._id)} className="flex-1 py-2 rounded-md font-label text-sm text-on-error-container bg-error-container hover:bg-error/10 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "addProduct":
        return <AddProductPage />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-primary mb-6">My Account</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <div className="rounded-lg shadow-md overflow-hidden bg-surface-container-high">
              <div className="p-6 text-center border-b border-outline-variant">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 bg-secondary-container">
                  <span className="text-2xl text-on-secondary-container">{currentUser.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <h2 className="font-headline font-bold text-on-surface">{currentUser.name}</h2>
                <p className="text-sm text-on-surface-variant">{currentUser.email}</p>
              </div>
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors font-label text-sm ${
                      activeTab === tab.id 
                        ? "bg-secondary-container text-on-secondary-container" 
                        : "text-on-surface-variant hover:bg-surface-container-high"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto bg-surface-container-high">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-headline font-bold text-on-surface">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressFormChange}
                    className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none"
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Street Address *</label>
                  <div className="flex gap-2">
                    <input type="text" name="street" value={addressForm.street} onChange={handleAddressFormChange}
                      className="flex-1 px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none"
                      placeholder="123 Main Street, Apt 4" />
                    <button type="button" onClick={openMapModal}
                      className="px-3 py-2 rounded-md font-label text-sm text-on-primary bg-primary hover:bg-primary/90 whitespace-nowrap">
                      📍 Pick from Map
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">City *</label>
                    <input type="text" name="city" value={addressForm.city} onChange={handleAddressFormChange}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none"
                      placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">State *</label>
                    <input type="text" name="state" value={addressForm.state} onChange={handleAddressFormChange}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none"
                      placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">PIN Code *</label>
                    <input type="text" name="zipCode" value={addressForm.zipCode} onChange={handleAddressFormChange}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none"
                      placeholder="500001" />
                  </div>
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">Country</label>
                    <select name="country" value={addressForm.country} onChange={handleAddressFormChange}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none">
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Phone</label>
                  <input type="text" name="phone" value={addressForm.phone} onChange={handleAddressFormChange}
                    className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none"
                    placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Label</label>
                  <select name="label" value={addressForm.label} onChange={handleAddressFormChange}
                    className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none">
                    <option value="">None</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isMain" id="isMain" checked={addressForm.isMain} onChange={handleAddressFormChange} className="rounded accent-secondary" />
                  <label htmlFor="isMain" className="text-sm font-label text-on-surface-variant">Set as default address</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={savingAddress}
                    className="flex-1 bg-primary text-on-primary py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 font-label text-sm">
                    {savingAddress ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                  </button>
                  <button type="button" onClick={handleCloseModal}
                    className="flex-1 py-2 px-4 rounded-md font-label text-sm bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-lowest">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden bg-surface-container-high">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center">
              <h2 className="text-lg font-headline font-bold text-on-surface">
                Select Location from Map
              </h2>
              <button onClick={() => setShowMapModal(false)} className="text-on-surface-variant hover:text-on-surface">✕</button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={handleGetCurrentLocation} disabled={mapLoading}
                  className="px-4 py-2 rounded-md font-label text-sm text-on-primary bg-primary hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                  {mapLoading ? "Getting..." : "📍 Use Current Location"}
                </button>
                <p className="text-sm text-on-surface-variant">
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
                    className="px-4 py-2 rounded-md font-label text-sm text-on-primary bg-primary hover:bg-primary/90">
                    Confirm Location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto bg-surface-container-high">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-headline font-bold text-on-surface">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <button onClick={() => { setShowProductModal(false); resetProductForm(); }} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    {productImagePreview && <img src={productImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />}
                    <input type="file" accept="image/*" onChange={handleProductImageSelect} className="text-sm text-on-surface-variant" />
                    {uploadingProductImage && <div className="inline-flex justify-center items-center gap-1"><span className="dot-bounce bg-primary"></span><span className="dot-bounce delay-150 bg-primary"></span><span className="dot-bounce delay-300 bg-primary"></span></div>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Product Name *</label>
                  <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none" placeholder="Product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">Price (₹) *</label>
                    <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">Stock</label>
                    <input type="number" value={productForm.countInStock} onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">Brand</label>
                    <input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none" placeholder="Brand" />
                  </div>
                  <div>
                    <label className="block text-sm font-label text-on-surface-variant mb-1">Category</label>
                    <input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none" placeholder="Category" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-label text-on-surface-variant mb-1">Description *</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3}
                    className="w-full px-3 py-2 rounded-md bg-surface-container-highest text-on-surface outline outline-1 outline-primary/15 focus:outline-none" placeholder="Description" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={savingProduct}
                    className="flex-1 bg-primary text-on-primary py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 font-label text-sm">
                    {savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button type="button" onClick={() => { setShowProductModal(false); resetProductForm(); }}
                    className="flex-1 py-2 px-4 rounded-md font-label text-sm bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-lowest">
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