import express from 'express';
import userHandler from './users/handler';
import linkHandler from './links/handler';
import { validateInput } from './middlewares/validateInput';
import { userCreateSchema } from './users/schema';
import { linksCreateSchema, linkUpdateSchema } from './links/schema';
import validateUser from './middlewares/validateUser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    credentials: true,
    origin: ['*']
  }
));

app.post('/api/signup', validateInput(userCreateSchema), userHandler.create);
app.post('/api/signin', validateInput(userCreateSchema), userHandler.login);
app.get('/api/links/:username', linkHandler.index);
app.use(validateUser);
app.post('/api/links', validateInput(linksCreateSchema), linkHandler.create);
app.put('/api/links/:id', validateInput(linkUpdateSchema), linkHandler.update);
app.delete('/api/links/:id', linkHandler.destroy);
app.get('/api/links/:username/:id', linkHandler.show);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`),
);

export default app;

