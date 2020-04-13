const moment = require('moment')
const fs = require('fs')
var path = require("path");  
const _ = require('lodash')
const productor = require('../commom/productor')
var url = require('../commom/config')
const uuid = require('uuid');
/**
 * change array and object,  deal date
 * @param {data} deviceJob
 * @param {modeType} type
 * @param {this.app} app
 */
async function rmsFunc(deviceJob, type, app) {
  let setUilt = new Set()
  const projectArray = []
  var dateRms
  for (let node of deviceJob) {
    if (type === 'project') setUilt.add(node.projectId)
    else if (type === 'device') setUilt.add(node.deviceId)
    else if (type === 'user') setUilt.add(node.inspectorId)
  }
  for (let utilId of setUilt.values()) utilId && projectArray.push(utilId)
  if (type === 'project')
    dateRms = await app.feign.rmsProject.getProject({}, projectArray.join(','))
  else if (type === 'device')
    dateRms = await app.feign.rmsDevice.getDevice({}, projectArray.join(','))
  else if (type === 'user') dateRms = await app.feign.rmsSystem.getUseInfo({})
  else if (type === 'upload') {
    //待优化
    dateRms = await app.model.InspectUpload.findAll({})
    if (dateRms instanceof Array) return dateRms
    else return [dateRms]
  } else if (type === 'review') {
    //待优化
    dateRms = await app.model.InspectReview.findAll({})
    if (dateRms instanceof Array) return dateRms
    else return [dateRms]
  }

  if (dateRms.data instanceof Array) return dateRms.data
  else return [dateRms.data]
}
/**
 * fuck
 * @param {Date} date
 */
exports.formatDate = date => {
  if (date) return moment(date).format('YYYY-MM-DD HH:mm:ss')
  else return null
}
exports.formatDateYmn = date => {
  if (date) return moment(date).format('YYYY-MM-DD')
  else return null
}
/**
 * fake Properties add exit model
 * @param {data} getInspectJobDate
 */
exports.getDevivceDataName = async (deviceJob, app) => {
  if(deviceJob && deviceJob.length ===0) return
  let keyName,tableName;
  if(deviceJob[0].inspectJobId === undefined){  keyName = 'id',tableName='inspect_job'}
  else{keyName = 'inspectJobId',tableName='inspect_history'} 
  const pointArray = await app.model.query(
    `SELECT point.name,${tableName}.point_id,point.nfc_id  from ${tableName} INNER JOIN point on ${tableName}.point_id = point.id`,
  )
  const userArray = await rmsFunc(deviceJob, 'user', app)
  const projectArray = await rmsFunc(deviceJob, 'project', app)
  const deviceArray = await rmsFunc(deviceJob, 'device', app)
  const uploadArray = await rmsFunc(deviceJob, 'upload', app)
  const reviewArray = await rmsFunc(deviceJob, 'review', app)
  for (let job of deviceJob) {
    var upArray = []
    var reArray = []
    if (projectArray && projectArray.length > 0) {
      for (let project of projectArray) {
        if (job.projectId === project.id)
          job.projectName = project.name
      }
    }
    if (deviceArray && deviceArray.length > 0) {
      for (let device of deviceArray) {
        if (job.deviceId === device.id)
          job.deviceName=device.name
      }
    }
    if (pointArray[0] && pointArray[0].length > 0) {
      for (let pointDate of pointArray[0]) {
        if (job.pointId === pointDate.point_id) {
          job.pointName= pointDate.name
          job.nfcId = pointDate.nfc_id
        }
      }
    }
    if (uploadArray && uploadArray.length > 0) {
      for (let uploadDate of uploadArray) {
        if (job[keyName] === uploadDate.inspectJobId) {
          upArray.push(uploadDate)
          job.setDataValue('uploads',upArray)
        }
        if (userArray && userArray.length > 0)
          userArray.forEach(node => {
 
            if (node.id === uploadDate.recipientId) {
              uploadDate.setDataValue('recipientName', node.username)
            }
            if (node.id === uploadDate.submitId) {
              uploadDate.setDataValue('submitName', node.username)
            }
          })
      }
    }
    if (reviewArray && reviewArray.length > 0) {
      for (let reviewDate of reviewArray) {
        if (job[keyName] === reviewDate.inspectJobId) {
          reArray.push(reviewDate)
          job.setDataValue('reviews', reArray)
        }
        if (userArray && userArray.length > 0)
          userArray.forEach(node => {
            if (node.id === reviewDate.recipientId) {
              reviewDate.setDataValue('recipientName', node.username)
            }
            if (node.id === reviewDate.submitId) {
              reviewDate.setDataValue('submitName', node.username)
            }
          })
      }
    }
    if (userArray && userArray.length > 0) {
      for (let userDate of userArray) {
        if (job.inspectorId === userDate.id) {
          job.setDataValue('inspectorName', userDate.username)
        }
      }
    }
  }
  return deviceJob
}
/**
 * upload image and saveImage
 * @param {File} ctx.request.files
 */

function mkdirs(baseFile) {  
  var imgUrlName = []
  for (let img of baseFile) {
    if (!img.name.includes('.')) {
      img.name += '.jpg'
    }
    const newImgFile =`images/${uuid()}_${img.name}`
    imgUrlName.push(newImgFile)
    fs.createReadStream(img.path).pipe(
      fs.createWriteStream(`${url.config.imgUrl}/${newImgFile}`),
    )
  }  
  return imgUrlName.join(';')
}

exports.saveImage = ctx => {
  var baseFile = []
  if (JSON.stringify(ctx.request.files) == '{}') return ''
  const baseFileType = ctx.request.files.imgFiles
  if (baseFileType instanceof Array) baseFile = baseFileType
  else baseFile = [baseFileType]
  const dirname = `${url.config.imgUrl}/images`
  if(!fs.existsSync(dirname)){
    fs.mkdirSync(dirname)
  }
  return mkdirs(baseFile)
}

/**
 * auto review
 * @param {File} ctx.request.autoInspect
 */
exports.autoReview = async (ctx,jobId) => {
    let mCron =""
   const autoInspectData= await ctx.model.AutoInspect.findOne({where:{recipientId:+ctx.uid}})
   const time = autoInspectData.timeDate
    if(time === 30) mCron = `* * * 0/1 ?`
    else if(time === 60) mCron = `* * * 0/2 ?`
    else if(time>0 && time<30) mCron =`* * 0/${time} * ?`
    else return
    // mCron = `* * * * ?`
    const jobs = await ctx.model.InspectJob.findOne({where:{id:jobId}})  //测试
        if(jobs.firstUploadDate && jobs.firstUploadDate.length>0 && jobs.firstUploadDate === jobs.lastUploadDate ){
            const obj ={ flag:'auto', id: jobs.id,recipientId:jobs.inspectorId,submitId:jobs.recipientId,startDate:jobs.firstUploadDate,cron:mCron}
            productor.productor(obj);
        }
}
