package org.yourweebyneighbor.constellation.spica

import mu.KotlinLogging
import org.yourweebyneighbor.constellation.spica.api.WebRequestHandler
import org.yourweebyneighbor.constellation.spica.data.providers.ProviderLocator
import org.yourweebyneighbor.constellation.spica.data.storage.file.FileStorageSession
import org.yourweebyneighbor.constellation.spica.library.Library
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

private val logger = KotlinLogging.logger {}

private const val PORT = 5056

private const val DIRECTORY = "Music"

fun main() {
//    Library.clearLibrary()
//    FileStorageSession().clearStorage()

    ProviderLocator.default.ingest(listFiles(Paths.get(DIRECTORY)).map { it.toUri() })
    WebRequestHandler(PORT)

    logger.info { "spica backend started successfully at http://localhost:${PORT}" }
}

private fun listFiles(directory: Path): Collection<Path> {
    val result = mutableSetOf<Path>()

    if (!Files.exists(directory) || !Files.isDirectory(directory)) {
        logger.warn { "'$directory' is not a directory!" }
        return result
    }

    directory.toFile().walkTopDown().forEach { if (!it.isDirectory) result.add(it.toPath()) }
    return result
}
