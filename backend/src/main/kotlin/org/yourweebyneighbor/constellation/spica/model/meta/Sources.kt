package org.yourweebyneighbor.constellation.spica.model.meta

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.neo4j.ogm.annotation.NodeEntity
import org.neo4j.ogm.annotation.Relationship
import org.neo4j.ogm.annotation.typeconversion.Convert
import org.neo4j.ogm.typeconversion.AttributeConverter
import org.yourweebyneighbor.constellation.spica.model.BaseEntityCollectionConverter
import org.yourweebyneighbor.constellation.spica.model.DataTypes
import java.net.URI
import java.util.*


@NodeEntity
open class UriSource(uuid: UUID) : BaseEntity(uuid) {

    @JsonSerialize(converter = BaseEntityCollectionConverter::class)
    @Relationship(direction = Relationship.INCOMING, type = "CONTAINS")
    var tracks: MutableSet<Track> = mutableSetOf()

    var type: String? = DataTypes.UNKNOWN.type
    var provider: String? = null

    @Convert(UriConverter::class)
    var uri: URI? = null

    constructor() : this(UUID.randomUUID())

    constructor(uuid: UUID, uri: URI, provider: String, type: String = DataTypes.UNKNOWN.type) : this(uuid) {
        this.uri = uri
        this.provider = provider
        this.type = type
    }

    class UriConverter : AttributeConverter<URI, String> {

        override fun toGraphProperty(value: URI): String? {
            return value.toString()
        }

        override fun toEntityAttribute(value: String?): URI {
            return URI(value!!)
        }
    }
}

@NodeEntity
class ImageUri(uuid: UUID) : UriSource(uuid) {
    constructor() : this(UUID.randomUUID())

    constructor(uuid: UUID, uri: URI, provider: String) : this(uuid) {
        this.uri = uri
        this.provider = provider
        this.type = DataTypes.IMAGE.type
    }
}

@NodeEntity
class AudioUri(uuid: UUID) : UriSource(uuid) {
    constructor() : this(UUID.randomUUID())


    constructor(uuid: UUID, uri: URI, provider: String) : this(uuid) {
        this.uri = uri
        this.provider = provider
        this.type = DataTypes.AUDIO.type
    }
}

@NodeEntity
class ThumbnailUri(uuid: UUID) : UriSource(uuid) {
    constructor() : this(UUID.randomUUID())

    constructor(uuid: UUID, uri: URI, provider: String) : this(uuid) {
        this.uri = uri
        this.provider = provider
        this.type = DataTypes.THUMBNAIL.type
    }
}
