import { IUsersRepository } from '../../../interfaces/IUsersRepository';
import { UsersHttpResolver } from '../UsersHttpResolver';

const mockUserRepo: IUsersRepository = {
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn()
};

describe('UsersHttpResolver', () => {
  let resolver: UsersHttpResolver;

  beforeEach(() => {
    resolver = new UsersHttpResolver(mockUserRepo);
  });

  it('calls User Repository create method with right params', async () => {
    await resolver.createUser({ login: 'login', email: 'email' });

    expect(mockUserRepo.create).toBeCalledWith({
      login: 'login',
      email: 'email'
    });
  });

  it('calls User Repository find method with right params', async () => {
    await resolver.getUsers();

    expect(mockUserRepo.find).toBeCalledWith();
  });

  it('calls User Repository findOneOrFail method with right params', async () => {
    await resolver.getUser(1);

    expect(mockUserRepo.findOneOrFail).toBeCalledWith(1);
  });
});
