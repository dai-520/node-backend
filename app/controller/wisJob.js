'use strict';
const Controller = require('egg-extend');
const rmsUtil = require('../../commom/job')
class WisJobController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisJob
  }
  async index() {
    const { ctx } = this;
    const { limit, offset, attributes, order, where } = this.getIndexParms();
      if (limit) {
        const data = await this.model.findAndCountAll({
          limit, offset, attributes, order, where,
        });
        await rmsUtil.getJobDataName(data.rows,this.app,'1')
        super.success({ total: data.count, rows:data.rows });
      } else {
        const data = await this.model.findAll({
          where,
          attributes,
          order,
        });
        await rmsUtil.getJobDataName(data,this.app,'1')
        super.success(data);
      } 
  }
  async create(){
    const { ctx } = this;
    const mInspectorId = ctx.request.body.inspectorId.split(";")
    mInspectorId.forEach(async node => {
      Object.assign(ctx.request.body,{inspectorId:node})
      await ctx.model.WisJob.create(ctx.request.body)
    });
    ctx.body = {
      code:0
    }
  }
}
module.exports = WisJobController;

