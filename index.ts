/** Returns the string for the given month number. */
function getMonthStr(month: number): string {
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
        "December",
    ];
    const monthStr = months[month] ?? "";

    return monthStr;
}

/** Sets the month and year of given month and year.
 * @example
 * displayCalendarHeading(0, 2026, <h2> Month Year </h2>) // => <h2> January 2026 </h2>
 */
function displayCalendarHeading(date: Date, monthHeading: Element): string {
    const month = date.getMonth();
    const year = date.getFullYear();

    const calendarMonth = getMonthStr(month);
    const calendarYear = year.toString();
    const calendarHeading = `${calendarMonth} ${calendarYear}`;

    monthHeading.textContent = calendarHeading;

    return calendarHeading;
}

/** returns the last day of a given month */
function monthEndDate(month: number, year: number): number {
    const days30 = [3, 5, 8, 10];
    const days31 = [0, 2, 4, 6, 7, 9, 11];
    const isLeapYear = new Date(`February 29, ${year}`).getDate() === 29;

    if (days30.includes(month)) {
        return 30;
    } else if (days31.includes(month)) {
        return 31;
    } else if (isLeapYear) {
        return 29;
    }

    return 28;
}

/** Returns the previous month number */
function previousMonth(month: number): number {
    const jan = 0;
    const dec = 11;
    if (month !== jan) return month - 1;
    return dec;
}

/** Returns a Map of the week1 days and dates associated to this month */
function weekOneDatesThisMonth(dayOfWeek: number): Map<number, number> {
    const week = new Map();
    const daysInWeek = 7;
    const numDays = daysInWeek - dayOfWeek;

    let dayInLoop = dayOfWeek;
    let date = 1;

    while (week.size !== numDays) {
        week.set(dayInLoop, date);
        dayInLoop += 1;
        date += 1;
    }
    return week;
}

/** Returns a Map of the week1 days and dates associated to the last month */
function setFirstWeekDates(
    dayOfWeek: number,
    month: number,
    year: number,
): Map<number, number> {
    const firstWeek = weekOneDatesThisMonth(dayOfWeek);
    const daysInWeek = 7;
    const numDays = daysInWeek - firstWeek.size;
    const prevMonth = previousMonth(month);
    const prevMonthEnd = monthEndDate(prevMonth, year);

    let index = numDays - 1;
    let date = prevMonthEnd;
    while (firstWeek.size !== daysInWeek) {
        firstWeek.set(index, date);
        index -= 1;
        date -= 1;
    }
    return firstWeek;
}

/** sets the dates for the second week of the calendar */
function setSecondWeekDates(
    prevWeek: Map<number, number>,
    month: number,
    year: number,
): Map<number, number> {
    const week = new Map();
    const lastMonthEnd = monthEndDate(previousMonth(month), year);

    prevWeek.forEach((value, key) => {
        const daysInWeek = 7;
        const date = value + daysInWeek;
        if (date < lastMonthEnd) week.set(key, date);
        else {
            let newDate = date - lastMonthEnd;
            week.set(key, newDate);
            newDate -= 1;
        }
    });
    return week;
}

/** sets the dates for the middle weeks of the calendar */
function setMiddleWeekDates(
    prevWeek: Map<number, number>,
): Map<number, number> {
    const week = new Map();

    prevWeek.forEach((value, key) => {
        const daysInWeek = 7;
        const date = value + daysInWeek;

        week.set(key, date);
    });

    return week;
}

/** sets the dates for the first week of the calendar */
function setLastWeekDates(
    prevWeek: Map<number, number>,
    month: number,
    year: number,
): Map<number, number> {
    const week = new Map();
    const monthEnd = monthEndDate(month, year);
    const daysInWeek = 7;

    prevWeek.forEach((value, key) => {
        const date = value + daysInWeek;
        if (date > monthEnd) {
            let newDate = date - monthEnd;
            week.set(key, newDate);
        } else week.set(key, date);
    });

    return week;
}

/** Returns the day of the week the 1st of a given month fall on */
function getFirstOfMonth(month: number, year: number): number {
    const monthStr = getMonthStr(month);
    const firstDay = new Date(`${monthStr} 1, ${year}`).getDay();

    return firstDay;
}

/** Checks if the given month can be fully displayed in 5 weeks */
function isFiveWeeks(
    week4: Map<number, number>,
    week5: Map<number, number>,
    month: number,
    year: number,
): boolean {
    const hasLastDay: Array<boolean> = [];
    const monthEnd = monthEndDate(month, year);

    // Checking if monthEnd for February falls on week 4 Saturday
    hasLastDay.push(week4.get(6) === monthEnd);

    week5.forEach((value) => {
        hasLastDay.push(value === monthEnd);
    });

    return hasLastDay.includes(true);
}

