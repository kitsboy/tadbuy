package com.zapcampaign.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF00D4FF),      // Lightning blue
    secondary = Color(0xFFFFC107),    // Bitcoin orange
    background = Color(0xFF121212),
    surface = Color(0xFF1E1E1E),
)

@Composable
fun ZapCampaignTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}

// Minimal typography
val Typography = androidx.compose.material3.Typography()
