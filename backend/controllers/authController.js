import User from "../models/User.js";
import { sendEmailVerification } from "../emails/authEmailService.js";

const register = async (request, response) => {
  // Valida que estén todos los campos
  if (Object.values(request.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return response.status(400).json({
      msg: error.message
    });
  }

  const { name, email, password } = request.body;

  // Evitar registros duplicados
  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new Error("Usuario ya registrado");
    return response.status(400).json({
      msg: error.message
    });
  }

  // Validar la extensión del passwowrd

  const MIN_PASSWORD_LENGTH = 8;
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(`El password debe contener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    return response.status(400).json({
      msg: error.message
    });
  }

  try {
    const user = new User(request.body);
    const result = await user.save();

    const { name, email, token } = result;
    sendEmailVerification({ name, email, token });

    response.json({
      msg: "El usuario se creó correctamente. Revisa tu email"
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyAccount = async (request, response) => {
  const { token } = request.params;
  // const user = await User.findOne({token: token}) - Se pasa el objeto con clave - valor pero como tienen el mismo nombre se simplifica
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Hubo un error. Token no válido");
    response.status(401).json({
      msg: error.message
    });
  }
  // Si el token es válido, confirmamos la cuenta
  try {
    user.verified = true
    user.token = ""
    await user.save()
    response.json({msg: "Usuario confirmado correctamente"})

  } catch (error) {
    console.log(error);
  }
};

const login = async (request, response) => {
 // Revisar que el usuario exista

 const { email, password } = request.body
 const user = await User.findOne({email})

 if (!user) {
  const error = new Error("El usuario no existe");
  response.status(401).json({
    msg: error.message
  });
}

 // Revisar que si el usuario confirmó su cuenta
 if(!user.verified){
  const error = new Error("Tu cuenta no ha sido confirmada aún");
  response.status(401).json({
    msg: error.message
  });
 }

 // Comprobar el password
 if(await user.checkPassword(password)){
response.json({
  msg: "Usuario autenticado"
})

 } else {
  const error = new Error("El password es incorrecto");
  response.status(401).json({
    msg: error.message
  });
 }

  
}

export { register, verifyAccount, login };
