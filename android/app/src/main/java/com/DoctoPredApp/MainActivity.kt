package com.DoctoPredApp

import android.app.PictureInPictureParams
import android.content.res.Configuration
import android.os.Build
import android.util.Rational
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

    // Auto-enter picture-in-picture mode in portrait orientation
    override fun onPictureInPictureRequested(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ratio = Rational(9, 16)
            val pipParams = PictureInPictureParams.Builder()
                .setAspectRatio(ratio)
                .build()
            try {
                enterPictureInPictureMode(pipParams)
                return true
            } catch (e: Exception) {
                // fallback to module
            }
        }
        AndroidPipModule.pipModeReq()
        return true
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                val ratio = Rational(9, 16)
                val pipParams = PictureInPictureParams.Builder()
                    .setAspectRatio(ratio)
                    .build()
                setPictureInPictureParams(pipParams)
            } catch (e: Exception) {
                // ignore
            }
        }
    }
}


