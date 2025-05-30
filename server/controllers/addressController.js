import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const addAddress = asyncHandler(async (req, res) => {
  const { street, city, state, zip, mainAddress = 0 } = req.body;
  const userId = req.user._id;

  if (!street || !city || !state || !zip) {
    res.status(400);
    throw new Error("All address fields are required");
  }

  const user = await User.findById(userId);

  const newAddress = {
    street,
    city,
    state,
    zip,
    mainAddress: Boolean(mainAddress),
  };

  if (newAddress.mainAddress) {
    user.address.forEach((addr) => {
      addr.mainAddress = false;
    });
  }

  user.address.push(newAddress);

  if (user.address.length === 1) {
    user.address[0].mainAddress = true;
  }

  const updatedUser = await user.save();

  res.status(201).json({
    message: "Address added successfully",
    addresses: updatedUser.address,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { street, city, state, zip, mainAddress } = req.body;
  const userId = req.user._id;
  const addressId = req.params.addressId;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400);
    throw new Error("Invalid address ID");
  }

  const user = await User.findById(userId);

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (street) user.address[addressIndex].street = street;
  if (city) user.address[addressIndex].city = city;
  if (state) user.address[addressIndex].state = state;
  if (zip) user.address[addressIndex].zip = zip;

  if (mainAddress !== undefined) {
    const setAsMain = Boolean(mainAddress);
    if (setAsMain) {
      user.address.forEach((addr) => {
        addr.mainAddress = false;
      });
    }

    user.address[addressIndex].mainAddress = setAsMain;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Address updated successfully",
    addresses: updatedUser.address,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400);
    throw new Error("Invalid address ID");
  }

  const user = await User.findById(userId);

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  const wasMainAddress = user.address[addressIndex].mainAddress;

  user.address.splice(addressIndex, 1);

  if (wasMainAddress && user.address.length > 0) {
    user.address[0].mainAddress = true;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Address deleted successfully",
    addresses: updatedUser.address,
  });
});

const setMainAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400);
    throw new Error("Invalid address ID");
  }

  const user = await User.findById(userId);

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  user.address.forEach((addr) => {
    addr.mainAddress = false;
  });

  user.address[addressIndex].mainAddress = true;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Main address set successfully",
    addresses: updatedUser.address,
  });
});

const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  res.status(200).json(user.address);
});

const getMainAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  const mainAddress = user.address.find((addr) => addr.mainAddress);

  if (!mainAddress) {
    res.status(404);
    throw new Error("No main address found");
  }

  res.status(200).json(mainAddress);
});

export {
  addAddress,
  updateAddress,
  deleteAddress,
  setMainAddress,
  getAddresses,
  getMainAddress,
};
