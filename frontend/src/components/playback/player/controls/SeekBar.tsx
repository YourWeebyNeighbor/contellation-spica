import React from 'react'
import { HsvColor, getCssHsvColorString } from '../../../../utils/ColorTools'
import { makeStyles } from '@material-ui/styles';

const OUTER_ALPHA = 0.4;

const useStyles = makeStyles({
    seekbar: {
        height: 3,
    },

    inner: {
        transition: 'width 0.5s',
    },

    waiting: {
        backgroundImage: `linear-gradient(
            90deg, 
            rgba(0,0,0, 0.1) 25%, 
            transparent 25%, 
            transparent 50%, 
            rgba(0,0,0, 0.1) 50%, 
            rgba(0,0,0, 0.1) 75%, 
            transparent 75%, 
            transparent
        )`,
        backgroundSize: 15
    },
})

export default function SeekBar({ color, duration, position, isWaiting, isMoving }: { isMoving: boolean, color: HsvColor, duration: number, position: number, isWaiting: boolean }) {

    const styles = useStyles()

    const progressValue = duration !== 0
        ? (position / duration)
        : 0

    return (
        <div className={`${styles.seekbar} ${isWaiting ? styles.waiting : ""}`} style={{ backgroundColor: getCssHsvColorString(color, OUTER_ALPHA) }}>

            <div className={styles.inner} style={{
                willChange: "width",
                height: "100%",
                width: `${progressValue * 100}%`,
                backgroundColor: getCssHsvColorString(color)
            }} />
        </div>
    )

}