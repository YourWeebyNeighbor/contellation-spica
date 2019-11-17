package org.yourweebyneighbor.constellation.spica.data.providers.filesystem

import mu.KotlinLogging
import net.bramp.ffmpeg.FFmpeg
import net.bramp.ffmpeg.FFprobe
import net.bramp.ffmpeg.builder.FFmpegBuilder
import org.yourweebyneighbor.constellation.spica.data.providers.IDataProvider
import org.yourweebyneighbor.constellation.spica.data.providers.ProviderLocator
import org.yourweebyneighbor.constellation.spica.data.storage.file.FileStorageSession
import org.yourweebyneighbor.constellation.spica.library.Library
import org.yourweebyneighbor.constellation.spica.model.DataTypes
import org.yourweebyneighbor.constellation.spica.model.Payload
import org.yourweebyneighbor.constellation.spica.model.Utils
import org.yourweebyneighbor.constellation.spica.model.meta.*
import java.net.URI
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

object FileSystemDataProvider : IDataProvider {

    override val providerName: String = FileSystemDataProvider.javaClass.simpleName

    private const val THUMB_SIZE = 512
    private const val THUMB_EXTENSION = "webp"
    private const val ALBUM_ART_EXTENSION = "png"
    private val TMP_DIR = Files.createTempDirectory("spica-tmp")
    private val IGNORED_EXTENSIONS = listOf(".db", ".jpg", ".png")

    private val logger = KotlinLogging.logger {}

    private val TAG_TO_ENTITY: Map<String, (String) -> Metadata> = mapOf(
            "artist" to { name: String -> Artist(name) },
            "album" to { name: String -> Release(name) },
            "composer" to { name: String -> Artist(name) },
            "title" to { name: String -> Track(name) }
    )

    private val ffprobe = FFprobe()
    private val ffmpeg = FFmpeg()

    override fun scan(uri: URI): Pair<Collection<UriSource>, Collection<Metadata>>? {
        return scanFile(Paths.get(uri))
    }

    override fun scan(uris: Collection<URI>): Map<Collection<UriSource>, Collection<Metadata>> {
        val newFiles = uris.filter { IGNORED_EXTENSIONS.none { extension -> it.toString().endsWith(extension) } && !Library.isImported(it) }

        logger.info { "importing ${newFiles.size}/${uris.size} files..." }

        if (logger.isDebugEnabled) {
            newFiles.forEach { logger.debug { "new file: '$it'" } }
        }

        return newFiles.mapNotNull { scanFile(Paths.get(it)) }.associateBy({ it.first }, { it.second })

    }

    private fun scanFile(path: Path): Pair<Collection<UriSource>, Collection<Metadata>>? {
        try {
            logger.info { "processing file '${path.toAbsolutePath()}'..." }
            if (path.toFile().exists())
                return setOf(getImage(path), getImage(path, true), getAudio(path)) to getMetadata(path)

        } catch (ex: Exception) {
            logger.debug(ex) { "error while processing file '${path.toAbsolutePath()}'" }
            logger.error { "unable to import file '${path.toAbsolutePath()}'" }
        }

        return null
    }

    private fun getImage(path: Path, thumbnail: Boolean = false): UriSource {
        val tmpImagePath = TMP_DIR
                .resolve(if (thumbnail) "thumb_${THUMB_SIZE}px_tmp.${THUMB_EXTENSION}" else "tmp.${ALBUM_ART_EXTENSION}").toAbsolutePath()

        val builder = FFmpegBuilder()
                .addInput(path.toAbsolutePath().toString())
                .addExtraArgs("-an")
                .addOutput(tmpImagePath.toString())

        if (thumbnail) {
            builder.setVideoFilter("scale='min(${THUMB_SIZE}, iw)':-1")
        }

        ffmpeg.run(builder.done())

        val contentType = Files.probeContentType(tmpImagePath)

        if (contentType == null) {
            logger.debug { "unable to determine content type for $tmpImagePath" }
        }

        val image = Payload(
                contentType ?: "",
                Files.readAllBytes(tmpImagePath),
                if (thumbnail) DataTypes.THUMBNAIL.type else DataTypes.IMAGE.type,
                if (thumbnail) THUMB_EXTENSION else ALBUM_ART_EXTENSION,
                ProviderLocator.default.providerName)

        Files.deleteIfExists(tmpImagePath)

        return FileStorageSession().store(image)
    }

    private fun getAudio(path: Path): UriSource {
        return Utils.buildUriSource(path.toUri(), providerName, DataTypes.AUDIO)
    }

    private fun getMetadata(path: Path): Collection<Metadata> {
        val result = getMetaData(path).entries.map {
            if (TAG_TO_ENTITY.containsKey(it.key.toLowerCase())) TAG_TO_ENTITY[it.key.toLowerCase()]?.invoke(it.value)
            else Tag(it.key, it.value)
        }.requireNoNulls().toMutableSet()

        return if (result.filterIsInstance<Track>().any()) {
            result
        } else {
            result.plus(Track(path.fileName.toString()))
        }
    }

    private fun getMetaData(path: Path): Map<String, String> {
        return ffprobe.probe(path.toString())?.format?.tags
                ?: throw Exception("file '${path.toAbsolutePath()}' contains no metadata")
    }

    override fun getData(source: UriSource): Payload {
        return FileStorageSession().get(source)
    }
}
