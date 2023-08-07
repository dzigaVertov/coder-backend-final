import { PERSISTENCIA } from '../config/database.config.js';

let usersDao;
let cartsDao;
let ticketDao;
if (PERSISTENCIA === 'mongoose') {
    const { usersDaoMongoose } = await import('../DAO/usersDaoMongoose.js');
    const { cartManagerMongo } = await import('../DAO/CartManagerMongo.js');
    const { ticketDaoMongoose } = await import('../DAO/ticketDaoMongoose.js');
    usersDao = usersDaoMongoose;
    cartsDao = cartManagerMongo;
    ticketDao = ticketDaoMongoose;
} else {
    throw new Error('Error de tipo de persistencia.  Opciones disponibles: mongoose');
}

export { usersDao, cartsDao, ticketDao };
