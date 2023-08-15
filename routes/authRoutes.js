import express from "express";
import { register, login, updateUser, getCurrentUser, logoutUser } from "../controler/authControler.js";
import authenticatedUser from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateuser").patch(authenticatedUser, updateUser);
router.route("/getcurrentuser").get(authenticatedUser, getCurrentUser)
router.route("/logoutuser").get(logoutUser)

export default router;
