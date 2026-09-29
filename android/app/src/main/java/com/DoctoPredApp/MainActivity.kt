package com.DoctoPredApp

import android.content.res.Configuration
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import live.videosdk.pipmode.AndroidPipModule

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "DoctoPredApp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    // This is for the changing values of pip listener
    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration
    ) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        AndroidPipModule.pipModeChanged(isInPictureInPictureMode)
    }

    // This is for the auto enable pip mode
    override fun onPictureInPictureRequested(): Boolean {
        AndroidPipModule.pipModeReq()
        return true
    }
}

