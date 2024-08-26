const db = require('../../db')(require('../../knexfile'));
const selectData = require('../../api/select-data')(db);

module.exports = async function (app, opts) {
  app.get('/list', {}, async (request, reply) => {
    try {
      const data = await selectData();
      return data;
    } catch (error) {
      console.error(error);
      reply.code(500).send('Internal Server Error');
    }
  });
};
