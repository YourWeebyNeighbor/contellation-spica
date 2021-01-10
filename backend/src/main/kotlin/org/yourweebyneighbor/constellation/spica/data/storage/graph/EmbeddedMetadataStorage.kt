package org.yourweebyneighbor.constellation.spica.data.storage.graph

import org.neo4j.ogm.cypher.ComparisonOperator
import org.neo4j.ogm.cypher.Filter
import org.yourweebyneighbor.constellation.spica.data.storage.IMetadataStorage
import org.yourweebyneighbor.constellation.spica.model.meta.BaseEntity
import java.util.*
import java.util.regex.Pattern

class EmbeddedMetadataStorage : IMetadataStorage {

    private val depth = 1

    private val session = EmbeddedNeo4j.getSession()

    override fun <T : BaseEntity> createOrUpdate(clazz: Class<T>, entity: T): T {
        session.save(entity, depth)
        return session.load(clazz, entity.uuid)
    }

    override fun <T : BaseEntity> getAll(clazz: Class<T>): Iterable<T> {
        return session.loadAll(clazz, depth)
    }

    override fun <T : BaseEntity> searchString(clazz: Class<T>, propertyName: String, propertyValue: String): Iterable<T> {
        return session.loadAll(clazz, Filter(propertyName, ComparisonOperator.CONTAINING, propertyValue.toLowerCase()))
            .union(session.loadAll(clazz, Filter(propertyName, ComparisonOperator.CONTAINING, propertyValue.toUpperCase())))
            .distinctBy { item -> item.uuid }
    }

    override fun <T : BaseEntity> search(clazz: Class<T>, propertyName: String, propertyValue: Any): Iterable<T> {
        return session.loadAll(clazz, Filter(propertyName, ComparisonOperator.MATCHES, propertyValue))
    }

    override fun <T : BaseEntity> get(clazz: Class<T>, uuid: UUID): T {
        return session.load(clazz, uuid)
    }

    override fun <TRoot : BaseEntity, TTarget : BaseEntity> getRelated(rootClass: Class<TRoot>, targetClass: Class<TTarget>, uuid: UUID): Iterable<TTarget> {
        return session.query(
            targetClass,
            "MATCH (r:${rootClass.simpleName})-[]->(t:${targetClass.simpleName}) WHERE r.uuid=\$uuid RETURN t",
            mapOf("uuid" to uuid.toString())
        ).filterNotNull()
    }

    override fun <T : BaseEntity> delete(clazz: Class<T>, uuid: UUID) {
        session.delete(session.load(clazz, uuid))
    }


    override fun clearStorage() {
        session.purgeDatabase()
    }
}
