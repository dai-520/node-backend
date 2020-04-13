'use strict';
const Controller = require('egg-extend');
class WisCheckInfoController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisCheckInfo
  }
}
module.exports = WisCheckInfoController;

