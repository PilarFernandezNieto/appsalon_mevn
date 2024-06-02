import { sendEmailVerification } from "../emails/authEmailService.js";
import User from "../models/User.js";


const register = async (request, response) => {
    
// Valida todos los campos
  if (Object.values(request.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return response.status(400).json({
      msg: error.message
    });
  }
  // Evita registros duplicados
  const {email, password, name} = request.body
  const userExists = await User.findOne({email})
  if(userExists){
    const error = new Error("Usuario ya registrado");
    return response.status(400).json({
      msg: error.message
    });
  }

  // Valida la extensión del password
  const MIN_PASSWORD_LENGTH = 8
  if(password.trim().length < MIN_PASSWORD_LENGTH){
    const error = new Error(`El password debe contener ${MIN_PASSWORD_LENGTH} caracteres`);
    return response.status(400).json({
      msg: error.message
    });
  }

  // Hashear password



  try {

    const user = new User(request.body);
    const result = await user.save();
    sendEmailVerification();

    response.json({
      msg: "El usuario se creó correctamente. Revisa tu email"
    });

  } catch (error) {

    console.log(error);

  }
};
/** fin register */

export default register;
