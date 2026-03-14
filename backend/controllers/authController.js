import User from "../models/User.js";
import { sendEmailVerification, sendEmaiPasswordReset } from "../emails/authEmailService.js";
import { generateJWT, uniqueID } from "../utils/index.js";
import { response } from "express";

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
    user.verified = true;
    user.token = "";
    await user.save();
    response.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (request, response) => {
  // Revisar que el usuario exista

  const { email, password } = request.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe");
    return response.status(401).json({ msg: error.message });
  }

  // Revisar que si el usuario confirmó su cuenta
  if (!user.verified) {
    const error = new Error("Tu cuenta no ha sido confirmada aún");
    return response.status(401).json({ msg: error.message });
  }

  // Comprobar el password
  if (await user.checkPassword(password)) {
    const token = generateJWT(user._id);
    return response.json({ token });
  } else {
    const error = new Error("El password es incorrecto");
    return response.status(401).json({ msg: error.message });
  }
};

const forgotPassword = async (request, response) => {
  const { email } = request.body;

  // comprobar que el email existe
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe");
    return response.status(404).json({ msg: error.message });
  }
  try {
    user.token = uniqueID();
    const result = await user.save();
    await sendEmaiPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token
    });

    response.json({
      msg: "Hemos enviado un email con las instrucciones"
    });
  } catch (error) {
    console.log(error);
  }
};
const verifyPasswordResetToken = async (request, response) => {
  const { token } = request.params;
  const isValidToken = await User.findOne({ token });
  if (!isValidToken) {
    const error = new Error("Hubo un error. Token no válido");
    return response.status(400).json({
      msg: error.message
    });
  }
  response.json({
    msg: "Token válido"
  });
};
const updatePassword = async (request, response) => {
  const { token } = request.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Hubo un error. Token no válido");
    return response.status(400).json({
      msg: error.message
    });
  }
  const { password } = request.body;
  try {
    user.token = "";
    user.password = password;
    await user.save();
    response.json({
      msg: "Password modificado correctamente"
    });
  } catch (error) {
    console.log(error);
  }
};

const user = async (request, response) => {
  const { user } = request;

  response.json({
    user
  });
};
const admin = async (request, response) => {
  const { user } = request;

  if(!user.admin){
    const error = new Error("Acción no válida")
    return response.status(403).json({ 
      msg: error.message
    })
  }

  response.json({
    user
  });
};
export { register, verifyAccount, login, forgotPassword, verifyPasswordResetToken, updatePassword, user, admin };
