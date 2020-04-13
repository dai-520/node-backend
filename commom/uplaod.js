var Enumerable = require('linq')
exports.funcLinq = async(arrRes,dateType) =>{
    return Enumerable.from(arrRes,dateType).groupBy(m => {
      if(dateType == '1') return {jobId: m.jobId}
      else return {id:m.id,jobId: m.jobId}
    },null,(key, g) => {
      if(dateType == '1') return {
      jobId: key.jobId,
      submitDate: g.getSource()[0].submitDate,
      warnOne: g.getSource().filter(s => s.warnLevel == '1').length,
      warnTwo: g.getSource().filter(s => s.warnLevel == '2').length,
      warnThree: g.getSource().filter(s => s.warnLevel == '3').length,
      warnTotal: g.getSource().filter(s => s.warnLevel!==null &&s.warnLevel!=='' && +s.warnLevel>0).length,
      checkNum: g.getSource().length,
      }
      else return {
      jobId: key.jobId,
      submitDate:g.getSource()[0].submitDate,
      value:g.getSource()[0].value,
      name:g.getSource()[0].name,
      }
    },
    (key) => {   if(dateType == '1') return key.jobId  
    else  return key.id + ':' + key.jobId 
      }
    ).toArray()
}
exports.level = async(data) =>{
  const mapDate = {'1':'一级','2':'二级','3':'三级'}
  // data.forEach(m => {
  //   m.level =  '无'
  //   if(m.warnLevel != "") m.level = mapDate[m.warnLevel]
  // })
  for(let idx in data){
    data[idx].level = '无'
    data[idx].index = +idx + 1
    if(data[idx].warnLevel != "") data[idx].level = mapDate[data[idx].warnLevel]
  }
  return data
}

exports.getDeviceDataName = async (deviceJob,app) => {
  if(deviceJob && deviceJob.length ===0) return
  const deviceArr = await app.model.WisDevice.findAll({})
  for (let job of deviceJob) {
    if (deviceArr && deviceArr.length > 0 ) { //设备名称
      for (let device of deviceArr) {
             if(job.deviceId === device.id) {
                job.deviceName = device.name
                job.uniqueCode = device.uniqueCode
             }  
      }
    } 
  }
  return deviceJob
}