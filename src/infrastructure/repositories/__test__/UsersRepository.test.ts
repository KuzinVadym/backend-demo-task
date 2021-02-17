import { setupDatabase } from '../../../shared/tests/setupDB';
import { UsersRepository } from '../UsersRepository';
import { getCustomRepository } from 'typeorm';
import { UsersFactory } from '../../../shared/tests/factories/UsersFactory';

setupDatabase();

describe('UsersRepository', () => {
  let sut: UsersRepository;

  beforeEach(() => {
    sut = getCustomRepository(UsersRepository);
  });

  it('creates user', async () => {
    const attr = {
      login: 'login',
      email: 'email'
    };

    const result = await sut.create(attr);

    expect(result).toMatchObject({
      login: 'login',
      email: 'email'
    });
  });

  it('finds user by Id', async () => {
    const attr = {
      id: 99,
      login: 'login',
      email: 'email'
    };
    const user = await UsersFactory.create(attr);

    const result = await sut.findOneOrFail(user.id);

    expect(result).toMatchObject(user);
  });

  it('finds users', async () => {
    const attr = {
      login: 'login',
      email: 'email'
    };

    await UsersFactory.createList(3, attr);

    const result = await sut.find();

    expect(result.length).toEqual(3);
  });
});
