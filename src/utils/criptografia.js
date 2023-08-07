import { hashSync, compareSync } from 'bcrypt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_KEY} from '../config/auth.config.js';

export function hashear(password) {
    return hashSync(password, bcrypt.genSaltSync(10));
}

export function chequearPassword(aChequear, passHasheado) {
    return compareSync(aChequear, passHasheado);
}

export function encriptarJwt(user, options={}){
    return jwt.sign(user, JWT_KEY, options);
}
