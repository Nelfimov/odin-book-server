# Server side for Odin Book project

Small server side implementation of Odin Book, a project aiming at replicating Facebook functionality, mainly handling posts, commments, user authentication, friends system.

This project is inspired by [The Odin Project](https://theodinproject.com/).

It uses:

1. [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme) - for password encryption;
2. [dotenv](https://github.com/motdotla/dotenv#readme) - for sensitive info storage;
3. [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) and [PassportJS](https://www.passportjs.org/) - for authorization;
4. [Mongoose](https://mongoosejs.com/) - for database communication;
5. [Multer](https://github.com/expressjs/multer#readme) - for working with image uploads;

For its dev dependencies:

1. [MongoDB-memory-server](https://github.com/nodkz/mongodb-memory-server#readme) - temporary mongodb for testing;
2. [Supertest](https://github.com/ladjs/supertest#readme);

## Features

- Only authorized users can access;
- Users can create posts;
- Users can comment on others posts;
- Users can like others posts;
- Users can upload their profile picture;
