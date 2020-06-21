import React from 'react';
import SeekBar from './controls/SeekBar';
import TimeDisplay from './displays/TimeDisplay'
import PlayButton from './controls/PlayButton';
import PrevButton from './controls/PrevButton';
import NextButton from './controls/NextButton';
import TrackTitle from '../../common/TrackTitle';
import TrackTags from '../../common/TrackTags';
import QueueControls from './controls/QueueControls';
import { ColorSet, getCssHsvColorString } from '../../../utils/ColorTools'
import PlaybackStore from '../../../model/store/playback/PlaybackStore';
import { observer } from 'mobx-react';
import ArtistList from '../../common/ArtistList';
import { Box, Fade } from '@material-ui/core';
import ColorStore from '../../../model/store/color/ColorStore';
import { getSmallThumbUrl } from '../../../utils/ThumbTools';
import PlayerAlbumArt from './displays/PlayerAlbumArt';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/styles';

export const DEFAULT_COLORS: ColorSet = {
    background: {
        hue: 0,
        saturation: 0,
        value: 20
    },
    text: {
        hue: 0,
        saturation: 0,
        value: 80
    },
    accent: {
        hue: 0,
        saturation: 0,
        value: 80
    }
}

const useStyles = makeStyles({
    wrapper: {
        width: 'calc(100% - 7px)',
        height: 130,
        marginRight: 7,

        position: 'absolute',
        zIndex: 3,
    },

    player: {
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        whiteSpace: 'nowrap',
        overflow: 'hidden',

        borderRadius: '0px 0px 15px 15px',
    },

    background: {
        height: 130,
        width: '100%',

        position: 'absolute',
        zIndex: -1,

        borderRadius: '0px 0px 15px 15px',

        backdropFilter: 'blur(15px)',
        backgroundBlendMode: 'exclusion',
        backgroundImage: 'url(data:image/png;base64,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)',
        backgroundRepeat: 'repeat',
        backgroundSize: 24,
    },

    controls: {
        minWidth: 100,
        flexGrow: 1,

        display: 'flex',
        flexDirection: 'column',
    },

    time: {
        margin: 2,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        opacity: 0.6,
        fontSize: '8pt',
        fontWeight: 'bold',
    },

    main: {
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,

        flexGrow: 1,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    summary: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 7,
    },

    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        height: 24,
    },

    trackTitile: {
        flexShrink: 1,

        alignSelf: 'center',
        whiteSpace: 'nowrap',

        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    tags: {
        whiteSpace: 'nowrap',
        height: '100%',
    },

    svg: {
        height: '100%',
    },

    playback: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        overflow: 'hidden',

        marginTop: 10,
        marginLeft: 3.5,
        marginBottom: 2,
    }
})

const Player = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {

    const track = store.currentTrack;

    const styles = useStyles()

    if (track == null) {
        return (<div className="player-placeholder" />)
    }

    const thumbUrl = getSmallThumbUrl(track.thumbnails)

    colorStore.extractColor(thumbUrl)

    const colors = thumbUrl != null ? colorStore.cachedColorSets.get(thumbUrl) || DEFAULT_COLORS : DEFAULT_COLORS;

    const lowerBackgroundStyle = {
        backgroundColor: getCssHsvColorString(colors.background, 0.6)
    }

    const style = {
        color: getCssHsvColorString(colors.text)
    }

    return (
        <motion.div key="player" className={styles.wrapper}>
            <Fade in={true}>
                <Box boxShadow={3} className={styles.player} style={style}>
                    <div className={styles.background} style={lowerBackgroundStyle} />
                    <div className={styles.controls}>
                        <div>
                            <SeekBar
                                position={store.currentTrackPosition || 0}
                                duration={store.currentTrackDuration || 0}
                                isWaiting={store.isWaiting}
                                color={colors.text} />

                            <div className={styles.time}>
                                <TimeDisplay value={store.currentTrackPosition || 0} />
                                <TimeDisplay value={store.currentTrackDuration || 0} />
                            </div>
                        </div>
                        <div className={styles.main}>
                            <div className={styles.summary}>
                                <div className={styles.title}>
                                    <TrackTitle title={track.name} />
                                    <TrackTags />
                                </div>
                                <div>
                                    <ArtistList colors={colors} artists={track.artists || []} />
                                </div>
                            </div>
                            <div className={styles.playback} style={{ color: getCssHsvColorString(colors.text) }}>
                                <div>
                                    <PlayButton isPlaying={store.isPlaying} playAction={store.play} pauseAction={store.pause} color={colors.accent} />
                                    <PrevButton isEnabled={store.hasPrevious} action={store.skipPrevious} />
                                    <NextButton isEnabled={store.hasNext} action={store.skipNext} />
                                </div>
                                <QueueControls base={colors.text} accent={colors.accent} />
                            </div>
                        </div>
                    </div>
                    <PlayerAlbumArt thumbnails={track.thumbnails} backgroundColor={colors.background} />
                </Box>
            </Fade>
        </motion.div >
    )
})

export default Player
