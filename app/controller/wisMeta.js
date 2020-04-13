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
    return ctx.body = {
      code:0,
      data:{apkUrl: "/up_release/wt_inspect.apk",
      htmlUrl: "/up_release/down.html"}
    }
  }
}
module.exports = WisUserController;

