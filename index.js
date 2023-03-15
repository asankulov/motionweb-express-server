const express = require('express');

const { Post } = require('./db');

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

app.get('/posts', async (request, response) => {
  // let { minVotes, isPaid, hashtags } = request.query;

  // isPaid = isPaid === 'false' ? false : Boolean(isPaid);

  const posts = await Post
    .find(
      {
        /*$and: [
          // { votes: { $gte: Number(minVotes) } },
          { isPaid },
          { hashtags: { $all: hashtags } },
        ],*/
      },
      { __v: 0 },
    )
    .limit(50)
    .skip(0)
    .sort({ votes: -1, createdAt: -1 });
  // 1, 2, 3, 4, 5 = 1 A-Z a-z
  // 5, 4, 3, 2, 1 = -1 Z-A z-a
  response.render('index', {
    title: 'Posts page',
    posts: posts.map((post) => ({ ...post.toJSON(), link: '/posts/' + post._id })),
  });

  // response.json(posts);
});

app.get('/posts/:id', async (request, response) => {
  const id = request.params.id;
  const post = await Post.findById(id, { __v: 0 });

  response.render(
    'post',
    {
      title: post.title,
      text: post.text,
      hashtags: post.hashtags,
    },
  );

  // response.json(post);
});

app.post('/posts', async (request, response) => {
  try {
    await Post.create({
      title: request.body.title,
      text: request.body.text,
      isPaid: Boolean(request.body.isPaid),
      hashtags: request.body.hashtags,
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

app.patch('/posts/:id', async (request, response) => {
  await Post.updateOne(
    { _id: request.params.id },
    {
      $set: {
        ...request.body,
      },
    },
  )

  response.sendStatus(200);
});

app.delete('/posts/:id', async (request, response) => {
  const { id } = request.params;
  await Post.deleteOne({ _id: id });

  response.sendStatus(200);
});

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

