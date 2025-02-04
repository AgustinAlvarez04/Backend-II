import { Router } from "express";
import userModel from "../models/user.model.js";

const router = Router();

//Endpoints
router.get("/", async (req, res) => {
    try {
        let users = await userModel.find()
        res.send({result: "success", payload: users})
    }
    catch (error){
        console.log(error)
    }
})

router.post("/", async (req, res) => {
    let {first_name, last_name,email} = req.body

    if(!first_name || !last_name || !email){
        res.send({ status: "error", error: "Faltan Parametros"})}

    let result = await userModel.create({ first_name, last_name, email})
    res.send({ result: "success", payload: result})
})

router.put("/:id", async (req, res) =>{
    let {id} = req.params
    let userToReplace = req.body

    if (!userToReplace.first_name || !userToReplace.last_name || !userToReplace.email) {
        res.send({ status: "error", error: "Parametros indefinidos"})}

    let result = await userModel.updateOne({ _id: id}, userToReplace)
    res.send({ result: "success", payload: result})
})

router.delete("/:id", async (req, res) => {
    let {id} = req.params
    let result = await userModel.deleteOne({ _id: id})
    res.send({ result: "success", payload: result})
})

export default router;