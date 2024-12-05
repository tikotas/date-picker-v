import {StyleProp, TextStyle, ViewStyle} from "react-native";
import {ReactNode} from "react";

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