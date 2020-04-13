'use strict';
const Controller = require('egg-extend');
const docx = require('docxtemplater');
var XlsxTemplate = require('xlsx-template');
const piz = require('pizzip');
const fs = require('fs')
const path = require('path')
const saveFiles = require('../../commom/docx')
const rmsUtil = require('../../commom/job')
const urls = require('../../commom/config')
const convert = require('../../commom/uplaod')
class WisDocxController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisDocx
  }
  async index(){
    const {ctx} = this
    const Op = this.app.Sequelize.Op;
    const {id,jobId}=ctx.query
    if(jobId && id){
      const historyDate = await ctx.model.WisHistory.findAll({where:{id:+id}})
      var hisDate =  await rmsUtil.getJobDataName(historyDate,this.app,'3') //获取history
      hisDate[0].uploads = [] //所有详情
      hisDate[0].uploadWarnAll = [] //所有警告详情
      hisDate[0].uploadWarnOne = [] //一级警告详情
      hisDate[0].uploadWarnTwo = [] //二级警告详情
      hisDate[0].uploadWarnThree = [] //三级警告详情
      hisDate[0].uploadWarnZero = [] //无警告详情
      const where1 = {warnLevel:{[Op.in]: ['1', '2','3']},jobId:{[Op.eq]:+jobId}}
      const where2 = {warnLevel:{[Op.eq]: '1'},jobId:{[Op.eq]:+jobId}}
      const where3 = {warnLevel:{[Op.eq]: '2'},jobId:{[Op.eq]:+jobId}}
      const where4 = {warnLevel:{[Op.eq]: '3'},jobId:{[Op.eq]:+jobId}}
      const where5 = {warnLevel:{[Op.notIn]: ['1','2','3']},jobId:{[Op.eq]:+jobId}}
      const uploads =  await ctx.model.WisUpload.findAll({where:{jobId:+jobId}}) //对应的Upload数据
      const uploadWarnAll = await ctx.model.WisUpload.findAll({where:where1}) //对应所有警告数据
      const uploadWarnOne = await ctx.model.WisUpload.findAll({where:where2}) //对应一级警告详情数据
      const uploadWarnTwo = await ctx.model.WisUpload.findAll({where:where3}) //对应二级警告详情数据
      const uploadWarnThree = await ctx.model.WisUpload.findAll({where:where4}) //对应三级警告详情数据
      const uploadWarnZero = await ctx.model.WisUpload.findAll({where:where5}) //对应无警告详情数据
      hisDate[0].uploads =await convert.level(uploads)
      hisDate[0].uploadWarnAll = await convert.level(uploadWarnAll)
      hisDate[0].uploadWarnOne = await convert.level(uploadWarnOne)
      hisDate[0].uploadWarnTwo = await convert.level(uploadWarnTwo)
      hisDate[0].uploadWarnThree = await convert.level(uploadWarnThree)
      hisDate[0].uploadWarnZero = await convert.level(uploadWarnZero)
      const {url} = await this.model.findOne({})
      let suffixArr = url.split('.')[1]
        var content = fs.readFileSync(path.resolve(__dirname,`${urls.config.imgUrl}/${url}`),'binary');
        if(suffixArr === 'docx'){
          var zip = new piz(content)
          var doc = new docx()
          doc.loadZip(zip)
          //设置数据
          doc.setData(hisDate[0])
          doc.render()
          var buf = doc.getZip().generate({type:'nodebuffer'})
          ctx.type="docx"
          let fileName=encodeURIComponent("草泥.docx")
          ctx.set("Content-Disposition",`attachment;fileName=${fileName}`)
          ctx.body=buf;
        }
        else {
          var template = new XlsxTemplate(content);
          template.substitute(1, hisDate[0]);
          var buf = template.generate({type:'nodebuffer'});
          ctx.type="xlsx"
          let fileName=encodeURIComponent("草泥.xlsx")
          ctx.set("Content-Disposition",`attachment;fileName=${fileName}`)
          ctx.body=buf;
        }
    }else{
      await super.index()
    }
  }
  async create(){
    const {ctx} = this
    const fileUrl = await saveFiles.saveFile(ctx)
    let docs = await this.model.findOne({});
    if(docs){
      if(fs.existsSync(`${urls.config.imgUrl}/${docs.url}`))
      fs.unlinkSync(`${urls.config.imgUrl}/${docs.url}`) //更新时清空上一个模板文件
      await ctx.model.WisDocx.update({url:fileUrl},{where:{id:+docs.id}})
    } 
    else await ctx.model.WisDocx.create({url:fileUrl})
    this.success()
  }
}
module.exports = WisDocxController;

