package org.yourweebyneighbor.constellation.spica.data.providers

import org.yourweebyneighbor.constellation.spica.library.Library
import org.yourweebyneighbor.constellation.spica.model.meta.Metadata
import org.yourweebyneighbor.constellation.spica.model.Payload
import org.yourweebyneighbor.constellation.spica.model.meta.UriSource
import java.net.URI

interface IDataProvider {
    val providerName: String

    fun scan(uri: URI): Pair<Collection<UriSource>, Collection<Metadata>>?

    fun scan(uris: Collection<URI>): Map<Collection<UriSource>, Collection<Metadata>>

    fun ingest(uri: URI) {
        val data = scan(uri)
        Library.ingest(data!!)
    }

    fun ingest(uris: Collection<URI>) {
        Library.ingest(scan(uris))
    }

    fun getData(source: UriSource): Payload?
}
