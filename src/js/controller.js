import moment from "moment";

const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { dayInput, monthInput, yearInput } = e.target.elements;

    let isAnyInputsEmpty = false;

    [dayInput, monthInput, yearInput].forEach((el) => {
        if (!el.value) {
            renderInputError(el, "This field is required");
            isAnyInputsEmpty = true;
        } else {
            resetInput(el);
        }
    });

    if (!isAnyInputsEmpty) {
        const birthDate = moment({
            year: Number(yearInput.value),
            month: Number(monthInput.value) - 1,
            day: Number(dayInput.value),
        });

        if (birthDate.isValid() && isValidYear(yearInput)) {
            const age = calcAge(birthDate);
            renderAge(age);
        } else {
            if (birthDate.invalidAt() === 1) {
                renderInputError(monthInput, "Must be a valid month");
            }

            if (birthDate.invalidAt() === 2) {
                renderInputError(dayInput, "Must be a valid day");
            }
        }
    }
});

function calcAge(birthDate) {
    const today = new Date();
    const age = {};
    // today date < birth day date and today month < bd month => give 30 days to days, give 1 year to months
    if (today.getMonth() < birthDate.month && today.getDate() < birthDate.day) {
        age.years = today.getFullYear() - birthDate.year - 1;
        age.months = today.getMonth() - birthDate.month + 12 - 1;
        age.days = today.getDate() + 30 - birthDate.day;
    } else if (today.getMonth() < birthDate.month && today.getDate() >= birthDate.day) {
        age.years = today.getFullYear() - birthDate.year - 1;
        age.months = today.getMonth() - birthDate.month + 12;
        age.days = today.getDate() - birthDate.day;
    } else if (today.getMonth() >= birthDate.month && today.getDate() < birthDate.day) {
        if (today.getMonth() - birthDate.month - 1 >= 0) {
            age.years = today.getFullYear() - birthDate.year;
            age.months = today.getMonth() - birthDate.month - 1;
            age.days = today.getDate() + 30 - birthDate.day;
        } else {
            age.years = today.getFullYear() - birthDate.year - 1;
            age.months = today.getMonth() - birthDate.month + 12 - 1;
            age.days = today.getDate() + 30 - birthDate.day;
        }
    } else {
        age.years = today.getFullYear() - birthDate.year;
        age.months = today.getMonth() - birthDate.month;
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

function isValidYear(yearEl) {
    const year = Number(yearEl.value);
    if (year >= new Date().getFullYear()) {
        renderInputError(yearEl, "Must be in the past");
        return false;
    }

    if (year < 0 || !Number.isInteger(year)) {
        renderInputError(yearEl, "Must be a valid year");
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
