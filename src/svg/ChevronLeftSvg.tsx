import {Path, Svg} from "react-native-svg"
import {FC} from "react"
import {SvgStyleType} from "../types";

export const ChevronLeftSvg: FC<SvgStyleType> = ({
                                                     height = "28",
                                                     width = "28",
                                                     color = "#B1BBCB",
                                                 }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
            <Path
                d="M8.349 13.654c0 .308.114.572.36.8l6.838 6.697c.193.194.44.3.73.3.58 0 1.045-.458 1.045-1.047 0-.29-.123-.545-.316-.747l-6.161-6.003 6.16-6.003a1.09 1.09 0 00.317-.747c0-.589-.466-1.046-1.046-1.046-.29 0-.536.106-.73.3L8.71 12.845c-.246.237-.36.5-.36.808z"
                fill={color}
            />
        </Svg>
    )
}
