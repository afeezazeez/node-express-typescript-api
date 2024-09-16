import { QueryInterface, Sequelize } from 'sequelize';
import { faker } from '@faker-js/faker';
import {BcryptService} from '../../utils/bycrypt/bycrypt.service';

const bcryptService = new BcryptService();

export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize): Promise<void> {
    // Create users array with resolved promises
    const users = await Promise.all(
        Array.from({ length: 20 }).map(async () => ({
          uuid: faker.string.uuid(), // Generate a new UUID for each user
          display_name:faker.person.lastName(),
          email: faker.internet.email(),
          password: await bcryptService.make(faker.internet.password()), // Await password hashing
          enabled:true,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          email_verified_at:null
        }))
    );

    // Insert the users into the database
    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize): Promise<void> {
    await queryInterface.bulkDelete('users', {}, {});
  }
};
