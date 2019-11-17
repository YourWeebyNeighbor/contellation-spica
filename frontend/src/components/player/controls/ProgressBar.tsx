import React from 'react'
import { HsvColor, getCssHsvColorString } from '../../../utils/ColorTools'

const OUTER_ALPHA = 0.4;
const UPDATE_INTERVAL = 500;

export default class ProgressBar extends React.Component<{
    durationGetter: () => number | null, positionGetter: () => number | null,
    color: HsvColor, autoUpadte: boolean
}, {}> {

    private intervalId: NodeJS.Timeout | null = null

    componentDidMount() {
        this.intervalId = setInterval(() => this.setState({}), UPDATE_INTERVAL);
    }

    componentWillUnmount() {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
        }
    }

    render() {
        const rawDuration: number = this.props.durationGetter() || 0
        const rawProgress: number = this.props.positionGetter() || 0

        const progressValue = Number.isInteger(Math.floor(rawDuration)) && Number.isInteger(Math.floor(rawProgress)) && Math.floor(rawDuration) !== 0
            ? rawProgress / rawDuration
            : 0

        return (
            <div className="progressbar" style={{ backgroundColor: getCssHsvColorString(this.props.color, OUTER_ALPHA) }}>
                <div className="progressbar-inner" style={{
                    height: "100%",
                    width: `${progressValue * 100}%`,
                    backgroundColor: getCssHsvColorString(this.props.color)
                }} />
            </div>
        )
    }
}