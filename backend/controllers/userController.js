import Appointment from "../models/Appointment.js";

const getUserAppointments = async (request, response) => {
    const {user} = request.params
    const role = "user"

    if(user !== request.user._id.toString() && role !=="admin"){
        const error = new Error("Acceso Denegado")
        return response.status(400).json({ msg: error.message })
    }


    try {
        const appointments = await Appointment.find({
            user,
            date: {
                $gte: new Date()
            }
        }).populate("services")
        response.json(appointments)
    } catch (error) {
        console.log(error);
    }
    
}

export {
    getUserAppointments
}