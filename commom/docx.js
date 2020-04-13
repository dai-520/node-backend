const fs = require('fs')
var path = require("path");  
var url = require('../commom/config')
/**
 * upload image and saveImage
 * @param {File} ctx.request.files
 */
exports.saveFile = ctx => {
  if (JSON.stringify(ctx.request.files) == '{}') return null
  const baseFileType = ctx.request.files.file
    const newImgFile =`docxs/${baseFileType.name}`
    const dirname = `${url.config.imgUrl}/docxs`
    if(!fs.existsSync(dirname)) fs.mkdirSync(dirname)
    fs.createReadStream(baseFileType.path).pipe(
    fs.createWriteStream(`${url.config.imgUrl}/${newImgFile}`),)
  return newImgFile
}