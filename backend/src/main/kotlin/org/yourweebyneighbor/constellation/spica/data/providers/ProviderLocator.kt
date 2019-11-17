package org.yourweebyneighbor.constellation.spica.data.providers

import org.yourweebyneighbor.constellation.spica.data.providers.filesystem.FileSystemDataProvider

private enum class Builtins(val provider: IDataProvider, val providerName: String) {
    FILE_SYSTEM_PROVIDER(FileSystemDataProvider, FileSystemDataProvider.providerName.toLowerCase());
}

object ProviderLocator {
    val default: IDataProvider by lazy { Builtins.FILE_SYSTEM_PROVIDER.provider }

    private val providers = Builtins.values().associateBy({ it.providerName }, { it.provider }).toMutableMap()

    fun get(name: String): IDataProvider? {
        return providers[name]
    }

    fun register(provider: IDataProvider) {
        providers.putIfAbsent(provider.providerName, provider)
    }
}
