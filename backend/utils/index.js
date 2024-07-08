import mongoose from "mongoose";
import jwt from "jsonwebtoken"

function validateObjectId(id, response) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("El id no es válido");
    return response.status(400).json({
      msg: error.message,
    });
  }
}

function handleNotFoundError(message, response) {
  const error = new Error(message);
  return response.status(404).json({
    msg: error.message,
  });
}

const uniqueID = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

const generateJWT = (id) => {
  const token = jwt.sign({id}, process.env.JWT_SECRET,{
    expiresIn: '30d'
  })
  return token
  
}




export { 
  validateObjectId, 
  handleNotFoundError, 
  uniqueID,
  generateJWT
 };
