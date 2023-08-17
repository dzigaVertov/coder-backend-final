const botonComprar = document.querySelector('#comprarCarrito');
const botonVaciar = document.querySelector('#vaciarCarrito');

if (botonComprar instanceof HTMLButtonElement) {
    botonComprar.addEventListener('click', comprarCarrito);
}

if (botonVaciar instanceof HTMLButtonElement) {
    botonVaciar.addEventListener('click', vaciarCarrito);
}

async function comprarCarrito(event) {
    window.location.href = '/ticket';
}

async function vaciarCarrito(event) {
    const { status } = await fetch('/api/carts/vaciarcarrito', { method: 'DELETE' });

    if (status === 200) {
        console.log('aca');
        alert('Carrito vaciado');
        window.location.href = '/products';
    }
}
