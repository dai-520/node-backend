'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  eggExtend: {
    enable: true,
    package: 'egg-extend',
  },
   static: {
    enable: true,
 },
 jwt:{
  enable: true,
  package: "egg-jwt"
 },
 redis:{ 
   enable: true,
   package: 'egg-redis'
 },
nunjucks:{
  enable: true,
  package: 'egg-view-nunjucks'
}
  // assets :{
  //   enable: true,
  //   package: 'egg-view-assets',
  // },
  // nunjucks : {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // }
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
};
