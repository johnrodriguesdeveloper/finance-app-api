import express from 'express';
import 'dotenv/config.js'
import { CreateUserController, GetUserByIdController, UpdateUserController, DeleteUserController, GetUserByIdUseCase } from './src/controllers/index.js';
import { GetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js';
import { CreateUserUseCase } from './src/use-cases/create-user.js';
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js';
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js';
import { UpdateUserRepository } from './src/repositories/postgres/update-user.js';
import { DeleteUserUseCase } from './src/use-cases/delete-user.js';
import { PostgresDeleteUser } from './src/repositories/postgres/delete-user.js';

const app = express();

app.use(express.json());

app.post('/api/users',async (req, res) => {
  const getUserByIdRepository = new GetUserByIdRepository()
  const createUserRepository = new PostgresCreateUserRepository()
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByIdRepository
  )
  const createUserController = new CreateUserController(createUserUseCase)
  
  const { statusCode,body} = await createUserController.execute(req)

  res.status(statusCode).json(body)
});

app.patch('/api/users/:userId', async (req, res) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const updateUserRepository = new UpdateUserRepository()
  const updateUserController = new UpdateUserController(getUserByEmailRepository, updateUserRepository)
  
  const { statusCode,body} = await updateUserController.execute(req)

  res.status(statusCode).json(body)
})

app.get('/api/users/:userId', async (req, res) => {

  const getUserByIdRepository = new GetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)


  const { statusCode,body} = await getUserByIdController.execute(req)

  res.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (req, res) => {
  const deleteUserRepository = new PostgresDeleteUser()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)
  
  const { statusCode,body} = await deleteUserController.execute(req)

  res.status(statusCode).json(body)
})

app.listen(8080, () =>
  console.log(`listening on port 8080`)
);
