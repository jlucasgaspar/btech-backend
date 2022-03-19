import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';

class Database {
  private readonly logger = new Logger(Database.name);

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.DATABASE_URI, {}, (err) =>
        err ? reject(err) : resolve(this.logger.log('MongoDB connected'))
      );

      mongoose.connection.on('open', () => resolve());
      mongoose.connection.on('error', (err) => reject(err));
    });
  }
}

const database = new Database();

export default database;
