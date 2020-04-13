'use strict';
const Controller = require('egg-extend');
class WisRouteController extends Controller {
  get model() {
    const {ctx} = this
    return ctx.model.WisRoute
  }
}
module.exports = WisRouteController;

