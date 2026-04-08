import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    street,
    city,
    state,
    zipCode,
    country,
    phone,
    isMain = false,
    label,
    deliveryInstructions,
  } = req.body;

  const errors = [];

  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }
  if (!street || street.trim().length < 5) {
    errors.push("Street address must be at least 5 characters");
  }
  if (!city || city.trim().length < 2) {
    errors.push("City must be at least 2 characters");
  }
  if (!state || state.trim().length < 2) {
    errors.push("State is required");
  }
  
  const zipTrimmed = zipCode?.trim() || "";
  
  if (!zipTrimmed || !/^\d{6}$/.test(zipTrimmed)) {
    errors.push("Please enter a valid 6-digit PIN code (e.g., 500001)");
  }
  if (phone && phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(phone.trim())) {
    errors.push("Please enter a valid phone number");
  }

  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors.join(", "));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const newAddress = {
    fullName: fullName.trim(),
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    zipCode: zipCode.trim(),
    country: country?.trim() || "United States",
    phone: phone?.trim() || "",
    isMain: Boolean(isMain),
    label: label || null,
    deliveryInstructions: deliveryInstructions?.trim() || null,
  };

  if (newAddress.isMain) {
    user.address.forEach((addr) => {
      addr.isMain = false;
    });
  } else if (user.address.length === 0) {
    newAddress.isMain = true;
  }

  user.address.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    addresses: user.address,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const {
    fullName,
    street,
    city,
    state,
    zipCode,
    country,
    phone,
    isMain,
    label,
    deliveryInstructions,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400);
    throw new Error("Invalid address ID");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (fullName !== undefined) {
    if (fullName.trim().length < 2) {
      res.status(400);
      throw new Error("Full name must be at least 2 characters");
    }
    user.address[addressIndex].fullName = fullName.trim();
  }

  if (street !== undefined) {
    if (street.trim().length < 5) {
      res.status(400);
      throw new Error("Street address must be at least 5 characters");
    }
    user.address[addressIndex].street = street.trim();
  }

  if (city !== undefined) {
    if (city.trim().length < 2) {
      res.status(400);
      throw new Error("City must be at least 2 characters");
    }
    user.address[addressIndex].city = city.trim();
  }

  if (state !== undefined) {
    if (state.trim().length < 2) {
      res.status(400);
      throw new Error("State is required");
    }
    user.address[addressIndex].state = state.trim();
  }

  if (zipCode !== undefined) {
    if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      res.status(400);
      throw new Error("Please enter a valid ZIP code");
    }
    user.address[addressIndex].zipCode = zipCode.trim();
  }

  if (country !== undefined) {
    user.address[addressIndex].country = country.trim();
  }

  if (phone !== undefined) {
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      res.status(400);
      throw new Error("Please enter a valid phone number");
    }
    user.address[addressIndex].phone = phone.trim();
  }

  if (label !== undefined) {
    const validLabels = ["Home", "Work", "Other", null];
    user.address[addressIndex].label = validLabels.includes(label) ? label : null;
  }

  if (deliveryInstructions !== undefined) {
    user.address[addressIndex].deliveryInstructions = deliveryInstructions?.trim() || null;
  }

  if (isMain !== undefined) {
    const setAsMain = Boolean(isMain);
    if (setAsMain) {
      user.address.forEach((addr) => {
        addr.isMain = false;
      });
    }
    user.address[addressIndex].isMain = setAsMain;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    addresses: user.address,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400);
    throw new Error("Invalid address ID");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  const wasMainAddress = user.address[addressIndex].isMain;

  user.address.splice(addressIndex, 1);

  if (wasMainAddress && user.address.length > 0) {
    user.address[0].isMain = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
    addresses: user.address,
  });
});

const setMainAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400);
    throw new Error("Invalid address ID");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  user.address.forEach((addr) => {
    addr.isMain = false;
  });

  user.address[addressIndex].isMain = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Default address set successfully",
    addresses: user.address,
  });
});

const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("address");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    addresses: user.address,
  });
});

const getMainAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("address");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const mainAddress = user.address.find((addr) => addr.isMain);

  if (!mainAddress) {
    res.status(404);
    throw new Error("No default address found");
  }

  res.status(200).json({
    success: true,
    address: mainAddress,
  });
});

export {
  addAddress,
  updateAddress,
  deleteAddress,
  setMainAddress,
  getAddresses,
  getMainAddress,
};