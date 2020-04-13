'use strict';
const Controller = require('egg-extend');
const linFunc = require('../../commom/history')
class WisUserController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisUser
  }
  async index(){  //指令删除
    var checkArr = []
    const {ctx} = this
    const Op = this.app.Sequelize.Op;
    const where = {deviceId:{[Op.eq]: ctx.query.deviceId}}
    const checkData = await ctx.model.WisCheckInfo.findAll({where})
    for(let job of checkData){
      checkArr.push({deviceId:ctx.query.copyDeviceId,type:job.type,name:job.name, remarks:job.remarks, rules:job.rules}) 
     }
    await ctx.model.query(`DELETE from  wis_check_info where device_id = ${ctx.query.copyDeviceId}`)
    await ctx.model.WisCheckInfo.bulkCreate(checkArr)
    ctx.body = {code:0}
  }
}
module.exports = WisUserController;

