# API de Chistes y Operaciones Matemáticas

Esta aplicación Node.js utiliza Express para crear una API que proporciona chistes aleatorios y realiza operaciones matemáticas simples. A continuación, se presenta una descripción simplificada del archivo `app.js`.

## Configuración

La aplicación utiliza los siguientes paquetes:

- `express` para la creación de la API.
- `swagger-ui-express` para la documentación de la API.
- `mongoose` para la conexión y operaciones con la base de datos MongoDB.
- `axios` para realizar solicitudes HTTP.
- `config` para la configuración de la aplicación.
- `Chiste` para el modelo de datos de chistes.
- `helpers` para funciones de ayuda, como el cálculo del Mínimo Común Múltiplo (MCM).

## Ejecución del Proyecto

### Instalación de Dependencias

Antes de ejecutar el proyecto, asegúrate de instalar las dependencias utilizando el siguiente comando:

```bash
npm install
```

### Configuración de la Base de Datos

La aplicación utiliza MongoDB como base de datos. Asegúrate de tener un servidor MongoDB en ejecución y configura la conexión en el archivo `config.js`.

### Ejecución de la Aplicación

Para iniciar la aplicación, utiliza el siguiente comando:

```bash
npm start
```

La aplicación se ejecutará en el puerto especificado en el archivo `app.js` o en el puerto 3000 por defecto.

### Documentación de la API

Una vez que la aplicación esté en funcionamiento, puedes acceder a la documentación de la API en `/api-docs` en tu navegador.

### Ejecución de Pruebas

Se incluyen pruebas automatizadas utilizando Chai y chai-http. Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

Asegúrate de que la aplicación esté en ejecución antes de ejecutar las pruebas. Las pruebas verificarán los endpoints de la API y proporcionarán información detallada sobre su funcionamiento.

Consulta la documentación completa para obtener detalles sobre los endpoints y cómo probar la API.
