package org.yourweebyneighbor.constellation.spica.model

data class Payload(val mimeType: String, val data: ByteArray, val mediaType: String, val extension: String, val provider: String) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Payload

        if (mimeType != other.mimeType) return false
        if (!data.contentEquals(other.data)) return false

        return true
    }

    override fun hashCode(): Int {
        return data.contentHashCode()
    }

}
