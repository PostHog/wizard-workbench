import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 1, email: 'ada@example.com', name: 'Ada Lovelace', plan: 'pro' },
    { id: 2, email: 'grace@example.com', name: 'Grace Hopper', plan: 'free' },
    {
      id: 3,
      email: 'alan@example.com',
      name: 'Alan Turing',
      plan: 'enterprise',
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
}
