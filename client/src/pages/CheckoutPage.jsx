import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GetCartItems, GetAddresses, AddOrder, CreatePaymentOrder, VerifyPayment, DeleteCartItems } from "../Api";
import { getUserFromCookie } from "../utils/cookie.js";
import toast from "react-hot-toast";

const CheckoutPage = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [step, setStep] = useState(1);
  
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const currentUser = getUserFromCookie();
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
    loadRazorpay();
  }, [token, navigate]);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        GetCartItems(token),
        GetAddresses(token)
      ]);
      if (cartRes.status === 200) {
        setCartItems(cartRes.data || []);
        calculateSubtotal(cartRes.data || []);
      }
      if (addressRes.status === 200) {
        const addrList = addressRes.data?.addresses || addressRes.data || [];
        setAddresses(addrList);
        const mainAddr = addrList.find(a => a.isMain);
        if (mainAddr) setSelectedAddressId(mainAddr._id);
      }
    } catch (err) {
      toast.error("Failed to load data");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.priceAtAddition * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
  };

  const validateAddress = () => {
    if (useNewAddress) {
      const { fullName, street, city, state, zipCode, phone } = shippingAddress;
      return fullName && street && city && state && zipCode && phone;
    }
    return selectedAddressId;
  };

  const getSelectedAddress = () => {
    if (useNewAddress) {
      return shippingAddress;
    }
    return addresses.find(a => a._id === selectedAddressId);
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      toast.error("Please select or enter a shipping address");
      return;
    }

    setOrderProcessing(true);
    try {
      const addr = getSelectedAddress();
      
      if (paymentMethod === "card" && razorpayLoaded) {
        try {
          const orderRes = await CreatePaymentOrder(token, subtotal);
          const razorpayOrder = orderRes.data;

          const options = {
            key: razorpayOrder.keyId, 
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "ShopEase",
            description: "Order Payment",
            order_id: razorpayOrder.id,
            handler: async (response) => {
              try {
                const orderData = {
                  orderItems: cartItems.map(item => ({
                    productId: item.productId._id,
                    name: item.productId.name,
                    qty: item.quantity,
                    price: item.priceAtAddition,
                    image: item.productId.image
                  })),
                  shippingAddress: {
                    name: addr.fullName,
                    street: addr.street,
                    city: addr.city,
                    state: addr.state,
                    zipCode: addr.zipCode,
                    phone: addr.phone
                  },
                  paymentMethod: "card",
                  isPaid: true,
                  paidAt: new Date(),
                  itemsPrice: subtotal,
                  taxPrice: 0,
                  shippingPrice: 0,
                  totalPrice: subtotal
                };

                await AddOrder(token, orderData);
                await DeleteCartItems(token);
                await VerifyPayment(token, {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                toast.success("Order placed successfully!");
                navigate("/orders");
              } catch (err) {
                toast.error(err.response?.data?.message || "Payment verification failed");
              }
            },
            theme: {
              color: darkMode ? "#1f2937" : "#3b82f6"
            }
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to initiate payment");
        }
      } else {
        const orderData = {
          orderItems: cartItems.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            qty: item.quantity,
            price: item.priceAtAddition,
            image: item.productId.image
          })),
          shippingAddress: {
            name: addr.fullName,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            phone: addr.phone
          },
          paymentMethod: "cod",
          itemsPrice: subtotal,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: subtotal
        };

        await AddOrder(token, orderData);
        await DeleteCartItems(token);
        toast.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={`max-w-2xl mx-auto p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Your cart is empty</h2>
        <Link to="/shop" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>Checkout</h1>
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"}`}>1</div>
            <span className={`ml-2 ${step >= 1 ? darkMode ? "text-white" : "text-gray-800" : "text-gray-500"}`}>Address</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"}`}>2</div>
            <span className={`ml-2 ${step >= 2 ? darkMode ? "text-white" : "text-gray-800" : "text-gray-500"}`}>Payment</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"}`}>3</div>
            <span className={`ml-2 ${step >= 3 ? darkMode ? "text-white" : "text-gray-800" : "text-gray-500"}`}>Confirm</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {step === 1 && (
              <div className={`border rounded-lg p-6 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Shipping Address</h2>
                
                {addresses.length > 0 && (
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Saved Addresses</label>
                    <div className="space-y-2">
                      {addresses.map(addr => (
                        <label key={addr._id} className={`flex items-start p-3 border rounded-lg cursor-pointer ${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"} ${selectedAddressId === addr._id && !useNewAddress ? "border-blue-500 bg-blue-50" : ""}`}>
                          <input type="radio" name="savedAddress" checked={selectedAddressId === addr._id && !useNewAddress} onChange={() => handleAddressSelect(addr._id)} className="mt-1 mr-3" />
                          <div className="flex-1">
                            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{addr.fullName} {addr.isMain && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded ml-2">Default</span>}</p>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>📞 {addr.phone}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button onClick={() => { setUseNewAddress(true); setSelectedAddressId(null); }} className="mt-2 text-blue-500 text-sm hover:underline">+ Add New Address</button>
                  </div>
                )}

                {useNewAddress && addresses.length > 0 && (
                  <button onClick={() => setUseNewAddress(false)} className="mb-4 text-blue-500 text-sm hover:underline">← Back to saved addresses</button>
                )}

                {(addresses.length === 0 || useNewAddress) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
                      <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="John Doe" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Address</label>
                      <input type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="123 Main Street" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>City</label>
                      <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="Hyderabad" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>State</label>
                      <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="Telangana" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>PIN Code</label>
                      <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="500001" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Phone</label>
                      <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleAddressChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} placeholder="9876543210" />
                    </div>
                  </div>
                )}
                
                <button onClick={() => validateAddress() && setStep(2)}
                  className="w-full mt-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={`border rounded-lg p-6 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mr-3" />
                    <div>
                      <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Cash on Delivery</span>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mr-3" />
                    <div>
                      <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Online Payment</span>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Pay securely online</p>
                    </div>
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)} className={`flex-1 py-3 border font-medium rounded-md transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Continue to Review</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={`border rounded-lg p-6 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Review Order</h2>
                
                <div className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Shipping Address</h3>
                  {(() => {
                    const addr = getSelectedAddress();
                    return (
                      <>
                        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{addr?.fullName}</p>
                        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{addr?.street}</p>
                        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{addr?.city}, {addr?.state} - {addr?.zipCode}</p>
                        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>📞 {addr?.phone}</p>
                      </>
                    );
                  })()}
                </div>
                
                <div className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Payment Method</h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className={`font-medium mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>Order Items</h3>
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center mb-3">
                      <img src={item.productId?.image || "https://via.placeholder.com/60"} alt={item.productId?.name} className="w-16 h-16 object-cover rounded" />
                      <div className="ml-3 flex-1">
                        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{item.productId?.name}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Qty: {item.quantity}</p>
                      </div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>₹{(item.priceAtAddition * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(2)} className={`flex-1 py-3 border font-medium rounded-md transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>Back</button>
                  <button onClick={handlePlaceOrder} disabled={orderProcessing}
                    className="flex-1 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400">
                    {orderProcessing ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-80">
            <div className={`border rounded-lg p-6 shadow-sm sticky top-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center">
                    <img src={item.productId?.image || "https://via.placeholder.com/40"} alt={item.productId?.name} className="w-12 h-12 object-cover rounded" />
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-800"}`}>{item.productId?.name}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Qty: {item.quantity}</p>
                    </div>
                    <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>₹{(item.priceAtAddition * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Subtotal</span>
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Total</span>
                  <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;