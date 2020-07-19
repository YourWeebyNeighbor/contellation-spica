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
import { Box } from '@material-ui/core';
import ColorStore from '../../../model/store/color/ColorStore';
import { getSmallThumbUrl } from '../../../utils/ThumbTools';
import PlayerAlbumArt from './displays/PlayerAlbumArt';
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
        minHeight: 100,
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

    playback: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        flexGrow: 1,

        overflow: 'hidden',

        marginTop: 10,
        marginLeft: 3.5,
        marginBottom: 2,
    },

    placeholder: {

    },

    player: {
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },

    borderTop: {
        borderRadius: '0px 0px 15px 15px',
    },

    borderBottom: {
        borderRadius: '15px 15px 0px 0px',
    },

    albumArt: {
        height: 130,
        width: 130,
        objectFit: 'cover'
    },

    playAndSkip: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 130
    },

    skip: {
        height: 30,
        paddingTop: 10,
        paddingBottom: 10
    }
})

const CompactPlayer = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {

    const track = store.currentTrack;

    const styles = useStyles()

    if (track == null) {
        return (<div className={styles.placeholder} />)
    }

    const thumbUrl = getSmallThumbUrl(track.thumbnails)

    colorStore.extractColor(thumbUrl)

    const colors = thumbUrl != null ? colorStore.cachedColorSets.get(thumbUrl) || DEFAULT_COLORS : DEFAULT_COLORS;

    const boxStyle = {
        color: getCssHsvColorString(colors.text)
    }

    const playerState = store.playerState

    const borderClass = playerState === "fullscreen" ? "" : (
        playerState === "history" ? styles.borderBottom : styles.borderTop
    )

    return (
        <div className={`${styles.player} ${borderClass}`} style={boxStyle}>
            <div className={styles.controls}>

                {store.playerState === "queue" ? (<div>
                    <SeekBar
                        position={store.currentTrackPosition || 0}
                        duration={store.currentTrackDuration || 0}
                        isWaiting={store.isWaiting}
                        color={colors.text} />

                    <div className={styles.time}>
                        <TimeDisplay value={store.currentTrackPosition || 0} />
                        <TimeDisplay value={store.currentTrackDuration || 0} />
                    </div>
                </div>) : null}

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
                        <div className={styles.playAndSkip}>
                            <PlayButton isPlaying={store.isPlaying} playAction={store.play} pauseAction={store.pause} color={colors.accent} />
                            <PrevButton isEnabled={store.hasPrevious} action={store.skipPrevious} />
                            <NextButton isEnabled={store.hasNext} action={store.skipNext} />
                        </div>
                        <QueueControls base={colors.text} accent={colors.accent} />
                    </div>
                </div>

                {store.playerState === "history" ? (<div>
                    <div className={styles.time}>
                        <TimeDisplay value={store.currentTrackPosition || 0} />
                        <TimeDisplay value={store.currentTrackDuration || 0} />
                    </div>

                    <SeekBar
                        position={store.currentTrackPosition || 0}
                        duration={store.currentTrackDuration || 0}
                        isWaiting={store.isWaiting}
                        color={colors.text} />
                </div>) : null}

            </div>
            <div className={styles.albumArt} style={{ backgroundColor: getCssHsvColorString(colors.background, 0.4) }}>
                <PlayerAlbumArt thumbnails={track.thumbnails} />
            </div>
        </div>
    )
})

export default CompactPlayer