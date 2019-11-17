package org.yourweebyneighbor.constellation.spica.data.storage

import org.neo4j.ogm.cypher.ComparisonOperator
import org.neo4j.ogm.cypher.Filter
import org.yourweebyneighbor.constellation.spica.model.meta.BaseEntity
import java.util.*

interface IMetadataStorageSession {

    fun clearStorage()

    fun <T : BaseEntity> exists(clazz: Class<T>, propertyName: String, propertyValue: Any): Boolean
    fun <T : BaseEntity> createOrUpdate(clazz: Class<T>, entity: T): T
    fun <T : BaseEntity> find(clazz: Class<T>, uuid: UUID): T
    fun <T : BaseEntity> findAll(clazz: Class<T>): Iterable<T>
    fun <T : BaseEntity> findAll(clazz: Class<T>, filter: Filter): Iterable<T>
    fun <T : BaseEntity> findAll(clazz: Class<T>, propertyName: String, propertyValue: Any): Iterable<T>
    fun <T : BaseEntity> findAll(clazz: Class<T>, propertyName: String, propertyValue: Any, operator: ComparisonOperator): Iterable<T>
    fun <T : BaseEntity> delete(clazz: Class<T>, uuid: UUID)

    fun <TRoot : BaseEntity, TTarget : BaseEntity> findAllRelated(rootClass: Class<TRoot>, targetClass: Class<TTarget>, uuid: UUID): Iterable<TTarget>
}
