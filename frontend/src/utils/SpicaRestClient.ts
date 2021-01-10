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

function fetchAndCheckStatus(url: string) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`unable to get '${url}' - server responded with '${response.statusText}'`)
            }
            return response.json()
        })
}

function getSourceUrl(sourceKey: string): string {
    return `${dataUrl}/${sourceKey}`
}

export function searchByName<T extends Summary>(type: EntityType, name: string): Promise<T[]> {
    return fetchAndCheckStatus(`${metadataUrl}/${collections[type]}?name=${name}`)
}

export function getCollection<T extends Summary>(type: EntityType): Promise<T[]> {
    return fetchAndCheckStatus(`${metadataUrl}/${collections[type]}`)
}

export function getMetadata<T extends Metadata>(uuid: string, type: EntityType): Promise<T> {
    return fetchAndCheckStatus(`${metadataUrl}/${type}/${uuid}`)
}

export function getSourceUrlFromEntity(metadata: Entity, type: SourceType): string {
    for (const key in metadata.sources) {
        if (type === metadata.sources[key]) {
            return getSourceUrl(key)
        }
    }

    throw new Error(`no source with matching type '${type}' was found fro entity '${metadata.uuid}'`)
}