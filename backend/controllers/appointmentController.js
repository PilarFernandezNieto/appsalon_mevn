import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import Appointment from "../models/Appointment.js";
import { validateObjectId, handleNotFoundError, formatDate } from "../utils/index.js";
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailCancelledAppointment } from "../emails/appointmentsEmailService.js";

const createAppointment = async (request, response) => {
  const appointment = request.body;
  appointment.user = request.user._id.toString();

  try {
    const newAppointment = new Appointment(appointment);
    const result = await newAppointment.save();

    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time
    });
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

const getAppointmentsById = async (request, response) => {
  const { id } = request.params;

  //Validar ObjectId
  if (validateObjectId(id, response)) return;

  // Validar que la cita exista
  const appointment = await Appointment.findById(id).populate("services");
  if (!appointment) {
    return handleNotFoundError("La cita no existe", response);
  }

  if (appointment.user.toString() !== request.user.id.toString()) {
    const error = new Error("No tiene los persmisos");
    return response.status(400).json({ msg: error.message });
  }

  // Retornar la cita
  response.json(appointment);
};

const updateAppointment = async (request, response) => {
  const { id } = request.params;

  //Validar ObjectId
  if (validateObjectId(id, response)) return;

  // Validar que la cita exista
  const appointment = await Appointment.findById(id).populate("services");
  if (!appointment) {
    return handleNotFoundError("La cita no existe", response);
  }

  if (appointment.user.toString() !== request.user.id.toString()) {
    const error = new Error("No tiene los persmisos");
    return response.status(400).json({ msg: error.message });
  }
  const { date, time, totalAmount, services } = request.body;
  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;

  try {
    const result = await appointment.save();
    await sendEmailUpdateAppointment({
      date: formatDate(result.date),
      time: result.time
    });
    response.json({ msg: "Cita actualizada correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const deleteAppointment = async (request, response) => {
  const { id } = request.params;

  //Validar ObjectId
  if (validateObjectId(id, response)) return;

  // Validar que la cita exista
  const appointment = await Appointment.findById(id).populate("services");
  if (!appointment) {
    return handleNotFoundError("La cita no existe", response);
  }

  if (appointment.user.toString() !== request.user.id.toString()) {
    const error = new Error("No tiene los permisos");
    return response.status(400).json({ msg: error.message });
  }
  try {
    const result = await appointment.deleteOne();

    await sendEmailCancelledAppointment({
      date: formatDate(appointment.date),
      time: appointment.time
    });

    response.json({ msg: "Cita eliminada con éxito" });
  } catch (error) {}
};

export { createAppointment, getAppointmentsByDate, getAppointmentsById, updateAppointment, deleteAppointment };
