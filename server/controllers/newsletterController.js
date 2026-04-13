import Newsletter from "../models/newsletterModel.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/emailService.js";

const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

  if (existingSubscriber) {
    if (!existingSubscriber.isActive) {
      // Reactivate subscription
      existingSubscriber.isActive = true;
      existingSubscriber.unsubscribedAt = undefined;
      await existingSubscriber.save();
      
      // Send welcome email
      try {
        await sendEmail(email, "Welcome back to ShopEase!", `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4F46E5;">ShopEase</h1>
            </div>
            <h2>Welcome Back!</h2>
            <p>Great news! You've been re-subscribed to the ShopEase newsletter.</p>
            <p>Stay tuned for exclusive offers, new arrivals, and special deals!</p>
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

      return res.status(200).json({ message: "You've been re-subscribed successfully!" });
    }
    
    res.status(400);
    throw new Error("This email is already subscribed to our newsletter");
  }

  const subscriber = await Newsletter.create({ email: email.toLowerCase() });

  // Send welcome email
  try {
    await sendEmail(email, "Welcome to ShopEase Newsletter!", `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4F46E5;">ShopEase</h1>
        </div>
        <h2>Welcome to ShopEase!</h2>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You're now part of our community and will receive:</p>
        <ul>
          <li>Exclusive offers and discounts</li>
          <li>New product announcements</li>
          <li>Special deals and promotions</li>
          <li>Early access to sales</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BASE_URL}/shop" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Start Shopping</a>
        </div>
        <p style="color: #666; font-size: 14px;">If you didn't subscribe, please ignore this email or contact us to unsubscribe.</p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
      </div>
    `);
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

  res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
});

const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

  if (!subscriber || !subscriber.isActive) {
    res.status(404);
    throw new Error("This email is not subscribed to our newsletter");
  }

  subscriber.isActive = false;
  subscriber.unsubscribedAt = Date.now();
  await subscriber.save();

  res.status(200).json({ message: "Successfully unsubscribed from the newsletter" });
});

const getAllSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });
  res.status(200).json(subscribers);
});

const getSubscriberCount = asyncHandler(async (req, res) => {
  const count = await Newsletter.countDocuments({ isActive: true });
  res.status(200).json({ count });
});

export { subscribeNewsletter, unsubscribeNewsletter, getAllSubscribers, getSubscriberCount };