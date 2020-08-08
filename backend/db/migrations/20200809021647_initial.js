const Knex = require('knex');
const tableName = require('../../src/constants/tableName');

function addDefaultColumns(table){
    table.timestamps(false,true);
    table.datetime('deleted_at');
}

function createNameTable(knex,table_name){
    return knex.schema.createTable(table_name,(table)=>{
        table.increments().notNullable();
        table.string('name').notNullable().unique();
        addDefaultColumns(table);
    })
}

function references(table, tableName, notNullable = true, columnName = '') {
    const definition = table
      .integer(`${columnName || tableName}_id`)
      .unsigned()
      .references('id')
      .inTable(tableName)
      .onDelete('cascade');
  
    if (notNullable) {
      definition.notNullable();
    }
    return definition;
}

function url(table, columnName) {
    return table.string(columnName, 2000);
}
  
function email(table, columnName) {
    return table.string(columnName, 254);
}

exports.up = async (knex) => {
    await Promise.all([
        knex.schema.createTable(tableName.user,(table)=>{
            table.increments().notNullable();
            table.string('email',254).notNullable().unique();
            table.string('name').notNullable();
            table.string('password',500).notNullable();
            table.datetime('last_login');
            addDefaultColumns(table);
        }),
        createNameTable(knex,tableName.item_type),
        createNameTable(knex,tableName.country),
        createNameTable(knex,tableName.state),
        createNameTable(knex,tableName.shape),
        knex.schema.createTable(tableName.location, (table) => {
            table.increments().notNullable();
            table.string('name').notNullable().unique();
            table.string('description',1000);
            table.string('image_url',2000);
            addDefaultColumns(table);
        }),
    ])
    await knex.schema.createTable(tableName.address, (table) => {
        table.increments().notNullable();
        table.string('street_address_1', 50).notNullable();
        table.string('street_address_2', 50);
        table.string('city', 50).notNullable();
        table.string('zipcode', 15).notNullable();
        table.double('latitude').notNullable();
        table.double('longitude').notNullable();
        references(table, 'state', false);
        references(table, 'country');
        addDefaultColumns(table);
        table.unique([
          'street_address_1',
          'street_address_2',
          'city',
          'zipcode',
          'country_id',
          'state_id',
        ]);
      });
    
      await knex.schema.createTable(tableName.company, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        url(table, 'logo_url');
        table.string('description', 1000);
        url(table, 'website_url');
        email(table, 'email');
        references(table, 'address');
        addDefaultColumns(table);
      });
     
     

};

exports.down = async (knex) => {
  await Promise.all([
    tableName.company,
    tableName.address,
    tableName.user,
    tableName.country,
    tableName.shape,
    tableName.item_type,
    tableName.location,
    tableName.state,
  ].map((tableName) => knex.schema.dropTableIfExists(tableName)));
};
