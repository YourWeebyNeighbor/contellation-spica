import React from 'react'
import SkipPrevIcon from '@material-ui/icons/SkipPreviousRounded';
import ButtonBase from '@material-ui/core/ButtonBase';
import useCommonStyles from '../../../../styles/commonStyles';

export default function PrevButton({ action, isEnabled }: { isEnabled: boolean, action: () => void }) {
    const styles = useCommonStyles()

    return (
        <ButtonBase disabled={!isEnabled} onClick={action} className={`${styles.skipButton} ${isEnabled ? "" : styles.disabledButton}`}>
            <SkipPrevIcon />
        </ButtonBase>
    )
}