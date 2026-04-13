import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user
  const user = await User.findOne({ email }).select("+password");

  // Verify user exists and password matches
  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error("Your account is not verified. Please check your email and click the verification link to activate your account. If you haven't received the email, please try to register again to get a new verification link.");
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      }),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    if (userExists.isVerified) {
      res.status(400);
      throw new Error("User already exists");
    } else {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      userExists.verificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
      userExists.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;
      await userExists.save();

      const verifyUrl = `${process.env.BASE_URL}/verify-email/${verificationToken}`;
      await sendEmail(userExists.email, "ShopEase - Verify Your Email", `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5;">ShopEase</h1>
          </div>
          <h2>Verify Your Email</h2>
          <p>Hello ${userExists.name},</p>
          <p>Thank you for registering with ShopEase. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
        </div>
      `);

      return res.status(200).json({ 
        message: "Verification email sent. Please check your email to verify your account.",
        needsVerification: true 
      });
    }
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyUrl = `${process.env.BASE_URL}/verify-email/${verificationToken}`;
    try {
      await sendEmail(user.email, "ShopEase - Verify Your Email", `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5;">ShopEase</h1>
          </div>
          <h2>Verify Your Email</h2>
          <p>Hello ${user.name},</p>
          <p>Thank you for registering with ShopEase. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
        </div>
      `);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      needsVerification: true,
      isVerified: false,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail(user.email, "ShopEase - Password Reset Request", `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4F46E5;">ShopEase</h1>
        </div>
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #666; font-size: 14px;">This link expires in 30 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
      </div>
    `);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("Email could not be sent");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please provide new password");
  }

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    res.status(400);
    throw new Error("Invalid verification link");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification link");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpire = undefined;
  await user.save();

  try {
    await sendEmail(user.email, "Welcome to ShopEase!", `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4F46E5;">ShopEase</h1>
        </div>
        <h2>Welcome, ${user.name}!</h2>
        <p>Your email has been verified successfully!</p>
        <p>Now you can:</p>
        <ul>
          <li>Browse thousands of products</li>
          <li>Track your orders</li>
          <li>Save your favorite items</li>
          <li>Manage your addresses</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BASE_URL}/shop" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Start Shopping</a>
        </div>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
      </div>
    `);
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

  res.status(200).json({ message: "Email verified successfully! You can now login." });
});

export { authUser, registerUser, getUserProfile, forgotPassword, resetPassword, verifyEmail };
