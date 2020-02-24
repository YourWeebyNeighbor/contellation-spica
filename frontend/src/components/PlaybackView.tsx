import React from 'react';
import Player from './player/Player';
import PlaybackStore from '../model/store/playback/PlaybackStore';
import History from './lists/History';
import Queue from './lists/Queue';
import "../styles/commonComponents.scss";

export default function PlaybackView() {
    const store = new PlaybackStore();
    store.loadQueue()

    const filler = (<div className="player-filler"/>)

    return (
        <React.Fragment>
            <History store={store} header={filler}/>
            <Player store={store}/>
            <Queue store={store} header={filler}/>
        </React.Fragment>
    );
}