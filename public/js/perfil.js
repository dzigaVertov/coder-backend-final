const botonLogout = document.querySelector('#logout');

if (botonLogout instanceof HTMLButtonElement){
    botonLogout.addEventListener('click', desloguear);
}

async function desloguear(event){
    await fetch('/api/sessions/logout', {method:'POST'});
    document.location.href = '/login';
}
