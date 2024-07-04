import dotenv from "dotenv"
import colors from "colors"
import {db} from "../config/db.js"
import Services from "../models/Services.js"
import { services } from "./beautyServices.js"

dotenv.config() // Variables de entorno para la conexión a BBDD
await db()

async function seedDB() {
    try {
        await Services.insertMany(services)
        console.log(colors.green.bold('Se agregaron los datos correctamentte'));
        process.exit() // Finaliza el proceso sin errores (0 - sin errores / 1 - hubo errores y finaliza)
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

async function clearDB(){
    try {
        await Services.deleteMany()
        console.log(colors.red.bold('Se eliminaron los datos correctamentte'));
        process.exit() // Finaliza el proceso sin errores
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if(process.argv[2] === "--import"){
    seedDB()
} else {
    clearDB()
}
