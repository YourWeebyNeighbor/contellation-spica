import React from 'react';
import SeekBar from './controls/SeekBar';
import TimeDisplay from './displays/TimeDisplay'
import PrevButton from './controls/PrevButton';
import NextButton from './controls/NextButton';
import TrackTitle from '../../common/metadata/TrackTitle';
import TrackTags from '../../common/metadata/TrackTags';
import QueueControls from './controls/QueueControls';
import { ColorSet, getCssHsvColorString } from '../../../utils/ColorTools'
import PlaybackStore from '../../../model/store/playback/PlaybackStore';
import { observer } from 'mobx-react';
import ArtistList from '../../common/metadata/ArtistList';
import ColorStore from '../../../model/store/color/ColorStore';
import { getSmallThumbUrl } from '../../../utils/ThumbTools';
import PlayerAlbumArt from './displays/PlayerAlbumArt';
import { makeStyles } from '@material-ui/styles';
import PlayButtonLarge from './controls/PlayButtonLarge';

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
        minWidth: 400,
        minHeight: 200,

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
        flexDirection: 'column',
        justifyContent: 'space-between',

        overflow: 'hidden',

        marginTop: 10,
        marginLeft: 3.5,
        marginBottom: 2,
    },


    player: {
        height: '100%',
        width: '100%',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },

    albumArt: {
        flexGrow: 1,

        height: 'auto',
        width: '100%',

        minHeight: 200,
        minWidth: 200,

        objectFit: 'contain',

        display: 'flex',
        justifyContent: 'space-around'

    },

    playAndSkip: {
        height: 100,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

const FullScreenPlayer = observer(({ store, colorStore, isMoving }: { isMoving: boolean, store: PlaybackStore, colorStore: ColorStore }) => {

    const track = store.currentTrack;

    const styles = useStyles()

    const thumbUrl = getSmallThumbUrl(track!.thumbnails)

    colorStore.extractColor(thumbUrl)

    const colors = thumbUrl != null ? colorStore.cachedColorSets.get(thumbUrl) || DEFAULT_COLORS : DEFAULT_COLORS;

    const boxStyle = {
        color: getCssHsvColorString(colors.text)
    }

    return (
        <div className={styles.player} style={boxStyle}>
            <div key="albumart"
                className={styles.albumArt}
                style={{ backgroundColor: getCssHsvColorString(colors.background, 0.4) }}
            >
                <PlayerAlbumArt thumbnails={track!.thumbnails} />
            </div>
            <div>
                <SeekBar
                    position={store.currentTrackPosition || 0}
                    duration={store.currentTrackDuration || 0}
                    isWaiting={store.isWaiting}
                    color={colors.text}
                    isMoving={isMoving} />

                <div className={styles.time}>
                    <TimeDisplay value={store.currentTrackPosition || 0} />
                    <TimeDisplay value={store.currentTrackDuration || 0} />
                </div>
            </div>
            <div className={styles.controls}>
                <div className={styles.main}>
                    <div className={styles.summary}>
                        <div className={styles.title}>
                            <TrackTitle title={track!.name} />
                            <TrackTags />
                        </div>
                        <div>
                            <ArtistList colors={colors} artists={track!.artists || []} />
                        </div>
                    </div>
                    <div className={styles.playback} style={{ color: getCssHsvColorString(colors.text) }}>
                        <div className={styles.playAndSkip}>
                            <PrevButton isEnabled={store.hasPrevious} action={store.skipPrevious} />
                            <PlayButtonLarge isPlaying={store.isPlaying} playAction={store.play} pauseAction={store.pause} color={colors.accent} />
                            <NextButton isEnabled={store.hasNext} action={store.skipNext} />
                        </div>
                        <QueueControls base={colors.text} accent={colors.accent} />
                    </div>
                </div>
            </div>
        </div>
    )
})

export default FullScreenPlayer
