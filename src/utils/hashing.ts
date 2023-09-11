import * as bcrypt from 'bcrypt';

export const verifyPassword = (value: string, hash: string) => {
  return bcrypt.compare(value, hash);
};

export const hashPassword = (value: string) => {
  return bcrypt.hash(value, 10);
};
