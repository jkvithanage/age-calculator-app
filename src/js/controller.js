const btnSubmit = document.querySelector(".btn-submit");
const form = document.querySelector(".form");

const birthDate = {};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { dayInput, monthInput, yearInput } = e.target.elements;

    if (!isEmpty(dayInput) && isValidDay(dayInput)) {
        birthDate.day = Number(dayInput.value);
    }

    if (!isEmpty(monthInput) && isValidMonth(monthInput)) {
        birthDate.month = Number(monthInput.value);
    }

    if (!isEmpty(yearInput) && isValidYear(yearInput)) {
        birthDate.year = Number(yearInput.value);
    }

    if (birthDate.day && birthDate.month && birthDate.year) {
        const age = calcAge();
        renderAge(age);
    }
});

function calcAge() {
    const today = new Date();
    const age = {};
    if (today.getMonth() - 1 < birthDate.month && today.getDate() < birthDate.day) {
        age.years = today.getFullYear() - 1 - birthDate.year;
        age.months = today.getMonth() + 1 - birthDate.month + 12 - 1;
        age.days = today.getDate() + 30 - birthDate.day;
    } else if (today.getMonth() - 1 < birthDate.month) {
        age.years = today.getFullYear() - 1 - birthDate.year;
        age.months = today.getMonth() + 1 - birthDate.month + 12;
        age.days = today.getDate() - birthDate.day;
    } else if (today.getDate() < birthDate.day) {
        age.years = today.getFullYear() - birthDate.year;
        age.months = today.getMonth() + 1 - birthDate.month - 1;
        age.days = today.getDate() + 30 - birthDate.day;
    } else {
        age.years = today.getFullYear() - birthDate.year;
        age.months = today.getMonth() + 1 - birthDate.month;
        age.days = today.getDate() - birthDate.day;
    }

    return age;
}

function renderAge(age) {
    const yearsEl = document.querySelector(".output-years");
    const monthsEl = document.querySelector(".output-months");
    const daysEl = document.querySelector(".output-days");

    yearsEl.innerHTML = age.years;
    monthsEl.innerHTML = age.months;
    daysEl.innerHTML = age.days;
}

function isEmpty(el) {
    if (!el.value) {
        renderInputError(el, "This field is required");
        return true;
    }

    resetInput(el);
    return false;
}

function isValidDay(dayEl) {
    if (dayEl.value < 1 || dayEl.value > 31) {
        renderInputError(dayEl, "Must be a valid day");
        return false;
    }

    resetInput(dayEl);
    return true;
}

function isValidMonth(monthEl) {
    if (monthEl.value < 1 || monthEl.value > 12) {
        renderInputError(monthEl, "Must be a valid month");
        return false;
    }

    resetInput(monthEl);
    return true;
}

function isValidYear(yearEl) {
    if (Number(yearEl.value) > new Date().getFullYear()) {
        renderInputError(yearEl, "Must be in the past");
        return false;
    }

    resetInput(yearEl);
    return true;
}

function renderInputError(el, message) {
    el.nextElementSibling.innerHTML = message;
    el.classList.add("border-error");
    el.previousElementSibling.classList.add("label-error");
}

function resetInput(el) {
    el.nextElementSibling.innerHTML = "";
    el.classList.remove("border-error");
    el.previousElementSibling.classList.remove("label-error");
}
