import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (user, order) => {
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small style="color: #666;">Qty: ${item.qty}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4F46E5; margin: 0;">ShopEase</h1>
        <p style="color: #666; margin: 5px 0;">Order Confirmation</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Order #${order._id.toString().slice(-8)}</h2>
        <p style="color: #666;">Dear <strong>${user.name}</strong>,</p>
        <p style="color: #666;">Thank you for your order! We've received your order and will start processing it shortly.</p>
      </div>

      <h3 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #4F46E5; color: white;">
            <th style="padding: 12px; text-align: left;">Product</th>
            <th style="padding: 12px; text-align: left;">Info</th>
            <th style="padding: 12px; text-align: right;">Price</th>
            <th style="padding: 12px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 10px; text-align: right;">₹${order.itemsPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;">Tax:</td>
            <td style="padding: 10px; text-align: right;">₹${order.taxPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;">Shipping:</td>
            <td style="padding: 10px; text-align: right;">₹${order.shippingPrice.toFixed(2)}</td>
          </tr>
          <tr style="background: #4F46E5; color: white;">
            <td colspan="3" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 12px; text-align: right;"><strong>₹${order.totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <h3 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Shipping Address</h3>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>${order.shippingAddress.fullName}</strong></p>
        <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
        <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}</p>
        <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
        <p style="margin: 5px 0;">📞 ${order.shippingAddress.phone || 'N/A'}</p>
      </div>

      <h3 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Payment Method</h3>
      <p style="background: #f9f9f9; padding: 10px; border-radius: 8px;">${order.paymentMethod}</p>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">You can track your order status at any time by visiting your account on ShopEase.</p>
        <a href="${process.env.BASE_URL}/orders" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 10px;">View Orders</a>
      </div>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
    </div>
  `;

  await sendEmail(user.email, `ShopEase - Order Confirmation #${order._id.toString().slice(-8)}`, html);
};

export const sendOrderStatusEmail = async (user, order, status) => {
  let statusMessage = "";
  let statusColor = "";

  switch (status) {
    case "Processing":
      statusMessage = "Your order is being processed and will be shipped soon.";
      statusColor = "#f59e0b";
      break;
    case "Shipped":
      statusMessage = "Your order has been shipped and is on its way.";
      statusColor = "#3b82f6";
      break;
    case "Delivered":
      statusMessage = "Your order has been delivered successfully!";
      statusColor = "#10b981";
      break;
    case "Cancelled":
      statusMessage = "Your order has been cancelled.";
      statusColor = "#ef4444";
      break;
    default:
      statusMessage = `Your order status has been updated to: ${status}`;
      statusColor = "#6b7280";
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4F46E5; margin: 0;">ShopEase</h1>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; margin-top: 0;">Order Update - ${status}</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>${statusMessage}</p>
        
        <div style="background: ${statusColor}20; border: 2px solid ${statusColor}; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order #:</strong> ${order._id.toString().slice(-8)}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
        </div>

        <a href="${process.env.BASE_URL}/orders/${order._id}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Order Details</a>
      </div>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; text-align: center;">© 2026 ShopEase. All rights reserved.</p>
    </div>
  `;

  await sendEmail(user.email, `ShopEase - Order #${order._id.toString().slice(-8)} - ${status}`, html);
};