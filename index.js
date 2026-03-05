import express from 'express';
import 'dotenv/config.js'
import { CreateUserController } from './src/controllers/create-user.js';

const app = express();

app.use(express.json());

app.post('/api/users',async (req, res) => {
  const createUserController = new CreateUserController()
  
  const { statusCode,body} = await createUserController.execute(req)

  res.status(statusCode).json(body)
});

app.listen(8080, () =>
  console.log(`listening on port 8080`)
);
