import {Path, Svg} from "react-native-svg"
import {FC} from "react"
import {SvgStyleType} from "../types";

export const ChevronRightSvg: FC<SvgStyleType> = ({
                                                      height = "28",
                                                      width = "28",
                                                      color = "#B1BBCB",
                                                  }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
            <Path
                d="M10.5 21l7-7-7-7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}
