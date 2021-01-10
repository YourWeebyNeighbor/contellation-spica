import React, { useState } from 'react'
import { getCssHsvColorString, ColorSet } from '../../../utils/ColorTools'
import { ClickAwayListener, Box, IconButton } from '@material-ui/core'
import PlayableTrack from '../../../model/store/playback/PlayableTrack'
import AlbumArt from '../metadata/AlbumArt'
import { motion, AnimatePresence } from 'framer-motion'
import FavoriteIcon from '@material-ui/icons/FavoriteRounded'
import QueueIcon from '@material-ui/icons/QueueRounded'
import InfoIcon from '@material-ui/icons/InfoRounded'
import PlayIcon from '@material-ui/icons/PlayArrowRounded'
import { makeStyles } from '@material-ui/styles'
import useCommonStyles from '../../../styles/commonStyles'

const useStyles = makeStyles({
    clickableSurface: {
        width: '100%',
        height: '100%',
    },

    overlay: {
        height: 80,
        width: '100%',

        position: 'absolute',

        zIndex: 1,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        userSelect: 'none',
    }
})

const TrackListItemActionOverlay = ({ track, children, colors, disable }: { disable: boolean, track: PlayableTrack, children: JSX.Element, colors: ColorSet }) => {

    const styles = useStyles()

    const commonStyles = useCommonStyles()

    const [isVisible, setVisible] = useState<boolean>(false)

    const overlayStyle = {
        color: getCssHsvColorString(colors.background),
        backgroundColor: getCssHsvColorString(colors.text),
        clipPath: "circle(0%)"
    }

    const buttonStyle = {
        color: getCssHsvColorString(colors.background)
    }

    return (
        <ClickAwayListener onClickAway={() => setVisible(false)}>
            <div className={styles.clickableSurface}
                onClick={() => { if (!disable) setVisible(!isVisible) }}>

                <AnimatePresence>
                    {isVisible ? (

                        <motion.div
                            animate={{ clipPath: "circle(100%)" }}
                            exit={{ clipPath: "circle(0%)" }}
                            transition={{ type: "tween", ease: "easeInOut" }}
                            className={styles.overlay}
                            style={overlayStyle}
                        >
                            <div className="track-list-item-button-container">
                                <IconButton className="track-list-item-button" onClickCapture={e => { e.stopPropagation() }} style={buttonStyle}>
                                    <PlayIcon />
                                </IconButton>
                                <IconButton onClickCapture={e => { e.stopPropagation() }} style={buttonStyle}>
                                    <QueueIcon />
                                </IconButton>
                                <IconButton onClickCapture={e => { e.stopPropagation() }} style={buttonStyle}>
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton onClickCapture={e => { e.stopPropagation() }} style={buttonStyle}>
                                    <InfoIcon />
                                </IconButton>
                            </div>

                            <Box boxShadow={2} className={commonStyles.albumArt}>
                                <AlbumArt thumbnails={track.thumbnails} />
                            </Box>
                        </motion.div>
                    ) : null}

                </AnimatePresence>

                {children}
            </div>

        </ClickAwayListener>
    )
}

export default TrackListItemActionOverlay;