var Enumerable = require('linq')
exports.funcLinq = async(arrRes) =>{
    return Enumerable.from(arrRes).groupBy(m => {
       return {jobId: m.jobId}
    },null,(key, g) => { return {
      jobId: key.jobId,
      submitDate: g.getSource()[0].submitDate,
      warnOne: g.getSource().filter(s => s.warnLevel == '1').length,
      warnTwo: g.getSource().filter(s => s.warnLevel == '2').length,
      warnThree: g.getSource().filter(s => s.warnLevel == '3').length,
      warnTotal: g.getSource().filter(s => s.warnLevel!==null &&s.warnLevel!=='' && +s.warnLevel>0).length,
      checkNum: g.getSource().length,
      }
    },
    (key) => {  return key.jobId  }
    ).toArray()
}
