import React from 'react'

function isAcceptableNumber(value: number | null) {
    return value != null && value !== 0 && Number.isFinite(value);
}

export default function TimeDisplay({ value }: { value: number }) {

    if (value == null || !isAcceptableNumber(value)) {
        return (<div>&nbsp;</div>);
    }

    const minutes = Math.floor(Math.floor(value / 60))
    const seconds = Math.floor(value - minutes * 60)

    return (<div>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</div>)
}
