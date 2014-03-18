phonegap build -V android &&
adb uninstall com.ionicframework.starter &&
adb install platforms/android/bin/StarterApp-debug-unaligned.apk &&
adb shell am start -n com.ionicframework.starter.StarterApp/.starter
