if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/edwinyjlim/.gradle/caches/9.0.0/transforms/29919e313b2d3f97cb0d6a9c4fe8034f/transformed/hermes-android-0.14.0-debug/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/edwinyjlim/.gradle/caches/9.0.0/transforms/29919e313b2d3f97cb0d6a9c4fe8034f/transformed/hermes-android-0.14.0-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

