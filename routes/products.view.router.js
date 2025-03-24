import { Router } from "express";
import ProductDAO from "../daos/mongo/classes/product.dao.js";

const router = Router();
const productManager = new ProductDAO();

router.get("/register", async (req, res) => {
  try {
    res.status(200).render("register", { title: "Register Product" });
  } catch (error) {
    res
      .status(error.code || 500)
      .send(`<h1>Error</h1><h2>${error.message}</h2>`);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.status(200).render("productos", { title: "Product List", products });
  } catch (error) {
    res
      .status(error.code || 500)
      .send(`<h1>Error</h1><h2>${error.message}</h2>`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const products = await productManager.getOneById(req.params.id);
    res.status(200).render("products", { title: "Product", products });
  } catch (error) {
    res
      .status(error.code || 500)
      .send(`<h1>Error</h1><h2>${error.message}</h2>`);
  }
});

export default router;
