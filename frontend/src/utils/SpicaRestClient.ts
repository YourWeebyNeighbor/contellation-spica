import Entity from "../model/libraryEntities/Entity";
import { SourceType } from "../model/libraryEntities/SourceType"
import { EntityType } from "../model/libraryEntities/EntityType";
import Summary from "../model/libraryEntities/Summary";
import Metadata from "../model/libraryEntities/Metadata";

const port = 5056

const baseUrl = `http://${window.location.hostname}:${port}`

const metadataUrl = `${baseUrl}/metadata`

const dataUrl = `${baseUrl}/data`

const collections: { [key: string]: string } = {
    "track": "tracks",
    "release": "releases",
    "artist": "artists"
}

export function getCollection<T extends Summary>(type: EntityType): Promise<T[]> {
    return fetch(`${metadataUrl}/${collections[type]}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`unable to get queue - fetch returned with '${response.statusText}'`)
            }
            return response.json()
        })
}

export function getMetadata<T extends Metadata>(uuid: string, type: EntityType): Promise<T> {
    return fetch(`${metadataUrl}/${type}/${uuid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`unable to get metadata - fetch returned with '${response.statusText}'`)
            }
            return response.json()
        })
}

export function getSourceUrlFromEntity(metadata: Entity, type: SourceType): string {
    for (const key in metadata.sources) {
        if (type === metadata.sources[key]) {
            return getSourceUrl(key)
        }
    }

    throw new Error("no source with acceptable type was found")
}

export function getSourceUrl(uuid: string): string {
    return `${dataUrl}/${uuid}`
}