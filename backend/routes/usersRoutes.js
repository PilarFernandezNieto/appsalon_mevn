import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { getUserAppointments } from "../controllers/userController.js"



const router = express.Router()

// http://localhost:4000/api/users/668af8602eedf9f1c11fc097/appointments

router.route("/:user/appointments")
    .get(authMiddleware, getUserAppointments)


export default router