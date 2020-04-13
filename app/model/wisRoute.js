
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const wisRoute = app.model.define('wis_route', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    name:STRING(100),
    remarks:STRING(100),
  });
  return wisRoute;
};

