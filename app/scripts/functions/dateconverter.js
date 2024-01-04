function dateconverter(entity) {
    if (typeof(entity) == "string") {

        let date = entity.split("T")[0];
        let y = date.substr(0, 4);
        let m = date.substr(4, 2) - 1;
        let d = date.substr(6,2)*1;

        let time = entity.split("T")[1];
        let h = time.substr(0, 2) || 0;
        let min = time.substr(2, 2) || 0;
      
        return new Date(y,m,d,h,min);
  
    }

    if (typeof(entity) == "number") {
        entity = new Date(entity)
    }

    let date = [
        entity.getFullYear(),
        entity.getMonth() + 1,
        entity.getDate(),
        "T",
        entity.getHours(),
        entity.getMinutes(),
        "00"
    ]

    date.forEach((e, i) => {
        if (typeof(e) == "string" || e > 100) return;
        date[i] = e > 100 ? e += '' :  ('00' + e).slice(-2)
    })
    
    return date.join("")

}


try {
    module.exports = dateconverter; 
} catch (err) {
  
}