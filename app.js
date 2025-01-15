import express from 'express';
import { config } from 'dotenv';
import cors  from 'cors';
import conectarDB from './config/db.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from  './routes/pacienteRoutes.js';



//llamamos las variables de entorno
config();

//Llamamos a nuestro servidor web express q es nuestro framework q maneja http, rutas, etc.
const app = express();

//esto nos sirve para recibir los datos a consola de post
app.use(express.json());

//!Conexion a la base de datos
conectarDB();

//!habilitamos cors para que se puedan hacer peticiones desde cualquier origen

const dominiosPermitidos = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin,callback) {
        if(dominiosPermitidos.indexOf(origin) !==  -1) {
            callback(null, true)
        } else {
            callback(new Error('No se permite el acceso a este origen por CORS'))
        }
    }
};
app.use(cors(corsOptions));


// router para las consultas
//? Configuramos el servidor ejemplo http://localhost:4000/api/veterinarios
app.use('/api/veterinarios',veterinarioRoutes)
//? Configuramos el servidor ejemplo http://localhost:4000/api/pacientes
app.use('/api/pacientes',pacienteRoutes)

//* levantamos nuestro servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Servidor en el puerto: ${PORT}`);
})