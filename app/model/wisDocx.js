
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const wisDocx = app.model.define('wis_docx', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    url:STRING(100),
  });
  return wisDocx;
};

