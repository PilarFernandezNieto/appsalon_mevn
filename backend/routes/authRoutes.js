import express from "express"
import {register, verifyAccount, login, forgotPassword,verifyPasswordResetToken, updatePassword, user, admin} from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router()

// http://localhost:4000/api/auth/register
// http://localhost:4000/api/auth/verify/1i2771blar0dfmgpvsco
// http://localhost:4000/api/auth/login
// http://localhost:4000/api/auth/user


// Rutas de autenticación y registro de usuarios
router.post("/register", register)
router.get("/verify/:token", verifyAccount)
router.post("/login", login),
router.post("/forgot-password", forgotPassword),
router.route("/forgot-password/:token")
    .get(verifyPasswordResetToken)
    .post(updatePassword)

// Area privada - Requiere JWT
router.get("/user", authMiddleware, user)
router.get("/admin", authMiddleware, admin)




export default router