import { usersRepository } from '../repositories/userRepository.js';
import { construirJwt } from './sessionServices.js';
import Usuario from '../models/userModel.js';
import { emailService } from './emailService.js';
import { chequearPassword, hashear } from '../utils/criptografia.js';
import { RepeatedPasswordError } from '../models/errors/RepeatedPassword.error.js';
import { PASSWORD_RESET_EXP_TIME } from '../config/auth.config.js';
import { logger } from '../utils/logger.js';
import { cartRepository } from '../repositories/cartRepository.js';
import { DatosConsultaUsuario } from '../models/dtos/DatosConsultaUsuario.js';

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

    async getAllUsers() {
        const users = await usersRepository.readMany({});
        const dtos = [];
        for (const user of users) {
            const domainUser = new Usuario(user);
            dtos.push(domainUser.dto());
        }

        return dtos;
    }

}

export const userService = new UserService();

