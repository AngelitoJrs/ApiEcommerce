NanoStore Security - E-commerce con Stripe & JWT
NanoStore es una plataforma de comercio electrónico simplificada que prioriza la seguridad y la experiencia de usuario. Este proyecto demuestra la integración de una pasarela de pagos real (Stripe) con un sistema de autenticación basado en JSON Web Tokens (JWT) y persistencia de datos en MySQL.

🚀 Características Principales
Autenticación Robusta: Registro e inicio de sesión con contraseñas cifradas mediante bcryptjs y sesiones seguras con JWT.

Integración con Stripe: Flujo completo de Checkout, incluyendo gestión de pagos exitosos y cancelados.

Webhooks Seguros: Procesamiento automático de pedidos en la base de datos mediante validación de eventos firmados por Stripe.

Historial de Pedidos: Vista protegida con numeración correlativa (ROW_NUMBER()) para cada usuario.

Diseño Moderno: Interfaz responsiva y elegante construida con Tailwind CSS.

Validación de Datos: Uso de Joi para asegurar la integridad de la información en el registro.

🛠️ Tecnologías Utilizadas
Backend: Node.js, Express.

Base de Datos: MySQL.

Seguridad: JWT (JsonWebToken), bcryptjs, Joi.

Pagos: Stripe API & Stripe CLI.

Frontend: HTML5, JavaScript (ES6+), Tailwind CSS.

📦 Instalación y Configuración
Clonar el repositorio:

Bash

git clone https://github.com/AngelitoJrs/ApiEcommerce.git
cd ApiEcommerce
Instalar dependencias:

Bash

npm install
Configurar variables de entorno: Crea un archivo .env en la raíz y completa los siguientes campos:

Fragmento de código

DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=nanostore
JWT_SECRET=tu_clave_secreta_super_larga
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
Preparar la Base de Datos: Ejecuta el script SQL incluido (o crea las tablas users, products y orders).

Iniciar el servidor:

Bash

node server.js
💳 Cómo probar los pagos (Modo Test)
Inicia el Stripe CLI:

Bash

stripe listen --forward-to localhost:3000/webhook
Realiza una compra: Usa la tarjeta de prueba: 4242 4242 4242 4242.

Verificación: Al completar el pago, el Webhook procesará la orden y el estado cambiará automáticamente a "Completed".

🛡️ API Endpoints
🔓 Rutas Públicas
POST /register — Crea un nuevo usuario.

POST /login — Valida credenciales y genera el token de sesión.

GET /products — Obtiene el catálogo de productos disponibles.

POST /create-checkout-session — Inicia el proceso de pago en Stripe.

POST /webhook — Punto de entrada para las notificaciones de Stripe.

🔒 Rutas Protegidas
GET /my-orders — Recupera el historial de compras filtrado por el usuario del token. (Requiere encabezado Authorization: Bearer <token>).

🛠️ Próximas Mejoras
[ ] Implementar un carrito de compras multi-producto.

[ ] Panel de administración para gestión de stock.

[ ] Sistema de recuperación de contraseña vía Email.

[ ] Generación de facturas en PDF.

Desarrollado con ❤️ por Angel Gonzalez
