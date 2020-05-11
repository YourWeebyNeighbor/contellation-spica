import React, { useState } from 'react'
import { getCssHsvColorString, ColorSet } from '../../utils/ColorTools'
import { Slide, ClickAwayListener, Box, ButtonBase } from '@material-ui/core'


const TrackListItemActionOverlay = ({ children, colors }: { children: JSX.Element, colors: ColorSet }) => {

    const [isShowingActions, setShowingActions] = useState<boolean>()

    const style = {
        color: getCssHsvColorString(colors.text),
        backgroundColor: getCssHsvColorString(colors.background, 0.6)
    }

    return (
        <ClickAwayListener onClickAway={() => setShowingActions(false)}>
            <ButtonBase className="track-list-button" onClick={() => setShowingActions(!isShowingActions)}>
                <Slide direction="left" unmountOnExit mountOnEnter in={isShowingActions}>
                    <Box boxShadow={3} className="overlay" style={style} />
                </Slide>
                    {children}
            </ButtonBase>

        </ClickAwayListener>
    )
}

export default TrackListItemActionOverlay;