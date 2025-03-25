import { Router } from "express";
import passport from "passport";

import { createProduct, deleteProduct, updateProduct, getAllProducts, getProductById } from "../../controllers/product.controllers.js";

import { authorizeAdmin } from "../../config/authMiddlware.js";

const router = Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", passport.authenticate("current", { session: false }), authorizeAdmin, createProduct );

router.put("/:id", passport.authenticate("current", { session: false }), authorizeAdmin, updateProduct );

router.delete("/:id", passport.authenticate("current", { session: false }), authorizeAdmin, deleteProduct );

export default router;
