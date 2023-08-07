import { NODE_ENV } from '../config/servidor.config.js';

export function getHandler(req, res, next) {
    const tipoLog = req.params.tipoLog;
    const levels = ['fatal', 'error', 'warning', 'info', 'http', 'debug'];
    if (levels.includes(tipoLog)) {
        const mensaje = `Log de nivel ${tipoLog} generado en LoggerTest en entorno ${NODE_ENV} - ${new Date().toLocaleTimeString()}`;

        req.logger[tipoLog](mensaje);
        res.json({ mensaje: mensaje });
    } else {
        const mensaje = `Log de nivel info generado en LoggerTest en entorno ${NODE_ENV} - ${new Date().toLocaleTimeString()}`;
        req.logger.info(mensaje);

        res.json({ mensaje: mensaje });
    }
}
