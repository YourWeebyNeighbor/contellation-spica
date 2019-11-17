package org.yourweebyneighbor.constellation.spica.library

import org.yourweebyneighbor.constellation.spica.data.storage.graph.EmbeddedMetadataStorageSession
import org.yourweebyneighbor.constellation.spica.data.storage.IMetadataStorageSession
import org.yourweebyneighbor.constellation.spica.model.*
import org.yourweebyneighbor.constellation.spica.model.meta.Metadata
import org.yourweebyneighbor.constellation.spica.model.meta.Track
import org.yourweebyneighbor.constellation.spica.model.meta.UriSource
import java.net.URI
import java.util.*

object Library {

    private val session: IMetadataStorageSession by lazy { EmbeddedMetadataStorageSession(); }

    fun ingest(importedData: Pair<Collection<UriSource>, Collection<Metadata>>) {
        ingest(mapOf(importedData))
    }

    fun ingest(importedData: Map<Collection<UriSource>, Collection<Metadata>>) {
        val tracks = Utils.buildMetadataGraph(importedData)
        tracks.forEach { session.createOrUpdate(Track::class.java, it) }
    }

    fun <T : Metadata> getAllMetadata(clazz: Class<T>): Iterable<T> {
        return session.findAll(clazz)
    }

    fun <T : Metadata> getMetadata(clazz: Class<T>, uuid: UUID): T {
        return session.find(clazz, uuid)
    }

    fun <T : UriSource> getAllSources(clazz: Class<T>): Iterable<T> {
        return session.findAll(clazz)
    }

    fun <T : UriSource> getSource(clazz: Class<T>, uuid: UUID): T {
        return session.find(clazz, uuid)
    }

    fun <T : Metadata> getAllRelatedTrackMetadata(clazz: Class<T>, trackUuid: UUID): Iterable<T> {
        return session.findAllRelated(Track::class.java, clazz, trackUuid)
    }

    fun <T : UriSource> getAllRelatedTrackSources(clazz: Class<T>, trackUuid: UUID): Iterable<T> {
        return session.findAllRelated(Track::class.java, clazz, trackUuid)
    }

    fun isImported(uri: URI): Boolean {
        return session.exists(UriSource::class.java, UriSource::uri.name, uri)
    }

    fun clearLibrary() {
        EmbeddedMetadataStorageSession().clearStorage()
    }
}
