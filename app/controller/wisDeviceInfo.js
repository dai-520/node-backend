'use strict';
const Controller = require('egg-extend');
class WisDeviceInfoController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisDeviceInfo
  }
}
module.exports = WisDeviceInfoController;

