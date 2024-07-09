import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (request, response, next) => {
  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
    // Sí hay token - validamos que sea válido
    try {
      const token = request.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Consultamos la base de datos con la información recibida y eliminamos de la consulta
      // campos que no necesitamos
      request.user = await User.findById(decoded.id).select("-password -verified -token -__v");

      next();
      
    } catch {
      const error = new Error("Token no válido");
      response.status(403).json({
        msg: error.message
      });
    }
  } else {
    // No hay token - lanzamos error
    const error = new Error("Token no válido o inexistente");
    response.status(403).json({
      msg: error.message
    });
  }
};

export default authMiddleware;
