const formularioRegistro = document.getElementById('formularioRegistro');

if (formularioRegistro instanceof HTMLFormElement) {
    formularioRegistro.addEventListener('submit', nuevoUsuario);
}

async function nuevoUsuario(event) {
    event.preventDefault();

    const first_name = document.querySelector('#first_name');
    const last_name = document.querySelector('#last_name');
    const email = document.querySelector('#email');
    const age = document.querySelector('#age');
    const password = document.querySelector('#password');

    const datosUsuario = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        age: age.value,
        password: password.value
    }

    const { status } = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(datosUsuario),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (status === 201) {
        window.location.href = '/profile'
    } else {
        console.log('[login] estado inesperado: ' + status)
    }
}
