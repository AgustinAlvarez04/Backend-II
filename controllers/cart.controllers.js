import Cart from "../daos/mongo/classes/cart.dao.js";
import Product from "../daos/mongo/classes/product.dao.js";
import User from "../daos/mongo/classes/user.dao.js";
import TicketModel from "../daos/mongo/models/ticket.model.js";

import { v4 as uuidv4 } from "uuid";

import UserRepository from "../repositories/user.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";

const cartService = new CartRepository(new Cart());
const userService = new UserRepository(new User());
const productService = new ProductRepository(new Product());

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({ message: "Cart Successfully Created", cart: newCart });
   } catch (error) {
    res.status(500).json({ message: "Error Creating Cart", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await userService.getUserById(req.user._id);

    if (!user || !user.cart) {
      return res.status(404).json({ message: "User Without Cart" })};
      const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" })};

    const updatedCart = await cartService.addToCart(
      user.cart._id,
      productId,
      quantity
    );

    res.json({ message: "Product Added to Cart", cart: updatedCart });

  } catch (error) {
    res.status(500).json({ message: "Error Adding To Cart", error: error.message });
  };
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await userService.getUserById(req.user._id);
    if (!user || !user.cart) {
      return res.status(404).json({ message: "User Without Cart" })};

    const cart = await cartService.getCartById(user.cart._id);
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" })};

    const updatedProducts = cart.products.filter(
      (item) => item.productId.toString() !== productId);

    if (updatedProducts.length === cart.products.length) {
      return res.status(404).json({ message: "Product not found" })};

    cart.products = updatedProducts;
    await cart.save();

    res.json({message: "Deleted Product",cart});
  
  } catch (error) {
    res.status(500).json({ message: "Error Delete Product", error: error.message });
  };
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" })};

    let totalAmount = 0;
    let productsToKeep = [];
    let unavailableProducts = [];

    for (const item of cart.products) {
      const product = await productService.getProductById(item.productId);

      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        await product.save();

      } else {
        unavailableProducts.push(item.productId);
        productsToKeep.push(item);
      }};

    if (totalAmount > 0) {
      const ticket = await TicketModel.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: req.user.email,
      });

      cart.products = productsToKeep;
      await cart.save();

      return res.json({
        message: "Successful purchase",
        ticket,
        remainingProducts: cart.products,
        unavailableProducts,
      });
      
    } else {
      return res.status(400).json({ message: "Without Stock", unavailableProducts })};

  } catch (error) {
    res.status(500).json({ message: "Purchase Error", error: error.message });
  };
};

