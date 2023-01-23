import {faker} from '@faker-js/faker';
import {User, Post, Comment} from './models/index.js';
import {connectMongoose} from './config/index.js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User as IUser, Post as IPost } from './types/common/index.js';

dotenv.config();

const USERS: IUser[] = [];
const POSTS: IPost[] = [];
const COMMENTS = [];

connectMongoose(typeof process.env.MONGODB_URL === 'string' ? process.env.MONGODB_URL : '');

(async () => {
  for (let i = 0; i < 10; ++i) {
    await createRandomUser();
    await createRandomPost(i);
    await createRandomComment(i);
    await createRandomComment(i);
  }
})();

/**
 * Fake users
 */
async function createRandomUser() {
  console.log('starting app');
  const user = new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: await bcrypt.hashSync(
        faker.internet.password(), process.env.SALT,
    ),
  });
  USERS.push(user);
  await user.save();
}

/**
 * Fake posts
 */
async function createRandomPost(index: number) {
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
 */
async function createRandomComment(index: number) {
  const comment = new Comment({
    text: faker.lorem.sentence(),
    author: USERS[index]._id,
    post: POSTS[index]._id,
  });
  COMMENTS.push(comment);
  await comment.save();
}

