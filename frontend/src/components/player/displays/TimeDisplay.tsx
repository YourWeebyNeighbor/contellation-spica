import React from 'react'

const UPDATE_INTERVAL = 1000;

export default class TimeDisplay extends React.Component<{ valueGetter: () => number | null, autoUpdate: boolean }, {}> {

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
        const rawValue = this.props.valueGetter()

        if (rawValue == null || rawValue == 0 || !Number.isInteger(Math.floor(rawValue))) {
            return (<div>&nbsp;</div>);
        }

        if (!this.props.autoUpdate && this.intervalId != null) {
            clearInterval(this.intervalId);
        }

        const minutes = Math.floor(Math.floor(rawValue / 60))
        const seconds = Math.floor(rawValue - minutes * 60)

        return (<div>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</div>)
    }
}