import express from "express";
import { createAppointment, getAppointmentsByDate, getAppointmentsById, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

//http://localhost:4000/api/appointments

router.route("/")
    .post(authMiddleware, createAppointment)
    .get(authMiddleware, getAppointmentsByDate)

//http://localhost:4000/api/appointments/668d617ba50ddf6863041a89
router.route("/:id")
    .get(authMiddleware, getAppointmentsById)
    .put(authMiddleware, updateAppointment)
    .delete(authMiddleware, deleteAppointment)


export default router