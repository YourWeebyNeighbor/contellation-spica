@file:Suppress("unused")

package org.yourweebyneighbor.constellation.spica.model.meta

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.neo4j.ogm.annotation.NodeEntity
import org.neo4j.ogm.annotation.Relationship
import org.yourweebyneighbor.constellation.spica.model.BaseEntityCollectionConverter
import org.yourweebyneighbor.constellation.spica.model.SourceCollectionConverter
import org.yourweebyneighbor.constellation.spica.model.TagCollectionConverter

@NodeEntity
abstract class Metadata() : BaseEntity() {
    @JsonProperty("type")
    var key: String? = null

    @JsonIgnore
    var value: String? = null

    @JsonSerialize(converter = SourceCollectionConverter::class)
    @Relationship(direction = Relationship.OUTGOING, type = "CONTAINS")
    var sources: MutableSet<UriSource> = mutableSetOf()

    constructor(key: String) : this() {
        this.key = key
    }

    constructor(key: String?, value: String?) : this() {
        this.key = key
        this.value = value
    }

    override fun toString(): String {
        return "$key: $value"
    }
}

@NodeEntity
class Track(name: String?) : Metadata("track", name) {

    val name: String? get() = super.value

    constructor() : this(null)

    @JsonSerialize(converter = BaseEntityCollectionConverter::class)
    @Relationship(direction = Relationship.OUTGOING, type = "RELATES")
    var releases: MutableSet<Release> = mutableSetOf()

    @JsonSerialize(converter = BaseEntityCollectionConverter::class)
    @Relationship(direction = Relationship.OUTGOING, type = "RELATES")
    var artists: MutableSet<Artist> = mutableSetOf()

    @JsonSerialize(converter = TagCollectionConverter::class)
    @Relationship(direction = Relationship.OUTGOING, type = "HAS")
    var tags: MutableSet<Tag> = mutableSetOf()
}

@NodeEntity
class Tag(key: String?, value: String?) : Metadata(key, value) {
    val name: String? get() = super.key

    constructor() : this(null, null)

    @JsonSerialize(converter = BaseEntityCollectionConverter::class)
    @Relationship(direction = Relationship.INCOMING, type = "HAS")
    var tracks: MutableSet<Track> = mutableSetOf()
}

@NodeEntity
class Release(name: String?) : Metadata("release", name) {
    val name: String? get() = super.value

    constructor() : this(null)

    @JsonSerialize(converter = BaseEntityCollectionConverter::class)
    @Relationship(direction = Relationship.INCOMING, type = "RELATES")
    var tracks: MutableSet<Track> = mutableSetOf()
}

@NodeEntity
class Artist(name: String?) : Metadata("artist", name) {
    val name: String? get() = super.value

    constructor() : this(null)

    @JsonSerialize(converter = BaseEntityCollectionConverter::class)
    @Relationship(direction = Relationship.INCOMING, type = "RELATES")
    var tracks: MutableSet<Track> = mutableSetOf()
}

