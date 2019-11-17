import React from 'react';
import ProgressBar from '../components/player/controls/ProgressBar';
import TimeDisplay from '../components/player/displays/TimeDisplay'
import PlayButton from '../components/player/controls/PlayButton';
import PrevButton from '../components/player/controls/PrevButton';
import NextButton from '../components/player/controls/NextButton';
import TrackTitle from '../components/player/displays/TrackTitle';
import TrackTags from '../components/player/displays/TrackTags';
import QueueControls from '../components/player/controls/QueueControls';
import { ColorSet, getCssHsvColorString } from '../utils/ColorTools'
import '../styles/player.scss'
import ArtistCard from '../components/player/displays/ArtistCard';
import { observer } from 'mobx-react'
import PlaybackStore from '../model/store/PlaybackStore';
import Artist from '../model/libraryEntities/Artist';
import MediaSession from '@mebtte/react-media-session';

const defaultColors: ColorSet = {
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

@observer
export default class Player extends React.Component<{ store: PlaybackStore }, {}> {

    render() {
        if (this.props.store.currentTrack == null) {
            return "Player placeholder"
        }

        const track = this.props.store.currentTrack;

        const colors = track.colorSet || defaultColors;

        const style = {
            backgroundColor: getCssHsvColorString(colors.background),
            color: getCssHsvColorString(colors.text)
        }

        const artistCards = (
            (this.props.store.currentTrack.artists || []).map((artist: Artist) => (
                <ArtistCard key={artist.uuid} name={artist.name} avatarPath={null} background={colors.text} text={colors.background} />
            ))
        )

        return (
            <div className="player" style={style}>

                <MediaSession
                    title={track.name}
                    artist={(track.artists || []).map(artist => artist.name).join(", ")}
                    album={(track.releases || []).map(release => release.name).join(", ")}
                    artwork={[{ src: track.thumbnailUrl, size: "512x512" }, { src: track.albumArtUrl, size: "1024x1024" }]}
                    onPlay={this.props.store.play}
                    onPause={this.props.store.pause}
                    // onSeekBackward={() => (audio.currentTime -= 10)}
                    // onSeekForward={() => (audio.currentTime += 10)}
                    onPreviousTrack={this.props.store.skipPrevious}
                    onNextTrack={this.props.store.skipNext}
                />

                <div className="player-controls">
                    <ProgressBar positionGetter={track.getPosition} durationGetter={track.getDuration} color={colors.text} autoUpadte={true} />
                    <div className="player-controls-time">
                        <TimeDisplay valueGetter={track.getPosition} autoUpdate={true} />
                        <TimeDisplay valueGetter={track.getDuration} autoUpdate={true} />
                    </div>
                    <div className="player-controls-main">
                        <div className="player-controls-main-summary">
                            <div className="player-controls-main-summary-title">
                                <TrackTitle title={this.props.store.currentTrack.name} />
                                <TrackTags />
                            </div>
                            <div className="player-controls-main-summary-artists">
                                {artistCards}
                            </div>
                        </div>
                        <div className="player-controls-main-playback" style={{ color: getCssHsvColorString(colors.text) }}>
                            <div className="player-controls-main-playback-current">
                                <PlayButton isPlaying={this.props.store.isPlaying} playAction={this.props.store.play} pauseAction={this.props.store.pause} color={colors.accent} />
                                <PrevButton isEnabled={this.props.store.hasPrevious} action={this.props.store.skipPrevious} />
                                <NextButton isEnabled={this.props.store.hasNext} action={this.props.store.skipNext} />
                            </div>
                            <div className="player-controls-main-playback-queue">
                                <QueueControls base={colors.text} accent={colors.accent} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="player-albumart-wrapper">
                    {this.props.store.currentTrack.thumbnail}
                </div>
            </div>
        )
    }
}