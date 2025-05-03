import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      isReviewed: { type: Boolean, default: false },
    },
  ],
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Preparing",
      "Shipping",
      "Completed",
      "Canceled",
    ],
    default: "Pending",
  },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  recipientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
