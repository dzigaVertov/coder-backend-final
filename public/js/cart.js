const botonComprar = document.querySelector('#comprarCarrito');

if (botonComprar instanceof HTMLButtonElement) {
    botonComprar.addEventListener('click', comprarCarrito);
}

async function comprarCarrito(event) {
    window.location.href = '/ticket';
}
