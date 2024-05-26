import mongoose from "mongoose"

export const db = async () => {
    try {
        const db = await mongoose.connect("mongodb+srv://root:XoM0lYLILvO1WTsp@cluster0.ebgeewz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log('Se conectó correctamente');
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1)
    }

    
}