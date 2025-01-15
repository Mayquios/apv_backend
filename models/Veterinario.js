import mongoose, { Types, version } from "mongoose";
import bcrypt from 'bcrypt'
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String, //este de tipo cadena
        require:true, //este es para validar en el servidor
        trim: true  // esto es para eliminar espacios despues de la palabra
    },
    password:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true, //esto es para que no se repitan los emails
        trim:true
    },
    telefono:{
        type:String,
        default:null, //se podria decir q no va tener nada o no es necesario
        trim:true
    },
    web:{
        type:String,
        default:null
    },
    token:{
        type:String,
        default: generarId(),
    },
    confirmado:{
        type:Boolean, //esto cuando se envia un email para validar
        default:false // esto sera para cuando la persona crea su cuenta
    }
});

//sirve para hashed pass
veterinarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function (
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;