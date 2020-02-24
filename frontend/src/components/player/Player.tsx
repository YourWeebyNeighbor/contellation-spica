import React from 'react';
import ProgressBar from './controls/ProgressBar';
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
import MediaSession from '@mebtte/react-media-session';
import { observer } from 'mobx-react';
import ArtistList from './displays/ArtistList';
import { Box } from '@material-ui/core';

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

const Player = observer(({ store }: { store: PlaybackStore }) => {

    const track = store.currentTrack;

    if (track == null) {
        return (<div className="player-placeholder" />)
    }

    const colors = track.colorSet || DEFAULT_COLORS;

    const upperBackgroundStyle = {
        backgroundColor: getCssHsvColorString(colors.background),
    }

    const lowerBackgroundStyle = {
        backgroundColor: getCssHsvColorString(colors.background, 0.6)
    }

    const style = {
        color: getCssHsvColorString(colors.text)
    }

    return (
        <div className="player-wrapper">
            <Box boxShadow={3} className="player" style={style}>
                <div className="player-background-upper" style={upperBackgroundStyle} />
                <div className="player-background-lower" style={lowerBackgroundStyle} />

                <MediaSession
                    title={track.name}
                    artist={(track.artists || []).map(artist => artist.name).join(", ")}
                    album={(track.releases || []).map(release => release.name).join(", ")}
                    artwork={[{ src: track.thumbnailUrl, size: "512x512" }, { src: track.albumArtUrl, size: "2048x2048" }]}
                    onPlay={store.play}
                    onPause={store.pause}
                    onPreviousTrack={store.skipPrevious}
                    onNextTrack={store.skipNext}
                />

                <div className="player-controls">
                    <ProgressBar positionGetter={track.getPosition} durationGetter={track.getDuration} color={colors.text} autoUpadte={track.isPlaying} />
                    <div className="player-controls-time">
                        <TimeDisplay valueGetter={track.getPosition} autoUpdate={track.isPlaying} />
                        <TimeDisplay valueGetter={track.getDuration} autoUpdate={track.isPlaying} />
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
                {track.thumbnail}
            </Box>
        </div>
    )
})

export default Player
