import { prodRepository } from "../repositories/productRepository.js";
import { productService } from "../services/ProductsService.js";
import { getLinksPaginacion } from "../utils/paginacion.js";

export async function getHandler(req, res, next) {
    try {
        const opcionesBusqueda = req.query;
        const queryReturn = await productService.obtenerListaProductos(opcionesBusqueda);

        let [linkPrevPage, linkNextPage] = getLinksPaginacion(queryReturn,req.baseUrl ,opcionesBusqueda?.category, opcionesBusqueda?.sort, opcionesBusqueda?.sortField);

        let renderInfo = {
            status: 'success',
            payload: queryReturn.docs,
            totalPages: queryReturn.totalPages,
            prevPage: queryReturn.prevPage,
            nextPage: queryReturn.nextPage,
            page: queryReturn.page,
            limit: queryReturn.limit,
            hasPrevPage: queryReturn.hasPrevPage,
            hasNextPage: queryReturn.hasNextPage,
            prevLink: linkPrevPage,
            nextLink: linkNextPage
        };

        res.render('home', renderInfo);
    } catch (error) {
        next(error);
    }
}

export async function getPidHandler(req, res, next) {
    const id = req.params.pid;

    try {
        const producto = await prodRepository.getProductById(id);
        res.render('producto', { producto });
    }
    catch (error) {
        next(error);
    }
}
