exports.getJobDataName = async (deviceJob, app,type) => {
  if(deviceJob && deviceJob.length ===0) return
  const routeArr = await app.model.WisRoute.findAll({})
  const userArr = await app.model.WisUser.findAll({where:{type:'0'}})
  const deviceArr = await app.model.WisDevice.findAll({})
  for (let job of deviceJob) {
    if (routeArr && routeArr.length > 0) { //路线名称
      for (let route of routeArr) {
        if (job.routeId === route.id)
          job.routeName = route.name
      }
    }
    if (userArr && userArr.length > 0 && (type == '1' ||type == '3')) { //人员名称
      for (let user of userArr) {
        if (job.inspectorId === user.id)
          job.inspectorName = user.username
      }
    } 
    if (deviceArr && deviceArr.length > 0 && type !== '3') { //设备名称
      var nameList = []
      for (let device of deviceArr) {
         job.deviceList.split(";").forEach(m => {
             if(+m === device.id) nameList.push(device.name)
         });
      }
      job.deviceListName = nameList.join(' & ')
    }
    if (userArr && userArr.length > 0 && type == '2') { //设备名称规则
      var nameList = []
      for (let user of userArr) {
         job.inspectorIds.split(";").forEach(m => {
             if(+m === user.id) nameList.push(user.username)
         });
      }
      job.inspectorName = nameList.join(' & ')
    }  
  }
  return deviceJob
}