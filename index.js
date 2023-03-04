const express = require('express');

const app = express();

app.use(express.json());

app.use((request, response, next) => {
  console.log('Request: ', request.method, request.path);

  next();
});

app.use((request, response, next) => {
  const authPassword = request.headers['auth-password'];
  if (authPassword === 'motionweb') {
    return next();
  }

  throw new Error('Unauthorized!');
});

const posts = [
  {
    id: 1,
    title: 'Node.js programming language',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis.',
    createdDate: '2023-02-27',
  },
  {
    id: 2,
    title: '1st March events',
    text: 'Phasellus vel sapien consequat nunc convallis aliquam.',
    createdDate: '2023-03-01',
  },
];

app.get('/posts', (request, response) => {
  response.json(posts);
});

app.get('/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = posts.find((post) => post.id === id);

  response.json(post);
});

app.post('/posts', (request, response) => {
  posts.push({
    ...request.body,
    id: 3,
    createdDate: '2023-03-01',
  });

  response.sendStatus(200);
});

app.put('/posts/:id', (request, response) => {
  const id = Number(request.params.id);

  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return response.sendStatus(404);
  }

  posts[postIndex] = { ...request.body };

  response.sendStatus(200);
});

app.patch('/posts/:id', (request, response) => {
  const id = Number(request.params.id);

  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return response.sendStatus(404);
  }

  posts[postIndex] = { ...posts[postIndex], ...request.body };

  response.sendStatus(200);
});

app.delete('/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return response.sendStatus(404);
  }

  posts.splice(postIndex, 1);

  response.sendStatus(200);
});

app.use((error, request, response, next) => {
  console.log('Error: ', error);

  response.sendStatus(404);
});
app.listen(3000, () => {
  console.log('Http server started on port 3000');
});

