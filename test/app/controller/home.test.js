const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/home.test.js', () => {
  describe('GET /', () => {
    it('should status 200 and get the body', () => {
      // 对 app 发起 `GET /` 请求
      return app.httpRequest()
        .get('/')
        .expect(200) // 期望返回 status 200
        .expect('hello world111111'); // 期望 body 是 hello world
    });

    it('should send multi requests', async () => {
      // 使用 generator function 方式写测试用例，可以在一个用例中串行发起多次请求
      await app.httpRequest()
        .get('/')
        .expect(200) // 期望返回 status 200
        .expect('hello world'); // 期望 body 是 hello world

      // 再请求一次
      const result = await app.httpRequest()
        .get('/')
        .expect(200)
        .expect('hello world');

      // 也可以这样验证
      assert(result.status === 200);
    });
  });
});