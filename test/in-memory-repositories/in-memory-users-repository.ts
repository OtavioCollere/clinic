import {UsersRepository} from '../../src/domain/application/repositories/users-repository'
import {User} from '../../src/domain/enterprise/entities/user'


export class InMemoryUsersRepository implements UsersRepository{
  public items:  User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) return null

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) return null

    return user;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf === cpf);

    if (!user) return null

    return user;
  }

  async create(user: User): Promise<User> {
    this.items.push(user)
    return user;
  }

  async save(user: User): Promise<User> {
    const index = this.items.findIndex((item) => item.id.toString() === user.id.toString())

    if (index >= 0) {
      // já existe → substitui
      this.items[index] = user
    } else {
      // não existe → adiciona
      this.items.push(user)
    }

    return user

  }
  
}