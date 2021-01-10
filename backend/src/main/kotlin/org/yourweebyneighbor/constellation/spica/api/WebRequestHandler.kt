package org.yourweebyneighbor.constellation.spica.api

import com.fasterxml.jackson.databind.ObjectMapper
import mu.KotlinLogging
import org.yourweebyneighbor.constellation.spica.data.providers.ProviderLocator
import org.yourweebyneighbor.constellation.spica.library.Library
import org.yourweebyneighbor.constellation.spica.model.meta.*
import spark.Request
import spark.Response
import spark.kotlin.get
import spark.kotlin.port
import java.util.*

@Suppress("unused")
class WebRequestHandler(serverPort: Int) {
    private val logger = KotlinLogging.logger {}

    private val jsonMapper = ObjectMapper()

    init {
        port(serverPort)

        get("/") {
            response.type("text/html")
            response.header("Access-Control-Allow-Origin", "*")
            "<a href=\"metadata/releases\">releases</a>\n" +
                    "<br>\n" +
                    "<a href=\"metadata/tracks\">tracks</a>\n" +
                    "<br>\n" +
                    "<a href=\"metadata/artists\">artists</a>\n" +
                    "<br>\n" +
                    "<a href=\"version\">version</a>\n"
        }

        get("/version") {
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(object {
                val version = "0.1.1"
            })
        }


        get("metadata/tracks") {
            searchMetadata(Track::class.java, request, response)
        }

        get("metadata/track/:uuid") {
            getMetadata(Track::class.java, request, response)
        }


        get("metadata/releases") {
            searchMetadata(Release::class.java, request, response)
        }

        get("metadata/release/:uuid") {
            getMetadata(Release::class.java, request, response)
        }


        get("metadata/artists") {
            searchMetadata(Artist::class.java, request, response)
        }

        get("metadata/artist/:uuid") {
            getMetadata(Artist::class.java, request, response)
        }


        get("metadata/tags") {
            searchMetadata(Tag::class.java, request, response)
        }

        get("metadata/tag/:uuid") {
            getMetadata(Tag::class.java, request, response)
        }

        get("metadata") {
            searchMetadata(Metadata::class.java, request, response)
        }

        get("data/:uuid") {
            response.header("Cache-Control", "public, max-age=31536000")
            response.header("Access-Control-Allow-Origin", "*")
            val payload = ProviderLocator.default.getData(
                Library.getSource(
                    UriSource::class.java,
                    UUID.fromString(request.params("uuid"))
                )
            )

            if (payload == null) {
                response.status(404)
            } else {
                response.type(payload.mimeType)
                payload.data
            }
        }
    }

    private fun <T : Metadata> searchMetadata(clazz: Class<T>, request: Request, response: Response): String {
        return setHeadersAndReturnJson(Library.searchByName(clazz, request.queryParamOrDefault("name", null)).map(::getSummary), response)
    }

    private fun <T : Metadata> getMetadata(clazz: Class<T>, request: Request, response: Response): String {
        return setHeadersAndReturnJson(Library.getMetadata(clazz, UUID.fromString(request.params("uuid"))), response)
    }

    private fun setHeadersAndReturnJson(data: Any?, response: Response): String {
        response.type("application/json")
        response.header("Access-Control-Allow-Origin", "*")

        return getJson(data)
    }

    private fun getJson(data: Any?): String {
        return jsonMapper.writeValueAsString(data)
    }

    private fun getSummary(data: Metadata): Any {
        return object {
            val uuid = data.uuid
            val type = data.key
            val name = data.value
            val sources = data.sources.associateBy({ it.uuid }, { it.type })
        }
    }
}
