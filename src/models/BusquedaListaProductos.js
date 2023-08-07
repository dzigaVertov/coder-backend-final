import * as valid from '../utils/validacion.js';
import { InvalidArgumentError } from './errors/InvalidArgument.error.js';

export class BusquedaListaProductos {
    constructor({ paginate = false,
        limit = 10,
        page = 1,
        sort = 'none',
        category = 'all',
        stock = 'all',
        sortField = 'price' }) {
        limit = parseInt(limit);
        page = parseInt(page);
        if (paginate) {
            this.paginacion = {
                limit: valid.entero(valid.positivo(limit)),
                page: valid.entero(valid.positivo(page))
            };
        }
        this.sort = validarSort(sort);
        this.sortField = validarSortField(sortField);
        this.category = validarCategory(category);
        this.stock = validarStock(stock);
    }
}

function validarStock(stock) {
    const stockOptions = ['available', 'unavailable', 'all'];
    if (!stockOptions.includes(stock)) throw new InvalidArgumentError(`Invalid Stock: ${stock}`);
    return stock;
}

function validarCategory(category) {
    const categoryOptions = ['bebidas', 'computacion', 'frutas', 'muebles', 'all'];
    if (!categoryOptions.includes(category)) throw new InvalidArgumentError(`Invalid Category: ${category}`);

    return category;
}

function validarSort(sort) {
    const sortOptions = ['none', 'asc', 'desc'];
    if (!sortOptions.includes(sort)) throw new InvalidArgumentError(`Invalid Sort: ${sort}`);

    return sort;
}

function validarSortField(sortField) {
    const sortFieldOptions = ['price', 'category', 'title'];
    if (!sortFieldOptions.includes(sortField)) throw new InvalidArgumentError(`Invalid Sort Field: ${sortField}`);

    return sortField;
}
