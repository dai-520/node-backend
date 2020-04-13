exports.config = {imgUrl:'D:/wisInspection'}
// exports.config = {imgUrl:'//DESKTOP-8AHPKTB/inspection'}
exports.radis = {host:'10.168.1.110',port:6379,db:5}
exports.test = parms => { 
  const token = parms.jwt.sign({'11112':"1111"} ,"123456",{expiresIn: '1h'})
  return  token
}