import {ColorValue, StyleProp, TextStyle, ViewStyle} from "react-native";
import {ReactNode} from "react";
import {LanguageConverterType} from "./helpers/languageConverter";
import {Mode} from "./components/Key";

export type SvgStyleType = {
    width?: string
    height?: string
    color?: StyleProp<any>
}

export type ChildrenType = {
    type?: "primary" | "secondary" | "tertiary" | "link"
    title?: string
    onPress?: () => void
    align?: "center" | "flex-start" | "flex-end"
    justify?: "center" | "flex-start" | "flex-end"
    icon?: ReactNode
    customTitleStyles?: TextStyle
    style?: StyleProp<ViewStyle>
    pending?: boolean
    isLoading?: boolean
    disable?: boolean
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

export type DateType = {
    date: Date | null
    dateString: string | null
    startDate: Date | null
    startDateString: string | null
    endDate: Date | null
    endDateString: string | null
}

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
    onConfirm: (arg: DateType) => void
    cancelTitle?: string
    confirmTitle?: string
    selectButtonTitle?: string
    startDate?: Date
    chooseYearFirst?: boolean
    months: { [key: string]: string }
    weekDays: string[]
}

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