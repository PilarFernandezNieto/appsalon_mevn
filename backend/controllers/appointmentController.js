import Appointment from "../models/Appointment.js"

const createAppointment = async (request, response) => {
    const appointment = request.body
    appointment.user = request.user._id.toString()
 

    try {
        const newAppointment = new Appointment(appointment)
        await newAppointment.save()
        response.json({
            msg: "Cita almacenada correctamente"
        })
    } catch (error) {
        console.log(error);
    }
}

export {
    createAppointment
}