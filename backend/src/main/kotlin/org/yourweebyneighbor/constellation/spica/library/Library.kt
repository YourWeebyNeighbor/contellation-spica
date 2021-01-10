package org.yourweebyneighbor.constellation.spica.library

import org.yourweebyneighbor.constellation.spica.data.storage.graph.EmbeddedMetadataStorage
import org.yourweebyneighbor.constellation.spica.data.storage.IMetadataStorage
import org.yourweebyneighbor.constellation.spica.model.*
import org.yourweebyneighbor.constellation.spica.model.meta.Metadata
import org.yourweebyneighbor.constellation.spica.model.meta.Track
import org.yourweebyneighbor.constellation.spica.model.meta.UriSource
import java.net.URI
import java.util.*

object Library {

    private val storage: IMetadataStorage by lazy { EmbeddedMetadataStorage(); }

    fun ingest(importedData: Pair<Collection<UriSource>, Collection<Metadata>>) {
        ingest(mapOf(importedData))
    }

    fun ingest(importedData: Map<Collection<UriSource>, Collection<Metadata>>) {
        val tracks = Utils.buildMetadataGraph(importedData)
        tracks.forEach { storage.createOrUpdate(Track::class.java, it) }
    }

    fun <T : Metadata> searchByName(clazz: Class<T>, searchString: String? = null): Iterable<T> {
        return if (searchString != null)
            storage.searchString(clazz, Metadata::value.name, searchString)
                .sortedBy { item -> item.value!!.length - searchString.length }
        else
            storage.getAll(clazz)
    }

    fun <T : Metadata> getMetadata(clazz: Class<T>, uuid: UUID): T {
        return storage.get(clazz, uuid)
    }

    fun <T : UriSource> getAllSources(clazz: Class<T>): Iterable<T> {
        return storage.getAll(clazz)
    }

    fun <T : UriSource> getSource(clazz: Class<T>, uuid: UUID): T {
        return storage.get(clazz, uuid)
    }

    fun <T : Metadata> getAllRelatedTrackMetadata(clazz: Class<T>, trackUuid: UUID): Iterable<T> {
        return storage.getRelated(Track::class.java, clazz, trackUuid)
    }

    fun <T : UriSource> getAllRelatedTrackSources(clazz: Class<T>, trackUuid: UUID): Iterable<T> {
        return storage.getRelated(Track::class.java, clazz, trackUuid)
    }

    fun isImported(uri: URI): Boolean {
        return storage.search(UriSource::class.java, UriSource::uri.name, uri).any()
    }

    fun clearLibrary() {
        EmbeddedMetadataStorage().clearStorage()
    }
}
