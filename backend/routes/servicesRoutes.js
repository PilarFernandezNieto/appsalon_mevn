import express from "express"
import {createService, getServiceById, getServices, updateService, deleteService} from "../controllers/servicesController.js"

const router = express.Router();

// http://localhost:4000/api/services

router.route("/")
  .post(createService)
  .get(getServices)


// http://localhost:4000/api/services/6655f8822e0d371f009dbdb2
router.route("/:id")
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService)

export default router