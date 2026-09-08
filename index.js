import express from 'express';
import { sequelize } from './src/config/database.js';

import userRouter from './src/modules/users/user.router.js';
import postRouter from './src/modules/posts/post.router.js';
import commentRouter from './src/modules/comments/comment.router.js';

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Sync Database & Start Server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected & synced successfully.');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});