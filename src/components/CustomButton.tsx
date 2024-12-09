import {FC} from "react"
import {ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity,} from "react-native"

import {customStyles} from "../helpers/styleHelper";
import {ChildrenType} from "../types";
import {COLORS} from "../colors";
import {useConfiguration} from "../hooks/useConfiguration";

export const CustomButton: FC<ChildrenType> = ({
                                                   title,
                                                   onPress,
                                                   type = "primary",
                                                   align = "center",
                                                   justify = "center",
                                                   icon,
                                                   customTitleStyles,
                                                   style,
                                                   isLoading = false,
                                                   disable = false,
                                               }) => {
    const customStyles: StyleProp<any> = {
        alignItems: align,
        justifyContent: justify,
        flexDirection: icon ? "row" : "column",
    }
    const {customDateConfig} = useConfiguration()

    const disabledStyle = isLoading ? {backgroundColor: customDateConfig.colorConfigs.selectYearColor} : {}
    const disabledOpacity = disable ? {opacity: 0.5} : {}

    return (
        <TouchableOpacity
            style={[
                styles[type],
                customStyles,
                style,
                disabledStyle,
                disabledOpacity,
            ]}
            onPress={onPress}
            disabled={isLoading || disable}
            activeOpacity={0.5}
        >
            {!isLoading && icon && <Text>{icon}</Text>}
            {!isLoading && title && (
                <Text style={[styles[`${type}Title`], customTitleStyles]}>
                    {title}
                </Text>
            )}
            {isLoading && (
                <ActivityIndicator size="large" color={COLORS.secondary[100]}/>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    primary: {
        backgroundColor: COLORS.primary[30],
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        gap: 8,
        paddingVertical: 5,
    },

    secondary: {
        ...customStyles.border(1, "solid", COLORS.primary[30]),
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        gap: 8,
        paddingVertical: 5,
    },

    tertiary: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    link: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    primaryTitle: {
        color: COLORS.secondary[100],
        fontSize: 17,
        fontWeight: "600",
    },

    secondaryTitle: {
        color: COLORS.primary[30],
        fontSize: 17,
        fontWeight: "600",
    },

    tertiaryTitle: {
        color: COLORS.primary[30],
        fontSize: 15,
        fontWeight: "600",
    },

    linkTitle: {
        color: COLORS.primary[40],
        fontSize: 12,
        fontWeight: "400",
    },
})
