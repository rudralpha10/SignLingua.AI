![WhatsApp Image 2025-12-29 at 13 39 01](https://github.com/user-attachments/assets/8c8c84ce-49e7-4adc-8746-c6db4cec1fd9)
**PROTOTYPE**

**The Problem**
Most "accessibility" tools for the Deaf community are one-way streets. They focus on translating Sign Language into Text for hearing people. However, they ignore the reverse loop:

Text is not the native language of the Deaf. Many Deaf individuals prefer Sign Language over reading English text.

Lack of Emotion. Text captures words, but Sign Language relies heavily on facial expressions and body language ("Non-Manual Markers").

The Communication Loop is Broken. A hearing person cannot "sign back" without years of training.

💡 **The Solution**
Sign-Bridge is a bi-directional communication platform **Singnlingua.AI**.

Hearing-to-Deaf (The USP): Translates spoken audio into grammatically correct Sign Language (Gloss) performed by a hyper-realistic 3D Avatar with facial expressions.

Deaf-to-Hearing: Uses computer vision to track hand gestures and converts them into spoken speech.

🚀Key Features
🗣️ Real-Time Speech-to-Sign: Converts spoken English into ISL/ASL Gloss (Sign Language Grammar) using an LLM, not just word-for-word translation.

🤖 3D Neural Avatar: A WebGL-based avatar (Ready Player Me) that performs signs seamlessly.

😊 Sentiment & Emotion Sync: If the speaker sounds happy or concerned, the Avatar's facial expressions change accordingly (Brows up, smiling, frowning).

🏥 Medical/Emergency Mode: A high-accuracy mode for doctors and patients with pre-loaded, critical medical vocabulary.

⚡ Latency Optimized: Built on Groq/Deepgram for near-instant response times.


1. Hearing to Deaf Workflow (The Avatar Engine)
This flow converts spoken English into 3D Sign Language animation.

Audio Input: The hearing user speaks into the microphone.

Speech-to-Text (STT): The audio is captured via the Web Speech API (or Deepgram) and converted into a text string (e.g., "Are you feeling okay?").

NLP Processing (The Brain):

The text is sent to the LLM (Gemini/Llama-3).

The LLM converts the English grammar into Sign Language Gloss (e.g., "YOU FEEL OKAY?") to ensure it follows the correct linguistic structure, not just a word-for-word translation.

It simultaneously performs Sentiment Analysis to determine the emotional tone (e.g., Concern/Question).

Animation Synthesis:

The gloss words are mapped to a library of pre-recorded animation clips (GLTF format).

The Three.js engine blends these clips together for smooth motion.

The detected sentiment triggers facial blend shapes (e.g., raising eyebrows for a question) on the Ready Player Me avatar.

Visual Output: The avatar performs the signs on the screen for the Deaf user.

2. Deaf to Hearing Workflow (The Vision Engine)
This flow converts physical hand signs into spoken audio.

Video Input: The Deaf user signs in front of the webcam.

Hand Tracking: MediaPipe runs locally in the browser, detecting 21 3D landmarks on each hand in real-time.

Gesture Classification:

The landmark data (coordinates and vectors) is passed through a lightweight classifier (TensorFlow.js/LSTM).

The system identifies specific signs (e.g., "HELLO", "HELP").

Sentence Formation:

Recognized keywords are collected in a buffer.

The LLM refines these keywords into a grammatically correct English sentence (e.g., converts "HELP ME" → "I need help").

Audio Output: The final sentence is spoken out loud using the Text-to-Speech (TTS) engine for the hearing user to hear.
