const Subscription = require('egg').Subscription
const statisUtil = require('../../commom/statisUtil')
class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 0/5 * * *',
      // cron: '*/3 * * * * *',
      type: 'worker', // 指定所有的 worker 都需要执行
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const {ctx} =this
    let jobs = await ctx.model.InspectJob.findAll({})
    await statisUtil.getAllStatisticData(jobs,ctx)
    console.log("succcccccccccccccccccccccccccccccccccccccc")
  }
}

module.exports = UpdateCache
