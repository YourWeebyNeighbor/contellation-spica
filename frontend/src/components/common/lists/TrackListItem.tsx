import React, { useState } from 'react'
import PlayableTrack from '../../../model/store/playback/PlayableTrack'
import { observer } from 'mobx-react'
import ArtistList from '../metadata/ArtistList'
import { DEFAULT_COLORS } from '../../playback/player/PlayerWrapper'
import { getCssHsvColorString } from '../../../utils/ColorTools'
import TrackListItemActionOverlay from './TrackListItemActionOverlay'
import ColorStore from '../../../model/store/color/ColorStore'
import AlbumArt from '../metadata/AlbumArt'
import { getSmallThumbUrl } from '../../../utils/ThumbTools'
import { Box, makeStyles, ButtonBase } from '@material-ui/core'
import useCommonStyles from '../../../styles/commonStyles'
import ReactVisibilitySensor from 'react-visibility-sensor'
import { motion, PanInfo, RelayoutInfo, useMotionValue } from 'framer-motion'
import { ItemSlideDirection } from './TrackList'
import { Console } from 'console'

const itemHeight = 80;

const useStyles = makeStyles({
    item: {
        width: '100%',
        height: itemHeight,
        position: 'relative',
        cursor: 'default',
    },

    data: {
        margin: 12,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'left',
    },

    content: {
        width: '100%',
        height: itemHeight,

        display: 'flex',

        flexDirection: 'row',
        justifyContent: 'space-between',

        userSelect: 'none',

        fontSize: '11pt',
    },

    dummy: {
        width: '100%',
        height: itemHeight,
        overflow: 'hidden',

        '&:before': {
            width: 90,
            height: 20,

            margin: 5,

            content: '""',
            display: 'block',

            position: 'relative',
            left: 6,
            top: 40,

            borderStyle: 'solid',
            borderColor: 'gray',
            borderRadius: 12,
            borderWidth: 2,

            opacity: 0.2,
        },

        '&:after': {
            width: 66,
            height: 66,

            margin: 5,

            content: '""',
            display: 'block',

            position: 'relative',
            right: 'calc(-100% + 80px)',
            top: -29,

            borderStyle: 'solid',
            borderColor: 'gray',
            borderRadius: 10,
            borderWidth: 2,

            opacity: 0.2
        }
    }
})

const TrackListItem = observer(({ moveTrack, direction, track, colorStore, container, index }:
    {
        moveTrack: (track: PlayableTrack, currentIndex: number, offset: number) => void,
        direction: ItemSlideDirection,
        container: HTMLDivElement,
        track: PlayableTrack,
        colorStore: ColorStore,
        index: number
    }) => {

    if (track == null) {
        return null;
    }

    const styles = useStyles()

    const commonStyles = useCommonStyles()

    const thumbUrl = getSmallThumbUrl(track.thumbnails)

    colorStore.extractColor(thumbUrl)

    const colors = thumbUrl != null ? colorStore.cachedColorSets.get(thumbUrl) || DEFAULT_COLORS : DEFAULT_COLORS;

    const artists = track.artists == null ? [] : track.artists.slice()

    const inlineStyle = {
        backgroundColor: getCssHsvColorString(colors.background),
        color: getCssHsvColorString(colors.text)
    }

    const isUp = direction === "up"

    return (
        <div>
            <ReactVisibilitySensor
                resizeCheck={true}
                resizeDelay={300}
                resizeThrottle={200}

                scrollCheck={true}
                scrollDelay={200}
                scrollThrottle={100}

                intervalCheck={true}
                intervalDelay={500}

                offset={{ top: -90, bottom: -90 }}

                containment={container}
            >
                {({ isVisible }) => isVisible
                    ? (<motion.div style={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <ButtonBase component="div" centerRipple={false} className={styles.item} style={inlineStyle}>
                            <TrackListItemActionOverlay disable={false} track={track} colors={colors}>
                                <div className={styles.content}>
                                    <div className={styles.data}>
                                        <div className={styles.name}>
                                            {track.name}
                                        </div>
                                        <ArtistList artists={artists} colors={colors} />
                                    </div>
                                    <Box boxShadow={2} className={commonStyles.albumArt}>
                                        <AlbumArt thumbnails={track.thumbnails} />
                                    </Box>
                                </div>
                            </TrackListItemActionOverlay>
                        </ButtonBase>
                    </motion.div>)
                    : (<div className={styles.dummy} key="dummy" />)
                }
            </ReactVisibilitySensor>
        </div>
    )
})

export default TrackListItem;