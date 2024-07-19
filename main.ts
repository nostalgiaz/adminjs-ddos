import {PrismaClient} from '@prisma/client';
import {buildAdmin} from './admin.js';
import express from 'express';
import session from 'express-session';

const app = express();
const prisma = new PrismaClient();

app.use(
  session({
    secret: 'session-secret',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1d
    },
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(...buildAdmin(prisma));

app.get('/set-up', async (req, res) => {
  await prisma.testModel.create({
    data: {
      previewData: {
        'rows': [
          [['1'], ['name-1'], ['2'], ['name-2']],
          [['3'], ['name-3'], ['4'], ['name-4']],
        ],
      },
    },
  });
  res.send('ok');
});

app.listen(8080, async () => {
  console.log(`Server listening at http://localhost:8080`);
});

export default app;
