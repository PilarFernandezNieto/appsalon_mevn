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

    const {name, email, token} = result;
   
    sendEmailVerification({name, email, token });

    response.json({
      msg: "El usuario se creó correctamente. Revisa tu email"
    });

  } catch (error) {

    console.log(error);

  }
};

const verifyAccount = async(request, response) =>{
  const {token} = request.params
  const user = await User.findOne({token})
  if(!user){
    const error = new Error("Hubo un error, token no válido");
    return response.status(401).json({
      msg: error.message
    })
  }

  try {
    user.verified = true
    user.token = ""
    await user.save()
    response.json({
      msg: "Usuario confirmado correctamente"
    })
    
  } catch (error) {
    console.log(error);
  }
  
}

const login = async (request, response) => {
  const {email, password} = request.body
  
  // Revisar que el usuario existe
  const user = await User.findOne({email})
  if(!user){
    const error = new Error("El usuario no existe")
    return response.status(401).json({
      msg: error.message
    })
  }
  if(!user.verified){
    const error = new Error("Tu cuenta todavía no ha sido confirmada")
    return response.status(401).json({
      msg: error.message
    })
  }
  if(await user.checkPassword(password)){
    response.json({
      msg: "Usuario autenticado"
    })

  } else {
    const error = new Error("El password es incorrecto")
    return response.status(401).json({
      msg: error.message
    })

  }
  
}

export {
  register,
  verifyAccount,
  login
}
