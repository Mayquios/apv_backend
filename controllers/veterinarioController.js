// ! usar res.send = es para ver como una pagina algo asi, res.json = se ve como json mas backend podria decir
import Veterinario from "../models/veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import { Error } from "mongoose";
import generarId from "../helpers/generarId.js";
import emailRegistro  from "../helpers/emailRegistro.js";
import emailOlvidePassword  from "../helpers/emailOlvidePassword.js";


const registrar = async (req, res) => {
    const { email, nombre } = req.body;
    //prevenir si el usuario esta registrado con una busqueda
    const existeUsuario = await Veterinario.findOne({email})
    if (existeUsuario) {
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg:error.message})
    }

    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //! Enviar al email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error)
    }

};

const perfil = async (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Veterinario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no Valido')
        return res.status(404).json({msg:error.message})
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})
    if(!usuario){
        const error = new Error('Usuario no Existe')
        return res.status(404).json({msg:error.message})
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error ('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg:error.message})
    }

    // Revisar el Password via token para confirmar el registro
    if( await usuario.comprobarPassword(password)){
        //Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error ('El Password es incorrecto')
        return res.status(403).json({msg:error.message})
    }

};

const olvidePassword = async (req, res) => {
    const  { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error ('El usuario no existe');
        return res.status(400).json({msg:error.message})
    }
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //aca envia email con instrucciones para restablecer contraseña
        emailOlvidePassword ({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });


        res.json({msg: 'Se ha enviado un email con las instrucciones para restablecer'});
    } catch (error) {
        console.log(error)
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        //Token Valido existe el usuario
        //res.json({msg: 'Token Valido', usuario: tokenValido})  // con esto mostramos los datos de la persona
        res.json({msg: 'Token Valido el usuario existe'})
    } else {
        const error = new Error ('Token no Valido')
        return  res.status(400).json({msg:error.message})

    }
}

const nuevoPassword = async (req, res) => {
    const { token } =  req.params; // es la url
    const  { password } = req.body;  // eslo que el usuario escriba en los formularios

    const veterinario = await Veterinario.findOne({token})
    if (!veterinario){
        const error =  new Error ('Hubo un error')
        return res.status(400).json({msg:error.message})
    }
    try {
        veterinario.token = null; // eliminamos el token 
        veterinario.password = password; //  actualizamos el password
        await veterinario.save();  // actualizamos el usuario
        res.json({msg:  'Password Actualizado con exito'});
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        error = new Error('Veterinario no encontrado');
        return res.status(400).json({ msg: error.message });
    }
    const { email } = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('El email ya existe');
            return res.status(400).json({ msg: error.message });
        }
    }
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    //Primero leemos los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;
    //Comparamos que el veterianrio sea el mismo  q existe
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        error = new Error('Veterinario no encontrado');
        return res.status(400).json({ msg: error.message });
    }
    //comporbamos que el password actual sea correcto
    if(await veterinario.comprobarPassword(pwd_actual)){
        //actualizamos el password con el nuevo
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg:  'Password Actualizado con exito'});
    }else{
        const error = new Error('Password Incorrecto');
        return res.status(400).json({msg:error.message})
    }
    
}
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}