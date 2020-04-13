
const util =  require('../../commom/uitl');

module.exports = app => {
  const { STRING, INTEGER, DATE,VIRTUAL } = app.Sequelize;
  const wisUpload = app.model.define('wis_upload', {
    id: { type: INTEGER(20), primaryKey: true, autoIncrement: true },
    deviceId  : INTEGER(11),
    submitId: INTEGER(11),
    recipientId: INTEGER(11),
    jobId: INTEGER(11),
    submitDate: { type: DATE, get() {
      return util.formatDate(this.getDataValue('submitDate'))
    }},
    le_jobId:VIRTUAL,
    ge_jobId:VIRTUAL,
    in_warnLevel:VIRTUAL,
    le_submitDate:VIRTUAL,
    ge_submitDate:VIRTUAL,
    deviceName:VIRTUAL,
    uniqueCode:VIRTUAL,
    name: STRING(800),
    value: STRING(400),
    warnLevel: STRING(400),
    url:STRING(400),
    type:STRING(400),
    remarks:STRING(400),
  });
  return wisUpload;
};

