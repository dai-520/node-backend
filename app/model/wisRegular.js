
const util =  require('../../commom/uitl');
module.exports = app => {
  const { STRING, INTEGER, DATE,VIRTUAL } = app.Sequelize;
  const wisRegular = app.model.define('wis_regular', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    routeId: INTEGER(11),
    inspectorIds: INTEGER(11),
    startDate: { type: DATE, get() {
      return util.formatDate(this.getDataValue('startDate'))
    }},
    limitHours: INTEGER(11),
    deviceList: STRING(400),
    remarks: STRING(400),
    cron: STRING(400),
    routeName:VIRTUAL,
    inspectorName:VIRTUAL,
    deviceListName:VIRTUAL,
  });
  return wisRegular;
};

