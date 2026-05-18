import { jest } from '@jest/globals';
import { CreateUserController } from './create-user.js';
import { faker } from '@faker-js/faker';
import { EmailAlreadyInUseError } from '../../errors/user.js';


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
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(201);
       expect(httpResponse.body).toBe(httpRequest.body);
    });

    it('should return 400 if first_name is missing', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if last_name is missing', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if email is missing', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if email is invalid', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: 'invalid-email',
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });
    it('should return 400 if password is less than 6 characters', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 5
            })
        }
       };

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct parameters', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const executeSpy = jest.spyOn(createUserUseCase, 'execute');
       await createUserController.execute(httpRequest);

       expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
       expect(executeSpy).toHaveBeenCalledTimes(1);
    });
    it('should return 500 if CreateUserUseCase throws', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
       };

       const executeSpy = jest.spyOn(createUserUseCase, 'execute');
       executeSpy.mockRejectedValue(new Error('Database error'));
       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(500);
    });

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
      const createUserUseCase = new CreateUserUseCaseStub();
       const createUserController = new CreateUserController(createUserUseCase);

       const httpRequest = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
       };

       jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
        throw new EmailAlreadyInUseError(httpRequest.body.email);
       });

       const httpResponse = await createUserController.execute(httpRequest);

       expect(httpResponse.statusCode).toBe(400);
    });
});
