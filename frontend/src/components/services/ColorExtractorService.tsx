import React from 'react';
import ColorStore from '../../model/store/color/ColorStore';
import { observer } from 'mobx-react';
import { ColorExtractor } from 'react-color-extractor'
import { getColorSetFromSwatchArray } from '../../utils/ColorTools';

const Extractors = observer(({ store }: { store: ColorStore }) => {
    return (
        <div>
            {Array.from(store.activeExtractors).map(url => (
                <ColorExtractor rgb={true} src={url} key={url}
                    getColors={(swatches: number[][]) => store.saveColor(url, getColorSetFromSwatchArray(swatches))} />
            ))}
        </div>
    )
})

export default Extractors