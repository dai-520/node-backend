
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const wisCheckInfo = app.model.define('wis_check_info', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    deviceId: INTEGER(11),
    name: STRING(100),
    type: STRING(100),
    remarks: STRING(100),
    rules: STRING(100),
  });
  return wisCheckInfo;
};

