import { Router } from "express";
import CartManager from "../../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
	try {
		const cartFound = await cartManager.getAll(req.query);
		res.status(200).json({ status: "success", payload: cartFound });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const cartFound = await cartManager.getOneById(req.params.id);
		res.status(200).json({ status: "success", payload: cartFound });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const cartCreated = await cartManager.insertOne(req.body);
		res.status(201).json({ status: "success", payload: cartCreated });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const cartUpdated = await cartManager.updateOneById(
			req.params.id,
			req.body
		);
		res.status(200).json({ status: true, payload: cartUpdated });
	} catch (error) {
		errorHandler(res, error.message);
	}
});

router.put("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid: productId } = req.params;
		const { quantity } = req.body;
		const cartCreated = await cartManager.addProductToCart(
			cid,
			productId,
			quantity ?? 1
		);
		res.status(200).json({ status: true, payload: cartCreated });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

router.delete("/:id/products/:pid", async (req, res) => {
	try {
		const { id, pid: productId } = req.params;
		const cartDeleted = await cartManager.deleteProductFromCart(
			id,
			productId,
			1
		);
		res.status(200).json({ status: true, payload: cartDeleted });
	} catch (error) {
		errorHandler(res, error.message);
	}
});

router.delete("/:id/products", async (req, res) => {
	try {
		const cartDeleted = await cartManager.deleteAllProductsFromCart(
			req.params.id
		);
		res.status(200).json({ status: true, payload: cartDeleted });
	} catch (error) {
		errorHandler(res, error.message);
	}
});

export default router;
