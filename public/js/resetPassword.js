const formularioReset = document.querySelector('#formularioReset');

if (formularioReset instanceof HTMLFormElement) {
    formularioReset.addEventListener('submit', resetSubmit);
}

async function resetSubmit(event) {
    event.preventDefault();
    const pwd1 = document.querySelector('#inputPwd1');
    const pwd2 = document.querySelector('#inputPwd2');

    if (!(pwd1 instanceof HTMLInputElement) ||
        !(pwd2 instanceof HTMLInputElement) ||
        (pwd1.value !== pwd2.value)) {

        return
    };


    const { status } = await fetch('/api/users/newpassword', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: pwd1.value })
    });

    if ([200, 201].includes(status)) {
        window.location.href = '/login';
    }
    if (status === 400) {
        window.location.href = '/resetPassword?message=Debe elegir un password distinto';
    }

}

