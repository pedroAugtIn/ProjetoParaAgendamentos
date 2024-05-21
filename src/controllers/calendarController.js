const daysContainer = document.querySelector(".days");
nextBtn = document.querySelector(".next-btn"),
prevBtn = document.querySelector(".prev-btn"),
month = document.querySelector('.month'),
todayBtn = document.querySelector('.today-btn')

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// pegando a data atual
const date = new Date();

// pegando o mês atual
let currentMonth = date.getMonth();

// pegando o ano
let currentYear = date.getFullYear();

// função para renderizar dias
function renderCalendar(){
    // pegando os dias do mês anterior, atual e próximo
    date.setDate(1);
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;

    // atualizar o ano e mês atual no header
    month.innerHTML = `${months[currentMonth]} ${currentYear}`;

    // atualizar os dias no html
    let days = "";

    for(let x = firstDay.getDay(); x > 0; x--){
        days += `<div class="day prev">${prevLastDayDate -x + 1}</div>`;
    }

    // dias do mês atual
    for(let i = 1; i <= lastDayDate; i++){
        let currentDay = new Date(currentYear, currentMonth, i);
        let dayOfWeek = currentDay.getDay();
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            days += `<div class="day prev">${i}</div>`;
        } else if (
            i === new Date().getDate() && 
            currentMonth === new Date().getMonth() && 
            currentYear === new Date().getFullYear()
        ) {
            // se dia mes e ano baterem = dia atual
            days += `<div class="day today">${i}</div>`
        } else if(
            i < new Date().getDate() && 
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear() 
        ) {
            days += `<div class="day prev">${i}</div>`
        } else if (
            i === 1 && currentMonth === 0 ||
            i === 12 && currentMonth === 1 ||
            i === 13 && currentMonth === 1 ||
            i === 29 && currentMonth === 2 || 
            i === 31 && currentMonth === 2 ||
            i === 21 && currentMonth === 3 ||
            i === 1 && currentMonth === 4 ||
            i === 30 && currentMonth === 4 ||
            i === 7 && currentMonth === 8 ||
            i === 12 && currentMonth === 9 ||
            i === 2 && currentMonth === 10 ||
            i === 15 && currentMonth === 10 ||
            i === 20 && currentMonth === 10 ||
            i === 25 && currentMonth === 11 
        ) {
            days += `<div class="day prev">${i}</div>`
        }  else {
            days += `<div class="day available">${i}</div>`
        }
    }

    // Dias do mês seguinte
    for(let j= 1; j<= nextDays; j++){
        days += `<div class="day next">${j}</div>`
    }

    hideTodayBtn();
    daysContainer.innerHTML = days;

    // Adiciona evento de clique para cada dia
    document.querySelectorAll('.available').forEach(day => {
        day.addEventListener('click', function() {
            const date = this.getAttribute('data-date');
            document.getElementById('popup-date').innerText = date;
            document.getElementById('popup').style.display = 'block';
        });
    });
}

renderCalendar();

// adicionando evento no botão para avançar o mês
nextBtn.addEventListener("click", () => {
    // aumentando em 1 no mês atual
    currentMonth++;
    if(currentMonth > 11) {
        currentMonth = 0;
        currentYear++
    } 
    renderCalendar();
})

// adicionando evento no botão para retornar o mês
prevBtn.addEventListener("click", () => {
    currentMonth--;
    if(currentMonth < 0) {
        currentMonth = 11;
        currentYear--
    }
    renderCalendar();
});

// ir para o dia/mes atual
todayBtn.addEventListener("click", () => {
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    renderCalendar()
});

// ocultar o botão ir para o dia/mes atual se já estivermos nele
function hideTodayBtn(){
    if(
        currentMonth == new Date().getMonth() &&
        currentYear === new Date().getFullYear()
    ) {
        todayBtn.style.display = "none";
        prevBtn.style.display = "none";
    } else {
        todayBtn.style.display = "flex"
        prevBtn.style.display = "flex"
    }
};

// Função para fechar o pop-up
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

// Função para fechar o pop-up clicando fora do conteúdo
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('popup')) {
        document.getElementById('popup').style.display = 'none';
    }
});