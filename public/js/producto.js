const botonProductos = document.querySelector('#aProductos');


if (botonProductos instanceof HTMLButtonElement) {
    botonProductos.addEventListener('click', aProductos);
}

async function aProductos(event) {
    document.location.href = '/products';
}


async function agregarCarrito(pid) {
    let pedido = `/api/users/addtocart/${pid}`;
    const { status } = await fetch(pedido, { method: 'POST' });


    if ([200, 201].includes(status)) {
        alert('Producto Agregado al carrito');
    }
    if (status === 401) {
        window.location.href = '/login';
    }


}
