import React, {Dispatch, FC, SetStateAction} from "react"
import {ColorValue, StyleSheet, Text, TouchableOpacity} from "react-native"
import {customStyles} from "../helpers/styleHelper";
import {useConfiguration} from "../hooks/useConfiguration";

type Day = {
    year: number
    month: number
    date: number
    isCurrentMonth: boolean
    disabled: boolean
}
export type Output = {
    date: Date | null
    startDate: Date | null
    endDate: Date | null
}
type colorOptions = {
    dateTextColor: ColorValue
    backgroundColor: ColorValue
    selectedDateTextColor: ColorValue
    selectedDateBackgroundColor: ColorValue
}
export type Mode = "single" | "range"
type KeyProps = {
    colorOptions: colorOptions
    Day: Day
    mode: Mode
    output: Output
    setOutput: Dispatch<SetStateAction<Output>>
}

const todayDate = new Date()

const Key: FC<KeyProps> = ({
                               colorOptions,
                               Day,
                               mode,
                               output,
                               setOutput,
                           }: KeyProps) => {
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth()
    const currentDate = todayDate.getDate()
    const {customDateConfig} = useConfiguration()

    const {
        dateTextColor,
        backgroundColor,
        selectedDateTextColor,
        selectedDateBackgroundColor,
        currentDayColor
    } = customDateConfig.colorConfigs
    const singleMode = mode === "single"
    const rangeMode = mode === "range"

    const isThisDayCurrent =
        currentYear === Day.year &&
        currentDate === Day.date &&
        currentMonth === Day.month

    const onKeyPress = () => {
        if (Day.disabled) return

        const newDate = new Date(Day.year, Day.month, Day.date)

        const shouldSetStartDate =
            (!output.startDate || output.endDate) ??
            newDate.getTime() < output.startDate?.getTime()

        if (singleMode) {
            const newOutPut = {...output, date: newDate}
            setOutput(newOutPut)
            return
        }

        if (rangeMode) {
            if (shouldSetStartDate) {
                const newOutPut = {...output, startDate: newDate, endDate: null}
                setOutput(newOutPut)
            } else {
                const newOutPut = {...output, endDate: newDate}
                setOutput(newOutPut)
            }
        }
    }

    const getColor = () => {
        const selectedColors = {
            bgc: selectedDateBackgroundColor,
            text: selectedDateTextColor,
        }
        const notSelectedColors = {bgc: backgroundColor, text: dateTextColor}
        const disabledColors = {
            bgc: backgroundColor,
            text: `${dateTextColor.toString()}55`,
        }

        if (!Day.isCurrentMonth) {
            selectedColors.bgc = selectedDateBackgroundColor.toString() + "22"
            notSelectedColors.text = dateTextColor.toString() + "22"
            disabledColors.text = dateTextColor.toString() + "22"
        }

        const timeOfThisKey = new Date(Day.year, Day.month, Day.date).getTime()

        if (Day.disabled) return disabledColors

        if (singleMode) {
            const date = output.date as Date
            const isThisDateSelected = timeOfThisKey === date.getTime()
            return isThisDateSelected ? selectedColors : notSelectedColors
        }

        if (!output.endDate) {
            return timeOfThisKey === output.startDate?.getTime()
                ? selectedColors
                : notSelectedColors
        }

        const startDate = output.startDate as Date
        const isThisDayInSelectedRange =
            timeOfThisKey >= startDate.getTime() &&
            timeOfThisKey <= output.endDate.getTime()
        return isThisDayInSelectedRange ? selectedColors : notSelectedColors
    }

    const {bgc, text: textColor} = getColor()

    return (
        <TouchableOpacity
            onPress={onKeyPress}
            style={[
                styles.keys,
                {backgroundColor: bgc},
                isThisDayCurrent
                    ? {
                        ...customStyles.border(
                            1,
                            "solid",
                            currentDayColor,
                        ),
                    }
                    : {},
            ]}
        >
            <Text style={[styles.keys_text, {color: textColor}]}>
                {" "}
                {Day.date}{" "}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    keys: {
        width: 34,
        height: 34,
        borderRadius: 34,
        marginTop: 4,
        marginHorizontal: 4,
        justifyContent: "center",
        alignItems: "center",
    },

    keys_text: {
        fontSize: 16,
        fontWeight: "500",
    },
})

export default Key
