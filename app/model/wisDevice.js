
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const wisDevice = app.model.define('wis_device', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    routeId: INTEGER(11),
    name: STRING(100),
    uniqueCode: STRING(100),
  });
  return wisDevice;
};

