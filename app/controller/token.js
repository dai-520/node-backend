'use strict';
const Controller = require('egg-extend');
const uuid = require('uuid');

class WisUserController extends Controller {
  get model() {
    const { ctx } = this
    // const token = this.app.jwt.sign({'11112':"1111"} ,"123456",{expiresIn: '1h'})
    return ctx.model.WisUser
  }

  async create() {
    const { ctx, app } = this;
    let verCode=ctx.request.body.imgCode;
    if(verCode)
      verCode=verCode.toUpperCase();
    let sessionCode=ctx.session.verCode;
    if(ctx.request.body.loginType == '0'){ ///让app
      sessionCode=verCode="hello";
    }
    if(!sessionCode){
      this.fail("验证码失效，请刷新.");
      return;
    }
    if(verCode!=sessionCode){
      this.fail("验证码错误，请重试.");
      return;
    }
    if(!ctx.request.body.account || !ctx.request.body.password){
      this.fail("用户名和密码不能为空!");
      return;
    }
    let where = { account: ctx.request.body.account, password: ctx.request.body.password };
    let account = await this.model.findOne({ where });
    if (!account) {
      this.fail("用户名或密码错误");
      return;
    }
    if(ctx.request.body.loginType !== account.type){
      this.fail("该账号登录类型不匹配!");
      return;
    }
    if (account) {
      let authConfig = this.config.auth;
      const token = this.app.jwt.sign({id:account.id}, authConfig.secret, { expiresIn: authConfig.expire.time });
      let refreshTokenKey = authConfig.format + uuid();

      const tokenValue = { token, accountId: account.id };
      app.redis.hset(refreshTokenKey, "token",token);
      app.redis.hset(refreshTokenKey, "accountId",account.id);
      app.redis.expire(refreshTokenKey, authConfig.expire.refreshTime);
      this.success({ token, refreshToken: refreshTokenKey });
    } 
    // return this.ctx.body;
  }

  async update() {
    const { ctx } = this;
    //刷新Token    
    const { id } = this.routeParams;
    const refreshTokenKey = id;

    const accountId = await app.redis.hget(refreshTokenKey, "accountId");
    if (!accountId) {
      this.ctx.body = {
        code: 10001,
        msg: "refreshToken过期"
      };
    } else {
      let authConfig = this.config.auth;
      const newToken = this.app.jwt.sign(account.id, authConfig.secret, { expiresIn: authConfig.expire.time });
      this.app.redis.hset(refreshTokenKey, "token", newToken);
      app.redis.expire(refreshTokenKey, authConfig.expire.refreshTime);
      this.ctx.body = {
        code: 0,
        msg: newToken
      };
    }
    return this.ctx.body;
  };

  async destroy() {
    const { ctx } = this;

    const { id } = this.routeParams;
    const refreshTokenKey = id;
    this.app.redis.del(refreshTokenKey);
    this.success("");
    return this.ctx.body;
  };

  async index() {
    const { ctx,app } = this;
    let token = ctx.header["authorization"] || ctx.query.token;
    if (!token) {
      ctx.body = {
        code: 401,
        msg: '401 Unauthorized.'
      }
      return ctx.body;
    }
    let authConfig = this.config.auth;
    let payload = await app.jwt.verify(token, authConfig.secret);
    if (!payload) {
      ctx.body = {
        code: 10002,
        msg: 'invalid token.'
      }
      return ctx.body;
    }
    const where={};
    where[this.primaryKey]=payload.id;
    let account = await this.model.findOne({where});
    this.success(account);
    // return ctx.body;
  }

}
module.exports = WisUserController;

