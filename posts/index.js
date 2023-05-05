const express = require('express');

const { Post } = require('../db');
const { permission } = require('../auth/permission');
const { USER_ROLES } = require('../constants');
const { validate } = require('../middlewares');
const { postCreateSchema, postsQuerySchema } = require('../schemas');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemas:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id(mongodb ObjectId) of the post
 *         title:
 *           type: string
 *           description: The title of your post
 *         text:
 *           type: string
 *           description: The content of your post
 *         author:
 *           type: object
 *           description: The post author
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *         votes:
 *           type: integer
 *           description: The votes number of your post
 *         isPaid:
 *           type: boolean
 *           description: The flag which describes whether the post is commercial or not
 *         hashtags:
 *           type: array
 *           description: The array of hashtags
 *           items:
 *             type: string
 *         createdAt:
 *             type: string
 *             format: date
 *             description: The date the post was added
 *         updatedAt:
 *             type: string
 *             format: date
 *             description: The date the post was updated
 *       example:
 *         id: 643f8cdebb1bda8d845447f7
 *         title: The New Turing Omnibus
 *         text: Lorem Ipsum
 *         author: {
 *           email: motionweb@motionweb.online
 *         }
 *         isPaid: false
 *         votes: 10
 *         hashtags: [lorem, ipsum]
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */
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

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The posts managing API
 * /posts/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a post by id
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The found post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 *
 */
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

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *                 description: The title of your post
 *               text:
 *                 type: string
 *                 required: true
 *                 description: The content of your post
 *               isPaid:
 *                 type: boolean
 *                 description: The flag which describes whether the post is commercial or not
 *               hashtags:
 *                 type: array
 *                 description: The array of hashtags
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Some server error
 */
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
