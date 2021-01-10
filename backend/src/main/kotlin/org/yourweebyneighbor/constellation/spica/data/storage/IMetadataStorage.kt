package org.yourweebyneighbor.constellation.spica.data.storage

import org.yourweebyneighbor.constellation.spica.model.meta.BaseEntity
import java.util.*

interface IMetadataStorage {

    fun clearStorage()

    fun <T : BaseEntity> createOrUpdate(clazz: Class<T>, entity: T): T
    fun <T : BaseEntity> get(clazz: Class<T>, uuid: UUID): T
    fun <T : BaseEntity> getAll(clazz: Class<T>): Iterable<T>
    fun <T : BaseEntity> searchString(clazz: Class<T>, propertyName: String, searchString: String): Iterable<T>
    fun <T : BaseEntity> search(clazz: Class<T>, propertyName: String, propertyValue: Any): Iterable<T>
    fun <T : BaseEntity> delete(clazz: Class<T>, uuid: UUID)

    fun <TRoot : BaseEntity, TTarget : BaseEntity> getRelated(rootClass: Class<TRoot>, targetClass: Class<TTarget>, uuid: UUID): Iterable<TTarget>
}
