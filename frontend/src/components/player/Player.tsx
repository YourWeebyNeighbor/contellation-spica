import React from 'react';
import SeekBar from './controls/SeekBar';
import TimeDisplay from './displays/TimeDisplay'
import PlayButton from './controls/PlayButton';
import PrevButton from './controls/PrevButton';
import NextButton from './controls/NextButton';
import TrackTitle from './displays/TrackTitle';
import TrackTags from './displays/TrackTags';
import QueueControls from './controls/QueueControls';
import { ColorSet, getCssHsvColorString } from '../../utils/ColorTools'
import '../../styles/player.scss'
import PlaybackStore from '../../model/store/playback/PlaybackStore';
import { observer } from 'mobx-react';
import ArtistList from './displays/ArtistList';
import { Box, Fade } from '@material-ui/core';
import ColorStore from '../../model/store/color/ColorStore';
import { getSmallThumbUrl } from '../../utils/ThumbTools';
import { Flipper } from 'react-flip-toolkit';
import FixedSizeAlbumArt from './displays/FixedAlbumArt';

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

const Player = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {

    const track = store.currentTrack;

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
        <Flipper flipKey={track.uuid} className="player-wrapper">
            <Fade in={true}>
                <Box boxShadow={3} className="player" style={style}>
                    <div className="player-background" style={lowerBackgroundStyle} />
                    <div className="player-controls">
                        <div>
                            <SeekBar
                                position={store.currentTrackPosition || 0}
                                duration={store.currentTrackDuration || 0}
                                isWaiting={store.isWaiting}
                                color={colors.text} />

                            <div className="player-controls-time">
                                <TimeDisplay value={store.currentTrackPosition || 0} />
                                <TimeDisplay value={store.currentTrackDuration || 0} />
                            </div>
                        </div>
                        <div className="player-controls-main">
                            <div className="player-controls-main-summary">
                                <div className="player-controls-main-summary-title">
                                    <TrackTitle title={track.name} />
                                    <TrackTags />
                                </div>
                                <div className="player-controls-main-summary-artists">
                                    <ArtistList colors={colors} artists={track.artists || []} />
                                </div>
                            </div>
                            <div className="player-controls-main-playback" style={{ color: getCssHsvColorString(colors.text) }}>
                                <div className="player-controls-main-playback-current">
                                    <PlayButton isPlaying={store.isPlaying} playAction={store.play} pauseAction={store.pause} color={colors.accent} />
                                    <PrevButton isEnabled={store.hasPrevious} action={store.skipPrevious} />
                                    <NextButton isEnabled={store.hasNext} action={store.skipNext} />
                                </div>
                                <div className="player-controls-main-playback-queue">
                                    <QueueControls base={colors.text} accent={colors.accent} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <FixedSizeAlbumArt thumbnails={track.thumbnails} backgroundColor={colors.background} />
                </Box>
            </Fade>
        </Flipper >
    )
})

export default Player
