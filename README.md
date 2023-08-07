# Notas a esta entrega

-   Agregado logger de winston
-   Agregado endpoint de testeo de logger *loggerTest*:tipoMensaje


# Correr el servidor de forma local

-   Para iniciar el servidor:

    ```bash
    NODE_ENV="development" npm start mongoose # En modo desarrollo
    NODE_ENV="production" npm start mongoose # En modo producción
    ```

-   Iniciar el servidor con nodemon para desarrollo:

    ```bash
    NODE_ENV="development" npm test mongoose # En modo desarrollo
    NODE_ENV="production" npm test mongoose # En modo producción
    ```

-   El servidor intenta conectarse a una base de datos, por defecto en alguna de urls:

    ```bash
    mongodb://127.0.0.1:27017/ecommerce
    
    mongodb://localhost:27017/ecommerce
    ```

-   Se puede cambiar el string de conexión a la base de datos en

    ```bash
    src/config/mongoose.config.js   
    ```


# Notas a entregas anteriores

-   Roles y Factory

    -   Agregado modelo de Usuario separado de base de datos
    -   Agregado rol a modelo de Usuario
    -   Agregado Factory de Daos
    -   Agregados repositorios de Ticket y Carts
    -   

-   Arquitectura en capas

    -   Refactorización del código de rutas de API según separación en capas.
    -   Se agregan controladores en archivos separados.
    -   Se agregan repositorios de productos y usuarios como capa de abstracción entre controladores y DAOS.

-   Passport y JWT

    -   Ordenamiento de routers para limpieza general de servidor.js y mejoramiento de calidad de vida.
    -   Redirección a perfil luego de login exitoso
    -   Agregadas funciones de encriptado y desencriptado de JWT
    -   Agregado endpoint de logout para /api/sessions
    -   Agregada estrategia de Passport de JWT para autenticación
    -   Agregada estrategia Local de Passport para login con username y password
    -   Agregada creación de cookie para JWT
    -   Agregado extractor de cookie para JWT en Passport
    -   Agregada ruta '/current' en el router de /api/sessions que devuelve el usuario actual
    -   Agregado botón de logout a view de Perfil

-   Entrega de Session

    -   Agregado package express-session
    -   Agregado package connect-mongo para persistencia
    -   Agregado router de user para manejo de registro, login y perfil.
    -   Agregado router apiSession para manejo de sesión.
    -   Agregada vista de perfil
    -   Agregada vista de registro
    -   Agregada vista de login

-   Previously on Coder&#x2026;

    -   Instancia de modelo de productos exportado desde schemaProducto.js (antes se instanciaba en el manager de productos).
    -   Agregadas opciones de paginación a manager de productos
    -   Agregadas opciones de paginación al método get del router de productos por query params:
        -   /api/products?limit=5&page=2&sort=asc devuelve la segunda página de a cinco productos de la categoría ordenados por precio en forma ascendente por precio.
    -   Agregado formato de objeto que devuelve el método GET:
    
    ```js
    {
    	status:success/error
        payload: Resultado de los productos solicitados
        totalPages: Total de páginas
        prevPage: Página anterior
        nextPage: Página siguientekjnkjn
        page: Página actual
        hasPrevPage: Indicador para saber si la página previa existe
        hasNextPage: Indicador para saber si la página siguiente existe.
        prevLink: Link directo a la página previa (null si hasPrevPage=false)
        nextLink: Link directo a la página siguiente (null si hasNextPage=false)
    }
    
    ```
    
    -   Agregado parámetro de stock al get:
        -   ?stock=available devuelve productos con stock
        -   ?stock=unavailable devuelve productos sin stock
    
    -   Agregada la ruta de actualización de cantidad de producto en carrito: PUT api/carts/:cid/products/:pid
    
    -   Agregada la ruta para vaciar el carrito.
    
    -   Agregado populate de productos de carrito
    
    -   Agregados links de paginacion
    
    -   Agregada view de producto solo
    
    -   Agregado link a producto solo
    
    -   Agregado botón de agregar a carrito
    
    -   Agregado view de carrito


# Notas Generales

-   Rutas web

    -   La ruta raíz dirige a login si no hay sesión iniciada, o a vista de productos si ya hay sesion
    -   /login /register /profile para vistas de login, registro y perfil.
    -   /profile redirige a login si no hay sesión iniciada por el usuario.
    -   


# Organización del proyecto
