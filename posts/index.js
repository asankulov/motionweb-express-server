const express = require('express');

const { Post } = require('../db');
const { permission } = require('../auth/permission');

const router = express.Router();
router.get(
  '/posts',
  async (request, response) => {
    // let { minVotes, isPaid, hashtags } = request.query;

    // isPaid = isPaid === 'false' ? false : Boolean(isPaid);
    console.log(request.user);

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
  }
);

router.get('/posts/:id', permission('basic'), async (request, response) => {
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

router.post('/posts', permission('advanced'), async (request, response) => {
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

router.put('/posts/:id', permission('advanced'), async (request, response) => {
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

router.patch('/posts/:id', permission('advanced'), async (request, response) => {
  try {
    await Post.updateOne(
      { _id: request.params.id },
      {
        $sett: {
          ...request.body,
        },
      },
    );
  } catch (error) {
    console.log(error);
  }

  response.sendStatus(200);
});

router.delete('/posts/:id', permission('advanced'), async (request, response) => {
  const { id } = request.params;
  await Post.deleteOne({ _id: id });

  response.sendStatus(200);
});

module.exports = router;
