package org.yourweebyneighbor.constellation.spica

import mu.KotlinLogging
import org.yourweebyneighbor.constellation.spica.api.WebRequestHandler
import org.yourweebyneighbor.constellation.spica.data.providers.ProviderLocator
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

private val logger = KotlinLogging.logger {}

private const val PORT = 5056

fun main() {
//    Library.clearLibrary()
//    FileStorageSession().clearStorage()

    ProviderLocator.default.ingest(listFiles(Paths.get("../Music")).map { it.toUri() })
    val restHandler = WebRequestHandler(PORT)

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
