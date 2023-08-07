const serverSocket = io('http://localhost:8080/');

const listaMensajes = `
<h1>Generado desde chat.js en public/js</h1>
{{#if hayMensajes }}
<ul class='listaMensajes'>
    {{#each mensajes}}
    <li class='mensaje'>{{#each this}}
      <p>{{@key}}: {{this}}</p>
      {{/each}}
    </li>
    {{/each}}
</ul>
{{else}}
<p>no hay mensajes...</p>
{{/if}}
`;

const plantilla = Handlebars.compile(listaMensajes);

serverSocket.on('actualizacionMensajes', mensajes => {
    const contenedor = document.querySelector('#contenedorMensajes');
    if (contenedor) {
        contenedor.innerHTML = plantilla({ mensajes, hayMensajes: (mensajes.length >0) });
    }
});

const form = document.getElementById('formulario');
form.addEventListener('submit', nuevoMensaje);

function nuevoMensaje(event) {
    event.preventDefault();
    const campos = {};

    [...event.target.elements]
        .filter(el=>el.type !=='submit')
        .map(el=> campos[el.name]=el.value);
    
    serverSocket.emit('nuevoMensaje', campos);
}
