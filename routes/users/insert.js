const db = require('../../db')(require('../../knexfile'));
const insertUsers = require('../../api/insert_users')(db);

module.exports = async function (app, opts) {
  app.post('/insert', {}, async (request, reply) => {
    try {
      const res = await insertUsers();
      return { success: true, inserted: res };
    } catch (error) {
      console.error(error);
      reply.code(500).send('Internal Server Error');
    }
  });
};
