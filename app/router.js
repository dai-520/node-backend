'use strict';
const routerDecorator = require('egg-extend/router_decorator');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  routerDecorator.initRouter(app);

  router.get('/', controller.home.index);
  router.resources('wisUser', '/Token', controller.token);
  router.get("imgCode","/ImgCode",controller.imgCode.authImage);
  router.resources('wisDevice', '/wisDevice', controller.wisDevice);
  router.resources('wisDeviceInfo', '/wisDeviceInfo', controller.wisDeviceInfo);
  router.resources('wisCheckInfo', '/wisCheckInfo', controller.wisCheckInfo);
  router.resources('wisJob', '/wisJob', controller.wisJob);
  router.resources('wisHistory', '/wisHistory', controller.wisHistory);
  router.resources('wisRegular', '/wisRegular', controller.wisRegular);
  router.resources('wisRoute', '/wisRoute', controller.wisRoute);
  router.resources('wisUpload', '/wisUpload', controller.wisUpload);
  router.resources('wisUser', '/wisUser', controller.wisUser);
  router.resources('wisOrder', '/wisOrder', controller.wisOrder);
  router.resources('wisMeta', '/wisMeta', controller.wisMeta);
  router.resources('wisDocx', '/wisDocx', controller.wisDocx);
  router.resources('wisCopy', '/wisCopy', controller.wisCopy);
};
