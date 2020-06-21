package org.yourweebyneighbor.constellation.spica.data.storage.file

import mu.KotlinLogging
import org.yourweebyneighbor.constellation.spica.data.storage.IRawDataStorageSession
import org.yourweebyneighbor.constellation.spica.model.Payload
import org.yourweebyneighbor.constellation.spica.model.Utils
import org.yourweebyneighbor.constellation.spica.model.meta.UriSource
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import kotlin.streams.toList

class FileStorageSession : IRawDataStorageSession {
    private val logger = KotlinLogging.logger {}

    private val fileStorageLocation = Paths.get("storage/files/").toAbsolutePath()

    override fun clearStorage() {
        fileStorageLocation.toFile().deleteRecursively()
    }

    override fun store(payload: Payload, overwrite: Boolean): UriSource {
        val uuid = UUID.nameUUIDFromBytes(payload.data)
        val path = fileStorageLocation.resolve("${payload.mediaType}/${uuid}.${payload.extension}")

        if (!Files.exists(path) || overwrite) {
            logger.debug { "writing file '${path.toAbsolutePath()}'..." }

            Files.createDirectories(path.parent)

            Files.write(path.toAbsolutePath(), payload.data)
        } else {
            logger.debug { "file '${path}' already exists" }
        }

        return Utils.buildUriSource(uuid, path.toUri(), payload.provider, payload.mediaType)
    }

    override fun get(source: UriSource): Payload {

        val actualFilePath = getPath(source)

        return Payload(
                Files.probeContentType(actualFilePath) ?: "",
                Files.readAllBytes(actualFilePath),
                source.type!!,
                actualFilePath.fileName.toString().split(".").last(),
                source.provider!!
        )
    }

    private fun getPath(source: UriSource): Path {
        val givenPath = Paths.get(source.uri!!)

        if (Files.exists(givenPath)) {
            return givenPath
        }

        val matchingFiles = Files.list(fileStorageLocation.resolve(source.type!!)).filter { it.fileName.toString().toLowerCase().contains(source.uuid.toString()) }.toList()
        check(matchingFiles.size == 1) { "local file storage should contain exactly 1 file with uuid=${source.uuid}, but it has ${matchingFiles.size}" }
        return matchingFiles[0]
    }
}
