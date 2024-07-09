import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import Appointment from "../models/Appointment.js";

const createAppointment = async (request, response) => {
  const appointment = request.body;
  appointment.user = request.user._id.toString();

  try {
    const newAppointment = new Appointment(appointment);
    await newAppointment.save();
    response.json({
      msg: "Cita almacenada correctamente"
    });
  } catch (error) {
    console.log(error);
  }
};

const getAppointmentsByDate = async (request, response) => {
  const { date } = request.query;
  const newDate = parse(date, "dd/MM/yyyy", new Date());

  if (!isValid(newDate)) {
    const error = new Error("Fecha no válida");
    response.status(403).json({ msg: error.message });
  }
  const startDate = startOfDay(newDate);
  const endDate = endOfDay(newDate);
  const appointments = await Appointment.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).select("time");

  response.json(appointments);
};
export { createAppointment, getAppointmentsByDate };
