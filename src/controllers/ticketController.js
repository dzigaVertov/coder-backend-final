import { purchaseService } from '../services/purchase.service.js';

export async function getTicketHandler(req, res, next) {
    let cartId = req.params.cid || req.user.cart;
    try {
        const purchaseTicket = await purchaseService.createPurchase(cartId);
        console.log('ticket: ', purchaseTicket);
        res.render('ticket', {ticket: purchaseTicket});
    } catch (error) {
        next(error);
    }
}
