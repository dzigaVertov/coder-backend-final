import { usersDao } from '../DAO/persistenciaFactory.js';
import Usuario from '../models/userModel.js';
import { BaseRepository } from './baseRepository.js';

export const usersRepository = new BaseRepository(usersDao, Usuario);
