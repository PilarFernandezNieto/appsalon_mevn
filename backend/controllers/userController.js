import Appointment from "../models/Appointment.js";

const getUserAppointments = async (request, response) => {
  const { user } = request.params;

  if (user !== request.user._id.toString()) {
    const error = new Error("Acceso Denegado");
    return response.status(400).json({ msg: error.message });
  }

  // Trae las citas filtradas por fecha futura
  // No trae las fechas a pasado
  try {
    const query = request.user.admin ? { date: { $gte: new Date() } } : { user, date: { $gte: new Date() } };
    const appointments = await Appointment.find(query)
        .populate("services")
        .populate({path: "user", select: "name email"}).sort({ date: "asc" });

    response.json(appointments);
  } catch (error) {
    console.log(error);
  }
};

export { getUserAppointments };
