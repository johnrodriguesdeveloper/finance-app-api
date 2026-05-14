import { CreateUserController } from './create-user.js';

describe('Create User Controller', () => {
     class CreateUserUseCaseStub {
      execute(user){
        return user;
      }
     }
  
    it('should create a user', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: 'John', 
            last_name: 'Doe',   
            email: 'john.doe@example.com',
            password: 'password123'
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(201);
       expect(httpResponse.body).toBe(httpRequest.body);
    });
});