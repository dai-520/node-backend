var Enumerable = require('linq')
const moment = require('moment')
const _ = require('lodash')
async function rmsStatisFunc(jobs,type){
     return Enumerable.from(jobs).groupBy(job => {
        if(type==='statusStatis')
        return {inspectDate: moment(job.startDate).format('YYYY-MM-DD'), inspectorId: job.inspectorId,recipientId: job.recipientId,projectId: job.projectId}
        else if(type==='scoreStatis'){
        return {inspectDate: moment(job.startDate).format('YYYY-MM-DD'), pointId: job.pointId}
        }
      },
      null,
      (key, g) => {
      if(type==='statusStatis') {
        return {
          inspectDate: key.inspectDate,
          inspectorId: key.inspectorId,
          recipientId: key.recipientId,
          projectId: key.projectId,
          finishOntime: g.getSource().filter(s => s.firstUploadDate <= s.endDate &&s.status ==2).length,
          finishOvertime: g.getSource().filter(s => s.firstUploadDate > s.endDate &&s.status ==2).length,
          pendingCheck:jobs.filter(s => {
              const stTime = moment(s.startDate).format('YYYY-MM-DD')
            return (s.status== 0 || s.status==3) && stTime ==  key.inspectDate && s.inspectorId == key.inspectorId}).length,
          pendingReview:jobs.filter(s => {
            const stTime = moment(s.startDate).format('YYYY-MM-DD')
            return (s.status== 1 || s.status==4) && stTime ==  key.inspectDate && s.inspectorId == key.inspectorId}).length,
        }}
        else if(type==='scoreStatis'){
            return {
                inspectDate: key.inspectDate,
                pointId:key.pointId,
                score45: g.getSource().filter(s => s.lastScore>=4 &&s.status ==2 ).length,
                score34: g.getSource().filter(s => s.lastScore>=3&&s.lastScore<4&&s.status ==2).length,
                score23: g.getSource().filter(s => s.lastScore<3&&s.status ==2).length,
              }  
        }
      },
      (key) => { 
          if(type==='statusStatis')
          return key.inspectDate + ':' + key.inspectorId + ':' + key.recipientId + ':' + key.projectId
         else if(type==='scoreStatis')
          return key.inspectDate + ':' + key.pointId
        }
      ).toArray()
   
}
exports.getAllStatisticData= async (jobs,ctx) => {
  let newJOb = []
  const finishedJobs = jobs.filter(s=>s.status==2);
  const finishedJobIds = Enumerable.from(finishedJobs).select("$.id").toArray()
  const Op =ctx.app.Sequelize.Op
  let whereReject ={
    status:{[Op.eq]:1}
  }   
 for(let job of finishedJobs){
  newJOb.push({priority:job.priority,status:job.status,lastScore:job.lastScore, recipientId:job.recipientId, inspectorId:job.inspectorId,
    requirement:job.requirement,lastUploadDate: job.lastUploadDate,firstUploadDate: job.firstUploadDate,startDate:job.startDate,endDate:job.endDate,deviceId:job.deviceId,
    pointId:job.pointId,projectId:job.projectId,nfcId:job.nfcId,inspectJobId:job.id}) 
 }
  return ctx.model.transaction().then(async t => {
    var statusDate =await rmsStatisFunc(jobs,'statusStatis')
    for(let m of statusDate){
      const stTime = m.inspectDate + ' 00:00:00'
      const edTime = m.inspectDate + ' 23:59:59'
      const obj ={recipientId:{[Op.eq]:m.inspectorId},submitDate:{[Op.between]:[stTime,edTime]},status:{[Op.eq]:1}}
      Object.assign(whereReject,obj) 
      const reject = await ctx.model.InspectReview.count({where:whereReject})
      m.rejectCount =reject
      m.total = m.finishOntime + m.finishOvertime + m.pendingCheck + m.pendingReview 
      await ctx.model.query(`call pro_status(${m.inspectorId},'${m.inspectDate}',${m.recipientId},${m.projectId},${m.finishOntime},${m.finishOvertime},${m.pendingCheck}
      ,${m.pendingReview},${m.rejectCount},${m.total})`)
    }
    var scoreDate =await rmsStatisFunc(jobs,'scoreStatis')
    for(let n of scoreDate){
      const stTime = n.inspectDate + ' 00:00:00'
      const edTime = n.inspectDate + ' 23:59:59'
      const whereUpload ={pointId:{[Op.eq]:n.pointId},submitDate:{[Op.between]:[stTime,edTime]}}
      const upSum = await ctx.model.InspectUpload.count({where:whereUpload})
      const pointDate = await ctx.model.Point.findOne({where:{id:n.pointId}})
      n.deviceId= pointDate.deviceId
      n.projectId= pointDate.projectId
      n.uploadSum =upSum
      await ctx.model.query(`call pro_score(${n.pointId},'${n.inspectDate}',${n.score45},${n.score34},${n.score23},
      ${n.uploadSum},${n.projectId},${n.deviceId})`)
    }
    return ctx.model.History.bulkCreate(newJOb, {
      transaction: t,
    }).then(function() {
      return ctx.model.InspectJob.destroy(
        { where: { id: finishedJobIds}},
        { transaction: t },
      )
        .then(() => {
          ctx.body = { code: 0, message: 'action success' }
          return t.commit()
        })
        .catch(err => {
          ctx.body = { code: 1, message: 'action falied' }
          return t.rollback()
        })
    })
  })
}