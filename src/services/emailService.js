import { createTransport } from 'nodemailer';
import { EMAIL_CONFIG } from '../config/email.config.js';
import { construirJwt } from './sessionServices.js';



class EmailService {
    #clienteNodemailer

    constructor(config) {
        this.#clienteNodemailer = createTransport(config);
    }

    async send(from, destinatario, subject, mensaje) {
        const mailOptions = {
            from: from,
            to: destinatario,
            subject: subject,
            html: mensaje
        };

        try {
            const info = await this.#clienteNodemailer.sendMail(mailOptions);
            return info;
        } catch (error) {
            throw error;
        }

    }

    async sendPwdReset(emailUsuario, jwt) {
        const mensaje = "Click en el link para establecer una nueva contraseña: \n\n";
        const baseUrl = '<a href="http://localhost:8080/resetPassword/?token=';
        const url = baseUrl + jwt + '"> Link de reset </a>\n\n';

        const mensajeCompleto = mensaje + url;
        // TODO: Construir mensaje de mail con URL que contiene token
        this.send("estaEmpresa", emailUsuario, "Password Reset", mensajeCompleto);


    }

}


export const emailService = new EmailService(EMAIL_CONFIG);
