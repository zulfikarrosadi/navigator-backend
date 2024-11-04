import express from 'express';
import userHandler from './users/handler';
import linkHandler from './links/handler'
import { validateInput } from './middlewares/validateInput';
import { userCreateSchema } from './users/schema';
import { linksCreateSchema } from './links/schema';
import validateUser from './middlewares/validateUser';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser())

app.post('/api/users', validateInput(userCreateSchema), userHandler.create);
app.post('/api/signin', validateInput(userCreateSchema), userHandler.login);
app.use(validateUser)
app.post('/api/links', validateInput(linksCreateSchema), linkHandler.create);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`),
);
