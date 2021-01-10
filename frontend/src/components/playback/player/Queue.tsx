import React from 'react'
import PlaybackStore from '../../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import ColorStore from '../../../model/store/color/ColorStore'
import TrackList from '../../common/lists/TrackList'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    queue: {
        height: '100%',
        width: '100%'
    }
})

const Queue = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {
    const styles = useStyles()

    return (
        <div className={styles.queue}>
            <TrackList fillerText="Queue" direction="up" tracks={store.queue} colorStore={colorStore} />
        </div>
    )
})

export default Queue