import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/register", async (req, res) => {
	try {
		res.status(200).render("register", { title: "Registrar Producto"});
	} catch (error) {
		res.status(error.code || 500).send(`<h1>Error</h1><h2>${error.message}</h2>`);
	}
});


router.get("/", async (req, res) => {
	try {
		const products = await productManager.getAll();
		res.status(200).render("productos", { title: "Lista de Productos", products});
	} catch (error) {
		res.status(error.code || 500).send(`<h1>Error</h1><h2>${error.message}</h2>`);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const products = await productManager.getOneById(req.params.id);
		res.status(200).render("products", { title: "Producto", products });
	} catch (error) {
		res.status(error.code || 500).send(`<h1>Error</h1><h2>${error.message}</h2>`);
	}
});


export default router;
