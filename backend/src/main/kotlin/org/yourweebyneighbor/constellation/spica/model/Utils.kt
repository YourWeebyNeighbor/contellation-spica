package org.yourweebyneighbor.constellation.spica.model

import com.fasterxml.jackson.databind.util.StdConverter
import org.yourweebyneighbor.constellation.spica.model.meta.*
import java.net.URI
import java.util.*

class BaseEntityConverter : StdConverter<BaseEntity, String>() {
    override fun convert(metadata: BaseEntity): String {
        return metadata.uuid.toString()
    }
}

class BaseEntityCollectionConverter : StdConverter<Collection<BaseEntity>, Collection<String>>() {
    override fun convert(entities: Collection<BaseEntity>): Collection<String> {
        return entities.map { it.uuid.toString() }
    }
}

class SourceCollectionConverter : StdConverter<Collection<UriSource>, Map<String, String>>() {
    override fun convert(entities: Collection<UriSource>): Map<String, String> {
        return entities.associateBy({ it.uuid.toString() }, { it.type!! })
    }
}

class TagCollectionConverter : StdConverter<Collection<Tag>, Map<String, String>>() {
    override fun convert(tags: Collection<Tag>): Map<String, String> {
        return tags.associateBy({ it.key!! }, { it.value!! })
    }

}

object Utils {
    fun buildMetadataGraph(data: Map<Collection<UriSource>, Collection<Metadata>>): Collection<Track> {
        val tracks: MutableList<Track> = mutableListOf()
        val releases: MutableMap<String?, Release> = mutableMapOf()
        val artists: MutableMap<String?, Artist> = mutableMapOf()
        val tags: MutableMap<String?, Tag> = mutableMapOf()
        val uriSources: MutableMap<String?, UriSource> = mutableMapOf()

        for (entry in data.entries) {
            val currentTrack = entry.value.filterIsInstance<Track>().firstOrNull() ?: return emptyList()

            tracks.add(currentTrack)

            val currentSources = entry.key.map { uriSources.getOrPut(it.uri.toString(), { it }) }

            currentTrack.sources.addAll(currentSources)
            currentSources.forEach { it.tracks.add(currentTrack) }

            val currentTags = entry.value.filterIsInstance<Tag>().map { tags.getOrPut(it.name) { it } }
            currentTrack.tags.addAll(currentTags)
            currentTags.forEach { it.tracks.add(currentTrack) }

            var currentReleases = entry.value.filterIsInstance<Release>().map { releases.getOrPut(it.name) { it } }
            if (currentReleases.isEmpty()) {
                currentReleases = listOf(releases.getOrPut("unknown") { Release("unknown") })
            }
            currentTrack.releases.addAll(currentReleases)
            currentReleases.forEach { it.tracks.add(currentTrack) }

            var currentArtists = entry.value.filterIsInstance<Artist>().map { artists.getOrPut(it.name) { it } }
            if (currentArtists.isEmpty()) {
                currentArtists = listOf(artists.getOrPut("unknown") { Artist("unknown") })
            }
            currentTrack.artists.addAll(currentArtists)
            currentArtists.forEach { it.tracks.add(currentTrack) }
        }

        return tracks
    }

    fun buildUriSource(uuid: UUID, uri: URI, provider: String, type: DataTypes): UriSource {
        return buildUriSource(uuid, uri, provider, type.type)
    }

    fun buildUriSource(uri: URI, provider: String, type: DataTypes): UriSource {
        return buildUriSource(UUID.randomUUID(), uri, provider, type.type)
    }

    fun buildUriSource(uuid: UUID, uri: URI, provider: String, typeName: String): UriSource {
        return when (typeName) {
            DataTypes.AUDIO.type -> AudioUri(uuid, uri, provider)
            DataTypes.IMAGE.type -> ImageUri(uuid, uri, provider)
            DataTypes.THUMBNAIL.type -> ThumbnailUri(uuid, uri, provider)
            else -> UriSource(uuid, uri, provider, typeName)
        }
    }
}
