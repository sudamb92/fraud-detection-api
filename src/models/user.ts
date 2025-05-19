import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// In-memory storage for users
const users: User[] = [
  // Adding some sample users for testing
  {
    id: uuidv4(),
    email: 'john@example.com',
    name: 'John Doe',
    status: 'inactive',
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    email: 'alice@gmail.com',
    name: 'Alice Smith',
    status: 'active',
    createdAt: new Date()
  }
];

export const createUser = (email: string, name: string, status: 'active' | 'inactive' = 'active'): User => {
  const user: User = {
    id: uuidv4(),
    email,
    name,
    status,
    createdAt: new Date(),
  };
  
  users.push(user);
  return user;
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const isUserActive = (email: string): boolean => {
  const user = getUserByEmail(email);
  return user ? user.status === 'active' : false;
};

export const getUsers = (): User[] => {
  return [...users];
};

export const updateUserStatus = (email: string, status: 'active' | 'inactive'): User | undefined => {
  const user = getUserByEmail(email);
  if (user) {
    user.status = status;
  }
  return user;
}; 