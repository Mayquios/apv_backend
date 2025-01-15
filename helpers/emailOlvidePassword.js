import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos;

    //Enviar el email
    const info = await  transporter.sendMail({
        from: "Administrador de pacientes",
        to: email,
        subject: "Restablecer Contraseña",
        text: 'Restablece tu Contraseña',
        html: `
        <p> Hola ${nombre}, solicitaste reestablecer tu contraseña</p>
        <p> Click en el siguiente enlace para restablecer tu contraseña </p>
        <p><a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Restablecer Contraseña </a></p>
        <p>Si no creaste esta cuenta, ignora este mensaje</p>
        `
    });
    console.log('Mensaje enviado: %s', info.messageId);//esto mostrara en el servidor  el id del mensaje enviado


};

export default emailOlvidePassword;