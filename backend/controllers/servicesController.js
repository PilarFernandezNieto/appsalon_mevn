import Services from "../models/Services.js";
import { validateObjectId, handleNotFoundError } from "../utils/index.js";



const createService = async (request, response) => {
    
    // Validación
    console.log(Object.keys(request.body))
    if(Object.values(request.body).includes("")){
        const error = new Error("Todos los campos son obligatorios")

        return response.status(400).json({
            msg: error.message
        })
    }

    try {
        const service = new Services(request.body)
        const result = await service.save()

        response.json({
            msg: "El servicio se creo correctamente"
        })

    } catch (error) {
        console.log(error);
    }
}

const getServices = async (request, response) => {
    try {
        const services = await Services.find()
        response.json(services)
    } catch (error) {
        console.log(error);        
    }
  
};

const getServiceById = async (request, response) => {
    const {id} = request.params

  // Validar un ObjectId
  if(validateObjectId(id, response)) return

  // Validar que el id exista
  const service = await Services.findById(id)
  if(!service){
    return handleNotFoundError("El servicio no existe", response)
  }


  // Mostrar el servicio
  response.json(service)
    
}

const updateService = async (request, response) => {
    const {id} = request.params

  // Validar un ObjectId
  if(validateObjectId(id, response)) return
  
  // Validar que el id exista
  const service = await Services.findById(id)
  if(!service){
    return handleNotFoundError("El servicio no existe", response)
  }

    // Escribimos los valores nuevos
    service.name = request.body.name || service.name
    service.price = request.body.price || service.price

    try {
        await service.save()
        response.json({
            msg: "El servicio se actualizó correctamente"
        })
    } catch (error) {
        console.log(error);
    }

}

const deleteService = async(request, response) => {
    const {id} = request.params

    if(validateObjectId(id, response)) return

    const service = await Services.findById(id)
    if(!service){
      return handleNotFoundError("El servicio no existe", response)
    }
    try {
        await service.deleteOne()
        response.json({
            msg: "El servicio se eliminó correctamente"
        })
    } catch (error) {
        console.log(error);
    }
    
}

export {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
}