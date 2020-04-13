'use strict';
const Controller = require('egg-extend');
const rmsUtil = require('../../commom/job')
const productor = require('../../commom/productor');
class WisRegularController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisRegular
  }
  async index() {
    const { ctx } = this;
    const { limit, offset, attributes, order, where } = this.getIndexParms();
      if (limit) {
        const data = await this.model.findAndCountAll({
          limit, offset, attributes, order, where,
        });
        await rmsUtil.getJobDataName(data.rows,this.app,'2')
        super.success({ total: data.count, rows:data.rows });
      } else {
        const data = await this.model.findAll({
          where,
          attributes,
          order,
        });
        await rmsUtil.getJobDataName(data,this.app,'2')
        super.success(data);
      } 
  }
  async create() {
    const data = await super.create();
    const { ctx } = this;
    const obj = Object.assign(ctx.request.body, { flag: 0, id: data.data.id });
   productor.productor(obj);
  }
  async destroy() {
    await super.destroy();
    const ids = +this.routeParams.id[0];
    productor.productor({ id: ids, flag: 1 });
  }
  async update() {
    await super.update();
    const ids = +this.routeParams.id[0];
    const { ctx } = this;
    const obj = Object.assign(ctx.request.body, { flag: 2, id: ids });
    productor.productor(obj);
  }
}
module.exports = WisRegularController;

