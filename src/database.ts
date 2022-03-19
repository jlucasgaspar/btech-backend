import { Logger, ServiceUnavailableException } from '@nestjs/common';
import mongoose from 'mongoose';

if (!process.env.DATABASE_URI) {
  throw new ServiceUnavailableException('Provide correct database_uri');
}

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
