export function getLinksPaginacion(queryResult,baseUrl, category = 'all', sort = 'none', sortField = 'price') {
    let { hasPrevPage, hasNextPage, prevPage, nextPage, limit } = queryResult;

    let linkPrevPage = hasPrevPage ? (baseUrl + `?paginate=true&limit=${limit}&page=${prevPage}&category=${category}&sort=${sort}&sortField=${sortField}`) : null;
    let linkNextPage = hasNextPage ? (baseUrl + `?paginate=true&limit=${limit}&page=${nextPage}&category=${category}&sort=${sort}&sortField=${sortField}`) : null;

    return [linkPrevPage, linkNextPage];
}


