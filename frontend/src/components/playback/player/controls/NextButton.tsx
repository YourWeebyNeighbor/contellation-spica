import React from 'react'
import SkipNextIcon from '@material-ui/icons/SkipNextRounded';
import ButtonBase from '@material-ui/core/ButtonBase';
import useCommonStyles from '../../../../styles/commonStyles';

export default function NextButton({ action, isEnabled }: { isEnabled: boolean, action: () => void }) {
    const styles = useCommonStyles()

    return (
        <ButtonBase disabled={!isEnabled} onClick={action} className={`${styles.skipButton} ${isEnabled ? "" : styles.disabledButton}`}>
            <SkipNextIcon />
        </ButtonBase>
    )
}