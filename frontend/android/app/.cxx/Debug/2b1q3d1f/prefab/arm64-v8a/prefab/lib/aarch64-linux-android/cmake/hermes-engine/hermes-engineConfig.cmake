if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/litch/.gradle/caches/8.10.2/transforms/f5422ca1dadb413934a583d6614a2853/transformed/jetified-hermes-android-0.77.0-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/litch/.gradle/caches/8.10.2/transforms/f5422ca1dadb413934a583d6614a2853/transformed/jetified-hermes-android-0.77.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

