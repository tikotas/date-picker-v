import {useState} from "react";


const defaultColorOptions = {
    backgroundColor: "#3A414B",
    headerColor: "#3A414B",
    headerTextColor: "#ffffff",
    headerBorderColor: "#7E8997",
    changeYearModalColor: "#F3F8FF",
    weekDaysColor: "#F3F8FF",
    dateTextColor: "#F3F8FF",
    selectedDateTextColor: "#3A414B",
    selectedDateBackgroundColor: "#A1F0B8",
    confirmButtonColor: "#A1F0B8",
    cancelButtonColor: "#A1F0B8",
    prevNextTextColor: "#7A7A7A",
    currentDayColor: "#A1F0B8"
}

const initialConfigs = {
    colorConfigs: defaultColorOptions
}

type ConfigurationType = {
    colorConfigs: typeof defaultColorOptions
}


export const useConfiguration = () => {
    const [configuration, setConfiguration] = useState<ConfigurationType>(initialConfigs)

    return {customDateConfig: configuration, setCustomDateConfig: setConfiguration}
}