
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const wisUser = app.model.define('wis_user', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    username:STRING(100),
    account:STRING(100),
    password:STRING(100),
    phone: STRING(100),
    type: STRING(11),
    parentId:INTEGER(20)
  });
  return wisUser;
};

