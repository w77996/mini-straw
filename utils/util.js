//时间格式yyyy/MM/dd HH:MM:SS
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时间格式yyyy-MM-dd HH:MM:SS
const formatNow = date => {
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let strDate = date.getDate().toString().padStart(2, '0');

  return `${date.getFullYear()}年${month}月${strDate}日 ${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`;
}
//文件大小转换
const fileSizeTran = fileSizeByte => {
  let fileSizeMsg = ''
  if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "K";
  else if (fileSizeByte == 1048576) fileSizeMsg = "1M";
  else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "M";
  else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1G";
  else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "G";
  else fileSizeMsg = "文件超过1TB";
  return fileSizeMsg.replace(".00", "");
}
module.exports = {
  formatTime,
  formatNow,
  fileSizeTran
}