/** Returns  an array of weeks*/
function getCalendarDates(date: Date): Array<Map<number, number>> {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = getFirstOfMonth(month, year);

    const week1 = setFirstWeekDates(firstDay, month, year);
    const week2 = setSecondWeekDates(week1, month, year);
    const week3 = setMiddleWeekDates(week2);
    const week4 = setMiddleWeekDates(week3);
    const week5 = setLastWeekDates(week4, month, year);
    const week6 = setLastWeekDates(week5, month, year);
    const weeks = [];
    weeks.push(week1, week2, week3, week4, week5);

    if (!(isFiveWeeks(week4, week5, month, year))) weeks.push(week6);
    return weeks;
}

/** Returns the next month number */
function followingMonth(month: number): number {
    const jan = 0;
    const dec = 11;
    if (month !== dec) return month + 1;
    return jan;
}

/** Returns the year based on the given month, year, and action type (previous or next)  */
function getNewYear(date: Date, action: string): number {
    const jan = 0;
    const dec = 11;
    const month = date.getMonth();
    const year = date.getFullYear();

    if (action === "previous" && month === jan) return year - 1;

    if (action === "next" && month === dec) return year + 1;

    return year;
}

/** Checks if the current calendar month and year is the same as today */
function isTodayMonthYear(calendarMonthYear: string): boolean {
    const today = new Date();
    const todayMonth = today.getMonth();

    const todayMonthYearStr = `${
        getMonthStr(todayMonth)
    } ${today.getFullYear()}`;

    return calendarMonthYear === todayMonthYearStr;
}

/** Checks if the current calendar month is the one that comes after today's month*/
function isTodayMonthYearAfter(calendarMonthYear: string): boolean {
    const today = new Date();
    const lastMonth = previousMonth(today.getMonth());
    const lastMonthYearStr = `${getMonthStr(lastMonth)} ${
        getNewYear(today, "previous")
    }`;

    return calendarMonthYear === lastMonthYearStr;
}

/** Checks if the current calendar month is the one that comes before today's month */
function isTodayMonthYearBefore(calendarMonthYear: string): boolean {
    const today = new Date();
    const nextMonth = followingMonth(today.getMonth());
    const nextMonthYearStr = `${getMonthStr(nextMonth)} ${
        getNewYear(today, "next")
    }`;

    return calendarMonthYear === nextMonthYearStr;
}

/** Sets the date for the td cell and returns the cell */
function displayDate(
    calWeek: HTMLCollection,
    dates: Map<number, number>,
    index: number,
): Element {
    const dayOfWeek = calWeek[index];
    const indexDate = dates.get(index);

    if (dayOfWeek === undefined || indexDate === undefined) {
        return document.createElement("td");
    }
    dayOfWeek.textContent = indexDate.toString() ?? null;

    return dayOfWeek;
}

/** Checks  if the index date is today's date */
function isDateTodayDate(dayDate: number): boolean {
    const todayDate = new Date().getDate();

    return dayDate === todayDate;
}

/** Checks if today's date falls on the first week of the last month's calendar */
function isPreviousMonthDate(
    calMonthYear: string,
    dayOfWeek: Element,
): boolean {
    const weekRow = dayOfWeek.parentElement;
    const dayDate = Number(dayOfWeek.textContent);
    const weekRowClassList = weekRow?.classList.value ?? "";

    const isFirstCalWeek = weekRowClassList.includes("week1");
    const isDateFromLastMonth = dayDate > 7; // 7 = largest date that can be in first week

    return isTodayMonthYearBefore(calMonthYear) && isFirstCalWeek
        && isDateTodayDate(dayDate)
        && isDateFromLastMonth;
}

/** Checks if today's date and month falls within the current calendar */
function isTodayMonthAndDate(
    calMonthYear: string,
    dayOfWeek: Element,
): boolean {
    const dayDate = Number(dayOfWeek.textContent);

    return isTodayMonthYear(calMonthYear) && isDateTodayDate(dayDate);
}

/** Checks if today's date falls on the first week of the last month's calendar */
function isNextMonthDate(calMonthYear: string, dayOfWeek: Element): boolean {
    const weekRow = dayOfWeek.parentElement;
    const dayDate = Number(dayOfWeek.textContent);
    const newMonth = [1, 2, 3, 4, 5, 6, 7];
    const weekRowClassList = weekRow?.classList.value ?? "";

    const isFirstCalWeek = weekRowClassList.includes("last-week");
    const isDateFromNextMonth = newMonth.includes(dayDate);

    return isTodayMonthYearAfter(calMonthYear) && isFirstCalWeek
        && isDateTodayDate(dayDate) && isDateFromNextMonth;
}

/** Sets the class "this week" to the tr if the calendar date matches today's date, month, year or removes it if it is not */
function setsThisWeekAndTodayClass(
    dayOfWeek: Element,
    calMonthYear: string,
): void {
    const weekRow = dayOfWeek.parentElement;

    if (weekRow === null) return;
    if (isPreviousMonthDate(calMonthYear, dayOfWeek)) {
        dayOfWeek.classList.add("today");
        weekRow?.classList.add("this-week");
    } else if (isTodayMonthAndDate(calMonthYear, dayOfWeek)) {
        dayOfWeek.classList.add("today");
        weekRow?.classList.add("this-week");
    } else if (isNextMonthDate(calMonthYear, dayOfWeek)) {
        dayOfWeek.classList.add("today");
        weekRow?.classList.add("this-week");
    }
}

