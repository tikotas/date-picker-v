import {useState} from "react";


const defaultColorOptions = {
    backgroundColor: "#ffffff",
    headerColor: "#4682E9",
    headerTextColor: "#ffffff",
    headerBorderColor: "#7E8997",
    changeYearModalColor: "#4682E9",
    weekDaysColor: "#4682E9",
    dateTextColor: "#000000",
    selectedDateTextColor: "#ffffff",
    selectedDateBackgroundColor: "#4682E9",
    confirmButtonColor: "#4682E9",
    cancelButtonColor: "#ffffff",
    prevNextTextColor: "#7A7A7A",
    currentDayColor: "#000000",
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