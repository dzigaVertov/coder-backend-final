import { purchaseService } from '../services/purchase.service.js';
import { cartRepository } from '../repositories/cartRepository.js';

export async function purchaseController(req, res, next) {
    let cartId = req.params.cid;

    try {
        const purchaseTicket = purchaseService.createPurchase(cartId);
        res.status(200).send(purchaseTicket);
    } catch (error) {
        next(error);
    }


}