/** Sets the "other-mo" class on the appropriate cell */
function setOtherMoClass(weekType: string, dayOfWeek: Element): void {
    const dayDate = Number(dayOfWeek.textContent);
    const newMonth = [1, 2, 3, 4, 5, 6, 7];
    const isDateFromNextMonth = newMonth.includes(dayDate);

    // 7 = largest date that can be in first week
    if (weekType.includes("week1") && dayDate > 7) {
        dayOfWeek.classList.add("other-mo");
    } else if (weekType.includes("last-week") && isDateFromNextMonth) {
        dayOfWeek.classList.add("other-mo");
    } else {
        dayOfWeek.classList.remove("other-mo");
    }
}

/** Displays the dates for each day of the week for a given calendar week. */
function displayWeekDates(
    tableWeek: HTMLTableRowElement,
    dates: Map<number, number>,
    calMonthYear: string,
): void {
    const calWeek = tableWeek?.children;
    const weekType = tableWeek?.classList.value;

    let index = 0;
    while (dates.size > index) {
        const dayOfWeek = displayDate(calWeek, dates, index);
        setsThisWeekAndTodayClass(dayOfWeek, calMonthYear);
        setOtherMoClass(weekType, dayOfWeek);

        index += 1;
    }
}

/** Sets week6 classes*/
function setWeek6Classes(
    isFinalWeekDates: boolean,
    trs: NodeListOf<HTMLTableRowElement>,
    index: number,
): void {
    const week6 = trs[6];
    const week5 = trs[5];
    const currentWeek = trs[index];

    if (isFinalWeekDates && currentWeek === week6) {
        week6?.classList.add("last-week");
        week5?.classList.remove("last-week");
    }

    const isWeek6LastWeek = currentWeek === week6;
    const hasClass = week6?.className.includes("last-week");
    const isWeek6LastWeekWithClass = isFinalWeekDates && !isWeek6LastWeek
        && hasClass;
    if (isWeek6LastWeekWithClass) {
        week5?.classList.add("last-week");
        week6?.classList.remove("last-week");
    }
}

/** displays dates in the calendar table */
function displayCalendarDates(
    trs: NodeListOf<HTMLTableRowElement>,
    calendarDates: Array<Map<number, number>>,
    calMonthYear: string,
): void {
    const totalWeeks = calendarDates.length;
    const finalWeekIndex = totalWeeks - 1;

    let index = 1; // to exclude the thead row
    for (const week of calendarDates) {
        const tableWeek = trs[index];
        const isFinalWeekDates = calendarDates[finalWeekIndex] === week;
        if (!tableWeek) return;

        setWeek6Classes(isFinalWeekDates, trs, index);
        displayWeekDates(tableWeek, week, calMonthYear);
        index += 1;
    }
}

/** Resets the this-week and today classes on click */
function resetThisWeekAndToday(): void {
    const today = document.querySelector(".today");
    const weekRow = today?.parentElement;

    if (today) {
        today.classList.remove("today");
        weekRow?.classList.remove("this-week");
    }
}

/** Display previous calendar month */
function displayPreviousMonth(
    trs: NodeListOf<HTMLTableRowElement>,
    monthHeading: Element,
): string {
    const currentMonth = new Date(monthHeading.textContent);
    const lastMonth = new Date(
        getNewYear(currentMonth, "previous"),
        previousMonth(currentMonth.getMonth()),
        currentMonth.getDate(),
    );
    displayCalendarHeading(lastMonth, monthHeading);
    displayCalendarDates(
        trs,
        getCalendarDates(lastMonth),
        monthHeading.textContent,
    );

    return monthHeading.textContent;
}

/** Display previous calendar month */
function displayNextMonth(
    trs: NodeListOf<HTMLTableRowElement>,
    monthHeading: Element,
): string {
    const currentMonth = new Date(monthHeading.textContent);
    const nextMonth = new Date(
        getNewYear(currentMonth, "next"),
        followingMonth(currentMonth.getMonth()),
        currentMonth.getDate(),
    );
    displayCalendarHeading(nextMonth, monthHeading);
    displayCalendarDates(
        trs,
        getCalendarDates(nextMonth),
        monthHeading.textContent,
    );

    return monthHeading.textContent;
}

function main(): void {
    const monthHeading = document.querySelector("div.current h2");
    const trs = document.querySelectorAll("tr");
    const previousBtn = document.querySelector("button.prev");
    const nextBtn = document.querySelector("button.next");

    if (!monthHeading) return;
    const today = new Date();
    displayCalendarHeading(today, monthHeading);
    displayCalendarDates(
        trs,
        getCalendarDates(today),
        monthHeading.textContent,
    );

    previousBtn?.addEventListener("click", () => {
        resetThisWeekAndToday();
        displayPreviousMonth(trs, monthHeading);
    });

    nextBtn?.addEventListener("click", () => {
        resetThisWeekAndToday();
        displayNextMonth(trs, monthHeading);
    });
}

main();
