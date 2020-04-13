const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class ImgCodeController extends Controller {
  async authImage() {
    const { ctx, service } = this;
    const cap = svgCaptcha.create({color:false,ignoreChars:'OoiIlL1'});
    ctx.session.verCode=cap.text.toUpperCase();
    ctx.session.maxAge = 1000 * 60 * 10;
    ctx.type="svg";
    ctx.body=cap.data;
  }
}
module.exports = ImgCodeController;