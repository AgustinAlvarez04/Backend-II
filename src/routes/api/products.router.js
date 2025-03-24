import { Router } from "express";
import passport from "passport";

import { createProduct, deleteProduct, updateProduct, getAllProducts, getProductById } from "../../controllers/product.controllers.js";

import { authorizeAdmin } from "../../config/authMiddlware.js";

const productsRoutes = Router();

productsRoutes.get("/", getAllProducts);

productsRoutes.get("/:id", getProductById);

productsRoutes.post("/", passport.authenticate("current", { session: false }), authorizeAdmin, createProduct );

productsRoutes.put("/:id", passport.authenticate("current", { session: false }), authorizeAdmin, updateProduct );

productsRoutes.delete("/:id", passport.authenticate("current", { session: false }), authorizeAdmin, deleteProduct );

export default productsRoutes;
