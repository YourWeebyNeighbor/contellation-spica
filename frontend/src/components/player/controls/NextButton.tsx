import React from 'react'
import SkipNextIcon from '@material-ui/icons/SkipNextRounded';
import ButtonBase from '@material-ui/core/ButtonBase';

export default function NextButton({ action, isEnabled }: { isEnabled: boolean, action: () => void }) {
    return (
        <ButtonBase disabled={!isEnabled} onClick={action} className={`button-next ${isEnabled ? "enabled" : "disabled"}`}>
            <SkipNextIcon />
        </ButtonBase>
    )
}