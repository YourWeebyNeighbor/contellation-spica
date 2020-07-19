import React from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import ColorStore from '../../model/store/color/ColorStore'
import TrackList from '../common/lists/TrackList'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    history: {
        height: '100%',
        width: '100%'
    }
})

const History = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {
    const styles = useStyles()

    return (
        <div className={styles.history} style={store.playerState === "history" ? {} : { display: "none" }}>
            <TrackList direction="down" tracks={store.history} colorStore={colorStore} />
        </div>
    )
})

export default History