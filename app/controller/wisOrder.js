'use strict';
const Controller = require('egg-extend');
const linFunc = require('../../commom/history')
class WisUserController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisUser
  }
  async index(){  //指令删除
    const {ctx} = this
     var jobData = await ctx.model.WisJob.findOne({where:{id: +ctx.query.jobId}})
     const deviceNum =  jobData.deviceList.split(';').length
     const uplaodJob =  await  ctx.model.WisUpload.findAll({where:{jobId:jobData.id}})
     var objStatus = await linFunc.funcLinq(uplaodJob)
     var objHistortData = {jobId:jobData.id,checkTotal:objStatus[0].checkNum,warnOne:objStatus[0].warnOne,remarks:jobData.remarks,deviceTotal:deviceNum,
      submitDate:objStatus[0].submitDate,
      warnTwo:objStatus[0].warnTwo,warnThree:objStatus[0].warnThree,inspectorId:jobData.inspectorId,startDate:jobData.startDate,routeId:jobData.routeId,}
      return ctx.model.transaction().then(t => {
        // 在事务中执行操作
        return ctx.model.WisHistory.create(objHistortData, {
          transaction: t,
        }).then(async ()=> {
          return  ctx.model.WisJob.destroy(
            { where: { id: +ctx.query.jobId }},
            { transaction: t },
          )
            .then(async() => {
              ctx.body = { code: 0, message: 'upload success' }
              return t.commit()
            })
            .catch(err => {
              ctx.body = { code: 1, message: 'upload falied' }
              return t.rollback()
            })
        })
      })
  }
}
module.exports = WisUserController;

