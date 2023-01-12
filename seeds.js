import {faker} from '@faker-js/faker';
import {User, Post, Comment} from './models/index.js';
import {connectMongoose} from './config/index.js';
import * as dotenv from 'dotenv';

dotenv.config();

const USERS = [];
const POSTS = [];
const COMMENTS = [];

connectMongoose(process.env.MONGODB_URL);

(async () => {
  for (let i = 0; i < 10; ++i) {
    console.log(USERS);
    console.log(POSTS);
    await createRandomUser();
    await createRandomPost(i);
    await createRandomComment(i);
    await createRandomComment(i);
    await createRandomComment(i);
  };
})();

/**
 * Fake users
 * @return {shape}
 */
async function createRandomUser() {
  console.log('starting app');
  const user = new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });
  USERS.push(user);
  await user.save();
}

/**
 * Fake posts
 * @param {number} index Index
 * @return {shape}
 */
async function createRandomPost(index) {
  console.log('Creating post, current users:');
  console.log(USERS[index]);
  const post = new Post({
    title: faker.lorem.sentence(),
    text: faker.lorem.text(),
    author: USERS[index]._id,
    isPublished: true,
    likes: {
      count: index,
      users: USERS.map((user) => !user ? null : user._id),
    },
  });
  POSTS.push(post);
  await post.save();
}

/**
 * Fake comment
 * @param {number} index Index
 * @return {shape}
 */
async function createRandomComment(index) {
  const comment = new Comment({
    text: faker.lorem.sentence(),
    author: USERS[index]._id,
    post: POSTS[index]._id,
  });
  COMMENTS.push(comment);
  await comment.save();
}

