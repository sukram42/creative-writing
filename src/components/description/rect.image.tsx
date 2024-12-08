

interface RectProps {
    fill?: string
    width?: number
    stroke?: string
}

export function Rect({ fill = "#dddddd", width = 30, stroke = "#444444" }: RectProps) {
    return <svg width={width} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"
        overflow="hidden">
        <g>
            <rect x="2" y="2" width="50" height="50" stroke="#888" stroke-width="2" stroke-miterlimit="8" fill={fill} />
        </g>
    </svg>
}