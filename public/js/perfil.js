const botonLogout = document.querySelector('#logout');
const botonProductos = document.querySelector('#aProductos');

if (botonLogout instanceof HTMLButtonElement) {
    botonLogout.addEventListener('click', desloguear);
}

if (botonProductos instanceof HTMLButtonElement) {
    botonProductos.addEventListener('click', aProductos);
}

async function desloguear(event) {
    await fetch('/api/sessions/logout', { method: 'POST' });
    document.location.href = '/login';
}

async function aProductos(event) {
    document.location.href = '/products';
}
