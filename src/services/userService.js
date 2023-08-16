import { usersRepository } from '../repositories/userRepository.js';
import { construirJwt } from './sessionServices.js';
import Usuario from '../models/userModel.js';
import { emailService } from './emailService.js';
import { chequearPassword, hashear } from '../utils/criptografia.js';
import { RepeatedPasswordError } from '../models/errors/RepeatedPassword.error.js';
import { INACTIVE_USER_DELETE_TIME, PASSWORD_RESET_EXP_TIME } from '../config/auth.config.js';
import { logger } from '../utils/logger.js';
import { cartRepository } from '../repositories/cartRepository.js';
import { DatosConsultaUsuario } from '../models/dtos/DatosConsultaUsuario.js';
import { AuthenticationError } from '../models/errors/Authentication.error.js';

class UserService {

    async crearUsuario(datosUsuario) {
        datosUsuario.password = hashear(datosUsuario.password);
        const usuarioCreado = await usersRepository.create(datosUsuario);
        const cartUsuario = await cartRepository.create(usuarioCreado.id);
        const usuarioCompleto = await usersRepository.findOneAndUpdate({ id: usuarioCreado.id }, { cart: cartUsuario.id });

        return new DatosConsultaUsuario(usuarioCompleto);

    }

    async sendResetPassMail(email) {
        let datosUsuario = await usersRepository.readOne({ email: email });
        const options = { expiresIn: PASSWORD_RESET_EXP_TIME };
        let jwt = await construirJwt(datosUsuario, options);
        emailService.sendPwdReset(email, jwt);
    }

    async resetPassword(user, newPass) {
        if (chequearPassword(newPass, user.password)) {
            throw new RepeatedPasswordError('Password ya utilizado');
        }
        const newPassHasheado = hashear(newPass);
        const updated = await usersRepository.updateOne({ email: user.email }, { password: newPassHasheado });
        logger.debug('Password actualizado en UserService');
        return updated;
    }

    async actualizarUsuario(userId, camposAcambiar) {
        const userActualizado = await usersRepository.updateOne({ id: userId }, camposAcambiar);
        return userActualizado;
    }

    async loginUser(email, password) {
        const usuario = await usersRepository.readOne({ email: email });
        if (!usuario || !chequearPassword(password, usuario.password)) {
            throw new AuthenticationError('Error en el login');
        }
        const usuarioActualizado = await usersRepository.findOneAndUpdate({ email: email }, { lastActiveAt: new Date() });
        return usuarioActualizado;
    }


    async getAllUsers() {
        const users = await usersRepository.readMany({});
        const dtos = [];
        for (const user of users) {
            const domainUser = new Usuario(user);
            dtos.push(domainUser.dto());
        }

        return dtos;
    }

    async borrarInactivos() {
        const users = await usersRepository.readMany({});
        const usuariosAborrar = [];
        const ahora = new Date();

        for (const usr of users) {
            const transcurrido = ahora.getTime() - usr.lastActiveAt.getTime();

            if (transcurrido > INACTIVE_USER_DELETE_TIME) {
                usuariosAborrar.push(usr.id);
            }
        }

        if (usuariosAborrar.length) {
            const result = await usersRepository.deleteMany({ id: { $in: usuariosAborrar } });
            return result;
        }
        return null;
    }

}

export const userService = new UserService();

