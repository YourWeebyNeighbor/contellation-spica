import React from 'react';
import './App.css';
import Player from './views/Player'
import PlaybackStore from './model/store/PlaybackStore';

const App: React.FC = () => {
  const store = new PlaybackStore();
  store.loadQueue()
  return (
    <React.Fragment>
      <Player store={store} />
    </React.Fragment>
  );
}

export default App;
