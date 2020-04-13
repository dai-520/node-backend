'use strict';
const Controller = require('egg-extend');
const rmsUtil = require('../../commom/job')
class WisHistoryController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisHistory
  }
  async index() {
    const { ctx } = this;
    ctx.query.orderFields = "id DESC"
    const { limit, offset, attributes, order, where } = this.getIndexParms();
      if (limit) {
        const data = await this.model.findAndCountAll({
          limit, offset, attributes, order, where,
        });
        await rmsUtil.getJobDataName(data.rows,this.app,'3')
        super.success({ total: data.count, rows:data.rows });
      } else {
        const data = await this.model.findAll({
          where,
          attributes,
          order,
        });
        await rmsUtil.getJobDataName(data,this.app,'3')
        super.success(data);
      } 
  }
}
module.exports = WisHistoryController;

