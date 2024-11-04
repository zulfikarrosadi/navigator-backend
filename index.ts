import express from 'express';
import handler from './users/handler';
import { validateInput } from './middlewares/validateInput';
import { userCreateSchema } from './users/schema';

const app = express();

app.use(express.json());

app.post('/api/users', validateInput(userCreateSchema), handler.createUser);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`),
);
