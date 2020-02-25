import React, { useState } from 'react'
import useInterval from '@use-it/interval';

const UPDATE_INTERVAL = 1000;

function isAcceptableNumber(value: number | null) {
    return value != null && value !== 0 && Number.isFinite(value);
}

export default function TimeDisplay({ valueGetter, autoUpdate }: { valueGetter: () => number | null, autoUpdate: boolean }) {

    const [value, setValue] = useState(valueGetter())

    useInterval(() => { setValue(valueGetter()) }, (autoUpdate || !isAcceptableNumber(value)) ? UPDATE_INTERVAL : null)

    if (value == null || !isAcceptableNumber(value)) {
        return (<div>&nbsp;</div>);
    }

    const minutes = Math.floor(Math.floor(value / 60))
    const seconds = Math.floor(value - minutes * 60)

    return (<div>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</div>)
}
