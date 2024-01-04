function setCssVar(variable, value) {
    document.body.style.setProperty('--' + variable, value);
}

function resizeCalendar(event) {
    setCssVar('windowHeight', window.outerHeight + 'px');
    setCssVar('calendarHeight', document.querySelector("main.calendar-item .day").offsetHeight + 'px');
}

function updateCalendar(event) {
    const header = document.querySelector("header.calendar-item");
    const events = document.querySelector("main.calendar-item");
    const container = document.querySelector(".days-container");
    header.innerHTML = events.innerHTML = "";

    for (let index = -14; index < 28; index++) {
        let dayDate = +new Date() + 8.64e7 * index;
        dayDate = new Date(dayDate);

        let day = ["ВС", "ПН","ВТ","СР","ЧТ","ПТ","СБ"][dayDate.getDay()];
        let date = dayDate.getDate();
        let month = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][dayDate.getMonth()];

        header.innerHTML += `<div class="day ${day == "ВС" ? "weekend" : ""}"><b>${day}</b>, ${date} ${month}</div>`;
        events.innerHTML += `<div class="day" id="day${dateconverter(dayDate).split("T")[0]}"></div>`;
    }

    container.scrollLeft = document.getElementById("day" + dateconverter(new Date).split("T")[0]).getBoundingClientRect().x - 50;
}

window.addEventListener('DOMContentLoaded', resizeCalendar);
window.addEventListener('DOMContentLoaded', updateCalendar);
window.addEventListener('resize', resizeCalendar);