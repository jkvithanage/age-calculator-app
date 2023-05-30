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
    const today = moment();
    const age = {};
    // today date < birth day date and today month < bd month => give 30 days to days, give 1 year to months
    if (today.month() < birthDate.month() && today.date() < birthDate.date()) {
        age.years = today.year() - birthDate.year() - 1;
        age.months = today.month() - birthDate.month() + 12 - 1;
        age.days = today.date() + 30 - birthDate.date();
    } else if (today.month() < birthDate.month() && today.date() >= birthDate.date()) {
        age.years = today.year() - birthDate.year() - 1;
        age.months = today.month() - birthDate.month() + 12;
        age.days = today.date() - birthDate.date();
    } else if (today.month() >= birthDate.month() && today.date() < birthDate.date()) {
        if (today.month() - birthDate.month() - 1 >= 0) {
            age.years = today.year() - birthDate.year();
            age.months = today.month() - birthDate.month() - 1;
            age.days = today.date() + 30 - birthDate.date();
        } else {
            age.years = today.year() - birthDate.year() - 1;
            age.months = today.month() - birthDate.month() + 12 - 1;
            age.days = today.date() + 30 - birthDate.date();
        }
    } else {
        age.years = today.year() - birthDate.year();
        age.months = today.month() - birthDate.month();
        age.days = today.date() - birthDate.date();
    }

    return age;
}

function renderAge(age) {
    const yearsEl = document.querySelector(".output-years");
    const monthsEl = document.querySelector(".output-months");
    const daysEl = document.querySelector(".output-days");

    counter(age.years, yearsEl);
    setTimeout(() => {
        counter(age.months, monthsEl);
        setTimeout(() => {
            counter(age.days, daysEl);
        }, 200);
    }, 100);
}

function counter(end, el) {
    let num = 0;
    const s = setInterval(function () {
        el.innerHTML = num;
        num++;
        if (num === end) {
            clearInterval(s);
        }
    }, 30);
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
