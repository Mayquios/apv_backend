import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    fecha:{
        type: Date,
        require: true,
        default: Date.now()
    },
    sintomas:{
        type: String,
        require: true
    },
    // esto sirve cuando el veterianio crea el registro solo vera esa persona sus registros
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    },
    },
    {
    timestamps: true
    }
);

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;