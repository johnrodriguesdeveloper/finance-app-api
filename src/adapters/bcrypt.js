
import bcrypt from 'bcrypt';

export class BcryptAdapter {
  async hash(password) {
    return await bcrypt.hash(password, 10);
  }   
}