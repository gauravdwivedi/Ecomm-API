const stringHelper = {};

stringHelper.formatCount = (count) => {
  if(count < 1000){
    return count+"";
  }else if(count >= 1000 && count < 1000000){
    return Math.abs(count) > 999 ? Math.sign(count)*((Math.abs(count)/1000).toFixed(1)) + 'k' : Math.sign(count)*Math.abs(count)
  }else if(count >= 1000000 && count < 100000000){
    return Math.abs(count) > 999999 ? Math.sign(count)*((Math.abs(count)/1000000).toFixed(1)) + 'm' : Math.sign(count)*Math.abs(count)
  }else if(count >= 100000000 && count < 10000000000){
    return Math.abs(count) > 100000000 ? Math.sign(count)*((Math.abs(count)/100000000).toFixed(1)) + 'b' : Math.sign(count)*Math.abs(count)
  }
}

module.exports = stringHelper;