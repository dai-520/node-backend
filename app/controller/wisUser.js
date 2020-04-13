'use strict';
const Controller = require('egg-extend');
class WisUserController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisUser
  }
  async index(){
    const {ctx} = this
    const { limit, offset, attributes, order, where } = this.getIndexParms();
    if (limit){
      const data = await this.model.findAndCountAll({
        limit, offset, attributes, order, where,
      })
        super.success({ total: data.count, rows:data.rows });
        return
    } else if(ctx.query.type == '0'){
      const data = await this.model.findAll({ where });
      super.success(data);
      return
    }  
    else{
      ctx.query.id = ctx.uid
      const { where } = this.getIndexParms();
      const data = await this.model.findOne({ where });
      super.success(data);
      return
    }
  }
}
module.exports = WisUserController;

