'use strict';
import { faker } from '@faker-js/faker';
import {BcryptService} from '../../utils/bycrypt/bycrypt.service';
import { QueryInterface, Sequelize } from 'sequelize';

const bcryptService = new BcryptService();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface:QueryInterface, Sequelize:Sequelize) {
    const admins = await Promise.all(
        Array.from({ length: 2 }).map(async () => ({
          uuid: faker.string.uuid(),
          display_name:faker.person.lastName(),
          email: faker.internet.email(),
          password: await bcryptService.make('admin'), // Await password hashing
          enabled:true,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        }))
    );

    // Insert the users into the database
    await queryInterface.bulkInsert('admins', admins, {});
  },

  async down (queryInterface:QueryInterface, Sequelize:Sequelize) {
    await queryInterface.bulkDelete('admins', {}, {});
  }
};
