## Final Validation

> react-example@0.0.0 lint
> tsc --noEmit

LINT: PASS

> react-example@0.0.0 build
> vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs

vite v6.4.3 building for production...
transforming...
✓ 1702 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.38 kB │ gzip:   0.59 kB
dist/assets/index-fADSascZ.css   83.28 kB │ gzip:  12.18 kB
dist/assets/index-B-OtglEd.js   483.67 kB │ gzip: 129.39 kB
✓ built in 3.43s

  dist/server.cjs      10.8kb
  dist/server.cjs.map  15.3kb

⚡ Done in 5ms
BUILD: PASS
✔ Copying web assets from dist to android/app/src/main/assets/public in 13.19ms
✔ Creating capacitor.config.json in android/app/src/main/assets in 771.84μs
✔ copy android in 30.03ms
✔ Updating Android plugins in 4.02ms
✔ update android in 76.09ms
✔ copy web in 10.74ms
✔ update web in 6.89ms
[info] Sync finished in 0.157s
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.14.3/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 

> Configure project :app
WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.

> Configure project :capacitor-cordova-android-plugins
WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.

> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:javaPreCompileDebug UP-TO-DATE
> Task :capacitor-android:preBuild UP-TO-DATE
> Task :capacitor-android:preDebugBuild UP-TO-DATE
> Task :capacitor-android:writeDebugAarMetadata UP-TO-DATE
> Task :capacitor-cordova-android-plugins:preBuild UP-TO-DATE
> Task :capacitor-cordova-android-plugins:preDebugBuild UP-TO-DATE
> Task :capacitor-cordova-android-plugins:writeDebugAarMetadata
> Task :app:checkDebugAarMetadata UP-TO-DATE
> Task :capacitor-android:processDebugNavigationResources UP-TO-DATE
> Task :capacitor-cordova-android-plugins:processDebugNavigationResources
> Task :app:processDebugNavigationResources UP-TO-DATE
> Task :app:compileDebugNavigationResources UP-TO-DATE
> Task :app:generateDebugResValues UP-TO-DATE
> Task :capacitor-android:generateDebugResValues UP-TO-DATE
> Task :capacitor-android:generateDebugResources UP-TO-DATE
> Task :capacitor-android:packageDebugResources UP-TO-DATE
> Task :capacitor-cordova-android-plugins:generateDebugResValues
> Task :capacitor-cordova-android-plugins:generateDebugResources
> Task :capacitor-cordova-android-plugins:packageDebugResources
> Task :app:mapDebugSourceSetPaths UP-TO-DATE
> Task :app:generateDebugResources UP-TO-DATE
> Task :app:mergeDebugResources UP-TO-DATE
> Task :app:packageDebugResources UP-TO-DATE
> Task :app:parseDebugLocalResources UP-TO-DATE
> Task :app:createDebugCompatibleScreenManifests UP-TO-DATE
> Task :app:extractDeepLinksDebug UP-TO-DATE
> Task :capacitor-android:extractDeepLinksDebug UP-TO-DATE
> Task :capacitor-android:processDebugManifest UP-TO-DATE
> Task :capacitor-cordova-android-plugins:extractDeepLinksDebug
> Task :capacitor-cordova-android-plugins:processDebugManifest
> Task :app:processDebugMainManifest UP-TO-DATE
> Task :app:processDebugManifest UP-TO-DATE
> Task :app:processDebugManifestForPackage UP-TO-DATE
> Task :capacitor-android:compileDebugLibraryResources UP-TO-DATE
> Task :capacitor-android:parseDebugLocalResources UP-TO-DATE
> Task :capacitor-android:generateDebugRFile UP-TO-DATE
> Task :capacitor-cordova-android-plugins:compileDebugLibraryResources
> Task :capacitor-cordova-android-plugins:parseDebugLocalResources
> Task :capacitor-cordova-android-plugins:generateDebugRFile
> Task :app:processDebugResources UP-TO-DATE
> Task :capacitor-android:javaPreCompileDebug UP-TO-DATE
> Task :capacitor-android:compileDebugJavaWithJavac UP-TO-DATE
> Task :capacitor-android:bundleLibCompileToJarDebug UP-TO-DATE
> Task :capacitor-cordova-android-plugins:javaPreCompileDebug
> Task :capacitor-cordova-android-plugins:compileDebugJavaWithJavac NO-SOURCE
> Task :capacitor-cordova-android-plugins:bundleLibCompileToJarDebug
> Task :app:compileDebugJavaWithJavac UP-TO-DATE
> Task :app:mergeDebugShaders UP-TO-DATE
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :capacitor-android:mergeDebugShaders UP-TO-DATE
> Task :capacitor-android:compileDebugShaders NO-SOURCE
> Task :capacitor-android:generateDebugAssets UP-TO-DATE
> Task :capacitor-android:mergeDebugAssets UP-TO-DATE
> Task :capacitor-cordova-android-plugins:mergeDebugShaders
> Task :capacitor-cordova-android-plugins:compileDebugShaders NO-SOURCE
> Task :capacitor-cordova-android-plugins:generateDebugAssets UP-TO-DATE
> Task :capacitor-cordova-android-plugins:mergeDebugAssets
> Task :app:mergeDebugAssets UP-TO-DATE
> Task :app:compressDebugAssets UP-TO-DATE
> Task :capacitor-android:bundleLibRuntimeToJarDebug UP-TO-DATE
> Task :capacitor-cordova-android-plugins:bundleLibRuntimeToJarDebug
> Task :app:desugarDebugFileDependencies UP-TO-DATE
> Task :app:dexBuilderDebug UP-TO-DATE
> Task :app:mergeDebugGlobalSynthetics UP-TO-DATE
> Task :app:processDebugJavaRes NO-SOURCE
> Task :capacitor-android:processDebugJavaRes NO-SOURCE
> Task :capacitor-cordova-android-plugins:processDebugJavaRes NO-SOURCE
> Task :app:mergeDebugJavaResource UP-TO-DATE
> Task :app:checkDebugDuplicateClasses UP-TO-DATE
> Task :app:mergeExtDexDebug UP-TO-DATE
> Task :capacitor-android:bundleLibRuntimeToDirDebug UP-TO-DATE
> Task :capacitor-cordova-android-plugins:bundleLibRuntimeToDirDebug
> Task :app:mergeLibDexDebug UP-TO-DATE
> Task :app:mergeProjectDexDebug UP-TO-DATE
> Task :app:mergeDebugJniLibFolders UP-TO-DATE
> Task :capacitor-android:mergeDebugJniLibFolders UP-TO-DATE
> Task :capacitor-android:mergeDebugNativeLibs NO-SOURCE
> Task :capacitor-android:copyDebugJniLibsProjectOnly UP-TO-DATE
> Task :capacitor-cordova-android-plugins:mergeDebugJniLibFolders
> Task :capacitor-cordova-android-plugins:mergeDebugNativeLibs NO-SOURCE
> Task :capacitor-cordova-android-plugins:copyDebugJniLibsProjectOnly
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:validateSigningDebug UP-TO-DATE
> Task :app:writeDebugAppMetadata UP-TO-DATE
> Task :app:writeDebugSigningConfigVersions UP-TO-DATE
> Task :app:packageDebug UP-TO-DATE
> Task :app:createDebugApkListingFileRedirect UP-TO-DATE
> Task :app:assembleDebug UP-TO-DATE
> Task :capacitor-android:checkDebugAarMetadata UP-TO-DATE
> Task :capacitor-android:stripDebugDebugSymbols NO-SOURCE
> Task :capacitor-android:copyDebugJniLibsProjectAndLocalJars UP-TO-DATE
> Task :capacitor-android:extractDebugAnnotations UP-TO-DATE
> Task :capacitor-android:extractDeepLinksForAarDebug UP-TO-DATE
> Task :capacitor-android:mergeDebugGeneratedProguardFiles UP-TO-DATE
> Task :capacitor-android:mergeDebugConsumerProguardFiles UP-TO-DATE
> Task :capacitor-android:prepareDebugArtProfile UP-TO-DATE
> Task :capacitor-android:prepareLintJarForPublish UP-TO-DATE
> Task :capacitor-android:mergeDebugJavaResource UP-TO-DATE
> Task :capacitor-android:syncDebugLibJars UP-TO-DATE
> Task :capacitor-android:bundleDebugAar UP-TO-DATE
> Task :capacitor-android:assembleDebug UP-TO-DATE
> Task :capacitor-cordova-android-plugins:checkDebugAarMetadata
> Task :capacitor-cordova-android-plugins:stripDebugDebugSymbols NO-SOURCE
> Task :capacitor-cordova-android-plugins:copyDebugJniLibsProjectAndLocalJars
> Task :capacitor-cordova-android-plugins:extractDebugAnnotations
> Task :capacitor-cordova-android-plugins:extractDeepLinksForAarDebug UP-TO-DATE
> Task :capacitor-cordova-android-plugins:mergeDebugGeneratedProguardFiles UP-TO-DATE
> Task :capacitor-cordova-android-plugins:mergeDebugConsumerProguardFiles UP-TO-DATE
> Task :capacitor-cordova-android-plugins:prepareDebugArtProfile UP-TO-DATE
> Task :capacitor-cordova-android-plugins:prepareLintJarForPublish UP-TO-DATE
> Task :capacitor-cordova-android-plugins:mergeDebugJavaResource
> Task :capacitor-cordova-android-plugins:syncDebugLibJars
> Task :capacitor-cordova-android-plugins:bundleDebugAar
> Task :capacitor-cordova-android-plugins:assembleDebug

BUILD SUCCESSFUL in 20s
93 actionable tasks: 24 executed, 69 up-to-date
