function dateconverter(entity) {
    if (typeof(entity) == "object") {
  
    }
  
    let date = entity.split("T")[0];
    let y = date.substr(0, 4);
    let m = date.substr(4, 2) - 1;
    let d = date.substr(6);
  
    let time = entity.split("T")[1];
    let h = time.substr(0, 2) || 0;
    let min = time.substr(2, 2) || 0;
  
    return new Date(y,m,d,h,min);
}


try {
    module.exports = dateconverter; 
} catch (err) {
  
}