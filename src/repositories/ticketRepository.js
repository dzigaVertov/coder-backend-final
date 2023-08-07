import { BaseRepository } from './baseRepository.js';
import {ticketDao} from '../DAO/persistenciaFactory.js';
import {Ticket} from '../models/ticket.js';


export const ticketRepository = new BaseRepository(ticketDao, Ticket);
