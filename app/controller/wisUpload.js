'use strict';
const Controller = require('egg-extend');
const funcLinq = require('../../commom/uplaod')
const moment = require('moment')
const rmsUtil = require('../../commom/uitl')
const rmsDevice = require('../../commom/uplaod')
class WisUploadController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisUpload
  }
  async index(){
    const {ctx} = this
    const Op = this.app.Sequelize.Op;
     var {deviceId,page,dateType,jobSize,code}=ctx.query
     if(dateType == '1'){ //table
      var allSql = '' //wanzheng sql 
      if(code) { //android
      var codeDate =  await ctx.model.WisDevice.findOne({where:{uniqueCode:{[Op.eq]: code}}})
      deviceId = codeDate.id
      }
      var count =await ctx.model.query(`SELECT COUNT(DISTINCT job_id) as num from wis_upload where device_id=${deviceId}`)
      if(count[0][0]["num"] == 0 ){
        // this.fail("该设备无上传数据")
        ctx.body = {
          code:0,
          data:[]
        }
        return
      }
      var sql = `SELECT job_id from wis_upload b where device_id=${deviceId} GROUP BY job_id ORDER BY job_id DESC LIMIT`   //base sql
      allSql = sql + ` ${(page-1)*5},${page*5}` //web
      if(code)  allSql = sql + ` 0,${jobSize}` //android
      const arrJobId =await ctx.model.query(allSql)
      ctx.query.le_jobId = arrJobId[0][0]["job_id"] 
      if(code){ //android 
        ctx.query.ge_jobId = arrJobId[0][arrJobId[0].length-1]["job_id"]
        const { where } = this.getIndexParms();
        const data = await  ctx.model.WisUpload.findAll({where});
        ctx.body = {code:0,data}
        return
      }
      if(arrJobId[0].length<5) ctx.query.ge_jobId = arrJobId[0][arrJobId[0].length-1]["job_id"]
      else  ctx.query.ge_jobId = arrJobId[0][4]["job_id"]   
     }
     const { limit, offset, attributes, order, where } = this.getIndexParms();
     if(dateType == '3') {  
      if (limit){
        const data = await this.model.findAndCountAll({
          limit, offset, attributes, order, where,
        })
         await rmsDevice.getDeviceDataName(data.rows,this.app)
        super.success({ total: data.count, rows:data.rows });  
      }  else {
        const data = await this.model.findAll({
          limit, offset, attributes, order, where,
        })
        super.success(data);
      }       
       return
    }
    if(dateType == '4') { //android
      var dataArray = []
      var deviceIdData =  await ctx.model.query(`SELECT device_id as deviceId from wis_upload  GROUP BY device_id`)
      var allDevice = deviceIdData[0]
        for(let i =0 ;i<allDevice.length;i++){
          const arrJob = await ctx.model.query(`SELECT job_id from wis_upload b where device_id=${+allDevice[i]['deviceId']} GROUP BY job_id ORDER BY job_id DESC LIMIT 0,${+jobSize}`)
          ctx.query.le_jobId = arrJob[0][0]["job_id"] 
          if(arrJob[0].length<+jobSize) ctx.query.ge_jobId = arrJob[0][arrJob[0].length-1]["job_id"]
          else  ctx.query.ge_jobId = arrJob[0][+jobSize -1]["job_id"] 
          ctx.query.deviceId = +allDevice[i]['deviceId']
          const { where } = this.getIndexParms();
          var data = await this.model.findAll({ where });
          dataArray = dataArray.concat(data)
        }
        ctx.body={ code:0,data:dataArray }
        return
    }
    if(dateType == '1' || dateType == '2'){
      const arrRes = await  ctx.model.WisUpload.findAll({where});
      var data = await funcLinq.funcLinq(arrRes,dateType)
    } 
    if(dateType == '1') return ctx.body={ code:0,total:Math.ceil(count[0][0]["num"]/5),data }
    else if(dateType == '2')return ctx.body={ code:0,data }
    }

    async create() {
      const { ctx } = this
       const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      const imgUrl = await rmsUtil.saveImage(ctx)
      Object.assign(ctx.request.body, {url: imgUrl,submitId:ctx.uid,submitDate:currentTime})
      var m = ctx.request.body
      try{
      await ctx.model.query(`REPLACE INTO wis_upload(name,device_id,job_id,submit_id,submit_date,value,warn_level,url,type,remarks,recipient_id)
         VALUES ('${m.name}',${m.deviceId},${m.jobId},${m.submitId},'${m.submitDate}','${m.value}','${m.warnLevel}','${m.url}','${m.type}','${m.remarks}',${m.recipientId})`)
        this.success();
      }catch(err){
          this.fail();
      }  
    }
}
module.exports = WisUploadController;

