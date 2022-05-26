exports.removeFromArray = (array, value) => {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array
}

exports.delay = async(ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.sortDynamic = (array, item, is_number=true) => {

  if(is_number === true){
      array.sort(function (a, b) {
          return a[item] - b[item];
      });
  }else{
      array.sort((a, b) => {
          if ( a[item] < b[item] ){
              return -1;
          }
          if ( a[item] > b[item] ){
              return 1;
          }
          return 0;
      })

  }

  return array
}
