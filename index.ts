import express from 'express';
import userHandler from './users/handler';
import linkHandler from './links/handler'
import { validateInput } from './middlewares/validateInput';
import { userCreateSchema } from './users/schema';
import { linksCreateSchema } from './links/schema';

const app = express();

app.use(express.json());

app.post('/api/users', validateInput(userCreateSchema), userHandler.create);
app.post('/api/links', validateInput(linksCreateSchema), linkHandler.create);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`),
);
