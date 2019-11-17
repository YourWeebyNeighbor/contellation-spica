import React from 'react'
import SkipPrevIcon from '@material-ui/icons/SkipPreviousRounded';
import ButtonBase from '@material-ui/core/ButtonBase';

export default function PrevButton({ action, isEnabled }: { isEnabled: boolean, action: () => void }) {
    return (
        <ButtonBase disabled={!isEnabled} onClick={action} className={`button-prev ${isEnabled ? "enabled" : "disabled"}`}>
            <SkipPrevIcon />
        </ButtonBase>
    )
}