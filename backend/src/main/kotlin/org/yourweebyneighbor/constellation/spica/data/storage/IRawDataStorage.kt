package org.yourweebyneighbor.constellation.spica.data.storage

import org.yourweebyneighbor.constellation.spica.model.Payload
import org.yourweebyneighbor.constellation.spica.model.meta.UriSource

interface IRawDataStorage {

    fun clearStorage()

    fun store(payload: Payload, overwrite: Boolean = false): UriSource

    fun get(source: UriSource): Payload
}
