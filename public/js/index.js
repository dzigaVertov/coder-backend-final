const serverSocket = io('http://localhost:8080/');

const listaProductos = `
<h1>Generado desde index.js en public/js</h1>
{{#if hayProductos }}
<ul class='lista'>
    {{#each productos}}
    <li class='card'>{{#each this}}
      <p>{{@key}}: {{this}}</p>
      {{/each}}
    </li>
    {{/each}}
</ul>
{{else}}
<p>no hay productos...</p>
{{/if}}
`;

const plantilla = Handlebars.compile(listaProductos);

serverSocket.on('actualizacion', productos => {
    const contenedor = document.querySelector('#contenedorLista');
    if (contenedor) {
        contenedor.innerHTML = plantilla({ productos, hayProductos: (productos.length>0) });
    }
});

serverSocket.on('errorProducto', message => alert(message));


const form = document.getElementById('formulario');
if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', nuevoProducto);
}


function nuevoProducto(event) {
    event.preventDefault();
    const formData = new FormData(form);
    formData.append("status", true);
    formData.append("stock", 200);
    formData.append("thumbnails", ["thumb-1", "thumb-2"]);
    
    const campos = {};
    formData.forEach((value, key) => (campos[key] = value));
    fetch('/api/products', {
        method : 'POST',
        body : JSON.stringify(campos),
        headers : {
            "Content-type": "application/json"
        }
    });
}
