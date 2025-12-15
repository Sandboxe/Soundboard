# Sound Effect App - Design Guidelines

## Architecture Decisions

### Authentication
**No authentication required.** This is a single-user utility app with local functionality.

**Profile/Settings Screen Required:**
- User-customizable avatar (generate 3 playful preset avatars matching the fun, sound-focused theme)
- Display name field (default: "Sound Master")
- Preferences:
  - Sound volume control (slider, 0-100%)
  - Haptic feedback toggle
  - Theme selection (Light/Dark)

### Navigation
**Stack-Only Navigation** - Simple app with 2-3 screens:
1. **Main Sound Board** (Home)
2. **Settings Screen** (accessible via gear icon in header)

No tab bar needed. The app focuses on one primary function: triggering sound effects.

## Screen Specifications

### 1. Main Sound Board Screen
**Purpose:** Play sound effects by tapping interactive buttons

**Layout:**
- **Header:** Custom transparent header
  - Right button: Settings icon (gear)
  - Title: "Sound Board" (centered, bold)
  - Safe area: top inset = headerHeight + Spacing.xl
- **Main Content:**
  - Root view: ScrollView (vertical)
  - Grid layout: 2 columns on phones, 3 columns on tablets
  - 6-9 sound effect buttons displayed as cards
  - Safe area: bottom inset = insets.bottom + Spacing.xl

**Sound Effect Buttons:**
- Large, colorful cards (minimum 44x44pt touch target, recommended 120x120pt)
- Each button shows:
  - Icon representing the sound (use Feather icons from @expo/vector-icons)
  - Label below icon (e.g., "Applause", "Airhorn", "Drum")
- Visual states:
  - Default: Solid background color, subtle rounded corners (12pt radius)
  - Pressed: Scale down slightly (0.95), increase opacity
  - Playing: Pulsing animation or border highlight
- Each button has a unique accent color from the palette

**Components Needed:**
- Pressable sound cards with icon + label
- Grid container with equal spacing
- Audio player (hidden, triggered by button press)

### 2. Settings Screen
**Purpose:** Customize app preferences

**Layout:**
- **Header:** Default navigation header (non-transparent)
  - Left button: Back arrow
  - Title: "Settings"
  - Safe area: top inset = Spacing.xl
- **Main Content:**
  - Root view: ScrollView
  - Form layout with sections
  - Safe area: bottom inset = insets.bottom + Spacing.xl

**Form Sections:**
1. **Profile**
   - Avatar picker (3 preset options in horizontal scroll)
   - Display name input field
2. **Audio**
   - Volume slider with percentage label
   - Haptic feedback toggle
3. **Appearance**
   - Theme selector (segmented control: Light/Dark)

## Design System

### Color Palette
**Primary Colors (Playful & Energetic):**
- Primary: #6366F1 (Vibrant indigo)
- Secondary: #EC4899 (Hot pink)
- Accent 1: #F59E0B (Amber)
- Accent 2: #10B981 (Emerald)
- Accent 3: #8B5CF6 (Purple)
- Accent 4: #EF4444 (Red)

**Neutral Colors:**
- Background (Light): #F9FAFB
- Background (Dark): #111827
- Surface (Light): #FFFFFF
- Surface (Dark): #1F2937
- Text Primary (Light): #111827
- Text Primary (Dark): #F9FAFB
- Text Secondary (Light): #6B7280
- Text Secondary (Dark): #9CA3AF

### Typography
- **Header Title:** 24pt, Bold, System Font
- **Button Labels:** 16pt, Semi-Bold, System Font
- **Settings Labels:** 16pt, Regular, System Font
- **Body Text:** 14pt, Regular, System Font

### Spacing Scale
- xs: 4pt
- sm: 8pt
- md: 16pt
- lg: 24pt
- xl: 32pt

### Component Specifications

**Sound Effect Button:**
- Minimum size: 120x120pt (maintains 44pt minimum touch target)
- Border radius: 12pt
- Padding: 16pt
- Icon size: 48pt
- Label margin-top: 8pt
- Press animation: Scale to 0.95, duration 100ms
- Playing state: Add 2pt border in white/black with 0.5 opacity

**Form Inputs:**
- Height: 48pt
- Border radius: 8pt
- Border width: 1pt
- Border color: Text Secondary with 0.3 opacity
- Padding horizontal: 16pt

**Slider:**
- Track height: 4pt
- Thumb size: 24pt
- Active thumb size: 28pt (when dragging)

### Interaction Design
1. **Button Press Feedback:**
   - Immediate scale animation (95%) on press
   - Haptic feedback (if enabled)
   - Sound plays instantly
2. **Sound Playback:**
   - Multiple sounds can overlap
   - Visual indicator while sound is playing (pulsing border)
   - Stop playback if user navigates away
3. **Settings Changes:**
   - Volume changes apply immediately
   - Theme changes with smooth fade transition (200ms)

### Accessibility
- All buttons have accessible labels
- Minimum touch target: 44x44pt
- Support for Dynamic Type (scale fonts appropriately)
- VoiceOver announcements for sound playback ("Playing [sound name]")
- High contrast mode support

### Required Assets
Generate 5-6 sound effect audio files (.mp3 or .wav):
1. **Applause** - Clapping sound
2. **Airhorn** - Loud horn blast
3. **Drum Hit** - Single drum beat
4. **Bell Ring** - Clear bell chime
5. **Laugh Track** - Audience laughter
6. **Tada** - Celebratory fanfare

Generate 3 preset avatars (matching playful theme):
- Avatar style: Simple, geometric, colorful icons
- Examples: Musical note, speaker icon, waveform pattern