const express = require('express');
// const authRoutes = require('./auth/routes');
// const postRouter = require('./posts');

// const { isAuthenticated } = require('./auth/auth');


const app = express();

app.use('/assets', express.static('assets'));

app.set('view engine', 'pug');

app.use((request, response, next) => {
  // console.log('Request: ', request.method, request.url, '=', response.statusCode);
  response.on('finish', () => {
    console.log('Request: ', request.method, request.url, '=', response.statusCode);
  });

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(authRoutes);
// app.use(isAuthenticated, postRouter);

app.get('/', (request, response) => {
  response.render(
    'index',
    { title: 'Pug template', message: 'Hello, Pug!' }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Http server started on port 3000');
});

