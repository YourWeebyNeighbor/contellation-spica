import React, { useState } from 'react'
import { HsvColor, getCssHsvColorString } from '../../../utils/ColorTools'
import useInterval from '@use-it/interval';

const OUTER_ALPHA = 0.4;
const UPDATE_INTERVAL = 500;

export default function ProgressBar({ durationGetter, positionGetter, color, autoUpadte }:
    { durationGetter: () => number | null, positionGetter: () => number | null, color: HsvColor, autoUpadte: boolean }) {

    const [state, setState] = useState({duration: durationGetter(), position: positionGetter()})

    useInterval(() => { setState({duration: durationGetter(), position: positionGetter()}) }, autoUpadte ? UPDATE_INTERVAL : null)

    const rawDuration: number = durationGetter() || 0
    const rawProgress: number = positionGetter() || 0

    const progressValue = Number.isInteger(Math.floor(rawDuration)) && Number.isInteger(Math.floor(rawProgress)) && Math.floor(rawDuration) !== 0
        ? rawProgress / rawDuration
        : 0

    return (
        <div className="progressbar" style={{ backgroundColor: getCssHsvColorString(color, OUTER_ALPHA) }}>
            <div className="progressbar-inner" style={{
                height: "100%",
                width: `${progressValue * 100}%`,
                backgroundColor: getCssHsvColorString(color)
            }} />
        </div>
    )

}