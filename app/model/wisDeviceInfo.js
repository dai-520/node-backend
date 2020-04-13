
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const wisDeviceInfo = app.model.define('wis_device_info', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    deviceId: INTEGER(11),
    name: STRING(100),
    value: STRING(100),
  });
  return wisDeviceInfo;
};

