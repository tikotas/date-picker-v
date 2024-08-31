import {useTranslation} from "react-i18next"
import Modal from "react-native-modal"

import React, {Fragment, useEffect, useMemo, useState} from "react"
import format from "../helpers/dateformat"
import ChangeYearModal from "./ChangeYearModal"
import {
    ColorValue,
    Dimensions,
    I18nManager,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native"
import {LanguageConverterType} from "~utils/languageConfigs"
import {COLORS} from "~constants/colors"
import {DaysArray, useDaysOfMonth} from "../hooks/useDaysOfMonth";
import Key, {Mode, Output} from "./Key";
import {customStyles} from "../helpers/styleHelper";
import {ChevronLeftSvg, ChevronRightSvg} from "../svg";

I18nManager.allowRTL(false)
const winY = Dimensions.get("screen").height

export type ColorOptions = {
    backgroundColor?: ColorValue
    headerColor?: ColorValue
    headerTextColor?: ColorValue
    changeYearModalColor?: ColorValue
    weekDaysColor?: ColorValue
    dateTextColor?: ColorValue
    selectedDateTextColor?: ColorValue
    selectedDateBackgroundColor?: ColorValue
    confirmButtonColor?: ColorValue
    cancelButtonColor?: ColorValue
}

type DateStringOptions =
    | "ddd mmm dd yyyy HH:MM:ss"
    | "default"
    | "m/d/yy"
    | "shortDate"
    | "mm/dd/yyyy"
    | "paddedShortDate"
    | "mmm d, yyyy"
    | "mediumDate"
    | "mmmm d, yyyy"
    | "longDate"
    | "dddd, mmmm d, yyyy"
    | "fullDate"
    | "h:MM TT"
    | "shortTime"
    | "h:MM:ss TT"
    | "mediumTime"
    | "h:MM:ss TT Z"
    | "longTime"
    | "yyyy-mm-dd"
    | "isoDate"
    | "HH:MM:ss"
    | "isoTime"
    | "yyyy-mm-dd'T'HH:MM:sso"
    | "isoDateTime"
    | "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    | "isoUtcDateTime"
    | "ddd, dd mmm yyyy HH:MM:ss Z"
    | "expiresHeaderFormat"

export type DatePickerPropsType = {
    colorOptions?: ColorOptions
    dateStringFormat?: DateStringOptions
    endDate?: Date
    initialDate?: Date
    isVisible: boolean
    language?: LanguageConverterType
    maxDate: Date
    minDate: Date
    modalStyles?: ViewStyle
    mode: Mode
    onBackButtonPress?: () => void
    onBackdropPress?: () => void
    onCancel: () => void
    onConfirm: (arg: object) => void
    startDate?: Date
    chooseYearFirst?: boolean
}

const DatePickerV = ({
                         colorOptions,
                         dateStringFormat,
                         endDate,
                         initialDate,
                         isVisible,
                         maxDate,
                         minDate,
                         modalStyles,
                         mode,
                         onBackButtonPress,
                         onBackdropPress,
                         onCancel,
                         onConfirm,
                         startDate,
                         chooseYearFirst,
                     }: DatePickerPropsType) => {
    const {t} = useTranslation()
    const [showChangeYearModal, setShowChangeYearModal] = useState(
        chooseYearFirst ?? false,
    )

    const [displayTime, setDisplayTime] = useState(initialDate ?? new Date())
    const year = displayTime.getFullYear()
    const month = displayTime.getMonth() // 0-base
    const date = displayTime.getDate()
    const TODAY = new Date(year, month, date)

    const [output, setOutput] = useState<Output>(
        mode === "single"
            ? {date: TODAY, startDate: null, endDate: null}
            : {
                date: null,
                startDate: startDate ?? null,
                endDate: endDate ?? null,
            },
    )

    const [originalOutput, setOriginalOutput] = useState(output)

    const minTime = minDate?.getTime()
    const maxTime = maxDate?.getTime()

    const disablePrevious = useMemo(() => {
        return (
            minDate.getFullYear() >
            new Date(year, month - 1, date).getFullYear()
        )
    }, [year, month, date, minDate])

    const disableNext = useMemo(() => {
        return maxDate.getTime() < new Date(year, month + 1, date).getTime()
    }, [year, month, date, maxDate])

    const daysArray = useDaysOfMonth(year, month, minTime, maxTime)

    const onCancelPress = () => {
        onCancel()
        setTimeout(() => {
            setOutput(originalOutput)

            if (mode === "range" && !originalOutput.startDate)
                return setDisplayTime(initialDate ?? new Date())

            return mode === "single"
                ? setDisplayTime(originalOutput.date as Date)
                : setDisplayTime(originalOutput.startDate as Date)
        }, 300)
    }

    const months: { [key: string]: string } = t("datePicker.months", {
        returnObjects: true,
    })
    const weekDays: string[] = t("datePicker.weekDays", {returnObjects: true})

    const autoCompleteEndDate = () => {
        output.endDate = output.startDate
        setOutput({...output, endDate: null})
    }

    const onConfirmPress = () => {
        if (mode === "single") {
            const dateString = format(output.date as Date, dateStringFormat)
            const newOutput = {
                ...output,
                dateString,
                startDate: null,
                startDateString: null,
                endDate: null,
                endDateString: null,
            }
            onConfirm(newOutput)
        } else {
            // If you have not selected any date, just to onCancel
            if (mode === "range" && !output.startDate) return onCancel()

            //  If you have not selected endDate, set it same as startDate
            if (!output.endDate) autoCompleteEndDate()
            const startDateString = format(
                output.startDate as Date,
                dateStringFormat,
            )
            const endDateString = format(
                output.endDate as Date,
                dateStringFormat,
            )
            const newOutput = {
                ...output,
                startDateString,
                endDateString,
                date: null,
                dateString: null,
            }
            onConfirm(newOutput)
        }

        setOriginalOutput({...output})

        setTimeout(() => {
            return mode === "single"
                ? setDisplayTime(output.date as Date)
                : setDisplayTime(output.startDate as Date)
        }, 300)
    }

    const [btnDisabled, setBtnDisabled] = useState(false)

    const onPrev = () => {
        setBtnDisabled(false)
        setDisplayTime(new Date(year, month - 1, date))
    }

    const onNext = () => {
        setBtnDisabled(true)
        setDisplayTime(new Date(year, month + 1, date))
    }

    useEffect(() => {
        setTimeout(setBtnDisabled, 300, false)
    }, [btnDisabled])

    const {
        backgroundColor,
        headerColor,
        headerTextColor,
        changeYearModalColor,
        weekDaysColor,
        dateTextColor,
        selectedDateTextColor,
        selectedDateBackgroundColor,
        confirmButtonColor,
        cancelButtonColor,
    } = {...defaultColorOptions, ...colorOptions}

    useEffect(() => {
        setOutput(
            mode === "single"
                ? {date: TODAY, startDate: null, endDate: null}
                : {
                    date: null,
                    startDate: startDate ?? null,
                    endDate: endDate ?? null,
                },
        )
    }, [mode])

    return (
        <Modal
            isVisible={isVisible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onBackButtonPress ?? onCancelPress}
            onBackdropPress={onBackdropPress ?? onCancelPress}
            style={[styles.modal, modalStyles]}
            coverScreen={false}
            deviceHeight={winY}
        >
            <View style={[styles.container, {backgroundColor}]}>
                <View style={[styles.header, {backgroundColor: headerColor}]}>
                    <TouchableOpacity
                        style={styles.changeMonthTO}
                        onPress={onPrev}
                        disabled={disablePrevious ?? btnDisabled}
                    >
                        <ChevronLeftSvg
                            height="24"
                            width="24"
                            color={
                                disablePrevious
                                    ? COLORS.modalOpacity.secondary
                                    : headerTextColor
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setShowChangeYearModal(true)
                        }}
                    >
                        <Text
                            style={[
                                styles.header__title,
                                {color: headerTextColor},
                            ]}
                        >
                            {daysArray.length !== 0 && daysArray[10].year + " "}
                            {daysArray.length !== 0 &&
                                months[daysArray[10].month]}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.changeMonthTO}
                        onPress={onNext}
                        disabled={disableNext || btnDisabled}
                    >
                        <ChevronRightSvg
                            height="24"
                            width="24"
                            color={
                                disableNext
                                    ? COLORS.modalOpacity.secondary
                                    : headerTextColor
                            }
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.keys_container}>
                    {weekDays.map((weekDay: string, index: number) => (
                        <View style={styles.keys} key={index.toString()}>
                            <Text
                                style={[
                                    styles.weekDays,
                                    {color: weekDaysColor},
                                ]}
                            >
                                {weekDay}
                            </Text>
                        </View>
                    ))}

                    {/* every day */}
                    {daysArray.map((Day: DaysArray, i: number) => (
                        <Fragment key={`${Day.year}${Day.month}${i}`.toString()}>
                            <Key
                                Day={Day}
                                mode={mode}
                                output={output}
                                setOutput={setOutput}
                                colorOptions={{
                                    dateTextColor,
                                    backgroundColor,
                                    selectedDateTextColor,
                                    selectedDateBackgroundColor,
                                }}
                            />
                        </Fragment>
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={onCancelPress}
                        >
                            <Text
                                style={[
                                    styles.btn_text,
                                    {color: cancelButtonColor},
                                ]}
                            >
                                {t("datePicker.cancel")}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={onConfirmPress}
                        >
                            <Text
                                style={[
                                    styles.btn_text,
                                    {color: confirmButtonColor},
                                ]}
                            >
                                {t("datePicker.accept")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ChangeYearModal
                    isVisible={showChangeYearModal}
                    dismiss={() => {
                        setShowChangeYearModal(false)
                    }}
                    displayTime={displayTime}
                    setDisplayTime={setDisplayTime}
                    colorOptions={{
                        primary: changeYearModalColor,
                        backgroundColor,
                    }}
                    minDate={minDate?.getFullYear() as number}
                    maxDate={maxDate?.getFullYear() as number}
                />
            </View>
        </Modal>
    )
}

DatePickerV.defaultProps = {
    dateStringFormat: "yyyy-mm-dd",
    modalStyles: {justifyContent: "center"},
}

export default DatePickerV

// Notice: only six-digit HEX values are allowed.
const defaultColorOptions = {
    backgroundColor: "#ffffff",
    headerColor: "#4682E9",
    headerTextColor: "#ffffff",
    changeYearModalColor: "#4682E9",
    weekDaysColor: "#4682E9",
    dateTextColor: "#000000",
    selectedDateTextColor: "#ffffff",
    selectedDateBackgroundColor: "#4682E9",
    confirmButtonColor: "#4682E9",
    cancelButtonColor: "#ffffff",
}

const styles = StyleSheet.create({
    modal: {
        flex: Platform.OS === "web" ? 1 : 0,
        height: winY,
        alignItems: "center",
        padding: 0,
        margin: 0,
    },
    container: {
        width: 328,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        width: "100%",
        height: 68,
        paddingHorizontal: 24,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        ...customStyles.borderBottom(0.4, "solid", COLORS.secondary[70]),
    },
    header__title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "500",
    },
    keys_container: {
        width: 300,
        height: 264,
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    weekDays: {
        fontSize: 16,
    },
    keys: {
        width: 34,
        height: 30,
        borderRadius: 10,
        marginTop: 4,
        marginHorizontal: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        width: 300,
        height: 52,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    btn_box: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 8,
        justifyContent: "space-between",
    },
    btn: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    btn_text: {
        fontSize: 18,
        color: "#777",
    },
    changeMonthTO: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        padding: 4,
        borderColor: "black",
    },
})
