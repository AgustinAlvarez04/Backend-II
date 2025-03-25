import { Router } from "express";
import { isAuth } from "../../middlewares/isAuth.js";
import { handlePolice } from "../../middlewares/handle-policies.js";
import { extractTokenFromCookies, extractTokenFromHeaders } from "../../utils/jwt.js";
import { loginUser, getUsers, getUserById, createUser, logout, getCurrentUser, recoverPass} from "../../controllers/user.controllers.js";

const router = Router();

router.get("/", getUsers);

router.post("/register", createUser);

router.post("/login" , loginUser);

router.get("/logout", logout); 

router.get("/private", isAuth, (req,res) => res.send("ruta privada"));

router.get("/:uid", handlePolice(["admin", "user"]), getUserById);

router.post("/current", getCurrentUser);

router.get("/recover", recoverPass)

router.get("/private-headers", extractTokenFromHeaders, (req,res, next) => {
    try{
        if(!req.user) throw new Error("No autorizado");
        return res.json(req.user);
    } catch (error){
        next(error);
    }
});

router.get("/private-cookies", extractTokenFromCookies, (req,res, next) => {
    try{
        if(!req.user) throw new Error("No autorizado");
        return res.json(req.user);
    } catch (error){
        next(error);
    }
});

export default router;
