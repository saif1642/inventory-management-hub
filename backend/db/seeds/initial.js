const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Knex = require('knex');

const tableNames = require('../../src/constants/tableName');
const orderedTableNames = require('../../src/constants/orderedTableNames');

/** 
 * @param {Knex} knex 
**/
exports.seed = async (knex) =>  {

  orderedTableNames.reduce(async (promise,table_name) => {
    await promise;
    console.log('deleting:',table_name);
    return knex(table_name).del();
  },Promise.resolve());

  const password = crypto.randomBytes(30).toString('hex');
  const user = {
    email:"saif@gmail.com",
    name:"saif",
    password:await bcrypt.hash(password,12)
  }

  const [createdUser] = await knex(tableNames.user).insert(user).returning('*');
  console.log("created User: ",{
    createdUser,
    password
  });
};
