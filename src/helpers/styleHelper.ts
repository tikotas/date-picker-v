type TBorderStyles = "solid" | "dotted" | "dashed" | undefined
export const customStyles = {
    border: (
        width: number = 1,
        style: TBorderStyles = "solid",
        color: string = "red",
    ) => ({
        borderWidth: width,
        borderStyle: style,
        borderColor: color,
    }),
    borderBottom: (
        width: number = 1,
        style: TBorderStyles = "solid",
        color: string = "red",
    ) => ({
        borderBottomWidth: width,
        borderBottomStyle: style,
        borderBottomColor: color,
    }),
    borderTop: (
        width: number = 1,
        style: TBorderStyles = "solid",
        color: string = "red",
    ) => ({
        borderTopWidth: width,
        borderTopStyle: style,
        borderTopColor: color,
    }),
    borderLeft: (
        width: number = 1,
        style: TBorderStyles = "solid",
        color: string = "red",
    ) => ({
        borderLeftWidth: width,
        borderLeftStyle: style,
        borderLeftColor: color,
    }),
    borderRight: (
        width: number = 1,
        style: TBorderStyles = "solid",
        color: string = "red",
    ) => ({
        borderRightWidth: width,
        borderRightStyle: style,
        borderRightColor: color,
    }),
    borderRadius: (
        topLeft: number,
        topRight: number,
        bottomRight: number,
        bottomLeft: number,
    ) => ({
        borderTopLeftRadius: topLeft,
        borderTopRightRadius: topRight,
        borderBottomRightRadius: bottomRight,
        borderBottomLeftRadius: bottomLeft,
    }),
    boxShadow: (
        x: number,
        y: number,
        opacity: number,
        radius: number,
        color: string,
    ) => ({
        // For iOS
        shadowOffset: {width: x, height: y},
        shadowOpacity: opacity,
        shadowRadius: radius,
        shadowColor: color,
        // For Android
        elevation: radius,
    }),
}
