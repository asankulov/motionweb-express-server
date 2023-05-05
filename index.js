const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./auth/routes');
const postRouter = require('./posts');

const { isAuthenticated } = require('./auth/auth');


const app = express();

app.use('/assets', express.static('assets'));

app.set('view engine', 'pug');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Motionweb Express Server',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Motionweb',
        url: 'https://motionweb.com',
        email: 'info@motionweb.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
      {
        url: 'https://motionweb.online',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./posts/*.js', './auth/routes.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use((request, response, next) => {
  // console.log('Request: ', request.method, request.url, '=', response.statusCode);
  response.on('finish', () => {
    console.log('Request: ', request.method, request.url, '=', response.statusCode);
  });

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(isAuthenticated, postRouter);

app.get('/', (request, response) => {
  response.render(
    'index',
    { title: 'Pug template', message: 'Hello, Pug!' }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Http server started on port 3000');
});

