package org.yourweebyneighbor.constellation.spica.data.storage.graph

import org.neo4j.ogm.cypher.ComparisonOperator
import org.neo4j.ogm.cypher.Filter
import org.yourweebyneighbor.constellation.spica.data.storage.IMetadataStorageSession
import org.yourweebyneighbor.constellation.spica.model.meta.BaseEntity
import java.util.*

class EmbeddedMetadataStorageSession: IMetadataStorageSession {

    private val depth = 1

    private val session = EmbeddedNeo4j.getSession()

    override fun <T : BaseEntity> createOrUpdate(clazz: Class<T>, entity: T): T {
        session.save(entity, depth)
        return session.load(clazz, entity.uuid)
    }

    override fun <T : BaseEntity> findAll(clazz: Class<T>): Iterable<T> {
        return session.loadAll(clazz, depth)
    }

    override fun <T : BaseEntity> findAll(clazz: Class<T>, propertyName: String, propertyValue: Any, operator: ComparisonOperator): Iterable<T> {
        return session.loadAll(clazz, Filter(propertyName, operator, propertyValue))
    }

    override fun <T : BaseEntity> findAll(clazz: Class<T>, propertyName: String, propertyValue: Any): Iterable<T> {
        return session.loadAll(clazz, Filter(propertyName, ComparisonOperator.EQUALS, propertyValue))
    }

    override fun <T : BaseEntity> findAll(clazz: Class<T>, filter: Filter): Iterable<T> {
        return session.loadAll(clazz, filter)
    }

    override fun <T : BaseEntity> find(clazz: Class<T>, uuid: UUID): T {
        return session.load(clazz, uuid)
    }

    override fun <TRoot : BaseEntity, TTarget : BaseEntity> findAllRelated(rootClass: Class<TRoot>, targetClass: Class<TTarget>, uuid: UUID): Iterable<TTarget> {
        return session.query(
                targetClass,
                "MATCH (r:${rootClass.simpleName})-[]->(t:${targetClass.simpleName}) WHERE r.uuid=\$uuid RETURN t",
                mapOf("uuid" to uuid.toString())
        ).filterNotNull()
    }

    override fun <T : BaseEntity> delete(clazz: Class<T>, uuid: UUID) {
        session.delete(session.load(clazz, uuid))
    }

    override fun <T : BaseEntity> exists(clazz: Class<T>, propertyName: String, propertyValue: Any): Boolean {
        return !findAll(clazz, propertyName, propertyValue).none()
    }


    override fun clearStorage() {
        session.purgeDatabase()
    }
}
