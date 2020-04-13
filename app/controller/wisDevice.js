'use strict';
const Controller = require('egg-extend');
class WisDeviceController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisDevice
  }
}
module.exports = WisDeviceController;

