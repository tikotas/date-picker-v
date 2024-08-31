import {useEffect, useState} from "react"

export type DaysArray = {
    date: number
    disabled: boolean
    isCurrentMonth: boolean
    month: number
    year: number
}

export const useDaysOfMonth = (
    inputYear: number,
    inputMonth: number,
    minTime?: number,
    maxTime?: number,
): DaysArray[] => {
    const [dateArray, setDateArray] = useState<DaysArray[]>([])

    const days = new Date(inputYear, inputMonth + 1, 0).getDate()

    // Adjust to make Monday the first day of the week
    const firstDay = (new Date(inputYear, inputMonth, 1).getDay() + 6) % 7

    const prevMonthDays = new Date(inputYear, inputMonth, 0).getDate()

    const createDateArray = () => {
        let arr = Array.from(Array(days), (_, i) => {
            return {
                year: inputYear,
                month: inputMonth,
                date: i + 1,
                isCurrentMonth: true,
                disabled: false,
            }
        })

        let daysShouldInsert = firstDay
        let insertedNumber = prevMonthDays

        // Insert previous month's days at the beginning of the array
        while (daysShouldInsert > 0) {
            const insertingTime = {
                year: inputYear,
                month: inputMonth - 1,
                date: insertedNumber,
                isCurrentMonth: false,
                disabled: false,
            }
            arr.unshift(insertingTime)
            insertedNumber--
            daysShouldInsert--
        }

        let blankInEnd = arr.length % 7
        if (blankInEnd !== 0) blankInEnd = 7 - blankInEnd
        let i = 1

        // Insert next month's days at the end of the array
        while (blankInEnd > 0) {
            const insertingTime = {
                year: inputYear,
                month: inputMonth + 1,
                date: i,
                isCurrentMonth: false,
                disabled: false,
            }
            arr.push({...insertingTime})
            i++
            blankInEnd--
        }

        if (minTime ?? maxTime) {
            const checkShouldDisabled = (day: DaysArray) => {
                const thisKeyTime = new Date(
                    day.year,
                    day.month,
                    day.date,
                ).getTime()
                let shouldDisableKey = false
                if (maxTime && thisKeyTime > maxTime) shouldDisableKey = true
                if (minTime && thisKeyTime < minTime) shouldDisableKey = true
                const disableKey = shouldDisableKey
                return {...day, disabled: disableKey}
            }
            arr = arr.map(checkShouldDisabled)
        }

        return arr
    }

    useEffect(() => {
        setDateArray(createDateArray())
    }, [inputYear, inputMonth, minTime, maxTime])

    return dateArray
}
