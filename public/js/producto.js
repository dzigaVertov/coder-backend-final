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
