const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const lessons = require('../data/lessons.json')

exports.handler = async function(event, context) {

  //Функция формата даты
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
  
  // Возвращает номер недели
  Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0, 0);
    // Четверг на текущей неделе решает год.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // 4 января всегда приходится на неделю 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Настройтесь на четверг на 1-й неделе и подсчитайте количество недель от даты до week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  const GcalendarID = "b6c03590fcc36fb48050898b9afacc887bdc8e350b210941977739ee5cc6ca78%40group.calendar.google.com";
  const eventsdata = await fetch(`https://calendar.google.com/calendar/ical/${GcalendarID}/public/basic.ics`);
  let rawevents = await eventsdata.text();

  rawevents = rawevents.split("END:VEVENT");

  let events = [];
  
  rawevents.forEach((rowelem, index) => {
  
      function cutoff(string) {
        let result = rowelem.split(string + ":")[1];
        return (result?.split(string == "DESCRIPTION" ? "LAST-MODIFIED" : "\r")[0]).replace('\r', '')
      }
    
      let elem = {
        dtstart: cutoff("DTSTART;TZID=Europe/Moscow"),
        dtend: cutoff("DTEND;TZID=Europe/Moscow"),
        event: cutoff("SUMMARY"),
        description: cutoff("DESCRIPTION"),
        location: cutoff("LOCATION"),
        guid: cutoff("UID"),
      }
  
      let lesson = lessons.find(
        lesson => (lesson.name + lesson.otherntname).toLowerCase().indexOf(elem.event?.toLowerCase()) + 1
      )
  
      if (lesson) {
        elem.event = "Пара";
        elem.lessonname = lesson.name
        elem.short = lesson.shortname
        elem.theachers = lesson.theachers
        elem.rooms = lesson.rooms
  
        if (elem.lessonname == "Физкультура") {
          elem.rooms = [dateconverter(elem.dtstart).getWeek() & 2 ? "Бассейн" : "Спортзал"]
        }
      }
  
      if (elem.location && elem.location.indexOf("Каб.") >= 0) {
        let localrooms = elem.location.replace(/Каб\.\s/g, "").split(" // ")
        localrooms.forEach((room, i) => room && elem.rooms ? elem.rooms[i] = room : 0);
      }
  
  
      if (elem.description && elem.description.indexOf("Домашнее:") >= 0) {
        let splhomework =  elem.description.split("Домашнее:");
        elem.homewok = splhomework[1].replace("\n", "").replace("<br>", "").split(" // ")
        elem.description = splhomework[0]
      }
  
      if (rowelem.indexOf("EXDATE") + 1) rowelem.split("EXDATE;TZID=Europe/Moscow:").slice(1).forEach(repeat => {
        elem.dtstart = repeat.split("\n")[0];
        elem.dtend = [elem.dtstart.split("T")[0], elem.dtend.split("T")[1]].join("T");
        checksave(elem);
      });
      else {
        checksave(elem)
      }
  
      function checksave(elem) {
        let ElemDate = elem.dtstart ? +dateconverter(elem.dtstart) : 0;
        let NowDate = +new Date;
  
        if (Math.abs(NowDate - ElemDate) < 18144E5) {
          let result = JSON.parse(JSON.stringify(elem)); 
  
          let day = elem.dtstart.split("T")[0];
          let daysector = events.find(e => e.date == day)
          if (Math.abs(NowDate - ElemDate) < 18144E5) 
            daysector ? daysector.events.push(result) : events.push ({
            date: day,
            events: [result]
          })
        }
      }
  
  })
  
  events.sort((a, b) => a.date - b.date);

	return {
		statusCode: 200,
		body: JSON.stringify(events),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*',
		},
	}


}

