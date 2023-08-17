# El proyecto está alojado en:

-   <https://coder-backend-final-production.up.railway.app>


# Correr el servidor de forma local

-   Scripts para servidor local:

    ```bash
    npm run start:dev # corre el servidor con nodemon, se conecta a mongo en mongodb://127.0.0.1/ecommerceDev
    
    npm run start:test # levanta el servidor, se conecta a mongo en mongodb://127.0.0.1/ecommerceTest 
    
    npm run test # Corre los tests de las rutas de productos, sesiones, usuarios, carts.  Hace las peticiones al servidos anterior (levantado con npm run start:test)
    ```
