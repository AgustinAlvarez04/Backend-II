import Product from "../daos/mongo/classes/product.dao.js";

import ProductRepository from "../repositories/product.repository.js";

const productService = new ProductRepository(new Product());

export const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts();
    res.status(200).json({ message: "Product list", product: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.getProductById(id);
    if (!result)
      return res.status(404).json({ error: "Product Not Found" });
    res.status(200).json({ message: "Product Found", product: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const newProduct = { name, price, stock, description };
    const result = await productService.createProduct(newProduct);
    res.status(201).json({ message: "Successfully created product", product: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;
    const updateData = { name, price, stock, description };
    const updatedProduct = await productService.updateProduct(id, updateData);
    if (!updatedProduct)
      return res.status(404).json({ message: "Product Not Found" });
      res.json({ message: "Product successfully updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product Not Found" });
    res.json({ message: "Product successfully removed" });
    
  } catch (error) {
    res.status(500).json({ message: "Error removing product", error: error.message });
  }
};
