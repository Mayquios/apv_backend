import mongoose from "mongoose";

const conectarDB = async () => {
    const db = process.env.DB_MONGO
    try {
        await mongoose.connect(db)
        console.log('Conectado a la base de datos:  MongoDB');
    } catch (e) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;