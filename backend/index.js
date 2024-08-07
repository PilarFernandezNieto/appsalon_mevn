import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"

// Variables de entorno
dotenv.config();

// Configurar la aplicación
const app = express();

// Leer datos vía body
app.use(express.json())

// Conectar a base de datos
db();

// Configurar CORS
const whiteList = [process.env.FRONTEND_URL]


// Coloca en la lista de dominios permitidos la url de postman, que en este caso es undefined
if(process.argv[2] == '--postman'){
  whiteList.push(undefined)
 }

const corsOptions = {
  origin: function(origin, callback){
     if(whiteList.includes(origin)){
      // Permite la conexión
      // Parámetros: Mensaje de error - boolean para dar acceso
      callback(null, true)
    } else {
      // No permite la conexión
      callback(new Error("Error de Cors"))
    }
  }
}
app.use(cors(corsOptions));

// Definir una ruta
app.use("/api/services", servicesRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/users", usersRoutes)

// Definir puerto
const PORT = process.env.PORT || 4000;

// Arrancar la app
app.listen(PORT, () => {

  console.log(colors.blue("El servidor se está ejecutando en el puerto: "),colors.blue.bold(PORT));
});

