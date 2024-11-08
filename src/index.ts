import express from 'express';
import authHandler from './auth/handler';
import linkHandler from './links/handler';
import { validateInput } from './middlewares/validateInput';
import { userCreateSchema } from './auth/schema';
import { linksCreateSchema, linkUpdateSchema } from './links/schema';
import validateUser from './middlewares/validateUser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';

const app = express();
configDotenv()

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    credentials: true,
    origin: getAllowedOrigin()
  }
));

app.post('/api/signup', validateInput(userCreateSchema), authHandler.create);
app.post('/api/signin', validateInput(userCreateSchema), authHandler.login);
app.get('/api/refresh', authHandler.refresh)
app.get('/api/links/:username', linkHandler.index);
app.use(validateUser);
app.post('/api/links', validateInput(linksCreateSchema), linkHandler.create);
app.put('/api/links/:id', validateInput(linkUpdateSchema), linkHandler.update);
app.delete('/api/links/:id', linkHandler.destroy);
app.get('/api/links/:username/:id', linkHandler.show);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`),
);

function getAllowedOrigin() {
  if (process.env.NODE_ENV !== "development") {
    return [process.env.CLIENT_HOST] as string[]
  }

  const allowedOriginRaw = process.env.ALLOWED_ORIGIN as string
  if (!allowedOriginRaw) {
    return [process.env.CLIENT_HOST] as string[]
  }

  return allowedOriginRaw.split(',').map((origin) => origin)
}

export default app;

