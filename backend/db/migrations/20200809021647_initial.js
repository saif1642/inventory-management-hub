const Knex = require('knex');
const tableName = require('../../src/constants/tableName');

exports.up = async function(knex) {
    await knex.schema.createTable(tableName.user,(table)=>{
        table.increments().notNullable();
        table.string('email',254).notNullable().unique();
        table.string('name').notNullable();
        table.string('password',500).notNullable();
        table.dateTime('last_login');
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTable(tableName.user);
};
