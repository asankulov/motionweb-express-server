const express = require('express');

const { Post } = require('./db');

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

app.get('/posts', async (request, response) => {
  const posts = await Post.find({}, { __v: 0 });

  response.json(posts);
});

app.get('/posts/:id', async (request, response) => {
  const id = request.params.id;
  const post = await Post.findById(id, { __v: 0 });

  response.json(post);
});

app.post('/posts', async (request, response) => {
  try {
    await Post.create({
      title: request.body.title,
      content: request.body.text,
    });

    response.sendStatus(200);
  } catch (error) {
    response.status(400).json({
      message: 'Fields are invalid!',
    });
  }
});

app.put('/posts/:id', async (request, response) => {
  const { id } = request.params;

  await Post.updateOne(
    { _id: id },
    {
      title: request.body.title,
      text: request.body.text,
    },
  );


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

app.delete('/posts/:id', async (request, response) => {
  const { id } = request.params;
  await Post.deleteOne({ _id: id });

  response.sendStatus(200);
});

app.use((error, request, response, next) => {
  console.log('Error: ', error);

  response.sendStatus(404);
});

app.listen(3000, () => {
  console.log('Http server started on port 3000');
});

