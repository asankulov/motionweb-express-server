const express = require('express');
const authRoutes = require('./auth/routes');
const postRouter = require('./posts');

const {isAuthenticated} = require('./auth/auth');

const app = express();

app.set('view engine', 'pug');

app.use((request, response, next) => {
  // console.log('Request: ', request.method, request.url, '=', response.statusCode);
  response.on('finish', () => {
    console.log('Request: ', request.method, request.url, '=', response.statusCode);
  });

  next();
});

app.use(express.json());

app.use(authRoutes);
app.use(isAuthenticated, postRouter);

// app.use((request, response, next) => {
//   const authPassword = request.headers['auth-password'];
//   if (authPassword === 'motionweb') {
//     return next();
//   }
//
//   throw new Error('Unauthorized!');
// });

// example json body parser middleware
// app.use((request, response, next) => {
//   if (request.headers['content-type'] === 'application/json') {
//     request.body = JSON.parse(request.rawBody);
//   }
//
//   throw new Error('Unauthorized!');
// });


app.get('/', (request, response) => {
  response.render(
    'index',
    { title: 'Pug template', message: 'Hello, Pug!' }
  );
});

// app.use((error, request, response, next) => {
//   console.log('Error: ', error);
//
//   response.sendStatus(404);
// });

app.listen(3000, () => {
  console.log('Http server started on port 3000');
});

