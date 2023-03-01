const express = require('express');

const app = express();

app.use(express.json());

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
  console.log(post);

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


// app.put();
// app.patch();
// app.delete();


app.listen(3000, () => {
  console.log('Http server started on port 3000');
});

