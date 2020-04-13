const Producer = require('super-queue').Producer;
let config = require("../commom/config")
const p = new Producer({
  // 队列名称
  queue: 'winston',
  prefix: 'wt',
  // 设置Redis数据库连接
  redis: config.radis,
  // 默认的消息有效时间(s)，为0表示永久
  maxAge: 0,
  // 心跳时间周期（s），默认2秒
  heartbeat: 2,
});

// 初始化成功，触发start事件
// 注意：一定要在触发此事件后再使用push()，否则可能无法收到消息处理结果
p.on('start', () => {
  console.log('start');
});

exports.productor = parms => { // parms传递对象
  process.nextTick(() => {
    p.push({
      data: JSON.stringify(parms),
      maxAge: Math.random() * 2,
    }, (err, ret) => {
      if (err) {
        // 消息处理出错
        // 如果超过指定时间消费者未返回处理结果，则会返回MessageProcessingTimeoutError
        console.error(err);
      } else {
        // 消息的处理结果
      }
    });
  });
};
