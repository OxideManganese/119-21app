let events;

function setCssVar(variable, value) {
    document.body.style.setProperty('--' + variable, value);
}

function resizeCalendar(event) {
    setCssVar('windowHeight', document.documentElement.clientHeight + 'px');
    setCssVar('calendarHeight', document.querySelector("main.calendar-item .day").offsetHeight + 'px');
}

async function updateCalendar(event) {
    const header = document.querySelector("header.calendar-item");
    const main = document.querySelector("main.calendar-item");
    const container = document.querySelector(".days-container");
    header.innerHTML = main.innerHTML = "";

    const response = await fetch("https://119-21.netlify.app/.netlify/functions/calendar");
    events = await response.json();

    for (let index = -14; index < 28; index++) {
        let dayDate = +new Date() + 8.64e7 * index;
        dayDate = new Date(dayDate);

        const day = ["ВС", "ПН","ВТ","СР","ЧТ","ПТ","СБ"][dayDate.getDay()];
        const date = dayDate.getDate();
        const month = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][dayDate.getMonth()];
        const formatDate = dateconverter(dayDate).split("T")[0]
        const dayEvents = events.find(e => e.date == formatDate)?.events;

        let eventsBlocks = [];
        dayEvents?.forEach(event => {
            let schow = 1;
            
            if (event.event == "II пара. 2-й час") {
                let para2 = dayEvents.find(e => e.dtsend?.split("T")[1] == "125500")
                para2 ? event = para2 : schow = 0
            }

            if (event.event != "Пара" && event.event.indexOf("пара") + 1) schow = 0;

            if (schow) {
                const dtstart = dateconverter(event.dtstart);
                const dtend = dateconverter(event.dtend);
                const startH = dtstart.getHours() + dtstart.getMinutes() / 60 - 8;
                const duration = dtend.getHours() + dtend.getMinutes() / 60 - startH - 8;
                let eventblock = `<div class="event" style="--start: ${startH}; --duration: ${duration};">`
                eventblock += `<h3>${event.lessonname || event.event}</h3><p>`;
                eventblock += `${
                    dtstart.getHours()
                }:${
                    ("0" + dtstart.getMinutes()).slice(-2)
                }-${
                    dtend.getHours()
                }:${
                    ("0" + dtend.getMinutes()).slice(-2)
                }`;
                if(event.rooms) {
                    eventblock += "<br>Кабинет №" + event.rooms[0]
                }
                eventblock += "</p></div>"
                eventsBlocks.push(eventblock);
            } 
        })

        if (eventsBlocks.length == 1 && eventsBlocks[0].indexOf("Обед") +1) eventsBlocks = [];

        header.innerHTML += `<div class="day ${day == "ВС"?"weekend":""}"><b>${day}</b>, ${date} ${month}</div>`;
        main.innerHTML +=  `<div class="day" id="day${formatDate}">${eventsBlocks.join("")}</div>`;
    }

    const nowDay = document.getElementById("day" + dateconverter(new Date).split("T")[0]);
    nowDay.style.setProperty('background-color', '#f0fff5')
    container.scrollLeft = nowDay.getBoundingClientRect().x - 50;

    console.log(events)
}

window.addEventListener('DOMContentLoaded', resizeCalendar);
window.addEventListener('DOMContentLoaded', updateCalendar);
window.addEventListener('resize', resizeCalendar);