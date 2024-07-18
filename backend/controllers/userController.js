import Appointment from "../models/Appointment.js";

const getUserAppointments = async (request, response) => {
    const {user} = request.params
    const role = "user"

    if(user !== request.user._id.toString() && role !=="admin"){
        const error = new Error("Acceso Denegado")
        return response.status(400).json({ msg: error.message })
    }

    // Trae las citas filtradas por fecha futura
    // No trae las fechas a pasado
    try {
        const appointments = await Appointment.find({
            user,
            date: {
                $gte: new Date()
            }
        }).populate("services").sort({date: "asc"})

        response.json(appointments)
    } catch (error) {
        console.log(error);
    }
    
}

export {
    getUserAppointments
}