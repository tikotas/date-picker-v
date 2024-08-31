import {Path, Svg} from "react-native-svg"
import {FC} from "react"
import {SvgStyleType} from "../types";

export const ChevronDownSvg: FC<SvgStyleType> = ({
                                                     height = "20",
                                                     width = "20",
                                                     color = "#505865",
                                                 }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
            <Path
                d="M7 10.5l7 7 7-7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}
