package com.example.sourcemap

import android.app.Activity
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import com.posthog.PostHog

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            gravity = Gravity.CENTER
            orientation = LinearLayout.VERTICAL
        }
        layout.addView(TextView(this).apply { text = "Source Map Example" })
        layout.addView(Button(this).apply {
            text = "Capture test exception"
            setOnClickListener {
                PostHog.captureException(IllegalStateException("Source map test exception"))
                PostHog.flush()
            }
        })
        setContentView(layout)
    }
}
