const token =
    /d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g
const timezone =
    /\b(?:[A-Z]{1,3}[A-Z][TC])(?:[-+]\d{4})?|((?:Australian )?(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time)\b/g
const timezoneClip = /[^-+\dA-Z]/g

export type MaskType = keyof typeof masks

interface DayNameParams {
    y: number
    m: number
    d: number
    _: "get" | "getUTC"
    dayName: string
    short?: boolean
}

function pad(val: number, len: number = 2): string {
    const valStr = String(val)
    return valStr.length < len
        ? "0".repeat(len - valStr.length) + valStr
        : valStr
}

export default function dateFormat(
    date?: string | number | Date,
    mask?: string,
    utc: boolean = false,
    gmt: boolean = false,
): string {
    if (
        arguments.length === 1 &&
        typeof date === "string" &&
        !/\d/.test(date)
    ) {
        mask = date
        date = undefined
    }

    date = date || date === 0 ? date : new Date()

    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    if (isNaN(date.getTime())) {
        throw new TypeError("Invalid date")
    }

    mask = String(masks[mask as MaskType] || mask || masks.default)

    const maskSlice = mask.slice(0, 4)
    if (maskSlice === "UTC:" || maskSlice === "GMT:") {
        mask = mask.slice(4)
        utc = true
        if (maskSlice === "GMT:") {
            gmt = true
        }
    }

    const dateMethods = {
        getDate: date[utc ? "getUTCDate" : "getDate"].bind(date),
        getDay: date[utc ? "getUTCDay" : "getDay"].bind(date),
        getMonth: date[utc ? "getUTCMonth" : "getMonth"].bind(date),
        getFullYear: date[utc ? "getUTCFullYear" : "getFullYear"].bind(date),
        getHours: date[utc ? "getUTCHours" : "getHours"].bind(date),
        getMinutes: date[utc ? "getUTCMinutes" : "getMinutes"].bind(date),
        getSeconds: date[utc ? "getUTCSeconds" : "getSeconds"].bind(date),
        getMilliseconds:
            date[utc ? "getUTCMilliseconds" : "getMilliseconds"].bind(date),
        getTimezoneOffset: utc ? () => 0 : date.getTimezoneOffset.bind(date),
    }

    const d = () => dateMethods.getDate()
    const D = () => dateMethods.getDay()
    const m = () => dateMethods.getMonth()
    const y = () => dateMethods.getFullYear()
    const H = () => dateMethods.getHours()
    const M = () => dateMethods.getMinutes()
    const s = () => dateMethods.getSeconds()
    const L = () => dateMethods.getMilliseconds()
    const o = () => dateMethods.getTimezoneOffset()
    const W = () => getWeek(date as Date)
    const N = () => getDayOfWeek(date as Date)

    const flags: { [key: string]: () => string | number } = {
        d: () => d(),
        dd: () => pad(d()),
        ddd: () => i18n.dayNames[D()],
        DDD: () =>
            getDayName({
                y: y(),
                m: m(),
                d: d(),
                _: utc ? "getUTC" : "get",
                dayName: i18n.dayNames[D()],
                short: true,
            }),
        dddd: () => i18n.dayNames[D() + 7],
        DDDD: () =>
            getDayName({
                y: y(),
                m: m(),
                d: d(),
                _: utc ? "getUTC" : "get",
                dayName: i18n.dayNames[D() + 7],
            }),
        m: () => m() + 1,
        mm: () => pad(m() + 1),
        mmm: () => i18n.monthNames[m()],
        mmmm: () => i18n.monthNames[m() + 12],
        yy: () => String(y()).slice(2),
        yyyy: () => pad(y(), 4),
        h: () => H() % 12 || 12,
        hh: () => pad(H() % 12 || 12),
        H: () => H(),
        HH: () => pad(H()),
        M: () => M(),
        MM: () => pad(M()),
        s: () => s(),
        ss: () => pad(s()),
        l: () => pad(L(), 3),
        L: () => pad(Math.floor(L() / 10)),
        t: () => (H() < 12 ? i18n.timeNames[0] : i18n.timeNames[1]),
        tt: () => (H() < 12 ? i18n.timeNames[2] : i18n.timeNames[3]),
        T: () => (H() < 12 ? i18n.timeNames[4] : i18n.timeNames[5]),
        TT: () => (H() < 12 ? i18n.timeNames[6] : i18n.timeNames[7]),
        Z: () => (gmt ? "GMT" : utc ? "UTC" : formatTimezone(date as Date)),
        o: () =>
            (o() > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(o()) / 60) * 100 + (Math.abs(o()) % 60), 4),
        p: () =>
            (o() > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(o()) / 60), 2) +
            ":" +
            pad(Math.floor(Math.abs(o()) % 60), 2),
        S: () => {
            const date = d()
            const dayMod10 = date % 10
            const dayMod100 = date % 100
            const suffixIndex =
                dayMod10 > 3 || dayMod100 - dayMod10 === 10 ? 0 : dayMod10
            return ["th", "st", "nd", "rd"][suffixIndex]
        },
        W: () => W(),
        WW: () => pad(W()),
        N: () => N(),
    }

    return mask.replace(token, (match) => {
        if (match in flags) {
            return String(flags[match]())
        }
        return match.slice(1, match.length - 1)
    })
}

export const masks = {
    default: "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    paddedShortDate: "mm/dd/yyyy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z",
}

export const i18n = {
    dayNames: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ],
    monthNames: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
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
    ],
    timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"],
}

function getWeek(date: Date): number {
    const target = new Date(date.valueOf())
    const dayNr = (date.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)
    const firstThursday = target.valueOf()
    target.setMonth(0, 1)
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

function getDayOfWeek(date: Date): number {
    const target = new Date(date.valueOf())
    return ((target.getDay() + 6) % 7) + 1
}

function getDayName({y, m, d, _, dayName, short}: DayNameParams): string {
    const date = new Date(y, m, d)
    const dayIndex = date[`${_}Day` as "getDay" | "getUTCDay"]()
    const dayNames = short ? i18n.dayNames.slice(0, 7) : i18n.dayNames.slice(7)
    return dayNames[dayIndex]
}

function formatTimezone(date: Date): string {
    const offset = date.getTimezoneOffset()
    const absOffset = Math.abs(offset)
    const sign = offset > 0 ? "-" : "+"
    const hours = pad(Math.floor(absOffset / 60), 2)
    const minutes = pad(absOffset % 60, 2)
    return `GMT${sign}${hours}:${minutes}`
}
