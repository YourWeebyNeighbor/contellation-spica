package org.yourweebyneighbor.constellation.spica.data.storage.graph

import org.neo4j.graphdb.factory.GraphDatabaseFactory
import org.neo4j.ogm.drivers.embedded.driver.EmbeddedDriver
import org.neo4j.ogm.session.Session
import org.neo4j.ogm.session.SessionFactory
import java.nio.file.Paths


object EmbeddedNeo4j {
    private const val STORAGE_ENTITY_PACKAGE = "org.yourweebyneighbor.constellation.spica.model"
    private val DATABASE_FILE_PATH = Paths.get("storage/neo4j")


    private val graphDb = GraphDatabaseFactory()
            .newEmbeddedDatabaseBuilder(DATABASE_FILE_PATH.toFile())
            .newGraphDatabase()


    private val sessionFactory = SessionFactory(EmbeddedDriver(graphDb), STORAGE_ENTITY_PACKAGE)

    init {
        Runtime.getRuntime().addShutdownHook(Thread(graphDb::shutdown))
    }

    fun getSession(): Session {
        return sessionFactory.openSession()
    }
}
