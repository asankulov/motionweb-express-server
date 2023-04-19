const express = require('express');

const { Post } = require('../db');
const { permission } = require('../auth/permission');
const { USER_ROLES } = require('../constants');
const { validate } = require('../middlewares');
const { postCreateSchema, postsQuerySchema } = require('../schemas');

const router = express.Router();
router.get(
  '/posts',
  validate(postsQuerySchema, 'query'),
  async (request, response) => {
    let { minVotes, isPaid, hashtags } = request.query;

    let query = {};

    if (typeof minVotes !== 'undefined') {
      Object.assign(query, { votes: { $gte: minVotes } });
    }

    if (typeof isPaid !== 'undefined') {
      Object.assign(query, { isPaid });
    }

    if (typeof hashtags !== 'undefined') {
      Object.assign(query, { hashtags: { $all: hashtags } });
    }

    const posts = await Post
      .find(
        query,
        { __v: 0 },
      )
      .limit(50)
      .skip(0)
      .sort({ votes: -1, createdAt: -1 });


    // response.render('index', {
    //   title: 'Posts page',
    //   posts: posts.map((post) => ({ ...post.toJSON(), link: '/posts/' + post._id })),
    // });

    response.json(posts);
  }
);

router.get('/posts/:id', async (request, response) => {
  const id = request.params.id;
  const post = await Post
    .findById(id, { __v: 0 })
    .populate('author', { email: 1, _id: 0 });

  // response.render(
  //   'post',
  //   {
  //     title: post.title,
  //     text: post.text,
  //     hashtags: post.hashtags,
  //   },
  // );

  response.json(post);
});

router.post(
  '/posts',
  permission(USER_ROLES.ADVANCED),
  validate(postCreateSchema),
  async (request, response) => {
  try {
    const { user } = request;
    console.log(user);

    await Post.create({
      title: request.body.title,
      text: request.body.text,
      isPaid: request.body.isPaid,
      hashtags: request.body.hashtags,
      author: user._id,
    });

    response.sendStatus(200);
  } catch (error) {
    response.status(400).json({
      message: 'Fields are invalid!',
    });
  }
}
);

router.put('/posts/:id', permission(USER_ROLES.ADVANCED), async (request, response) => {
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

router.patch('/posts/:id', permission(USER_ROLES.ADVANCED), async (request, response) => {
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

router.delete('/posts/:id', permission(USER_ROLES.ADVANCED), async (request, response) => {
  const { id } = request.params;
  await Post.deleteOne({ _id: id });

  response.sendStatus(200);
});

module.exports = router;
