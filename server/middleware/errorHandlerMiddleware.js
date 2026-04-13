const userFriendlyMessages = {
  "Invalid email or password": "The email or password you entered is incorrect. Please try again.",
  "Please provide email and password": "Please enter both your email and password to sign in.",
  "Please provide name, email, and password": "Please fill in all the required fields: name, email, and password.",
  "User already exists": "An account with this email already exists. Try signing in instead.",
  "Your account is not verified. Please check your email and click the verification link to activate your account. If you haven't received the email, please try to register again to get a new verification link.": "Your account isn't active yet. Check your email for a verification link, or register again to get a new one.",
  "Please provide email": "Please enter your email address.",
  "Please provide new password": "Please enter a new password.",
  "Invalid or expired reset token": "This password reset link has expired or is invalid. Please request a new one.",
  "Invalid verification link": "This verification link has expired or is invalid. Please register again to get a new one.",
  "Invalid or expired verification link": "This verification link has expired or is invalid. Please register again to get a new one.",
  "User not found": "We couldn't find an account with that email. Please check and try again.",
  "Email could not be sent": "We couldn't send the email. Please try again in a few minutes.",
  "Product not found": "This product is no longer available.",
  "No products found under this category": "No products found in this category.",
  "Category parameter is required": "Please select a category.",
  "You can only update your own products": "You can only edit products that you created.",
  "You can only delete your own products": "You can only delete products that you created.",
  "Product already reviewed": "You've already reviewed this product.",
  "Please upload an image": "Please upload a product image.",
  "Cloudinary not configured": "Image upload service is temporarily unavailable. Please try again later.",
  "Failed to upload image:": "We couldn't upload your image. Please try again.",
  "No order items": "Your cart is empty. Add some products first.",
  "Order not found": "We couldn't find this order.",
  "Not authorized": "You're not authorized to perform this action.",
  "Please provide an email address": "Please enter a valid email address.",
  "This email is already subscribed to our newsletter": "This email is already subscribed to our newsletter.",
  "This email is not subscribed to our newsletter": "This email is not subscribed to our newsletter.",
  "Invalid product ID": "Something went wrong. Please try again.",
  "Product already in favorites": "This product is already in your favorites.",
  "Product not found in favorites": "This product is not in your favorites.",
  "Invalid quantity": "Please enter a valid quantity.",
  "Cart item not found": "This item is no longer in your cart.",
  "Invalid address ID": "Something went wrong. Please try again.",
  "Full name must be at least 2 characters": "Please enter your full name (at least 2 characters).",
  "Street address must be at least 5 characters": "Please enter a complete street address.",
  "City must be at least 2 characters": "Please enter a valid city name.",
  "State is required": "Please select a state.",
  "Please enter a valid ZIP code": "Please enter a valid ZIP code.",
  "Please enter a valid phone number": "Please enter a valid phone number.",
  "No default address found": "No default address found. Please add an address.",
  "Failed to create payment order": "Payment failed. Please try again.",
  "Invalid payment signature": "Payment verification failed. Please try again.",
  "Invalid user data": "Something went wrong. Please try again.",
};

const getUserFriendlyMessage = (errorMessage) => {
  if (userFriendlyMessages[errorMessage]) {
    return userFriendlyMessages[errorMessage];
  }
  
  for (const key of Object.keys(userFriendlyMessages)) {
    if (errorMessage.includes(key) || key.includes(errorMessage)) {
      return userFriendlyMessages[key];
    }
  }
  
  return "Something went wrong. Please try again.";
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  const userMessage = getUserFriendlyMessage(err.message);

  res.json({
    message: userMessage,
    originalMessage: err.message,
    errors: err.errors || undefined,
  });
};

export { notFound, errorHandler };
