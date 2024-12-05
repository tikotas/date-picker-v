import React, {Dispatch, FC, SetStateAction, useEffect, useMemo, useState,} from "react"
import {ColorValue, PanResponder, StyleSheet, Text, View} from "react-native"
import Modal, {ModalProps} from "react-native-modal"
import {ChevronDownSvg, ChevronUpSvg} from "../svg"
import {CustomButton} from "./CustomButton";
import {useConfiguration} from "../hooks/useConfiguration";

export type ChangeYearModalProps = {
    colorOptions: {
        primary: ColorValue
        backgroundColor: ColorValue
    }
    dismiss: () => void
    displayTime: Date
    isVisible: boolean
    setDisplayTime: Dispatch<SetStateAction<Date>>
    changeYearModalProps?: Omit<ModalProps, "children">
    minDate: number
    maxDate: number
    selectButtonTitle?: string
}

const ChangeYearModal: FC<ChangeYearModalProps> = ({
                                                       colorOptions,
                                                       dismiss,
                                                       displayTime,
                                                       isVisible,
                                                       setDisplayTime,
                                                       changeYearModalProps,
                                                       minDate,
                                                       maxDate,
                                                       selectButtonTitle
                                                   }) => {
    const {primary, backgroundColor} = colorOptions
    const {customDateConfig} = useConfiguration()
    const [year, setYear] = useState(displayTime.getFullYear())
    const onDismiss = () => {
        dismiss()
        const newDate = new Date(
            year,
            displayTime.getMonth(),
            displayTime.getDate(),
        )
        setDisplayTime(newDate)
    }

    const notChosen = () => {
        dismiss()
        setYear(displayTime.getFullYear())
    }

    // TODO this is just test, remove if doesn't work
    useEffect(() => {
        setYear(displayTime.getFullYear())
    }, [displayTime])

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            if (gestureState.dy > 10) {
                setYear((prev) => {
                    if (prev <= minDate) {
                        return minDate
                    }
                    return prev - 1
                })
            } else if (gestureState.dy < -10) {
                setYear((prev) => {
                    if (prev >= maxDate) {
                        return maxDate
                    }
                    return prev + 1
                })
            }
        },
    })

    const minDatePreviousYear = useMemo(() => {
        return minDate === year ? "" : year - 1
    }, [year])

    const maxDateNextYear = useMemo(() => {
        return maxDate === year ? "" : year + 1
    }, [year])

    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onDismiss}
            onBackdropPress={notChosen}
            animationIn="zoomIn"
            animationOut="zoomOut"
            style={styles.modal}
            {...changeYearModalProps}
        >
            <View style={[styles.container, {backgroundColor: customDateConfig.colorConfigs.backgroundColor}]}>
                <View {...panResponder.panHandlers} style={{width: "100%"}}>
                    <View style={styles.centerText}>
                        <ChevronUpSvg height="28" width="28"/>
                        {!!minDatePreviousYear && (
                            <Text
                                style={[styles.prevYearText, {color: customDateConfig.colorConfigs.prevNextTextColor}]}>
                                {minDatePreviousYear}
                            </Text>
                        )}
                    </View>
                    <Text style={[styles.yearText, {color: primary}]}>
                        {year}
                    </Text>
                    <View style={styles.centerText}>
                        {!!maxDateNextYear && (
                            <Text
                                style={[styles.nextYearText, {color: customDateConfig.colorConfigs.prevNextTextColor}]}>
                                {maxDateNextYear}
                            </Text>
                        )}
                        <ChevronDownSvg height="28" width="28"/>
                    </View>
                </View>
                <CustomButton

                    title={selectButtonTitle}
                    style={{marginTop: 30, width: "100%"}}
                    onPress={onDismiss}
                />
            </View>
        </Modal>
    )
}

export default ChangeYearModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: 250,
        borderRadius: 12,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    yearText: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
    },

    prevYearText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 4,
    },

    nextYearText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 4,
        marginBottom: 8,
    },

    centerText: {
        alignItems: "center"
    }
})
