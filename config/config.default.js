/* eslint valid-jsdoc: "off" */

'use strict';

require('babel-register')({
  plugins: [
    'transform-decorators-legacy',
  ],
});
const path = require('path')
var url = require('../commom/config')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.keys = appInfo.name + '_1558595032295_9433';

  // mysql config
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    // database: 'rms-inspection',
    // database: 'module-inspection',
    database: 'wis_backend',
     host: '10.168.1.110',
    // host: 'localhost',
    port: 3306,
    username: 'root',
    // password: 'dai123',
    password:'WTqazxsw$1',
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    },

  };

  // egg cluster config
  config.cluster = {
    listen: {
      port: 7008,
      // hostname: '127.0.0.1',
      // hostname:'10.168.1.107'
    },
  };
  
  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
      // ignoreJSON: true
    },
    // domainWhiteList: ['http://localhost:8090']
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks' //左边写成.html后缀，会自动渲染.html文件
    },
  };
  config.cors = {
    origin: function(ctx){
      const requestOrigin = ctx.get('Origin');
      return requestOrigin;
    },
    // origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.eggExtend = {
    app:false,
    agent:false,
    name: 'rms-inspection',
    discovery: {
      serverAddr: '10.168.1.110:8848',
    }, local: {
      port: 7008,
    },
  };
  config.static = {
    prefix:'', 
    // dir: [path.join(appInfo.baseDir, 'app/public'), "//10.168.1.200/inspection/images/Inspection"]
    // dir: [path.join(appInfo.baseDir, 'app/public'), `${url.config.imgUrl}/images/Inspection`]
    dir: [path.join(appInfo.baseDir, 'app/public'), `${url.config.imgUrl}`,'E:/workspace/vue-template-aviana/dist']
  }
  config.logger = {
    // level: 'ERROR',
    appLogName: `dadadadadadad-ggg.log`,
    consoleLevel: 'NONE',
  };
  const userConfig = {
    // myAppName: 'egg',
  };

  //登录授权配置
  config.auth = {
    secret: "123456", //自己设置的
    expire:{
      time:'2 days',
      refreshTime: 2592000
    },
    format: 'JWT_REFRESH_TOKEN::',
    whiteUrls: ["/Token","/ImgCode","/wisMeta"],
  };
  config.middleware = ['auth'];
  //redis配置
  config.redis={
    client:{ 
      host:'10.168.1.110',
      port:6379,
      password:1,
      db:9
    }
  };
  return {
    ...config,
    // ...userConfig,
  };
};
