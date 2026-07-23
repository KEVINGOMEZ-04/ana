// timeCalculator.js - Cálculos de tiempo basados en la fecha de nacimiento.

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;
const MS_IN_YEAR = MS_IN_DAY * 365.2425;
export const HEART_RATE_BPM = 72; // Promedio razonable de latidos por minuto en adultos.
export const BREATH_RATE_PMP = 16; // Promedio razonable de respiraciones por minuto en reposo.

const formatNumber = (value, digits = 0) => {
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
};

const getExactAgeComponents = (birthDate, now) => {
  const age = {
    years: now.getFullYear() - birthDate.getFullYear(),
    months: now.getMonth() - birthDate.getMonth(),
    days: now.getDate() - birthDate.getDate(),
    hours: now.getHours() - birthDate.getHours(),
    minutes: now.getMinutes() - birthDate.getMinutes(),
    seconds: now.getSeconds() - birthDate.getSeconds(),
  };

  if (age.seconds < 0) {
    age.seconds += 60;
    age.minutes -= 1;
  }

  if (age.minutes < 0) {
    age.minutes += 60;
    age.hours -= 1;
  }

  if (age.hours < 0) {
    age.hours += 24;
    age.days -= 1;
  }

  if (age.days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    age.days += previousMonth.getDate();
    age.months -= 1;
  }

  if (age.months < 0) {
    age.months += 12;
    age.years -= 1;
  }

  return age;
};

const getNextBirthday = (birthDate, now) => {
  const currentYear = now.getFullYear();
  const nextBirthday = new Date(birthDate);
  nextBirthday.setFullYear(currentYear);

  if (nextBirthday <= now) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  return nextBirthday;
};

const getCountdownTo = (targetDate, now) => {
  const distance = Math.max(0, targetDate - now);
  const days = Math.floor(distance / MS_IN_DAY);
  const hours = Math.floor((distance % MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((distance % MS_IN_HOUR) / MS_IN_MINUTE);
  const seconds = Math.floor((distance % MS_IN_MINUTE) / MS_IN_SECOND);

  return { days, hours, minutes, seconds };
};

export const getBirthDate = (config) => {
  if (!config.birthDateISO) {
    throw new Error('birthDateISO no está definido en config.js');
  }
  return new Date(config.birthDateISO);
};

export const getTimeData = (birthDate, now = new Date()) => {
  const age = getExactAgeComponents(birthDate, now);
  const elapsedMs = now - birthDate;
  const secondsLived = Math.floor(elapsedMs / MS_IN_SECOND);
  const minutesLived = Math.floor(elapsedMs / MS_IN_MINUTE);
  const hoursLived = Math.floor(elapsedMs / MS_IN_HOUR);
  const daysLived = Math.floor(elapsedMs / MS_IN_DAY);
  const nextBirthday = getNextBirthday(birthDate, now);
  const countdown = getCountdownTo(nextBirthday, now);
  const earthRevolutions = elapsedMs / MS_IN_YEAR;
  const yearsSlept = (hoursLived / 3) / 24 / 365.2425;

  return {
    years: age.years,
    months: age.months,
    days: age.days,
    hours: age.hours,
    minutes: age.minutes,
    seconds: age.seconds,
    daysLived,
    hoursLived,
    minutesLived,
    secondsLived,
    nextBirthday,
    nextBirthdayLabel: new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(nextBirthday),
    countdown,
    heartBeats: Math.floor((secondsLived / 60) * HEART_RATE_BPM),
    breaths: Math.floor((secondsLived / 60) * BREATH_RATE_PMP),
    sunrises: daysLived,
    sunsets: daysLived,
    earthRevolutions: parseFloat(earthRevolutions.toFixed(2)),
    moonCycles: Math.floor(daysLived / 29.53059),
    yearsSlept: parseFloat(yearsSlept.toFixed(2)),
    approximateAgeText: `${age.years} años, ${age.months} meses, ${age.days} días`,
    formatted: {
      years: formatNumber(age.years),
      months: formatNumber(age.months),
      days: formatNumber(age.days),
      hours: formatNumber(age.hours),
      minutes: formatNumber(age.minutes),
      seconds: formatNumber(age.seconds),
      daysLived: formatNumber(daysLived),
      hoursLived: formatNumber(hoursLived),
      minutesLived: formatNumber(minutesLived),
      secondsLived: formatNumber(secondsLived),
      heartBeats: formatNumber(Math.floor((secondsLived / 60) * HEART_RATE_BPM)),
      breaths: formatNumber(Math.floor((secondsLived / 60) * BREATH_RATE_PMP)),
      sunrises: formatNumber(daysLived),
      sunsets: formatNumber(daysLived),
      earthRevolutions: formatNumber(earthRevolutions, 2),
      moonCycles: formatNumber(Math.floor(daysLived / 29.53059)),
      yearsSlept: formatNumber(yearsSlept, 2),
    }
  };
};

export const formatCountdown = (countdown) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(countdown.days)}d ${pad(countdown.hours)}h ${pad(countdown.minutes)}m ${pad(countdown.seconds)}s`;
};

export const formatNumberValue = formatNumber;
