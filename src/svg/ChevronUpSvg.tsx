import {Path, Svg} from "react-native-svg"
import {FC} from "react"
import {SvgStyleType} from "../types";

export const ChevronUpSvg: FC<SvgStyleType> = ({
                                                   height = "20",
                                                   width = "20",
                                                   color = "#505865",
                                               }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
            <Path
                d="M14.346 8.349c-.308 0-.572.114-.8.36l-6.697 6.838c-.194.193-.3.44-.3.73 0 .58.458 1.045 1.047 1.045.29 0 .545-.123.747-.316l6.003-6.161 6.003 6.16c.202.194.465.317.747.317.589 0 1.046-.466 1.046-1.046 0-.29-.106-.536-.3-.73L15.155 8.71c-.237-.246-.5-.36-.808-.36z"
                fill={color}
            />
        </Svg>
    )
}
