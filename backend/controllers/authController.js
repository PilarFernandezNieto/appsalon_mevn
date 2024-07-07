import User from "../models/User.js";

const register = async (request, response) => {

  // Valida que estén todos los campos
  if (Object.values(request.body).includes("")) {

    const error = new Error("Todos los campos son obligatorios");
    return response.status(400).json({
      msg: error.message
    });
  }

  const {name, email, password} = request.body

  // Evitar registros duplicados
  const userExist = await User.findOne({email})
  if(userExist){
    const error = new Error("Usuario ya registrado");
    return response.status(400).json({
      msg: error.message
    });
  }

  // Validar la extensión del passwowrd

  const MIN_PASSWORD_LENGTH = 8
  if(password.trim().length < MIN_PASSWORD_LENGTH){
    const error = new Error(`El password debe contener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    return response.status(400).json({
      msg: error.message
    });
  }

  try {
    const user = new User(request.body);
    await user.save();

    response.json({
      msg: "El usuario se creó correctamente. Revisa tu email"
    })
  } catch (error) {
    console.log(error);
  }
};

export { register };
