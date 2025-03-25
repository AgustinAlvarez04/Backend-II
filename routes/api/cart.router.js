import { Router } from "express";
import passport from "passport";

import { authorizeUser } from "../../config/authMiddlware.js";
import { addToCart, purchaseCart, removeFromCart } from "../../controllers/cart.controllers.js";

const router = Router();

router.put("/", passport.authenticate("current", { session: false }), authorizeUser, addToCart);

router.delete("/", passport.authenticate("current", { session: false }), authorizeUser, removeFromCart );

router.post("/:cid/purchase", passport.authenticate("current", { session: false }), purchaseCart );

export default router;
    