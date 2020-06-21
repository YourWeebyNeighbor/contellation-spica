import React from 'react'
import PlayableTrack from '../../../model/store/playback/PlayableTrack'
import { observer } from 'mobx-react'
import ArtistList from '../ArtistList'
import { DEFAULT_COLORS } from '../../playback/player/Player'
import { getCssHsvColorString } from '../../../utils/ColorTools'
import TrackListItemActionOverlay from './TrackListItemActionOverlay'
import ColorStore from '../../../model/store/color/ColorStore'
import AlbumArt from '../AlbumArt'
import { getSmallThumbUrl } from '../../../utils/ThumbTools'
import { Box, makeStyles, ButtonBase } from '@material-ui/core'
import useCommonStyles from '../../../styles/commonStyles'
import ReactVisibilitySensor from 'react-visibility-sensor'
import { motion } from 'framer-motion'

const useStyles = makeStyles({
    item: {
        width: '100%',
        height: 80,
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
        height: 80,

        display: 'flex',

        flexDirection: 'row',
        justifyContent: 'space-between',

        userSelect: 'none',

        fontSize: '11pt',
    },

    dummy: {
        width: '100%',
        height: 80,
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

const TrackListItem = observer(({ track, colorStore }: { track: PlayableTrack, colorStore: ColorStore }) => {

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

    return (
        <ReactVisibilitySensor scrollThrottle={1} scrollDelay={250} offset={{top: -90, bottom: -90}}>
            {({ isVisible }) => isVisible
                ? (<motion.div style={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    <ButtonBase centerRipple={true} className={styles.item} style={inlineStyle}>
                        <TrackListItemActionOverlay track={track} colors={colors}>
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
    )
})

export default TrackListItem;