const formularioSendLink = document.getElementById('formularioSendLink');

if (formularioSendLink instanceof HTMLFormElement) {
    formularioSendLink.addEventListener('submit', sendLink);
}

async function sendLink(event) {
    event.preventDefault();

    const email = document.querySelector('#email');

    const datosUsuario = {
        email: email.value,
    }

    const {status} = await fetch('/api/users/sendlink', {
        method: 'POST',
        body: JSON.stringify(datosUsuario),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (status === 201) {
        window.location.href = '/login'
      } else {
        console.log('[login] estado inesperado: ' + status)
      }

    console.log(status);
}
