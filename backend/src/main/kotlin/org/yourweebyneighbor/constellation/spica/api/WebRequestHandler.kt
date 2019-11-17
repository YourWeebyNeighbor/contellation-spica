package org.yourweebyneighbor.constellation.spica.api

import com.fasterxml.jackson.databind.ObjectMapper
import mu.KotlinLogging
import org.yourweebyneighbor.constellation.spica.data.providers.ProviderLocator
import org.yourweebyneighbor.constellation.spica.library.Library
import org.yourweebyneighbor.constellation.spica.model.meta.*
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
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(Library.getAllMetadata(Track::class.java).map(::getSummary).shuffled())
        }

        get("metadata/track/:uuid") {
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(Library.getMetadata(Track::class.java, UUID.fromString(request.params("uuid"))))
        }


        get("metadata/releases") {
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(Library.getAllMetadata(Release::class.java).map(::getSummary))
        }

        get("metadata/release/:uuid") {
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(Library.getMetadata(Release::class.java, UUID.fromString(request.params("uuid"))))
        }


        get("metadata/artists") {
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(Library.getAllMetadata(Artist::class.java).map(::getSummary))
        }

        get("metadata/artist/:uuid") {
            response.type("application/json")
            response.header("Access-Control-Allow-Origin", "*")
            getJson(Library.getMetadata(Artist::class.java, UUID.fromString(request.params("uuid"))))
        }

        get("data/:uuid") {
            response.header("Cache-Control", "public, max-age=31536000")
            response.header("Access-Control-Allow-Origin", "*")
            val payload = ProviderLocator.default.getData(Library.getSource(UriSource::class.java, UUID.fromString(request.params("uuid"))))

            if (payload == null) {
                response.status(404)
            } else {
                response.type(payload.mimeType)
                payload.data
            }
        }
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
