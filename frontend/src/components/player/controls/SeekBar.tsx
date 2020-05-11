import React from 'react'
import { HsvColor, getCssHsvColorString } from '../../../utils/ColorTools'

const OUTER_ALPHA = 0.4;

export default function SeekBar({ color, duration, position, isWaiting }: { color: HsvColor, duration: number, position: number, isWaiting: boolean }) {

    const progressValue = duration !== 0

        ? (position / duration)
        : 0

    return (
        <div className={`seekbar ${isWaiting ? "waiting" : ""}`} style={{ backgroundColor: getCssHsvColorString(color, OUTER_ALPHA) }}>

            <div className="seekbar-inner" style={{
                willChange: "width",
                height: "100%",
                width: `${progressValue * 100}%`,
                backgroundColor: getCssHsvColorString(color)
            }} />
        </div>
    )

}