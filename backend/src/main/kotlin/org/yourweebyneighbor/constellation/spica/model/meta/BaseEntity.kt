package org.yourweebyneighbor.constellation.spica.model.meta

import org.neo4j.ogm.annotation.Id
import org.neo4j.ogm.annotation.NodeEntity
import org.neo4j.ogm.annotation.typeconversion.Convert
import org.neo4j.ogm.typeconversion.UuidStringConverter
import java.util.*

@NodeEntity
abstract class BaseEntity(uuid: UUID = UUID.randomUUID()) {

    @Id
    @Convert(UuidStringConverter::class)
    var uuid: UUID = uuid
        protected set
}
