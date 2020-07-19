import React from 'react'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilledRounded';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilledRounded';
import ButtonBase from '@material-ui/core/ButtonBase';
import { HsvColor, getCssHsvColorString } from '../../../../utils/ColorTools'
import useCommonStyles from '../../../../styles/commonStyles';

export default function PlayButtonLarge({ color, playAction, pauseAction, isPlaying }: { color: HsvColor, playAction: () => void, pauseAction: () => void, isPlaying: boolean }) {
    const styles = useCommonStyles()

    return (
        <ButtonBase onClick={isPlaying ? pauseAction : playAction} className={styles.buttonLarge}>
            {isPlaying
                ? (<PauseCircleFilledIcon style={{ color: getCssHsvColorString(color) }} />)
                : (<PlayCircleFilledIcon style={{ color: getCssHsvColorString(color) }} />)}
        </ButtonBase>
    )
}