import React from 'react';
import Player from './player/Player';
import PlaybackStore from '../model/store/playback/PlaybackStore';
import History from './lists/History';
import Queue from './lists/Queue';
import "../styles/commonComponents.scss";
import ColorStore from '../model/store/color/ColorStore';
import Extractors from './Extractors';

export default function PlaybackView() {
    const playbackStore = new PlaybackStore();
    const colorStore = new ColorStore();

    playbackStore.loadQueue()

    const filler = (<div className="player-filler" />)

    return (
        <React.Fragment>
            <History store={playbackStore} footer={filler} colorStore={colorStore} />
            <Player store={playbackStore} colorStore={colorStore} />
            <Queue store={playbackStore} header={filler} colorStore={colorStore} />
            <Extractors store={colorStore} />
        </React.Fragment>
    );
}