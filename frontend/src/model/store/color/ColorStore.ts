import { observable, action } from 'mobx'
import { ColorSet } from '../../../utils/ColorTools'

export default class ColorStore {
    @observable activeExtractors: Set<string> = new Set()
    @observable cachedColorSets: Map<string, ColorSet> = new Map()

    @action extractColor = (url: string | null | undefined) => {
        if (url == null || this.cachedColorSets.has(url) || this.activeExtractors.has(url)) {
            return
        }

        this.activeExtractors.add(url)
    }

    @action saveColor = (url: string, colorSet: ColorSet) => {
        this.activeExtractors.delete(url)
        this.cachedColorSets.set(url, colorSet)
    }
}