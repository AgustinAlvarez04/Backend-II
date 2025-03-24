import { Router } from "express";
import passport from "passport";

import { authorizeUser } from "../../config/authMiddlware.js";
import { addToCart, purchaseCart, removeFromCart } from "../../controllers/cart.controllers.js";

const cartRoutes = Router();

cartRoutes.put("/", passport.authenticate("current", { session: false }), authorizeUser, addToCart);

cartRoutes.delete("/", passport.authenticate("current", { session: false }), authorizeUser, removeFromCart );

cartRoutes.post("/:cid/purchase", passport.authenticate("current", { session: false }), purchaseCart );

export default cartRoutes;
