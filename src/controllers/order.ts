import { Request, Response } from "express";
import Order from "../models/Order";

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(orders);
  } catch (error: unknown) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { coinId, pair, type, amount, price, fullname, paymentMethod } = req.body;

    if (!coinId || !pair || !type || !amount || !price || !fullname || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await Order.create({
      coinId,
      pair,
      type,
      amount,
      price,
      fullname,
      paymentMethod,
      status: "Pending",
    });

    return res.status(201).json(order);
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    return res.json({ message: "Order cancelled successfully", order });
  } catch (error: unknown) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
