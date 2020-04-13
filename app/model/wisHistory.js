
const util =  require('../../commom/uitl');
module.exports = app => {
  const { STRING, INTEGER, DATE,VIRTUAL } = app.Sequelize;
  const wisHistory = app.model.define('wis_history', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    routeId: INTEGER(11),
    inspectorId: INTEGER(11),
    startDate: { type: DATE, get() {
      return util.formatDate(this.getDataValue('startDate'))
    }},
    submitDate:{ type: DATE, get() {
      return util.formatDate(this.getDataValue('submitDate'))
    }},
    remarks: STRING(400),
    jobId:INTEGER(11),
    checkTotal:INTEGER(11),
    deviceTotal:INTEGER(11),
    warnOne:INTEGER(11),
    warnTwo:INTEGER(11),
    warnThree:INTEGER(11),
    le_startDate:VIRTUAL,
    ge_startDate:VIRTUAL,
    routeName:VIRTUAL,
    inspectorName:VIRTUAL,
    deviceListName:VIRTUAL,
  });
  return wisHistory;
};

