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

     const makeSut = () => {
      const createUserUseCase = new CreateUserUseCaseStub();
      const createUserController = new CreateUserController(createUserUseCase);
      return {
        createUserUseCase,
        createUserController
      }
     }

     const httpRequestTemplate = {
        body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
     };
  
    it('should create a user', async () => {
      const { createUserController } = makeSut();

    

       const httpResponse = await createUserController.execute(httpRequestTemplate);

       expect(httpResponse.statusCode).toBe(201);
       expect(httpResponse.body).toBe(httpRequestTemplate.body);
    });

    it('should return 400 if first_name is missing', async () => {
      const { createUserController } = makeSut();

  

       const httpResponse = await createUserController.execute({...httpRequestTemplate, body: {...httpRequestTemplate.body, first_name: undefined}});

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if last_name is missing', async () => {
      const { createUserController } = makeSut();


       const httpResponse = await createUserController.execute({...httpRequestTemplate, body: {...httpRequestTemplate.body, last_name: undefined}});

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if email is missing', async () => {
      const { createUserController } = makeSut();

    

       const httpResponse = await createUserController.execute({...httpRequestTemplate, body: {...httpRequestTemplate.body, email: undefined}});

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if email is invalid', async () => {
      const { createUserController } = makeSut();

       const httpResponse = await createUserController.execute({...httpRequestTemplate, body: {...httpRequestTemplate.body, email: 'invalid-email'}});

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const { createUserController } = makeSut();

     

       const httpResponse = await createUserController.execute({...httpRequestTemplate, body: {...httpRequestTemplate.body, password: undefined}});

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const { createUserController } = makeSut();

       

       const httpResponse = await createUserController.execute({...httpRequestTemplate, body: {...httpRequestTemplate.body, password: faker.internet.password({length: 5})}});

       expect(httpResponse.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct parameters', async () => {
      const { createUserUseCase, createUserController } = makeSut();

       
       const executeSpy = jest.spyOn(createUserUseCase, 'execute');
       await createUserController.execute(httpRequestTemplate);

       expect(executeSpy).toHaveBeenCalledWith(httpRequestTemplate.body);
       expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if CreateUserUseCase throws', async () => {
      const { createUserUseCase, createUserController } = makeSut();

      
       const executeSpy = jest.spyOn(createUserUseCase, 'execute');
       executeSpy.mockRejectedValue(new Error('Database error'));
       const httpResponse = await createUserController.execute(httpRequestTemplate);

       expect(httpResponse.statusCode).toBe(500);
    });

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
      const { createUserUseCase, createUserController } = makeSut();

      

       jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
        throw new EmailAlreadyInUseError(httpRequestTemplate.body.email);
       });

       const httpResponse = await createUserController.execute(httpRequestTemplate);

       expect(httpResponse.statusCode).toBe(400);
    });
});
