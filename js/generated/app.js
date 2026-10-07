"use strict";
(() => {
  // src/i18n/messages.ts
  var DEFAULT_LANGUAGE = "zh-CN";
  function normalizeLanguage(value) {
    return value === "en" || value === "zh-CN" ? value : DEFAULT_LANGUAGE;
  }
  var chineseMessages = Object.freeze({
    "Language": "\u8BED\u8A00",
    "Changes take effect immediately and are saved in this browser.": "\u5207\u6362\u7ACB\u5373\u751F\u6548\uFF0C\u5E76\u4FDD\u5B58\u5728\u5F53\u524D\u6D4F\u89C8\u5668\u4E2D\u3002",
    "\u{1F3BC} Scores": "\u{1F3BC} \u66F2\u8C31",
    "\u25B6 Play": "\u25B6 \u64AD\u653E",
    "\u23F8 Pause": "\u23F8 \u6682\u505C",
    "\u23EE Reset": "\u23EE \u91CD\u7F6E",
    "\u{1F3B9} Practice \u25BE": "\u{1F3B9} \u7EC3\u4E60 \u25BE",
    "\u266A Tempo \u25BE": "\u266A \u901F\u5EA6 \u25BE",
    "\u{1F501} Loop \u25BE": "\u{1F501} \u5FAA\u73AF \u25BE",
    "\u22EF More \u25BE": "\u22EF \u66F4\u591A \u25BE",
    "Score:": "\u5F97\u5206\uFF1A",
    "\u2699 Settings": "\u2699 \u8BBE\u7F6E",
    "Open File": "\u6253\u5F00\u6587\u4EF6",
    "Save to Library": "\u4FDD\u5B58\u5230\u66F2\u5E93",
    "Backup Library": "\u5907\u4EFD\u66F2\u5E93",
    "Import Library (Merge)": "\u5BFC\u5165\u66F2\u5E93\uFF08\u5408\u5E76\uFF09",
    "Library": "\u66F2\u5E93",
    "Library tools will appear here in the next step.": "\u6B63\u5728\u51C6\u5907\u66F2\u5E93\u5DE5\u5177\u3002",
    "Welcome / Quick Start": "\u6B22\u8FCE / \u5FEB\u901F\u5165\u95E8",
    "Close help": "\u5173\u95ED\u5E2E\u52A9",
    "Close": "\u5173\u95ED",
    "Advanced setup (LEDs, iPad, hardware):": "\u9AD8\u7EA7\u914D\u7F6E\uFF08LED\u3001iPad\u3001\u786C\u4EF6\uFF09\uFF1A",
    "Full Setup Guide / README": "\u5B8C\u6574\u914D\u7F6E\u6307\u5357 / README\uFF08\u82F1\u6587\uFF09",
    "\u{1F4D8} Full Setup Guide": "\u{1F4D8} \u5B8C\u6574\u914D\u7F6E\u6307\u5357\uFF08\u82F1\u6587\uFF09",
    "Practice Modes": "\u7EC3\u4E60\u6A21\u5F0F",
    "Play continuously at the set tempo.": "\u6309\u8BBE\u5B9A\u901F\u5EA6\u8FDE\u7EED\u6F14\u594F\u3002",
    "Waits for correct notes before continuing.": "\u7B49\u5F85\u5F39\u5BF9\u97F3\u7B26\u540E\u518D\u7EE7\u7EED\u3002",
    "Play one hand while the app follows with the other.": "\u4F60\u5F39\u594F\u4E00\u53EA\u624B\uFF0C\u5E94\u7528\u8DDF\u968F\u6F14\u594F\u53E6\u4E00\u53EA\u624B\u3002",
    "\u2014 Play continuously at the set tempo.": "\u2014 \u6309\u8BBE\u5B9A\u901F\u5EA6\u8FDE\u7EED\u6F14\u594F\u3002",
    "\u2014 Waits for correct notes before continuing.": "\u2014 \u7B49\u5F85\u5F39\u5BF9\u97F3\u7B26\u540E\u518D\u7EE7\u7EED\u3002",
    "\u2014 Play one hand while the app follows with the other.": "\u2014 \u4F60\u5F39\u594F\u4E00\u53EA\u624B\uFF0C\u5E94\u7528\u8DDF\u968F\u6F14\u594F\u53E6\u4E00\u53EA\u624B\u3002",
    "Tip:": "\u63D0\u793A\uFF1A",
    "Start with": "\u5148\u4F7F\u7528",
    "to learn notes, then try": "\u719F\u6089\u97F3\u7B26\uFF0C\u7136\u540E\u5C1D\u8BD5",
    "to practice with timing.": "\u7EC3\u4E60\u8282\u594F\u3002",
    "Quick Start": "\u5FEB\u901F\u5165\u95E8",
    "Open a score from the Scores menu, or add your own files to the library.": "\u4ECE\u201C\u66F2\u8C31\u201D\u83DC\u5355\u6253\u5F00\u66F2\u8C31\uFF0C\u6216\u5C06\u81EA\u5DF1\u7684\u6587\u4EF6\u6DFB\u52A0\u5230\u66F2\u5E93\u3002",
    "Best results:": "\u63A8\u8350\u683C\u5F0F\uFF1A",
    "Also supported:": "\u5176\u4ED6\u652F\u6301\u683C\u5F0F\uFF1A",
    "MIDI, MuseScore (3.x), and Guitar Pro (5.x) files. These are experimental, and MIDI does not include all notation details.": "MIDI\u3001MuseScore (3.x) \u548C Guitar Pro (5.x) \u6587\u4EF6\u3002\u8FD9\u4E9B\u683C\u5F0F\u4ECD\u4E3A\u5B9E\u9A8C\u652F\u6301\uFF0CMIDI \u4E0D\u5305\u542B\u6240\u6709\u8BB0\u8C31\u7EC6\u8282\u3002",
    "Connect your MIDI keyboard in Settings.": "\u5728\u201C\u8BBE\u7F6E\u201D\u4E2D\u8FDE\u63A5 MIDI \u952E\u76D8\u3002",
    "On iPad / iPhone, use": "\u5728 iPad / iPhone \u4E0A\uFF0C\u53EF\u4F7F\u7528",
    "for MIDI input support.": "\u83B7\u5F97 MIDI \u8F93\u5165\u652F\u6301\u3002",
    "LED output is optional. See the setup guide for hardware and setup details.": "LED \u8F93\u51FA\u4E3A\u53EF\u9009\u529F\u80FD\uFF0C\u786C\u4EF6\u548C\u914D\u7F6E\u8BE6\u60C5\u8BF7\u53C2\u9605\u914D\u7F6E\u6307\u5357\u3002",
    "Starter songs are added on first run and can be deleted.": "\u9996\u6B21\u542F\u52A8\u4F1A\u6DFB\u52A0\u5165\u95E8\u66F2\u76EE\uFF0C\u4E5F\u53EF\u4EE5\u5220\u9664\u5B83\u4EEC\u3002",
    "Browse free starter songs at": "\u514D\u8D39\u5165\u95E8\u66F2\u76EE\u53EF\u5728\u6B64\u6D4F\u89C8\uFF1A",
    "Library & Backups": "\u66F2\u5E93\u4E0E\u5907\u4EFD",
    "Your score library is stored in your browser. Back it up if it matters to you.": "\u66F2\u5E93\u5B58\u50A8\u5728\u5F53\u524D\u6D4F\u89C8\u5668\u4E2D\uFF0C\u8BF7\u5907\u4EFD\u9700\u8981\u4FDD\u7559\u7684\u66F2\u8C31\u3002",
    "Use": "\u4F7F\u7528",
    "Scores \u2192 Backup Library": "\u66F2\u8C31 \u2192 \u5907\u4EFD\u66F2\u5E93",
    "to back up your song library.": "\u5907\u4EFD\u66F2\u5E93\u3002",
    "Settings \u2192 Backup All Settings": "\u8BBE\u7F6E \u2192 \u5907\u4EFD\u5168\u90E8\u8BBE\u7F6E",
    "to save trainer preferences, connections, and LED calibration.": "\u4FDD\u5B58\u7EC3\u4E60\u504F\u597D\u3001\u8FDE\u63A5\u914D\u7F6E\u548C LED \u6821\u51C6\u6570\u636E\u3002",
    "Important Note": "\u6CE8\u610F\u4E8B\u9879",
    "Some browsers, especially on mobile or low-storage devices, may clear local site data over time. Back up your library and LED calibration if the data matters to you.": "\u90E8\u5206\u6D4F\u89C8\u5668\uFF08\u5C24\u5176\u5728\u79FB\u52A8\u8BBE\u5907\u6216\u5B58\u50A8\u7A7A\u95F4\u4E0D\u8DB3\u65F6\uFF09\u53EF\u80FD\u6E05\u9664\u7F51\u7AD9\u672C\u5730\u6570\u636E\u3002\u8BF7\u53CA\u65F6\u5907\u4EFD\u66F2\u5E93\u548C LED \u6821\u51C6\u6570\u636E\u3002",
    "About & Updates": "\u5173\u4E8E\u4E0E\u66F4\u65B0",
    "Check for Updates": "\u68C0\u67E5\u66F4\u65B0",
    "Version: --": "\u7248\u672C\uFF1A--",
    "Update status: not checked yet.": "\u66F4\u65B0\u72B6\u6001\uFF1A\u5C1A\u672A\u68C0\u67E5\u3002",
    "MIDI Setup": "MIDI \u8BBE\u7F6E",
    "MIDI In:": "MIDI \u8F93\u5165\uFF1A",
    "MIDI Out:": "MIDI \u8F93\u51FA\uFF1A",
    "None": "\u65E0",
    "Any": "\u4EFB\u610F",
    "Channel:": "\u901A\u9053\uFF1A",
    "Keys:": "\u952E\u6570\uFF1A",
    "LED Setup": "LED \u8BBE\u7F6E",
    "LED Lights:": "LED \u706F\uFF1A",
    "MIDI Device": "MIDI \u8BBE\u5907",
    "MIDI LED Output": "MIDI LED \u8F93\u51FA",
    "LED MIDI Device:": "LED MIDI \u8BBE\u5907\uFF1A",
    "Low Velocity Mode": "\u4F4E\u529B\u5EA6\u6A21\u5F0F",
    "Test LED Strip": "\u6D4B\u8BD5\u706F\u5E26",
    "MIDI LED idle.": "MIDI LED \u7A7A\u95F2\u3002",
    "WLED Connection": "WLED \u8FDE\u63A5",
    "WLED IP Address:": "WLED IP \u5730\u5740\uFF1A",
    "Transport:": "\u4F20\u8F93\u65B9\u5F0F\uFF1A",
    "HTTP JSON (recommended)": "HTTP JSON\uFF08\u63A8\u8350\uFF09",
    "DDP (lower latency, experimental)": "DDP\uFF08\u4F4E\u5EF6\u8FDF\uFF0C\u5B9E\u9A8C\u529F\u80FD\uFF09",
    "DDP may require a local sender in browser mode.": "\u6D4F\u89C8\u5668\u6A21\u5F0F\u4E0B\uFF0CDDP \u53EF\u80FD\u9700\u8981\u672C\u5730\u53D1\u9001\u7A0B\u5E8F\u3002",
    "Active: HTTP JSON": "\u5F53\u524D\uFF1AHTTP JSON",
    "Active: DDP": "\u5F53\u524D\uFF1ADDP",
    "Active: DDP (awaiting frame confirm)": "\u5F53\u524D\uFF1ADDP\uFF08\u7B49\u5F85\u5E27\u786E\u8BA4\uFF09",
    "Active: HTTP JSON (DDP fallback active)": "\u5F53\u524D\uFF1AHTTP JSON\uFF08DDP \u56DE\u9000\u5DF2\u542F\u7528\uFF09",
    "Helper: Not detected.": "\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u672A\u68C0\u6D4B\u5230\u3002",
    "Helper: Not detected. Using HTTP JSON fallback.": "\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u672A\u68C0\u6D4B\u5230\uFF0C\u4F7F\u7528 HTTP JSON \u56DE\u9000\u3002",
    "Helper: Connected on localhost.": "\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u5DF2\u5728 localhost \u8FDE\u63A5\u3002",
    "Helper: Connected on localhost. Last DDP frame sent.": "\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u5DF2\u5728 localhost \u8FDE\u63A5\uFF0C\u4E0A\u4E00 DDP \u5E27\u5DF2\u53D1\u9001\u3002",
    "Helper: Connected on localhost. Waiting for a confirmed DDP frame.": "\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u5DF2\u5728 localhost \u8FDE\u63A5\uFF0C\u7B49\u5F85 DDP \u5E27\u786E\u8BA4\u3002",
    "Helper: Not needed for HTTP JSON.": "\u8F85\u52A9\u7A0B\u5E8F\uFF1AHTTP JSON \u65E0\u9700\u8F85\u52A9\u7A0B\u5E8F\u3002",
    "Re-send LEDs": "\u91CD\u65B0\u53D1\u9001 LED \u72B6\u6001",
    "WLED idle.": "WLED \u7A7A\u95F2\u3002",
    "LED Count": "LED \u6570\u91CF",
    "Reverse LEDs": "\u53CD\u8F6C LED \u987A\u5E8F",
    "Brightness": "\u4EAE\u5EA6",
    "Master": "\u603B\u4EAE\u5EA6",
    "Future note brightness": "\u540E\u7EED\u97F3\u7B26\u4EAE\u5EA6",
    "Future": "\u540E\u7EED\u97F3\u7B26",
    "Calibration": "\u6821\u51C6",
    "Start LED Calibration": "\u5F00\u59CB LED \u6821\u51C6",
    "Done LED Calibration": "\u5B8C\u6210 LED \u6821\u51C6",
    "Opens a small live calibration bar so you can still see the keyboard and LEDs.": "\u6253\u5F00\u5B9E\u65F6\u6821\u51C6\u680F\uFF0C\u540C\u65F6\u4FDD\u6301\u952E\u76D8\u548C LED \u53EF\u89C1\u3002",
    "Debug": "\u8C03\u8BD5",
    "Debug Note Feedback": "\u97F3\u7B26\u53CD\u9988\u8C03\u8BD5",
    "DDP Debug Logging": "DDP \u8C03\u8BD5\u65E5\u5FD7",
    "Backup All Settings": "\u5907\u4EFD\u5168\u90E8\u8BBE\u7F6E",
    "Import Settings": "\u5BFC\u5165\u8BBE\u7F6E",
    "Reset All Settings": "\u91CD\u7F6E\u5168\u90E8\u8BBE\u7F6E",
    "Backup includes saved Settings, Trainer preferences, Connections, WLED settings, and LED calibration. Score Library export stays separate.": "\u5907\u4EFD\u5305\u542B\u8BED\u8A00\u3001\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\u3001\u7EC3\u4E60\u504F\u597D\u3001\u8FDE\u63A5\u914D\u7F6E\u3001WLED \u8BBE\u7F6E\u548C LED \u6821\u51C6\u6570\u636E\u3002\u66F2\u5E93\u9700\u8981\u5355\u72EC\u5BFC\u51FA\u3002",
    "\u22EF More": "\u22EF \u66F4\u591A",
    "\u266A Tempo": "\u266A \u901F\u5EA6",
    "\u{1F501} Loop": "\u{1F501} \u5FAA\u73AF",
    "\u{1F39A} Audio / Routing": "\u{1F39A} \u97F3\u9891 / \u8DEF\u7531",
    "\u{1F5A5} Display": "\u{1F5A5} \u663E\u793A",
    "\u2195 Transpose": "\u2195 \u79FB\u8C03",
    "\u2139 Help & Guide": "\u2139 \u5E2E\u52A9\u4E0E\u6307\u5357",
    "App Audio": "\u5E94\u7528\u97F3\u9891",
    "Send enabled playback and live input through browser audio.": "\u901A\u8FC7\u6D4F\u89C8\u5668\u97F3\u9891\u8F93\u51FA\u5DF2\u542F\u7528\u7684\u64AD\u653E\u548C\u5B9E\u65F6\u8F93\u5165\u3002",
    "Volume": "\u97F3\u91CF",
    "Level": "\u7535\u5E73",
    "Score Playback": "\u66F2\u8C31\u64AD\u653E",
    "Uses Practice hand selections.": "\u4F7F\u7528\u201C\u7EC3\u4E60\u201D\u4E2D\u7684\u624B\u90E8\u9009\u62E9\u3002",
    "Hand Staves": "\u5DE6\u53F3\u624B\u8C31\u8868",
    "Other Staves": "\u5176\u4ED6\u8C31\u8868",
    "Live Input Monitoring": "\u5B9E\u65F6\u8F93\u5165\u76D1\u542C",
    "MIDI In": "MIDI \u8F93\u5165",
    "MIDI Out": "MIDI \u8F93\u51FA",
    "Virtual Keyboard": "\u865A\u62DF\u952E\u76D8",
    "MIDI In Boost": "MIDI \u8F93\u5165\u589E\u76CA",
    "No MIDI device selected.": "\u5C1A\u672A\u9009\u62E9 MIDI \u8BBE\u5907\u3002",
    "Select a device in Settings.": "\u8BF7\u5728\u201C\u8BBE\u7F6E\u201D\u4E2D\u9009\u62E9\u8BBE\u5907\u3002",
    "Score Layout": "\u8C31\u9762\u5E03\u5C40",
    "Traditional (multi-line)": "\u4F20\u7EDF\u4E94\u7EBF\u8C31\uFF08\u591A\u884C\uFF09",
    "Continuous (horizontal)": "\u8FDE\u7EED\u6A2A\u5411\u8C31\u9762",
    "Zoom": "\u7F29\u653E",
    "Auto Scroll": "\u81EA\u52A8\u6EDA\u52A8",
    "Full Screen on Play": "\u64AD\u653E\u65F6\u5168\u5C4F",
    "Transpose": "\u79FB\u8C03",
    "Current Key": "\u5F53\u524D\u8C03\u6027",
    "No score loaded": "\u5C1A\u672A\u52A0\u8F7D\u66F2\u8C31",
    "Mode": "\u6A21\u5F0F",
    "Transpose to Key": "\u6309\u8C03\u6027\u79FB\u8C03",
    "Transpose by Semitones": "\u6309\u534A\u97F3\u6570\u79FB\u8C03",
    "Target Key": "\u76EE\u6807\u8C03\u6027",
    "Semitones": "\u534A\u97F3\u6570",
    "Update key signature": "\u66F4\u65B0\u8C03\u53F7",
    "Reset": "\u91CD\u7F6E",
    "Apply": "\u5E94\u7528",
    "Load a MusicXML-based score to enable transpose.": "\u52A0\u8F7D MusicXML \u683C\u5F0F\u7684\u66F2\u8C31\u4EE5\u542F\u7528\u79FB\u8C03\u3002",
    "Tempo": "\u901F\u5EA6",
    "Speed (%)": "\u901F\u5EA6 (%)",
    "Metronome": "\u8282\u62CD\u5668",
    "MIDI Out click (Ch 10)": "MIDI \u8F93\u51FA\u8282\u62CD\u58F0\uFF08\u901A\u9053 10\uFF09",
    "Uses GM percussion on the selected MIDI Out device.": "\u4F7F\u7528\u6240\u9009 MIDI \u8F93\u51FA\u8BBE\u5907\u7684 GM \u6253\u51FB\u4E50\u97F3\u8272\u3002",
    "Accented Downbeat": "\u91CD\u97F3\u5F3A\u62CD",
    "Visual Pulse": "\u89C6\u89C9\u8282\u62CD\u63D0\u793A",
    "\u{1F3B9} Practice": "\u{1F3B9} \u7EC3\u4E60",
    "Practice mode": "\u7EC3\u4E60\u6A21\u5F0F",
    "Practice hands": "\u7EC3\u4E60\u624B\u90E8",
    "Left \u270B": "\u5DE6\u624B \u270B",
    "Right \u{1F91A}": "\u53F3\u624B \u{1F91A}",
    "Hands playback": "\u624B\u90E8\u64AD\u653E",
    "Audio playback is unavailable in Wait mode.": "Wait \u6A21\u5F0F\u4E0B\u4E0D\u64AD\u653E\u66F2\u8C31\u97F3\u9891\u3002",
    "Playback is automatically set to the opposite hand in Follow Me.": "Follow Me \u6A21\u5F0F\u4E0B\u81EA\u52A8\u64AD\u653E\u53E6\u4E00\u53EA\u624B\u7684\u58F0\u90E8\u3002",
    "Playback Timing": "\u64AD\u653E\u8BBE\u7F6E",
    "Use simple synth playback (experimental)": "\u4F7F\u7528\u7B80\u5355\u5408\u6210\u5668\u64AD\u653E\uFF08\u5B9E\u9A8C\u529F\u80FD\uFF09",
    "Uses a lighter synth sound instead of the sampled piano. May feel snappier, but sounds less realistic.": "\u7528\u8F83\u8F7B\u91CF\u7684\u5408\u6210\u97F3\u8272\u4EE3\u66FF\u94A2\u7434\u91C7\u6837\uFF0C\u54CD\u5E94\u53EF\u80FD\u66F4\u5FEB\uFF0C\u4F46\u97F3\u8272\u771F\u5B9E\u611F\u8F83\u4F4E\u3002",
    "Visual Feedback": "\u89C6\u89C9\u53CD\u9988",
    "Highlight correct / incorrect notes (on staff)": "\u9AD8\u4EAE\u6B63\u786E / \u9519\u8BEF\u97F3\u7B26\uFF08\u8C31\u8868\uFF09",
    "Highlight correct-note feedback (keyboard)": "\u9AD8\u4EAE\u6B63\u786E\u97F3\u7B26\u53CD\u9988\uFF08\u952E\u76D8\uFF09",
    "Highlight future notes (keyboard)": "\u9AD8\u4EAE\u540E\u7EED\u97F3\u7B26\uFF08\u952E\u76D8\uFF09",
    "Hand \u2192 Staff": "\u624B\u90E8 \u2192 \u8C31\u8868",
    "Staff 1": "\u8C31\u8868 1",
    "Staff 2": "\u8C31\u8868 2",
    "Looper": "\u5FAA\u73AF\u64AD\u653E",
    "Enable Loop": "\u542F\u7528 Loop \u5FAA\u73AF",
    "Loop Count-in": "Loop \u5FAA\u73AF\u9884\u5907\u62CD",
    "Beginning Measure": "\u5F00\u59CB\u5C0F\u8282",
    "Ending Measure": "\u7ED3\u675F\u5C0F\u8282",
    "Beginning Measure controls": "\u5F00\u59CB\u5C0F\u8282\u63A7\u5236",
    "Ending Measure controls": "\u7ED3\u675F\u5C0F\u8282\u63A7\u5236",
    "Decrease beginning measure": "\u51CF\u5C11\u5F00\u59CB\u5C0F\u8282",
    "Increase beginning measure": "\u589E\u52A0\u5F00\u59CB\u5C0F\u8282",
    "Decrease ending measure": "\u51CF\u5C11\u7ED3\u675F\u5C0F\u8282",
    "Increase ending measure": "\u589E\u52A0\u7ED3\u675F\u5C0F\u8282",
    "Score view controls": "\u8C31\u9762\u663E\u793A\u63A7\u5236",
    "Enter full screen": "\u8FDB\u5165\u5168\u5C4F",
    "Exit full screen": "\u9000\u51FA\u5168\u5C4F",
    "LED Calibration": "LED \u6821\u51C6",
    "Close LED calibration": "\u5173\u95ED LED \u6821\u51C6",
    "No key selected": "\u5C1A\u672A\u9009\u62E9\u7434\u952E",
    "Press any piano key or click a virtual key to select it.": "\u6309\u4E0B\u4EFB\u610F\u7434\u952E\u6216\u70B9\u51FB\u865A\u62DF\u7434\u952E\u8FDB\u884C\u9009\u62E9\u3002",
    "\u2190 Move Left": "\u2190 \u5411\u5DE6\u79FB\u52A8",
    "Move Right \u2192": "\u5411\u53F3\u79FB\u52A8 \u2192",
    "Reset Selected Key": "\u91CD\u7F6E\u6240\u9009\u7434\u952E",
    "Reset All Calibration": "\u91CD\u7F6E\u5168\u90E8\u6821\u51C6",
    "Export Calibration": "\u5BFC\u51FA\u6821\u51C6",
    "Import Calibration": "\u5BFC\u5165\u6821\u51C6",
    "Use Move Left / Move Right to line up the selected key.": "\u4F7F\u7528\u201C\u5411\u5DE6\u79FB\u52A8 / \u5411\u53F3\u79FB\u52A8\u201D\u5BF9\u9F50\u6240\u9009\u7434\u952E\u3002",
    "Connected": "\u5DF2\u8FDE\u63A5",
    "Disconnected": "\u5DF2\u65AD\u5F00",
    "Folders": "\u6587\u4EF6\u5939",
    "New Folder": "\u65B0\u5EFA\u6587\u4EF6\u5939",
    "Manage": "\u7BA1\u7406",
    "Deselect All": "\u53D6\u6D88\u5168\u9009",
    "Select All": "\u5168\u9009",
    "Delete": "\u5220\u9664",
    "Cancel": "\u53D6\u6D88",
    "Rename": "\u91CD\u547D\u540D",
    "Move": "\u79FB\u52A8",
    "Loaded": "\u5DF2\u52A0\u8F7D",
    "All Scores": "\u5168\u90E8\u66F2\u8C31",
    "Unfiled": "\u672A\u5206\u7C7B",
    "Add File(s)": "\u6DFB\u52A0\u6587\u4EF6",
    "\u2190 Back": "\u2190 \u8FD4\u56DE",
    "Select folders to delete": "\u9009\u62E9\u8981\u5220\u9664\u7684\u6587\u4EF6\u5939",
    "Select scores to move or delete": "\u9009\u62E9\u8981\u79FB\u52A8\u6216\u5220\u9664\u7684\u66F2\u8C31",
    "No saved scores yet. Add files to the library or save the current score.": "\u6682\u65E0\u5DF2\u4FDD\u5B58\u7684\u66F2\u8C31\u3002\u8BF7\u6DFB\u52A0\u6587\u4EF6\u6216\u4FDD\u5B58\u5F53\u524D\u66F2\u8C31\u3002",
    "Could not load the library.": "\u65E0\u6CD5\u52A0\u8F7D\u66F2\u5E93\u3002",
    "Open a score first, then save it into the library.": "\u8BF7\u5148\u6253\u5F00\u66F2\u8C31\uFF0C\u518D\u4FDD\u5B58\u5230\u66F2\u5E93\u3002",
    "Save the currently loaded score into your library.": "\u5C06\u5F53\u524D\u5DF2\u52A0\u8F7D\u7684\u66F2\u8C31\u4FDD\u5B58\u5230\u66F2\u5E93\u3002",
    "Choose a folder:": "\u9009\u62E9\u6587\u4EF6\u5939\uFF1A",
    "Add files to which folder?": "\u5C06\u6587\u4EF6\u6DFB\u52A0\u5230\u54EA\u4E2A\u6587\u4EF6\u5939\uFF1F",
    "Save into which folder?": "\u4FDD\u5B58\u5230\u54EA\u4E2A\u6587\u4EF6\u5939\uFF1F",
    "Rename folder:": "\u91CD\u547D\u540D\u6587\u4EF6\u5939\uFF1A",
    "Rename score:": "\u91CD\u547D\u540D\u66F2\u8C31\uFF1A",
    "New folder name:": "\u65B0\u6587\u4EF6\u5939\u540D\u79F0\uFF1A",
    "Save to library as:": "\u66F2\u5E93\u4E2D\u7684\u66F2\u8C31\u540D\u79F0\uFF1A",
    "Load a score first, then save it to the library.": "\u8BF7\u5148\u52A0\u8F7D\u66F2\u8C31\uFF0C\u518D\u4FDD\u5B58\u5230\u66F2\u5E93\u3002",
    "Could not create that folder.": "\u65E0\u6CD5\u521B\u5EFA\u8BE5\u6587\u4EF6\u5939\u3002",
    "Could not rename that folder.": "\u65E0\u6CD5\u91CD\u547D\u540D\u8BE5\u6587\u4EF6\u5939\u3002",
    "Could not rename that score.": "\u65E0\u6CD5\u91CD\u547D\u540D\u8BE5\u66F2\u8C31\u3002",
    "Could not delete that folder.": "\u65E0\u6CD5\u5220\u9664\u8BE5\u6587\u4EF6\u5939\u3002",
    "Could not delete that score.": "\u65E0\u6CD5\u5220\u9664\u8BE5\u66F2\u8C31\u3002",
    "Could not delete the selected folders.": "\u65E0\u6CD5\u5220\u9664\u6240\u9009\u6587\u4EF6\u5939\u3002",
    "Could not delete the selected scores.": "\u65E0\u6CD5\u5220\u9664\u6240\u9009\u66F2\u8C31\u3002",
    "Could not move that score.": "\u65E0\u6CD5\u79FB\u52A8\u8BE5\u66F2\u8C31\u3002",
    "Could not move the selected scores.": "\u65E0\u6CD5\u79FB\u52A8\u6240\u9009\u66F2\u8C31\u3002",
    "Could not import one or more score files.": "\u90E8\u5206\u66F2\u8C31\u6587\u4EF6\u65E0\u6CD5\u5BFC\u5165\u3002",
    "Could not save the current score to the library.": "\u65E0\u6CD5\u5C06\u5F53\u524D\u66F2\u8C31\u4FDD\u5B58\u5230\u66F2\u5E93\u3002",
    "Could not export the library backup.": "\u65E0\u6CD5\u5BFC\u51FA\u66F2\u5E93\u5907\u4EFD\u3002",
    "Invalid library backup file.": "\u66F2\u5E93\u5907\u4EFD\u6587\u4EF6\u65E0\u6548\u3002",
    "Could not export settings backup.": "\u65E0\u6CD5\u5BFC\u51FA\u8BBE\u7F6E\u5907\u4EFD\u3002",
    "Settings imported. The app will now reload to apply them.": "\u8BBE\u7F6E\u5DF2\u5BFC\u5165\uFF0C\u5E94\u7528\u5C06\u91CD\u65B0\u52A0\u8F7D\u4EE5\u5E94\u7528\u8BBE\u7F6E\u3002",
    "Invalid settings backup file.": "\u8BBE\u7F6E\u5907\u4EFD\u6587\u4EF6\u65E0\u6548\u3002",
    "Reset ALL saved Settings and Trainer preferences? This will erase all saved settings and restore defaults.": "\u91CD\u7F6E\u5168\u90E8\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\u548C\u7EC3\u4E60\u504F\u597D\uFF1F\u8FD9\u5C06\u6E05\u9664\u6240\u6709\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\uFF08\u5305\u62EC\u8BED\u8A00\uFF09\u5E76\u6062\u590D\u9ED8\u8BA4\u503C\u3002",
    "Could not export LED calibration.": "\u65E0\u6CD5\u5BFC\u51FA LED \u6821\u51C6\u6570\u636E\u3002",
    "Invalid LED calibration file.": "LED \u6821\u51C6\u6587\u4EF6\u65E0\u6548\u3002",
    "Reset all LED calibration adjustments?": "\u91CD\u7F6E\u5168\u90E8 LED \u6821\u51C6\u8C03\u6574\uFF1F",
    "Stop Test": "\u505C\u6B62\u6D4B\u8BD5",
    "Select an LED MIDI device first.": "\u8BF7\u5148\u9009\u62E9 LED MIDI \u8BBE\u5907\u3002",
    "MIDI LED test stopped.": "MIDI LED \u6D4B\u8BD5\u5DF2\u505C\u6B62\u3002",
    "No playable keys available for MIDI LED test.": "\u6CA1\u6709\u53EF\u7528\u4E8E MIDI LED \u6D4B\u8BD5\u7684\u7434\u952E\u3002",
    "Running MIDI LED strip test\u2026": "\u6B63\u5728\u6D4B\u8BD5 MIDI LED \u706F\u5E26\u2026",
    "MIDI LED test complete.": "MIDI LED \u6D4B\u8BD5\u5B8C\u6210\u3002",
    "MIDI LED test failed.": "MIDI LED \u6D4B\u8BD5\u5931\u8D25\u3002",
    "Run a chromatic sweep across the player key range.": "\u5728\u53EF\u5F39\u594F\u97F3\u57DF\u5185\u9010\u534A\u97F3\u6D4B\u8BD5\u3002",
    "MIDI access appears blocked or unavailable. Allow MIDI/device access in your browser, then refresh. MIDI only works on the device running this browser.": "MIDI \u8BBF\u95EE\u4F3C\u4E4E\u88AB\u963B\u6B62\u6216\u4E0D\u53EF\u7528\u3002\u8BF7\u5728\u6D4F\u89C8\u5668\u4E2D\u5141\u8BB8 MIDI / \u8BBE\u5907\u8BBF\u95EE\uFF0C\u7136\u540E\u5237\u65B0\u3002MIDI \u53EA\u80FD\u8FDE\u63A5\u8FD0\u884C\u6B64\u6D4F\u89C8\u5668\u7684\u8BBE\u5907\u3002",
    "DDP helper access failed. Allow local device access in your browser, then refresh. If access is already allowed, start the helper on this same device.": "DDP \u8F85\u52A9\u7A0B\u5E8F\u8BBF\u95EE\u5931\u8D25\u3002\u8BF7\u5141\u8BB8\u6D4F\u89C8\u5668\u8BBF\u95EE\u672C\u5730\u8BBE\u5907\u5E76\u5237\u65B0\uFF1B\u82E5\u5DF2\u5141\u8BB8\uFF0C\u8BF7\u5728\u540C\u4E00\u8BBE\u5907\u4E0A\u542F\u52A8\u8F85\u52A9\u7A0B\u5E8F\u3002",
    "Browser access to local devices may be blocked. Allow local network or local device access for this site, then refresh and try WLED again.": "\u6D4F\u89C8\u5668\u53EF\u80FD\u963B\u6B62\u4E86\u672C\u5730\u8BBE\u5907\u8BBF\u95EE\u3002\u8BF7\u5141\u8BB8\u6B64\u7F51\u7AD9\u8BBF\u95EE\u672C\u5730\u7F51\u7EDC\u6216\u8BBE\u5907\uFF0C\u7136\u540E\u5237\u65B0\u5E76\u91CD\u8BD5 WLED\u3002",
    "Select a MIDI Out device to hear metronome clicks on Channel 10. Some keyboards require a drum (Ch 10) or multi-timbral mode to avoid piano sounds.": "\u9009\u62E9 MIDI \u8F93\u51FA\u8BBE\u5907\u4EE5\u5728\u901A\u9053 10 \u64AD\u653E\u8282\u62CD\u58F0\u3002\u90E8\u5206\u952E\u76D8\u9700\u542F\u7528\u9F13\u97F3\u8272\uFF08\u901A\u9053 10\uFF09\u6216\u591A\u97F3\u8272\u6A21\u5F0F\uFF0C\u624D\u80FD\u907F\u514D\u94A2\u7434\u97F3\u8272\u3002",
    "Enter a WLED IP address first.": "\u8BF7\u5148\u8F93\u5165 WLED IP \u5730\u5740\u3002",
    "No playable LEDs configured to test.": "\u6CA1\u6709\u53EF\u6D4B\u8BD5\u7684 LED \u914D\u7F6E\u3002",
    "WLED ready.": "WLED \u5C31\u7EEA\u3002",
    "WLED ready. DDP selected.": "WLED \u5C31\u7EEA\uFF0C\u5DF2\u9009\u62E9 DDP\u3002",
    "DDP selected via localhost helper (awaiting frame confirm).": "\u5DF2\u901A\u8FC7 localhost \u8F85\u52A9\u7A0B\u5E8F\u9009\u62E9 DDP\uFF08\u7B49\u5F85\u5E27\u786E\u8BA4\uFF09\u3002",
    "DDP helper unavailable. Using HTTP JSON fallback.": "DDP \u8F85\u52A9\u7A0B\u5E8F\u4E0D\u53EF\u7528\uFF0C\u4F7F\u7528 HTTP JSON \u56DE\u9000\u3002",
    "DDP frame confirmed via localhost helper.": "DDP \u5E27\u5DF2\u901A\u8FC7 localhost \u8F85\u52A9\u7A0B\u5E8F\u786E\u8BA4\u3002",
    "HTTP JSON active.": "HTTP JSON \u5DF2\u542F\u7528\u3002",
    "HTTP JSON active; DDP fallback in use. Helper not detected.": "HTTP JSON \u5DF2\u542F\u7528\uFF1B\u6B63\u5728\u4F7F\u7528 DDP \u56DE\u9000\uFF0C\u672A\u68C0\u6D4B\u5230\u8F85\u52A9\u7A0B\u5E8F\u3002",
    "WLED cleared.": "WLED \u5DF2\u6E05\u7A7A\u3002",
    "WLED unreachable. Retrying\u2026": "\u65E0\u6CD5\u8FDE\u63A5 WLED\uFF0C\u6B63\u5728\u91CD\u8BD5\u2026",
    "WLED force-send failed. Retrying\u2026": "WLED \u5F3A\u5236\u53D1\u9001\u5931\u8D25\uFF0C\u6B63\u5728\u91CD\u8BD5\u2026",
    "WLED send error. Retrying\u2026": "WLED \u53D1\u9001\u51FA\u9519\uFF0C\u6B63\u5728\u91CD\u8BD5\u2026",
    "WLED reconnect failed. Retrying\u2026": "WLED \u91CD\u8FDE\u5931\u8D25\uFF0C\u6B63\u5728\u91CD\u8BD5\u2026",
    "WLED reconnected. Restoring current notes.": "WLED \u5DF2\u91CD\u8FDE\uFF0C\u6B63\u5728\u6062\u590D\u5F53\u524D\u97F3\u7B26\u3002",
    "WLED reconnected. Strip cleared.": "WLED \u5DF2\u91CD\u8FDE\uFF0C\u706F\u5E26\u5DF2\u6E05\u7A7A\u3002",
    "Running WLED note test\u2026": "\u6B63\u5728\u6D4B\u8BD5 WLED \u97F3\u7B26\u2026",
    "WLED test stopped.": "WLED \u6D4B\u8BD5\u5DF2\u505C\u6B62\u3002",
    "WLED test failed.": "WLED \u6D4B\u8BD5\u5931\u8D25\u3002",
    "WLED note test complete.": "WLED \u97F3\u7B26\u6D4B\u8BD5\u5B8C\u6210\u3002",
    "DDP is experimental. It may require a local sender or standalone build and may not work directly in browser mode. Switch to DDP anyway?": "DDP \u662F\u5B9E\u9A8C\u529F\u80FD\u3002\n\n\u5B83\u53EF\u80FD\u9700\u8981\u672C\u5730\u53D1\u9001\u7A0B\u5E8F\u6216\u72EC\u7ACB\u7248\u672C\uFF0C\u5728\u6D4F\u89C8\u5668\u6A21\u5F0F\u4E2D\u53EF\u80FD\u65E0\u6CD5\u76F4\u63A5\u4F7F\u7528\u3002\n\n\u4ECD\u8981\u5207\u6362\u5230 DDP \u5417\uFF1F",
    "No release URL is configured yet.": "\u5C1A\u672A\u914D\u7F6E\u7248\u672C\u4E0B\u8F7D\u5730\u5740\u3002",
    "Download Latest": "\u4E0B\u8F7D\u6700\u65B0\u7248",
    "Reload to Update": "\u91CD\u65B0\u52A0\u8F7D\u4EE5\u66F4\u65B0",
    "Up to Date": "\u5DF2\u662F\u6700\u65B0\u7248",
    "Up to date.": "\u5DF2\u662F\u6700\u65B0\u7248\u3002",
    "Update checks are not configured yet.": "\u5C1A\u672A\u914D\u7F6E\u66F4\u65B0\u68C0\u67E5\u3002",
    "Update manifest is missing a version value.": "\u66F4\u65B0\u4FE1\u606F\u7F3A\u5C11\u7248\u672C\u53F7\u3002",
    "Update check unavailable.": "\u66F4\u65B0\u68C0\u67E5\u6682\u4E0D\u53EF\u7528\u3002",
    "Unknown": "\u672A\u77E5",
    "Unavailable for this score": "\u6B64\u66F2\u8C31\u4E0D\u53EF\u7528",
    "Transposed score": "\u5DF2\u79FB\u8C03\u66F2\u8C31",
    "Original score": "\u539F\u8C03\u66F2\u8C31",
    "Ready. Transpose is applied from the original source score each time. Tanspose by Key Signature or by Semitones": "\u51C6\u5907\u5C31\u7EEA\u3002\u6BCF\u6B21\u79FB\u8C03\u5747\u57FA\u4E8E\u539F\u59CB\u66F2\u8C31\u3002\n\u53EF\u6309\u8C03\u53F7\u6216\u534A\u97F3\u6570\u79FB\u8C03\u3002",
    "Choose a target key before applying transpose.": "\u8BF7\u5148\u9009\u62E9\u76EE\u6807\u8C03\u6027\uFF0C\u518D\u5E94\u7528\u79FB\u8C03\u3002",
    "Target key already matches the current key. Choose a different key or use semitones.": "\u76EE\u6807\u8C03\u6027\u4E0E\u5F53\u524D\u8C03\u6027\u76F8\u540C\uFF0C\u8BF7\u9009\u62E9\u5176\u4ED6\u8C03\u6027\u6216\u4F7F\u7528\u534A\u97F3\u6570\u79FB\u8C03\u3002",
    "This score does not expose a readable key signature. Use semitones for this score.": "\u65E0\u6CD5\u8BFB\u53D6\u6B64\u66F2\u8C31\u7684\u8C03\u53F7\uFF0C\u8BF7\u4F7F\u7528\u534A\u97F3\u6570\u79FB\u8C03\u3002",
    "This score is not available as raw MusicXML text, so transpose is disabled for it right now.": "\u6B64\u66F2\u8C31\u6CA1\u6709\u53EF\u7528\u7684 MusicXML \u539F\u59CB\u6587\u672C\uFF0C\u6682\u65F6\u65E0\u6CD5\u79FB\u8C03\u3002",
    "Transpose works on XML, MusicXML, normalized MXL, and imported files that convert to MusicXML.": "\u79FB\u8C03\u652F\u6301 XML\u3001MusicXML\u3001\u6807\u51C6\u5316\u7684 MXL\uFF0C\u4EE5\u53CA\u53EF\u8F6C\u6362\u4E3A MusicXML \u7684\u5BFC\u5165\u6587\u4EF6\u3002",
    "Could not normalize this score for transpose.": "\u65E0\u6CD5\u4E3A\u79FB\u8C03\u6807\u51C6\u5316\u6B64\u66F2\u8C31\u3002",
    "Could not transpose this score.": "\u65E0\u6CD5\u79FB\u8C03\u6B64\u66F2\u8C31\u3002",
    "Could not reset transpose.": "\u65E0\u6CD5\u91CD\u7F6E\u79FB\u8C03\u3002",
    "Could not parse MusicXML for transposition.": "\u65E0\u6CD5\u89E3\u6790\u7528\u4E8E\u79FB\u8C03\u7684 MusicXML\u3002",
    "Could not extract MXL to MusicXML for transpose support.": "\u65E0\u6CD5\u5C06 MXL \u89E3\u538B\u4E3A MusicXML \u4EE5\u652F\u6301\u79FB\u8C03\u3002",
    "Could not normalize MXL to MusicXML for transpose support.": "\u65E0\u6CD5\u5C06 MXL \u6807\u51C6\u5316\u4E3A MusicXML \u4EE5\u652F\u6301\u79FB\u8C03\u3002",
    "Could not find the ZIP directory in this MXL file.": "\u65E0\u6CD5\u5728\u6B64 MXL \u6587\u4EF6\u4E2D\u627E\u5230 ZIP \u76EE\u5F55\u3002",
    "Could not read the ZIP entries from this MXL file.": "\u65E0\u6CD5\u8BFB\u53D6\u6B64 MXL \u6587\u4EF6\u4E2D\u7684 ZIP \u6761\u76EE\u3002",
    "This browser does not support ZIP decompression for transpose.": "\u6B64\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u79FB\u8C03\u6240\u9700\u7684 ZIP \u89E3\u538B\u529F\u80FD\u3002",
    "Could not find the embedded MusicXML inside this MXL file.": "\u65E0\u6CD5\u5728\u6B64 MXL \u6587\u4EF6\u4E2D\u627E\u5230\u5185\u5D4C\u7684 MusicXML\u3002",
    "Only MusicXML text and compressed MXL are supported for transpose normalization.": "\u79FB\u8C03\u6807\u51C6\u5316\u4EC5\u652F\u6301 MusicXML \u6587\u672C\u548C\u538B\u7F29 MXL\u3002",
    "No file selected.": "\u5C1A\u672A\u9009\u62E9\u6587\u4EF6\u3002",
    "Could not read score file.": "\u65E0\u6CD5\u8BFB\u53D6\u66F2\u8C31\u6587\u4EF6\u3002",
    "Could not read that file.": "\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u6587\u4EF6\u3002",
    "Error loading score file.": "\u52A0\u8F7D\u66F2\u8C31\u6587\u4EF6\u51FA\u9519\u3002",
    "File loaded successfully.": "\u6587\u4EF6\u52A0\u8F7D\u6210\u529F\u3002",
    "That file type is not supported for conversion.": "\u4E0D\u652F\u6301\u8F6C\u6362\u6B64\u6587\u4EF6\u7C7B\u578B\u3002",
    "Converted score was not returned as text.": "\u8F6C\u6362\u540E\u7684\u66F2\u8C31\u672A\u8FD4\u56DE\u6587\u672C\u3002",
    "Some MIDI, MuseScore, or Guitar Pro files may need cleanup in MuseScore before importing.": "\u90E8\u5206 MIDI\u3001MuseScore \u6216 Guitar Pro \u6587\u4EF6\u53EF\u80FD\u9700\u8981\u5728 MuseScore \u4E2D\u6574\u7406\u540E\u518D\u5BFC\u5165\u3002",
    "Could not load the local webmscore converter files. Download them into assets/vendor/webmscore first.": "\u65E0\u6CD5\u52A0\u8F7D\u672C\u5730 webmscore \u8F6C\u6362\u5668\u6587\u4EF6\u3002\u8BF7\u5148\u5C06\u5176\u4E0B\u8F7D\u5230 assets/vendor/webmscore\u3002",
    "webmscore did not initialize correctly.": "webmscore \u521D\u59CB\u5316\u5931\u8D25\u3002",
    "webmscore loaded, but this build does not expose a MusicXML export function.": "webmscore \u5DF2\u52A0\u8F7D\uFF0C\u4F46\u6B64\u7248\u672C\u6CA1\u6709\u53EF\u7528\u7684 MusicXML \u5BFC\u51FA\u529F\u80FD\u3002",
    "Direct MXL XML extraction also failed.": "\u76F4\u63A5\u4ECE MXL \u63D0\u53D6 XML \u4E5F\u5931\u8D25\u4E86\u3002",
    "Folder must be empty before deleting.": "\u5220\u9664\u524D\u6587\u4EF6\u5939\u5FC5\u987B\u4E3A\u7A7A\u3002",
    "Folder name is required.": "\u8BF7\u8F93\u5165\u6587\u4EF6\u5939\u540D\u79F0\u3002",
    "Folder not found.": "\u627E\u4E0D\u5230\u6587\u4EF6\u5939\u3002",
    "Score name is required.": "\u8BF7\u8F93\u5165\u66F2\u8C31\u540D\u79F0\u3002",
    "Score not found.": "\u627E\u4E0D\u5230\u66F2\u8C31\u3002",
    "IndexedDB is not available in this browser.": "\u6B64\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 IndexedDB\u3002",
    "Could not open the score library database.": "\u65E0\u6CD5\u6253\u5F00\u66F2\u5E93\u6570\u636E\u5E93\u3002",
    "Library request failed.": "\u66F2\u5E93\u8BF7\u6C42\u5931\u8D25\u3002",
    "Library transaction failed.": "\u66F2\u5E93\u6570\u636E\u64CD\u4F5C\u5931\u8D25\u3002",
    "Library transaction was aborted.": "\u66F2\u5E93\u6570\u636E\u64CD\u4F5C\u5DF2\u4E2D\u6B62\u3002",
    "This cannot be undone.": "\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\u3002",
    "No scores in": "\u201C",
    "yet.": "\u201D\u4E2D\u6682\u65E0\u66F2\u8C31\u3002"
  });
  var templates = [
    [/^Version: (.*)$/, (v) => `\u7248\u672C\uFF1A${v}`],
    [/^Version (.*) is available\. Reload now\?$/, (v) => `\u7248\u672C ${v} \u5DF2\u53D1\u5E03\uFF0C\u7ACB\u5373\u91CD\u65B0\u52A0\u8F7D\u5417\uFF1F`],
    [/^Update available: (.*)\.$/, (v) => `\u6709\u53EF\u7528\u66F4\u65B0\uFF1A${v}\u3002`],
    [/^Updating to (.*)\.\.\.$/, (v) => `\u6B63\u5728\u66F4\u65B0\u81F3 ${v}\u2026`],
    [/^Update check failed: (.*)$/, (v) => `\u66F4\u65B0\u68C0\u67E5\u5931\u8D25\uFF1A${v}`],
    [/^Playable Range: MIDI (.*)$/, (v) => `\u53EF\u5F39\u594F\u97F3\u57DF\uFF1AMIDI ${v}`],
    [/^Staff (\d+)$/, (v) => `\u8C31\u8868 ${v}`],
    [/^(\d+) selected$/, (v) => `\u5DF2\u9009\u62E9 ${v} \u9879`],
    [/^(\d+) scores? •$/, (v) => `${v} \u9996\u66F2\u8C31 \u2022`],
    [/^Actions for folder (.*)$/, (v) => `\u6587\u4EF6\u5939\u64CD\u4F5C\uFF1A${v}`],
    [/^Actions for (.*)$/, (v) => `\u66F2\u8C31\u64CD\u4F5C\uFF1A${v}`],
    [/^Move "(.*)" to which folder\?$/, (v) => `\u5C06\u201C${v}\u201D\u79FB\u52A8\u5230\u54EA\u4E2A\u6587\u4EF6\u5939\uFF1F`],
    [/^Move (\d+) selected scores? to which folder\?$/, (v) => `\u5C06\u6240\u9009 ${v} \u9996\u66F2\u8C31\u79FB\u52A8\u5230\u54EA\u4E2A\u6587\u4EF6\u5939\uFF1F`],
    [/^Delete score "(.*)"\?$/, (v) => `\u5220\u9664\u66F2\u8C31\u201C${v}\u201D\uFF1F`],
    [/^Delete (\d+) selected scores?\? This cannot be undone\.$/, (v) => `\u5220\u9664\u6240\u9009 ${v} \u9996\u66F2\u8C31\uFF1F\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\u3002`],
    [/^Delete (\d+) selected folders?\? Any scores inside (?:it will|them will) also be deleted\.$/, (v) => `\u5220\u9664\u6240\u9009 ${v} \u4E2A\u6587\u4EF6\u5939\uFF1F\u5176\u4E2D\u7684\u66F2\u8C31\u4E5F\u5C06\u88AB\u5220\u9664\u3002`],
    [/^Delete folder "(.*)"\? This cannot be undone\.$/, (v) => `\u5220\u9664\u6587\u4EF6\u5939\u201C${v}\u201D\uFF1F\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\u3002`],
    [/^Delete folder "(.*)"\? This will also delete (\d+) scores? inside it\.$/, (v, count) => `\u5220\u9664\u6587\u4EF6\u5939\u201C${v}\u201D\uFF1F\u5176\u4E2D ${count} \u9996\u66F2\u8C31\u4E5F\u5C06\u88AB\u5220\u9664\u3002`],
    [/^No scores in (.*) yet\.$/, (v) => `\u201C${v}\u201D\u4E2D\u6682\u65E0\u66F2\u8C31\u3002`],
    [/^Send playback and input to (.*)\.$/, (v) => `\u5C06\u64AD\u653E\u4E0E\u8F93\u5165\u53D1\u9001\u5230 ${v}\u3002`],
    [/^Selected Key: MIDI (.*) \| LED Offset: (.*)$/, (v, offset) => `\u6240\u9009\u7434\u952E\uFF1AMIDI ${v} | LED \u504F\u79FB\uFF1A${offset}`],
    [/^Testing MIDI LED note (.*) \((.*)\)\.$/, (v, count) => `\u6B63\u5728\u6D4B\u8BD5 MIDI LED \u97F3\u7B26 ${v} (${count})\u3002`],
    [/^WLED test note (.*) \((.*)\)\.$/, (v, count) => `\u6B63\u5728\u6D4B\u8BD5 WLED \u97F3\u7B26 ${v} (${count})\u3002`],
    [/^WLED connected \((.*) LEDs, (.*)\)$/, (v, transport) => `WLED \u5DF2\u8FDE\u63A5\uFF08${v} \u4E2A LED\uFF0C${transport}\uFF09`],
    [/^WLED frame re-sent \((.*) LEDs\)\.$/, (v) => `WLED \u5E27\u5DF2\u91CD\u65B0\u53D1\u9001\uFF08${v} \u4E2A LED\uFF09\u3002`],
    [/^WLED frame re-sent over (.*) \((.*) LEDs\)\.$/, (transport, v) => `WLED \u5E27\u5DF2\u901A\u8FC7 ${transport} \u91CD\u65B0\u53D1\u9001\uFF08${v} \u4E2A LED\uFF09\u3002`],
    [/^Helper: Connected on localhost\. Last DDP frame skipped \((.*)\)\.$/, (v) => `\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u5DF2\u5728 localhost \u8FDE\u63A5\uFF0C\u4E0A\u4E00 DDP \u5E27\u5DF2\u8DF3\u8FC7\uFF08${v}\uFF09\u3002`],
    [/^Helper: Connected on localhost\. Last frame (.*) (.*)\.$/, (transport, outcome) => `\u8F85\u52A9\u7A0B\u5E8F\uFF1A\u5DF2\u5728 localhost \u8FDE\u63A5\uFF0C\u4E0A\u4E00\u5E27 ${transport} ${outcome}\u3002`],
    [/^Applied: ([+-]?\d+) semitones$/, (v) => `\u5DF2\u5E94\u7528\uFF1A${v} \u534A\u97F3`],
    [/^Applied: to (.*)$/, (v) => `\u5DF2\u79FB\u8C03\u81F3\uFF1A${v}`],
    [/^Applied: Original score$/, () => "\u5DF2\u5E94\u7528\uFF1A\u539F\u8C03\u66F2\u8C31"],
    [/^Applied: (.*)$/, (v) => `\u5DF2\u5E94\u7528\uFF1A${v}`],
    [/^Unsupported MXL compression method: (.*)\.$/, (v) => `\u4E0D\u652F\u6301\u7684 MXL \u538B\u7F29\u65B9\u6CD5\uFF1A${v}\u3002`],
    [/^Could not read ZIP entry "(.*)"\.$/, (v) => `\u65E0\u6CD5\u8BFB\u53D6 ZIP \u6761\u76EE\u201C${v}\u201D\u3002`],
    [/^Could not convert "(.*)"\. (.*)$/, (v, detail) => `\u65E0\u6CD5\u8F6C\u6362\u201C${v}\u201D\u3002${detail === "Some MIDI, MuseScore, or Guitar Pro files may need cleanup in MuseScore before importing." ? chineseMessages[detail] : detail}`],
    [/^Could not load starter library \((.*)\)\.$/, (v) => `\u65E0\u6CD5\u52A0\u8F7D\u5165\u95E8\u66F2\u5E93\uFF08${v}\uFF09\u3002`]
  ];
  function translateMessage(source, language) {
    if (language === "en") return source;
    const normalized = source.trim().replace(/\s+/g, " ");
    const direct = Object.prototype.hasOwnProperty.call(chineseMessages, normalized) ? chineseMessages[normalized] : void 0;
    if (direct !== void 0) return source.replace(source.trim(), () => direct);
    for (const [pattern, render] of templates) {
      const match = source.trim().match(pattern);
      if (match) return source.replace(source.trim(), () => render(...match.slice(1)));
    }
    return source;
  }

  // src/state/preference-keys.ts
  var PREFERENCE_STORAGE_KEYS = Object.freeze({
    LANGUAGE_STORAGE_KEY: "pt_language",
    UPDATE_MANIFEST_URL_STORAGE_KEY: "pt_updateManifestUrl",
    ASSET_VERSION_OVERRIDE_STORAGE_KEY: "pt_assetVersionOverride",
    PLAYER_PIANO_STORAGE_KEY: "pt_playerPianoType",
    MIDI_IN_NAME_STORAGE_KEY: "pt_savedMidiInName",
    MIDI_OUT_NAME_STORAGE_KEY: "pt_savedMidiOutName",
    MIDI_LIGHTS_NAME_STORAGE_KEY: "pt_savedMidiLightsName",
    LED_COUNT_STORAGE_KEY: "pt_ledCount",
    LED_OUTPUT_MODE_STORAGE_KEY: "pt_ledOutputMode",
    LED_REVERSE_STORAGE_KEY: "pt_ledReverse",
    WLED_IP_STORAGE_KEY: "pt_wledIp",
    WLED_TRANSPORT_STORAGE_KEY: "pt_wledTransport",
    WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY: "pt_wledTransportWarningAccepted",
    WLED_DDP_DEBUG_STORAGE_KEY: "pt_wledDdpDebugEnabled",
    LED_MASTER_BRIGHTNESS_STORAGE_KEY: "pt_ledMasterBrightness",
    LED_FUTURE1_PCT_STORAGE_KEY: "pt_ledFuture1Pct",
    LED_FUTURE2_PCT_STORAGE_KEY: "pt_ledFuture2Pct",
    LED_CALIBRATION_STORAGE_KEY: "pt_ledCalibration",
    TRAINER_MODE_STORAGE_KEY: "pt_trainerMode",
    TRAINER_FEEDBACK_STORAGE_KEY: "pt_feedbackEnabled",
    TRAINER_FUTURE_PREVIEW_STORAGE_KEY: "pt_futurePreviewEnabled",
    TRAINER_FUTURE_DEPTH_STORAGE_KEY: "pt_futurePreviewDepth",
    TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY: "pt_correctHighlightEnabled",
    TRAINER_PRACTICE_LH_STORAGE_KEY: "pt_practiceLeft",
    TRAINER_PRACTICE_RH_STORAGE_KEY: "pt_practiceRight",
    TRAINER_PLAYBACK_LH_STORAGE_KEY: "pt_audioLeft",
    TRAINER_PLAYBACK_RH_STORAGE_KEY: "pt_audioRight",
    TRAINER_AUDIO_HANDS_STORAGE_KEY: "pt_audioHands",
    TRAINER_AUDIO_OTHER_STORAGE_KEY: "pt_audioOther",
    TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY: "pt_audioInstrument",
    TRAINER_AUDIO_VIRTUAL_STORAGE_KEY: "pt_audioVirtualKeyboard",
    TRAINER_MIDIOUT_HANDS_STORAGE_KEY: "pt_midiOutHands",
    TRAINER_MIDIOUT_OTHER_STORAGE_KEY: "pt_midiOutOther",
    TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY: "pt_midiOutInstrument",
    TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY: "pt_midiOutVirtualKeyboard",
    TRAINER_INPUT_VELOCITY_STORAGE_KEY: "pt_inputVelocityEnabled",
    TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY: "pt_liveLowLatencyMonitoringEnabled",
    TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY: "pt_lowLatencyPlaybackEnabled",
    TRAINER_PIANO_VOL_STORAGE_KEY: "pt_trainerPianoVolume",
    TRAINER_MIDIOUT_VOL_STORAGE_KEY: "pt_trainerMidiOutVolume",
    TRAINER_MIDIIN_BOOST_STORAGE_KEY: "pt_trainerMidiInBoost",
    TRAINER_ZOOM_STORAGE_KEY: "pt_trainerZoom",
    TRAINER_SCORE_LAYOUT_STORAGE_KEY: "pt_scoreLayout",
    TRAINER_AUTOSCROLL_STORAGE_KEY: "pt_autoScroll",
    TRAINER_KEYBOARD_STORAGE_KEY: "pt_virtualKeyboardVisible",
    TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY: "pt_fullscreenOnPlay",
    SETTINGS_DEBUG_STORAGE_KEY: "pt_debugEnabled",
    MIDI_IN_ID_STORAGE_KEY: "pt_savedMidiIn",
    MIDI_OUT_ID_STORAGE_KEY: "pt_savedMidiOut",
    MIDI_LIGHTS_ID_STORAGE_KEY: "pt_savedMidiLights",
    MIDI_IN_CHANNEL_STORAGE_KEY: "pt_savedMidiInChannel",
    MIDI_OUT_CHANNEL_STORAGE_KEY: "pt_savedMidiOutChannel",
    MIDI_LIGHTS_CHANNEL_STORAGE_KEY: "pt_savedMidiLightsChannel",
    MIDI_LED_LOW_VELOCITY_STORAGE_KEY: "pt_midiLedLowVelocity",
    VISUAL_PULSE_STORAGE_KEY: "pt_visualPulseEnabled",
    LOOP_COUNT_IN_STORAGE_KEY: "pt_loopCountInEnabled",
    METRONOME_VOL_STORAGE_KEY: "pt_metronomeVolume",
    METRONOME_MIDIOUT_STORAGE_KEY: "pt_metronomeMidiOutEnabled",
    ACCENTED_DOWNBEAT_STORAGE_KEY: "pt_accentedDownbeatEnabled",
    FIRST_RUN_INIT_STORAGE_KEY: "pt_firstRunInit_20260321",
    SKIP_FIRST_RUN_ONCE_STORAGE_KEY: "pt_skipFirstRunOnce"
  });
  var LANGUAGE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LANGUAGE_STORAGE_KEY;
  var UPDATE_MANIFEST_URL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.UPDATE_MANIFEST_URL_STORAGE_KEY;
  var ASSET_VERSION_OVERRIDE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.ASSET_VERSION_OVERRIDE_STORAGE_KEY;
  var PLAYER_PIANO_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.PLAYER_PIANO_STORAGE_KEY;
  var MIDI_IN_NAME_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_IN_NAME_STORAGE_KEY;
  var MIDI_OUT_NAME_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_OUT_NAME_STORAGE_KEY;
  var MIDI_LIGHTS_NAME_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_LIGHTS_NAME_STORAGE_KEY;
  var LED_COUNT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_COUNT_STORAGE_KEY;
  var LED_OUTPUT_MODE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_OUTPUT_MODE_STORAGE_KEY;
  var LED_REVERSE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_REVERSE_STORAGE_KEY;
  var WLED_IP_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.WLED_IP_STORAGE_KEY;
  var WLED_TRANSPORT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.WLED_TRANSPORT_STORAGE_KEY;
  var WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY;
  var WLED_DDP_DEBUG_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.WLED_DDP_DEBUG_STORAGE_KEY;
  var LED_MASTER_BRIGHTNESS_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_MASTER_BRIGHTNESS_STORAGE_KEY;
  var LED_FUTURE1_PCT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_FUTURE1_PCT_STORAGE_KEY;
  var LED_FUTURE2_PCT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_FUTURE2_PCT_STORAGE_KEY;
  var LED_CALIBRATION_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LED_CALIBRATION_STORAGE_KEY;
  var TRAINER_MODE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MODE_STORAGE_KEY;
  var TRAINER_FEEDBACK_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_FEEDBACK_STORAGE_KEY;
  var TRAINER_FUTURE_PREVIEW_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_FUTURE_PREVIEW_STORAGE_KEY;
  var TRAINER_FUTURE_DEPTH_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_FUTURE_DEPTH_STORAGE_KEY;
  var TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY;
  var TRAINER_PRACTICE_LH_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_PRACTICE_LH_STORAGE_KEY;
  var TRAINER_PRACTICE_RH_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_PRACTICE_RH_STORAGE_KEY;
  var TRAINER_PLAYBACK_LH_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_PLAYBACK_LH_STORAGE_KEY;
  var TRAINER_PLAYBACK_RH_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_PLAYBACK_RH_STORAGE_KEY;
  var TRAINER_AUDIO_HANDS_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_AUDIO_HANDS_STORAGE_KEY;
  var TRAINER_AUDIO_OTHER_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_AUDIO_OTHER_STORAGE_KEY;
  var TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY;
  var TRAINER_AUDIO_VIRTUAL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_AUDIO_VIRTUAL_STORAGE_KEY;
  var TRAINER_MIDIOUT_HANDS_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MIDIOUT_HANDS_STORAGE_KEY;
  var TRAINER_MIDIOUT_OTHER_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MIDIOUT_OTHER_STORAGE_KEY;
  var TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY;
  var TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY;
  var TRAINER_INPUT_VELOCITY_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_INPUT_VELOCITY_STORAGE_KEY;
  var TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY;
  var TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY;
  var TRAINER_PIANO_VOL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_PIANO_VOL_STORAGE_KEY;
  var TRAINER_MIDIOUT_VOL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MIDIOUT_VOL_STORAGE_KEY;
  var TRAINER_MIDIIN_BOOST_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_MIDIIN_BOOST_STORAGE_KEY;
  var TRAINER_ZOOM_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_ZOOM_STORAGE_KEY;
  var TRAINER_SCORE_LAYOUT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_SCORE_LAYOUT_STORAGE_KEY;
  var TRAINER_AUTOSCROLL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_AUTOSCROLL_STORAGE_KEY;
  var TRAINER_KEYBOARD_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_KEYBOARD_STORAGE_KEY;
  var TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY;
  var SETTINGS_DEBUG_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.SETTINGS_DEBUG_STORAGE_KEY;
  var MIDI_IN_ID_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_IN_ID_STORAGE_KEY;
  var MIDI_OUT_ID_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_OUT_ID_STORAGE_KEY;
  var MIDI_LIGHTS_ID_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_LIGHTS_ID_STORAGE_KEY;
  var MIDI_IN_CHANNEL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_IN_CHANNEL_STORAGE_KEY;
  var MIDI_OUT_CHANNEL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_OUT_CHANNEL_STORAGE_KEY;
  var MIDI_LIGHTS_CHANNEL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_LIGHTS_CHANNEL_STORAGE_KEY;
  var MIDI_LED_LOW_VELOCITY_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.MIDI_LED_LOW_VELOCITY_STORAGE_KEY;
  var VISUAL_PULSE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.VISUAL_PULSE_STORAGE_KEY;
  var LOOP_COUNT_IN_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.LOOP_COUNT_IN_STORAGE_KEY;
  var METRONOME_VOL_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.METRONOME_VOL_STORAGE_KEY;
  var METRONOME_MIDIOUT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.METRONOME_MIDIOUT_STORAGE_KEY;
  var ACCENTED_DOWNBEAT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.ACCENTED_DOWNBEAT_STORAGE_KEY;
  var FIRST_RUN_INIT_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.FIRST_RUN_INIT_STORAGE_KEY;
  var SKIP_FIRST_RUN_ONCE_STORAGE_KEY = PREFERENCE_STORAGE_KEYS.SKIP_FIRST_RUN_ONCE_STORAGE_KEY;
  var RESETTABLE_PREFERENCE_KEYS = [
    LANGUAGE_STORAGE_KEY,
    PLAYER_PIANO_STORAGE_KEY,
    MIDI_IN_NAME_STORAGE_KEY,
    MIDI_OUT_NAME_STORAGE_KEY,
    MIDI_LIGHTS_NAME_STORAGE_KEY,
    MIDI_IN_ID_STORAGE_KEY,
    MIDI_IN_CHANNEL_STORAGE_KEY,
    MIDI_OUT_ID_STORAGE_KEY,
    MIDI_LIGHTS_ID_STORAGE_KEY,
    MIDI_OUT_CHANNEL_STORAGE_KEY,
    MIDI_LIGHTS_CHANNEL_STORAGE_KEY,
    MIDI_LED_LOW_VELOCITY_STORAGE_KEY,
    LED_COUNT_STORAGE_KEY,
    LED_OUTPUT_MODE_STORAGE_KEY,
    LED_REVERSE_STORAGE_KEY,
    WLED_IP_STORAGE_KEY,
    WLED_TRANSPORT_STORAGE_KEY,
    WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY,
    WLED_DDP_DEBUG_STORAGE_KEY,
    LED_MASTER_BRIGHTNESS_STORAGE_KEY,
    LED_FUTURE1_PCT_STORAGE_KEY,
    LED_FUTURE2_PCT_STORAGE_KEY,
    LED_CALIBRATION_STORAGE_KEY,
    TRAINER_MODE_STORAGE_KEY,
    TRAINER_FEEDBACK_STORAGE_KEY,
    TRAINER_FUTURE_PREVIEW_STORAGE_KEY,
    TRAINER_FUTURE_DEPTH_STORAGE_KEY,
    TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY,
    TRAINER_PRACTICE_LH_STORAGE_KEY,
    TRAINER_PRACTICE_RH_STORAGE_KEY,
    TRAINER_PLAYBACK_LH_STORAGE_KEY,
    TRAINER_PLAYBACK_RH_STORAGE_KEY,
    TRAINER_AUDIO_HANDS_STORAGE_KEY,
    TRAINER_AUDIO_OTHER_STORAGE_KEY,
    TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY,
    TRAINER_AUDIO_VIRTUAL_STORAGE_KEY,
    TRAINER_MIDIOUT_HANDS_STORAGE_KEY,
    TRAINER_MIDIOUT_OTHER_STORAGE_KEY,
    TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY,
    TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY,
    TRAINER_INPUT_VELOCITY_STORAGE_KEY,
    TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY,
    TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY,
    TRAINER_PIANO_VOL_STORAGE_KEY,
    TRAINER_MIDIOUT_VOL_STORAGE_KEY,
    TRAINER_MIDIIN_BOOST_STORAGE_KEY,
    TRAINER_ZOOM_STORAGE_KEY,
    TRAINER_SCORE_LAYOUT_STORAGE_KEY,
    TRAINER_AUTOSCROLL_STORAGE_KEY,
    TRAINER_KEYBOARD_STORAGE_KEY,
    TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY,
    SETTINGS_DEBUG_STORAGE_KEY,
    VISUAL_PULSE_STORAGE_KEY,
    LOOP_COUNT_IN_STORAGE_KEY,
    METRONOME_VOL_STORAGE_KEY,
    METRONOME_MIDIOUT_STORAGE_KEY,
    ACCENTED_DOWNBEAT_STORAGE_KEY
  ];

  // src/i18n/language-controller.ts
  var rootsSelector = "#static-menu, #scores-panel, #options-overlay, #help-overlay, #more-popup, #audio-popup, #display-popup, #transpose-popup, #tempo-popup, #practice-popup, #looper-popup, .score-overlay-controls, #led-calibration-panel, .scores-folder-picker-overlay, .scores-action-menu-overlay";
  var skipSelector = "script, style, svg, [data-i18n-skip], .scores-item-title, .scores-item-meta, .scores-action-menu-title";
  var attributes = ["title", "aria-label", "placeholder", "data-tooltip"];
  var sourceCopies = /* @__PURE__ */ new WeakMap();
  function createLanguageController(ports) {
    const { document: document2 } = ports;
    let language = DEFAULT_LANGUAGE, initialized = false, disposed = false;
    let bodyObserver = null, select = null;
    const observers = /* @__PURE__ */ new Map();
    let copies = sourceCopies.get(document2);
    if (!copies) {
      copies = { texts: /* @__PURE__ */ new WeakMap(), attributes: /* @__PURE__ */ new WeakMap() };
      sourceCopies.set(document2, copies);
    }
    const textCopies = copies.texts, attributeCopies = copies.attributes;
    function translate(source) {
      return translateMessage(String(source ?? ""), language);
    }
    function skip(node) {
      const element = node.nodeType === 1 ? node : node.parentElement;
      return !element || !!element.closest(skipSelector);
    }
    function applyText(node) {
      if (skip(node)) return;
      const value = node.nodeValue || "", previous = textCopies.get(node);
      const source = previous && value === previous.rendered ? previous.source : value;
      const rendered = translate(source);
      textCopies.set(node, { source, rendered });
      if (rendered !== value) node.nodeValue = rendered;
    }
    function applyAttributes(element) {
      if (skip(element)) return;
      let copies2 = attributeCopies.get(element);
      if (!copies2) {
        copies2 = /* @__PURE__ */ new Map();
        attributeCopies.set(element, copies2);
      }
      for (const name of attributes) {
        const value = element.getAttribute(name);
        if (value === null) {
          copies2.delete(name);
          continue;
        }
        const previous = copies2.get(name);
        const source = previous && value === previous.rendered ? previous.source : value;
        const rendered = translate(source);
        copies2.set(name, { source, rendered });
        if (rendered !== value) element.setAttribute(name, rendered);
      }
    }
    function applyTree(node) {
      if (node.nodeType === 3) {
        applyText(node);
        return;
      }
      if (node.nodeType !== 1 || skip(node)) return;
      applyAttributes(node);
      for (const child of node.childNodes) applyTree(child);
    }
    function onMutations(records) {
      if (disposed) return;
      for (const record of records) {
        if (record.type === "characterData") applyText(record.target);
        else if (record.type === "attributes") applyAttributes(record.target);
        else for (const node of record.addedNodes) applyTree(node);
      }
    }
    function registerRoot(root) {
      if (observers.has(root)) return;
      applyTree(root);
      const observer = ports.createObserver(onMutations);
      observer.observe(root, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: [...attributes]
      });
      observers.set(root, observer);
    }
    function discoverRoots() {
      for (const [root, observer] of observers) {
        if (!root.isConnected) {
          observer.disconnect();
          observers.delete(root);
        }
      }
      for (const root of document2.querySelectorAll(rootsSelector)) registerRoot(root);
    }
    function setLanguage(value, { save = true } = {}) {
      if (disposed) return;
      language = normalizeLanguage(value);
      if (save) {
        try {
          ports.storage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch (_) {
        }
      }
      document2.documentElement.lang = language;
      if (select) select.value = language;
      discoverRoots();
      for (const [root, observer] of observers) {
        onMutations(observer.takeRecords());
        applyTree(root);
      }
    }
    function readSavedLanguage() {
      try {
        return normalizeLanguage(ports.storage.getItem(LANGUAGE_STORAGE_KEY));
      } catch (_) {
        return DEFAULT_LANGUAGE;
      }
    }
    function onChange() {
      if (select) setLanguage(select.value);
    }
    function init() {
      if (initialized || disposed) return;
      initialized = true;
      select = document2.querySelector("#select-language");
      select?.addEventListener("change", onChange);
      setLanguage(readSavedLanguage(), { save: false });
      bodyObserver = ports.createObserver(() => {
        if (!disposed) discoverRoots();
      });
      bodyObserver.observe(document2.body, { childList: true });
    }
    function restoreSavedLanguage() {
      setLanguage(readSavedLanguage(), { save: false });
    }
    function dispose() {
      if (disposed) return;
      disposed = true;
      select?.removeEventListener("change", onChange);
      select = null;
      bodyObserver?.disconnect();
      bodyObserver = null;
      for (const observer of observers.values()) observer.disconnect();
      observers.clear();
    }
    return { init, dispose, translate, setLanguage, restoreSavedLanguage, getLanguage: () => language };
  }

  // src/app/hand-assignment-controller.ts
  var PianoTrainerHandAssignment;
  ((PianoTrainerHandAssignment2) => {
    function create(ports) {
      function commit(left, right, refreshCurrentFrame) {
        if (right == null) return;
        const state = ports.state;
        state.hands.left = left;
        state.hands.right = right;
        state.ledPreviewTimelineDirty = true;
        state.lastLedPreviewEvents = [];
        const frame = refreshCurrentFrame ? ports.captureCurrentFrame() : null;
        if (!frame) {
          ports.renderKeyboard();
          return;
        }
        if (frame.hasEntries && frame.measureIndex != null) {
          frame.buildExpected();
          frame.renderKeyboard();
        } else {
          state.expectedNotes = [];
          state.visualNotesToStart = [];
          state.outOfRangeCurrentNotes = [];
          ports.renderKeyboard();
        }
      }
      return { commit };
    }
    PianoTrainerHandAssignment2.create = create;
  })(PianoTrainerHandAssignment || (PianoTrainerHandAssignment = {}));

  // src/domain/keyboard-state.ts
  var PianoTrainerKeyboardState;
  ((PianoTrainerKeyboardState2) => {
    function priority(state) {
      if (!state) return 0;
      if (state === "expected-l" || state === "expected-r") return 5;
      if (state === "future1-l" || state === "future1-r" || state === "future2-l" || state === "future2-r") return 4;
      if (state === "pressed-l" || state === "pressed-r") return 2;
      if (state === "wrong" || state === "active") return 1;
      return 0;
    }
    PianoTrainerKeyboardState2.priority = priority;
    function choose(current, candidate) {
      return priority(candidate) > priority(current) ? candidate : current;
    }
    PianoTrainerKeyboardState2.choose = choose;
    function applyPreview(base, events) {
      const states = new Map(base);
      (events || []).forEach((event) => {
        event.notes.forEach((note) => {
          const current = states.get(note.midi) || null;
          const next = choose(current, note.state);
          if (next && next !== current) states.set(note.midi, next);
        });
      });
      return states;
    }
    PianoTrainerKeyboardState2.applyPreview = applyPreview;
  })(PianoTrainerKeyboardState || (PianoTrainerKeyboardState = {}));

  // src/app/keyboard-controller.ts
  var PianoTrainerKeyboardController;
  ((PianoTrainerKeyboardController2) => {
    function create(ports) {
      const state = ports.state;
      function render(frame = null, currentTimestamp = null) {
        const desiredStates = /* @__PURE__ */ new Map();
        const previewStateMap = /* @__PURE__ */ new Map();
        if (state.ledCalibrationMode) {
          if (state.ledCalibrationSelectedMidi != null && ports.isMidiInRange(state.ledCalibrationSelectedMidi)) {
            desiredStates.set(state.ledCalibrationSelectedMidi, "calibration");
          }
          ports.led.render(desiredStates);
          for (let i = 21; i <= 108; i++) {
            const desiredClass = state.ledCalibrationSelectedMidi === i ? "active" : null;
            ports.drawKey(i, desiredClass, true);
          }
          return;
        }
        ports.sustains.pruneAtTimestamp(currentTimestamp);
        state.sustainedVisuals.forEach((n) => {
          if (!ports.isMidiInRange(n.midi)) return;
          const handRole = ports.getHandRole(n.staffId);
          desiredStates.set(n.midi, handRole === "left" ? "expected-l" : "expected-r");
        });
        state.visualNotesToStart.forEach((n) => {
          if (!ports.isMidiInRange(n.midi)) return;
          const handRole = ports.getHandRole(n.staffId);
          desiredStates.set(n.midi, handRole === "left" ? "expected-l" : "expected-r");
        });
        const previewDepth = state.futurePreviewEnabled ? 1 : 0;
        let previewEvents = previewDepth > 0 ? state.lastLedPreviewEvents || [] : [];
        if (frame) {
          previewEvents = frame.collectPreview(previewDepth);
          state.lastLedPreviewEvents = previewEvents;
        }
        (previewEvents || []).forEach((event) => {
          event.notes.forEach((note) => {
            const currentState = previewStateMap.get(note.midi) || null;
            const nextState = PianoTrainerKeyboardState.choose(currentState, note.state);
            if (nextState && nextState !== currentState) {
              previewStateMap.set(note.midi, nextState);
            }
          });
        });
        state.pressedKeys.forEach((midi) => {
          const previewState = previewStateMap.get(midi) || null;
          ports.sustains.markHeldPreview(midi, previewState);
          const currentState = desiredStates.get(midi) || null;
          const isCarryHeldIntoExpected = state.preExpectedHeldNotes.has(midi) && (currentState === "expected-l" || currentState === "expected-r");
          if (isCarryHeldIntoExpected) {
            desiredStates.set(midi, currentState);
          } else if (currentState === "expected-l" || currentState === "expected-r") {
            if (state.correctHighlightEnabled) {
              desiredStates.set(midi, currentState === "expected-l" ? "pressed-l" : "pressed-r");
            } else {
              desiredStates.set(midi, currentState);
            }
          } else if (previewState === "future1-l" || previewState === "future1-r") {
            desiredStates.set(midi, previewState);
          } else if (state.heldCorrectNotes.has(midi)) {
            const hasActiveSustainForMidi = state.sustainedVisuals.some((v) => v.midi === midi) || state.visualNotesToStart.some((v) => v.midi === midi) || state.expectedNotes.some((n) => n.midi === midi);
            if (hasActiveSustainForMidi) {
              if (state.correctHighlightEnabled) {
                const staffId = state.heldCorrectNotes.get(midi);
                desiredStates.set(midi, ports.getHandRole(staffId) === "left" ? "pressed-l" : "pressed-r");
              } else {
                desiredStates.delete(midi);
              }
            } else {
              desiredStates.delete(midi);
            }
          } else {
            desiredStates.set(midi, state.isPlaying ? "wrong" : "active");
          }
        });
        const displayStates = previewDepth > 0 ? PianoTrainerKeyboardState.applyPreview(desiredStates, previewEvents) : desiredStates;
        ports.led.render(displayStates, previewDepth);
        for (let i = 21; i <= 108; i++) {
          const desiredClass = displayStates.get(i) || null;
          ports.drawKey(i, desiredClass);
          const hardwareDesiredClass = desiredStates.get(i) || null;
          const currentHardwareClass = state.hardwareLEDState.get(i) || null;
          if (currentHardwareClass !== hardwareDesiredClass) {
            ports.led.updateHardware(i, hardwareDesiredClass, currentHardwareClass);
            if (hardwareDesiredClass) {
              state.hardwareLEDState.set(i, hardwareDesiredClass);
            } else {
              state.hardwareLEDState.delete(i);
            }
          }
        }
      }
      return { render };
    }
    PianoTrainerKeyboardController2.create = create;
  })(PianoTrainerKeyboardController || (PianoTrainerKeyboardController = {}));

  // src/app/score-seek-controller.ts
  var PianoTrainerScoreSeek;
  ((PianoTrainerScoreSeek2) => {
    function create(ports) {
      function seek(clientX, clientY) {
        if (!ports.hasGraphicSheet() || ports.state.isPlaying) return;
        if (ports.isAnyToolbarPanelOpen()) return;
        if (ports.seekPresentation?.(clientX, clientY)) return;
        const point = ports.clientPointToSvg(clientX, clientY);
        if (!point) return;
        let target = -1;
        for (let i = 0; i < ports.getMeasureCount(); i++) {
          const box = ports.getMeasureBox(i, 0);
          if (!box) continue;
          if (point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) {
            target = i;
            break;
          }
        }
        if (target !== -1) {
          const enabled = ports.isLoopEnabled();
          if (enabled && (target < ports.state.looper.min - 1 || target > ports.state.looper.max - 1)) return;
          ports.stopTransport();
          ports.resetCursor();
          while (!ports.isEndReached() && ports.getCurrentMeasureIndex() < target) ports.advance();
          ports.updateCursor();
          ports.scroll();
          ports.clearVisuals();
        }
      }
      return { seek };
    }
    PianoTrainerScoreSeek2.create = create;
  })(PianoTrainerScoreSeek || (PianoTrainerScoreSeek = {}));

  // src/app/score-ui-controller.ts
  var PianoTrainerScoreUiController;
  ((PianoTrainerScoreUiController2) => {
    function create(ports) {
      function initSongUI() {
        ports.rebuildStaffIdentity();
        ports.rebuildMeasureTimingCache();
        const total = ports.getMeasureCount();
        ports.resetLoopRange(total);
        if (ports.getFirstTempo()) ports.state.baseBpm = ports.getFirstTempo();
        else ports.state.baseBpm = 120;
        ports.updateTempo("percent", ports.state.speedPercent * 100);
        const staves = ports.getStaffCount();
        ports.resetHandAssignments(staves);
        ports.state.score.correct = 0;
        ports.state.score.wrong = 0;
        ports.updateScoreDisplay();
        ports.renderLooper();
      }
      return { initSongUI };
    }
    PianoTrainerScoreUiController2.create = create;
  })(PianoTrainerScoreUiController || (PianoTrainerScoreUiController = {}));

  // src/domain/version.ts
  var PianoTrainerVersion;
  ((PianoTrainerVersion2) => {
    function compareSemverLoose(a, b) {
      const parse = (value) => String(value || "").trim().replace(/^[^\d]*/, "").split(/[\.-]/).map((part) => {
        const n = Number(part);
        return Number.isFinite(n) ? n : 0;
      });
      const aa = parse(a);
      const bb = parse(b);
      const len = Math.max(aa.length, bb.length, 3);
      for (let i = 0; i < len; i++) {
        const av = aa[i] || 0;
        const bv = bb[i] || 0;
        if (av > bv)
          return 1;
        if (av < bv)
          return -1;
      }
      return 0;
    }
    PianoTrainerVersion2.compareSemverLoose = compareSemverLoose;
  })(PianoTrainerVersion || (PianoTrainerVersion = {}));

  // src/app/update-controller.ts
  var PianoTrainerUpdateController;
  ((PianoTrainerUpdateController2) => {
    function create(ports) {
      const state = ports.state, pending = /* @__PURE__ */ new Set();
      let generation = 0;
      function isLocalAppRuntime() {
        const host = String(ports.location.hostname || "").toLowerCase();
        return ports.location.protocol === "file:" || host === "localhost" || host === "127.0.0.1";
      }
      function getUpdateActionUrl() {
        const downloadUrl = String(state.updateInfo?.downloadUrl || "").trim();
        const releaseUrl = String(state.updateInfo?.releaseUrl || "").trim();
        return downloadUrl || releaseUrl || ports.releaseUrl || "";
      }
      function getRequestedAssetVersion() {
        try {
          const url = new URL(ports.location.href);
          return String(url.searchParams.get("appv") || "").trim();
        } catch (_) {
          return "";
        }
      }
      function setAssetVersionOverride(version) {
        const normalized = String(version || "").trim();
        if (!normalized) {
          ports.storage.removeItem(ports.keys.assetOverride);
          return;
        }
        ports.storage.setItem(ports.keys.assetOverride, normalized);
      }
      function clearAssetVersionOverrideIfCurrent() {
        const requested = getRequestedAssetVersion();
        const stored = String(ports.storage.getItem(ports.keys.assetOverride) || "").trim();
        if (requested && PianoTrainerVersion.compareSemverLoose(ports.version, requested) >= 0) {
          ports.storage.removeItem(ports.keys.assetOverride);
          try {
            const url = new URL(ports.location.href);
            url.searchParams.delete("appv");
            url.searchParams.delete("t");
            ports.replaceHistory(url.pathname + url.search + url.hash);
          } catch (_) {
          }
          return;
        }
        if (stored && PianoTrainerVersion.compareSemverLoose(ports.version, stored) >= 0) {
          ports.storage.removeItem(ports.keys.assetOverride);
        }
      }
      function forceReloadToVersion(version) {
        const normalized = String(version || "").trim();
        if (!normalized) {
          ports.location.reload();
          return;
        }
        setAssetVersionOverride(normalized);
        try {
          const url = new URL(ports.location.href);
          url.searchParams.set("appv", normalized);
          url.searchParams.set("t", String(ports.nowMs()));
          ports.location.replace(url.toString());
        } catch (_) {
          ports.location.reload();
        }
      }
      async function checkForUpdates({ manual = false } = {}) {
        const token = generation;
        ports.setChecking();
        if (!state.updateManifestUrl) {
          state.updateLastCheckedAt = ports.nowMs();
          state.updateInfo = null;
          state.updateStatus = "Update checks are not configured yet.";
          ports.syncControls();
          return;
        }
        const controller = ports.createAbortController();
        pending.add(controller);
        try {
          const response = await ports.fetch(`${state.updateManifestUrl}${state.updateManifestUrl.includes("?") ? "&" : "?"}t=${ports.nowMs()}`, {
            cache: "no-store",
            signal: controller.signal
          });
          if (token !== generation)
            return;
          if (!response.ok)
            throw new Error(`Manifest HTTP ${response.status}`);
          const rawManifest = await response.json();
          if (token !== generation)
            return;
          const manifest = typeof rawManifest === "object" && rawManifest !== null ? rawManifest : null;
          const remoteVersion = String(manifest?.version || "").trim();
          const releaseUrl = String(manifest?.releaseUrl || ports.releaseUrl || "").trim();
          const downloadUrl = String(manifest?.downloadUrl || "").trim();
          const updateAvailable = remoteVersion ? PianoTrainerVersion.compareSemverLoose(remoteVersion, ports.version) > 0 : false;
          state.updateInfo = {
            currentVersion: ports.version,
            remoteVersion,
            updateAvailable,
            releaseUrl,
            downloadUrl
          };
          state.updateLastCheckedAt = ports.nowMs();
          if (!remoteVersion) {
            state.updateStatus = "Update manifest is missing a version value.";
          } else if (updateAvailable) {
            state.updateStatus = `Update available: ${remoteVersion}.`;
            if (!manual && !isLocalAppRuntime()) {
              state.updateStatus = `Updating to ${remoteVersion}...`;
              ports.syncControls();
              forceReloadToVersion(remoteVersion);
              return;
            }
          } else {
            state.updateStatus = "Up to date.";
            clearAssetVersionOverrideIfCurrent();
          }
        } catch (err) {
          if (token !== generation)
            return;
          state.updateLastCheckedAt = ports.nowMs();
          state.updateInfo = null;
          state.updateStatus = manual ? `Update check failed: ${ports.getErrorMessage(err) || String(err)}` : "Update check unavailable.";
        } finally {
          pending.delete(controller);
          if (token === generation)
            ports.syncControls();
        }
      }
      function init() {
        state.updateManifestUrl = String(ports.storage.getItem(ports.keys.manifestUrl) || ports.manifestUrl || "").trim();
        state.updateStatus = "";
        clearAssetVersionOverrideIfCurrent();
      }
      function dispose() {
        generation++;
        for (const controller of pending)
          controller.abort();
        pending.clear();
      }
      return { init, dispose, checkForUpdates, isLocalAppRuntime, getUpdateActionUrl, forceReloadToVersion, clearAssetVersionOverrideIfCurrent };
    }
    PianoTrainerUpdateController2.create = create;
  })(PianoTrainerUpdateController || (PianoTrainerUpdateController = {}));

  // src/domain/velocity.ts
  var PianoTrainerVelocity;
  ((PianoTrainerVelocity2) => {
    function normalizeLiveVelocity(velocity) {
      const numericVelocity = Number(velocity);
      const clampedMidi = Math.max(1, Math.min(127, Number.isFinite(numericVelocity) ? numericVelocity : 100));
      return {
        midi: clampedMidi,
        gain: Math.max(0.05, Math.min(1, clampedMidi / 127))
      };
    }
    PianoTrainerVelocity2.normalizeLiveVelocity = normalizeLiveVelocity;
  })(PianoTrainerVelocity || (PianoTrainerVelocity = {}));

  // src/audio/audio-routing.ts
  var PianoTrainerAudioRouting;
  ((PianoTrainerAudioRouting2) => {
    function create(ports) {
      const state = ports.state;
      const releaseTimers = /* @__PURE__ */ new Set();
      let epoch = 0;
      function sourceRole(source) {
        if (source === "midi") return "instrument";
        if (source === "ui") return "virtual";
        return null;
      }
      function route(bucket, source) {
        const role = sourceRole(source);
        return role ? !!(bucket && bucket[role]) : false;
      }
      function monitoringVelocity(source, velocity = 100) {
        if (source !== "midi") return velocity;
        const boostPercent = Math.max(50, Math.min(200, Number(state.midiInBoost) || 100));
        return Math.max(1, Math.min(127, Math.round((Number(velocity) || 100) * (boostPercent / 100))));
      }
      function monitorNoteOn(midi, source, velocity = 100) {
        const liveVelocity = source === "midi" && state.inputVelocityEnabled ? velocity : 100;
        const localVelocity = monitoringVelocity(source, liveVelocity);
        if (route(state.audioEnabled, source)) {
          ports.audio.playLocalPianoNote(midi, localVelocity, null, {
            lowLatencyLive: source === "ui" ? true : !!state.liveLowLatencyMonitoringEnabled,
            retrigger: true
          });
        }
        if (route(state.midiOutEnabled, source)) {
          ports.midi.noteOn(midi, PianoTrainerVelocity.normalizeLiveVelocity(liveVelocity).midi);
        }
      }
      function monitorNoteOff(midi, source) {
        if (route(state.audioEnabled, source)) ports.audio.releaseLocalPianoNote(midi);
        if (route(state.midiOutEnabled, source)) ports.midi.noteOff(midi);
      }
      function schedulePlaybackForDestinations(midi, durationMs, velocity = 100, options = {}) {
        if (!Number.isFinite(midi) || midi < 0) return;
        if (durationMs <= 0) return;
        if (options.toLocalAudio) ports.audio.playScheduledPlaybackNote(midi, velocity, durationMs);
        if (options.toMidiOut && ports.midi.noteOn(midi, velocity)) {
          const currentEpoch = epoch;
          const id = ports.setTimer(() => {
            releaseTimers.delete(id);
            if (currentEpoch === epoch) ports.midi.noteOff(midi);
          }, durationMs);
          releaseTimers.add(id);
        }
      }
      function dispose() {
        epoch++;
        for (const id of releaseTimers) ports.clearTimer(id);
        releaseTimers.clear();
      }
      return { monitorNoteOn, monitorNoteOff, schedulePlaybackForDestinations, dispose };
    }
    PianoTrainerAudioRouting2.create = create;
  })(PianoTrainerAudioRouting || (PianoTrainerAudioRouting = {}));

  // src/audio/metronome-output.ts
  var PianoTrainerMetronomeOutput;
  ((PianoTrainerMetronomeOutput2) => {
    function create(ports) {
      let synth = null;
      function init() {
        if (synth) return;
        synth = new ports.tone.MembraneSynth({
          pitchDecay: 8e-3,
          octaves: 1.5,
          oscillator: { type: "sine" },
          envelope: { attack: 1e-3, decay: 0.1, sustain: 0, release: 0.01 }
        }).toDestination();
      }
      function play(note, duration, time, gain) {
        synth.triggerAttackRelease(note, duration, time, gain);
      }
      function setVolumeDecibels(value) {
        synth.volume.value = value;
      }
      function dispose() {
        synth?.dispose();
        synth = null;
      }
      return { init, play, setVolumeDecibels, dispose };
    }
    PianoTrainerMetronomeOutput2.create = create;
  })(PianoTrainerMetronomeOutput || (PianoTrainerMetronomeOutput = {}));

  // src/audio/metronome.ts
  var PianoTrainerMetronome;
  ((PianoTrainerMetronome2) => {
    function create(ports) {
      const state = ports.state;
      let lastTempoPulseAtMs = -Infinity;
      let tempoPulseTimeoutId = null, tempoPulseScheduleId = null;
      let scheduledMetronomeEventIds = [];
      let waitMetronomeTimeoutId = null;
      let waitMetronomeBeatCounter = 0, waitMetronomeNumerator = 4;
      let waitMetronomeNextClickAtSec = null;
      let waitMetronomeActiveMeasureIndex = -1;
      function getMetronomeClickSpec(isDownbeat) {
        if (isDownbeat && state.accentedDownbeatEnabled !== false) {
          return { note: "G6", velocity: 0.95 };
        }
        return { note: "C6", velocity: 0.7 };
      }
      function getMetronomeMidiClickSpec(isDownbeat) {
        if (isDownbeat && state.accentedDownbeatEnabled !== false) {
          return { note: 75, velocity: 118 };
        }
        return { note: 76, velocity: 92 };
      }
      function getMetronomeMidiVelocity(volumePercent, clickVelocity = 100) {
        const volumeScale = Math.max(0, Math.min(100, Number(volumePercent) || 0)) / 100;
        const baseVelocity = Math.max(1, Math.min(127, Math.round(Number(clickVelocity) || 100)));
        return Math.max(1, Math.min(127, Math.round(baseVelocity * volumeScale)));
      }
      function shouldUseMidiOutMetronome() {
        return !!state.metronomeMidiOutEnabled && !!ports.midi.isAvailable();
      }
      function sendMidiOutMetronomeClick(note, velocity = 100, durationMs = 80) {
        if (!ports.midi.isAvailable()) return false;
        return ports.midi.percussionClick(note, getMetronomeMidiVelocity(ports.getVolume(), velocity), durationMs);
      }
      function playMetronomeClick(isDownbeat, timeSec = null) {
        const pulseTime = Number.isFinite(timeSec) ? timeSec : null;
        if (shouldUseMidiOutMetronome()) {
          const clickSpec2 = getMetronomeMidiClickSpec(isDownbeat);
          const delayMs = pulseTime == null ? 0 : Math.max(0, (pulseTime - ports.clock.nowSeconds()) * 1e3 - 2);
          ports.clock.setTimer(() => {
            if (!ports.isEnabled()) return;
            sendMidiOutMetronomeClick(clickSpec2.note, clickSpec2.velocity);
          }, delayMs);
          triggerTempoVisualPulse(pulseTime);
          return;
        }
        const clickSpec = getMetronomeClickSpec(isDownbeat);
        ports.audio.play(clickSpec.note, "64n", pulseTime ?? ports.clock.nowSeconds(), clickSpec.velocity);
        triggerTempoVisualPulse(pulseTime);
      }
      function clearTempoVisualPulse() {
        const tempoButton = ports.getPulseTarget();
        if (tempoButton) tempoButton.hide();
        if (tempoPulseTimeoutId) {
          ports.clock.clearTimer(tempoPulseTimeoutId);
          tempoPulseTimeoutId = null;
        }
        if (tempoPulseScheduleId) {
          ports.clock.clearTimer(tempoPulseScheduleId);
          tempoPulseScheduleId = null;
        }
      }
      function triggerTempoVisualPulse(time = null) {
        if (!state.visualPulseEnabled) return;
        const tempoButton = ports.getPulseTarget();
        if (!tempoButton) return;
        const firePulse = () => {
          tempoPulseScheduleId = null;
          const now = ports.clock.monotonicMilliseconds();
          if (now - lastTempoPulseAtMs < 120) return;
          lastTempoPulseAtMs = now;
          tempoButton.restart();
          if (tempoPulseTimeoutId) ports.clock.clearTimer(tempoPulseTimeoutId);
          tempoPulseTimeoutId = ports.clock.setTimer(() => {
            tempoButton.hide();
            tempoPulseTimeoutId = null;
          }, 170);
        };
        if (typeof time === "number") {
          const delayMs = Math.max(0, (time - ports.clock.nowSeconds()) * 1e3 - 8);
          if (tempoPulseScheduleId) ports.clock.clearTimer(tempoPulseScheduleId);
          tempoPulseScheduleId = ports.clock.setTimer(firePulse, delayMs);
        } else {
          firePulse();
        }
      }
      function clearScheduledMetronomeEvents() {
        if (!scheduledMetronomeEventIds.length) return;
        scheduledMetronomeEventIds.forEach((id) => ports.clock.clearTimer(id));
        scheduledMetronomeEventIds = [];
      }
      function stopWaitModeMetronome() {
        if (waitMetronomeTimeoutId) {
          ports.clock.clearTimer(waitMetronomeTimeoutId);
          waitMetronomeTimeoutId = null;
        }
        waitMetronomeBeatCounter = 0;
        waitMetronomeNumerator = 4;
        waitMetronomeNextClickAtSec = null;
        waitMetronomeActiveMeasureIndex = -1;
      }
      function getMetronomeTimeSignatureNumerator(measureIndex) {
        const timing = ports.timing.getInfo(Math.max(0, Number(measureIndex) || 0));
        return Math.max(1, Number(timing?.numerator) || 4);
      }
      function scheduleNextWaitModeMetronomeTick(referenceTimeSec = null) {
        if (waitMetronomeTimeoutId) {
          ports.clock.clearTimer(waitMetronomeTimeoutId);
          waitMetronomeTimeoutId = null;
        }
        if (!state.isPlaying || state.countInActive || state.mode !== "wait") return;
        if (!ports.isEnabled()) return;
        const currentRunningBpm = Math.max(1, state.baseBpm * state.speedPercent);
        const beatDurationSec = 60 / currentRunningBpm;
        const nowSec = ports.clock.nowSeconds();
        const targetTimeSec = Number.isFinite(referenceTimeSec) ? Math.max(nowSec, referenceTimeSec) : Math.max(nowSec, waitMetronomeNextClickAtSec ?? nowSec);
        waitMetronomeNextClickAtSec = targetTimeSec;
        const delayMs = Math.max(0, (targetTimeSec - nowSec) * 1e3 - 8);
        waitMetronomeTimeoutId = ports.clock.setTimer(() => {
          waitMetronomeTimeoutId = null;
          if (!state.isPlaying || state.countInActive || state.mode !== "wait") return;
          if (!ports.isEnabled()) return;
          const isDownbeat = waitMetronomeBeatCounter === 0;
          playMetronomeClick(isDownbeat);
          waitMetronomeBeatCounter = (waitMetronomeBeatCounter + 1) % Math.max(1, waitMetronomeNumerator || 4);
          waitMetronomeNextClickAtSec = targetTimeSec + beatDurationSec;
          scheduleNextWaitModeMetronomeTick(waitMetronomeNextClickAtSec);
        }, delayMs);
      }
      function startWaitModeMetronome(measureIndex) {
        if (!state.isPlaying || state.countInActive || state.mode !== "wait") return;
        if (!ports.isEnabled()) {
          stopWaitModeMetronome();
          return;
        }
        waitMetronomeActiveMeasureIndex = Math.max(0, Number(measureIndex) || 0);
        waitMetronomeNumerator = getMetronomeTimeSignatureNumerator(waitMetronomeActiveMeasureIndex);
        waitMetronomeBeatCounter = 0;
        waitMetronomeNextClickAtSec = ports.clock.nowSeconds();
        scheduleNextWaitModeMetronomeTick(waitMetronomeNextClickAtSec);
      }
      function rebuildWaitModeMetronome(measureIndex = waitMetronomeActiveMeasureIndex) {
        stopWaitModeMetronome();
        if (!state.isPlaying || state.countInActive || state.mode !== "wait") return;
        startWaitModeMetronome(measureIndex);
      }
      function scheduleMetronomeForPlaybackWindow(startTimeSec, currentMeasureIdx, currentTimestamp, windowLengthSec, beatsToWait) {
        clearScheduledMetronomeEvents();
        if (!state.isPlaying || state.countInActive) {
          stopWaitModeMetronome();
          return;
        }
        if (!ports.isEnabled()) {
          stopWaitModeMetronome();
          return;
        }
        if (state.mode === "wait") {
          if (waitMetronomeTimeoutId == null && waitMetronomeNextClickAtSec == null) {
            startWaitModeMetronome(currentMeasureIdx);
          }
          return;
        }
        stopWaitModeMetronome();
        if (!Number.isFinite(startTimeSec) || !Number.isFinite(currentTimestamp) || !Number.isFinite(windowLengthSec) || windowLengthSec < 0) return;
        const endTimestamp = currentTimestamp + (Number.isFinite(beatsToWait) ? beatsToWait : 0) / 4;
        const epsilonWhole = 1e-7;
        let measureIndex = currentMeasureIdx;
        while (measureIndex < ports.timing.getCachedMeasureCount()) {
          const timing = ports.timing.getInfo(measureIndex);
          const measureStart = timing.startTimestamp;
          const measureEnd = measureStart + Math.max(timing.actualLengthWhole || 0, timing.nominalMeasureLengthWhole || 0);
          if (measureEnd <= currentTimestamp + epsilonWhole) {
            measureIndex += 1;
            continue;
          }
          if (measureStart >= endTimestamp - epsilonWhole) {
            break;
          }
          const localStart = Math.max(currentTimestamp, measureStart);
          const localEnd = Math.min(endTimestamp, measureEnd);
          const firstBeatIndex = Math.max(0, Math.ceil((localStart - measureStart) / timing.beatLengthWhole - epsilonWhole));
          const maxBeatIndex = timing.numerator - 1;
          for (let beatIndex = firstBeatIndex; beatIndex <= maxBeatIndex; beatIndex++) {
            const beatTimestamp = measureStart + beatIndex * timing.beatLengthWhole;
            if (beatTimestamp < localStart - epsilonWhole) continue;
            if (beatTimestamp >= localEnd - epsilonWhole) continue;
            const beatOffsetWhole = beatTimestamp - currentTimestamp;
            const beatOffsetSec = beatOffsetWhole * 4 * (windowLengthSec / Math.max(epsilonWhole, endTimestamp - currentTimestamp));
            const clickTimeSec = startTimeSec + Math.max(0, beatOffsetSec);
            const delayMs = Math.max(0, (clickTimeSec - ports.clock.nowSeconds()) * 1e3 - 8);
            const isDownbeat = beatIndex === 0;
            const timeoutId = ports.clock.setTimer(() => {
              if (!state.isPlaying || state.countInActive) return;
              if (!ports.isEnabled()) return;
              playMetronomeClick(isDownbeat, shouldUseMidiOutMetronome() ? null : ports.getLiveAudioTime());
            }, delayMs);
            scheduledMetronomeEventIds.push(timeoutId);
          }
          measureIndex += 1;
        }
      }
      function doCountInAndStart(callback) {
        const mIdx = ports.getCurrentMeasureIndex();
        const beats = ports.getCountInBeats(mIdx);
        const currentRunningBpm = state.baseBpm * state.speedPercent;
        const beatDurationSeconds = 60 / currentRunningBpm;
        let beatCount = 0;
        state.countInActive = true;
        function tick() {
          if (!state.isPlaying) {
            state.countInActive = false;
            return;
          }
          const isDownbeat = beatCount === 0;
          playMetronomeClick(isDownbeat);
          beatCount++;
          if (beatCount < beats) {
            ports.clock.setTimer(tick, beatDurationSeconds * 1e3);
          } else {
            ports.clock.setTimer(() => {
              if (!state.isPlaying) {
                state.countInActive = false;
                state.lastLedPreviewEvents = [];
                state.ledPreviewTraversalIndex = -1;
                return;
              }
              state.countInActive = false;
              callback();
            }, beatDurationSeconds * 1e3);
          }
        }
        tick();
      }
      function dispose() {
        clearScheduledMetronomeEvents();
        stopWaitModeMetronome();
        clearTempoVisualPulse();
        ports.clock.dispose();
      }
      return { getMetronomeClickSpec, getMetronomeMidiClickSpec, getMetronomeMidiVelocity, shouldUseMidiOutMetronome, playMetronomeClick, clearTempoVisualPulse, triggerTempoVisualPulse, clearScheduledMetronomeEvents, stopWaitModeMetronome, getMetronomeTimeSignatureNumerator, scheduleNextWaitModeMetronomeTick, startWaitModeMetronome, rebuildWaitModeMetronome, scheduleMetronomeForPlaybackWindow, doCountInAndStart, sendMidiOutMetronomeClick, dispose, getWaitMeasureIndex: () => waitMetronomeActiveMeasureIndex, readResources: () => ({ windowEvents: scheduledMetronomeEventIds.length, waitTimer: waitMetronomeTimeoutId, pulseTimer: tempoPulseTimeoutId, pulseSchedule: tempoPulseScheduleId }) };
    }
    PianoTrainerMetronome2.create = create;
  })(PianoTrainerMetronome || (PianoTrainerMetronome = {}));

  // src/audio/playback-clock.ts
  var PianoTrainerPlaybackClock;
  ((PianoTrainerPlaybackClock2) => {
    function create(ports) {
      const timers = /* @__PURE__ */ new Set(), frames = /* @__PURE__ */ new Set();
      let epoch = 0;
      function setTimer(callback, delayMs) {
        const generation = epoch;
        const id = ports.setTimer(() => {
          timers.delete(id);
          if (generation === epoch) callback();
        }, delayMs);
        timers.add(id);
        return id;
      }
      function clearTimer(id) {
        timers.delete(id);
        ports.clearTimer(id);
      }
      function requestFrame(callback) {
        const generation = epoch;
        const id = ports.requestFrame((time) => {
          frames.delete(id);
          if (generation === epoch) callback(time);
        });
        frames.add(id);
        return id;
      }
      function dispose() {
        epoch++;
        for (const id of timers) ports.clearTimer(id);
        for (const id of frames) ports.cancelFrame(id);
        timers.clear();
        frames.clear();
      }
      return {
        nowSeconds: ports.nowSeconds,
        monotonicMilliseconds: ports.monotonicMilliseconds,
        setTimer,
        clearTimer,
        requestFrame,
        dispose,
        readResources: () => ({ timers: timers.size, frames: frames.size })
      };
    }
    PianoTrainerPlaybackClock2.create = create;
  })(PianoTrainerPlaybackClock || (PianoTrainerPlaybackClock = {}));

  // src/audio/tone-adapter.ts
  var PianoTrainerAudioOutput;
  ((PianoTrainerAudioOutput2) => {
    const FOLLOW_ME_TONE_LATENCY_PROFILE = Object.freeze({ lookAhead: 5e-3, updateInterval: 5e-3, latencyHint: 1e-3 });
    function create(ports) {
      const Tone2 = ports.tone, state = ports.state;
      const normalizeLiveVelocity = PianoTrainerVelocity.normalizeLiveVelocity;
      let masterPianoVolume = null;
      let lowLatencyPlaybackSynth = null;
      let pianoSampler = null;
      let pianoSamplerReady = false;
      let pianoSamplerReadyPromise = null;
      let DEFAULT_TONE_LATENCY_PROFILE = null;
      let disposed = false, epoch = 0, pendingNoteEpoch = 0;
      const releaseTimers = /* @__PURE__ */ new Set();
      function init() {
        if (masterPianoVolume)
          return;
        disposed = false;
        DEFAULT_TONE_LATENCY_PROFILE = captureToneLatencyProfile();
        const PIANO_SAMPLE_EXTENSION = ports.sampleExtension();
        masterPianoVolume = new Tone2.Volume(0).toDestination();
        lowLatencyPlaybackSynth = new Tone2.PolySynth(Tone2.Synth, {
          maxPolyphony: 24,
          volume: -6,
          options: {
            oscillator: { type: "triangle" },
            envelope: {
              attack: 1e-3,
              decay: 0.08,
              sustain: 0.18,
              release: 0.12
            }
          }
        }).connect(masterPianoVolume);
        pianoSampler = new Tone2.Sampler({
          urls: {
            "A0": `A0.${PIANO_SAMPLE_EXTENSION}`,
            "C1": `C1.${PIANO_SAMPLE_EXTENSION}`,
            "D#1": `Ds1.${PIANO_SAMPLE_EXTENSION}`,
            "F#1": `Fs1.${PIANO_SAMPLE_EXTENSION}`,
            "A1": `A1.${PIANO_SAMPLE_EXTENSION}`,
            "C2": `C2.${PIANO_SAMPLE_EXTENSION}`,
            "D#2": `Ds2.${PIANO_SAMPLE_EXTENSION}`,
            "F#2": `Fs2.${PIANO_SAMPLE_EXTENSION}`,
            "A2": `A2.${PIANO_SAMPLE_EXTENSION}`,
            "C3": `C3.${PIANO_SAMPLE_EXTENSION}`,
            "D#3": `Ds3.${PIANO_SAMPLE_EXTENSION}`,
            "F#3": `Fs3.${PIANO_SAMPLE_EXTENSION}`,
            "A3": `A3.${PIANO_SAMPLE_EXTENSION}`,
            "C4": `C4.${PIANO_SAMPLE_EXTENSION}`,
            "D#4": `Ds4.${PIANO_SAMPLE_EXTENSION}`,
            "F#4": `Fs4.${PIANO_SAMPLE_EXTENSION}`,
            "A4": `A4.${PIANO_SAMPLE_EXTENSION}`,
            "C5": `C5.${PIANO_SAMPLE_EXTENSION}`,
            "D#5": `Ds5.${PIANO_SAMPLE_EXTENSION}`,
            "F#5": `Fs5.${PIANO_SAMPLE_EXTENSION}`,
            "A5": `A5.${PIANO_SAMPLE_EXTENSION}`,
            "C6": `C6.${PIANO_SAMPLE_EXTENSION}`,
            "D#6": `Ds6.${PIANO_SAMPLE_EXTENSION}`,
            "F#6": `Fs6.${PIANO_SAMPLE_EXTENSION}`,
            "A6": `A6.${PIANO_SAMPLE_EXTENSION}`,
            "C7": `C7.${PIANO_SAMPLE_EXTENSION}`,
            "D#7": `Ds7.${PIANO_SAMPLE_EXTENSION}`,
            "F#7": `Fs7.${PIANO_SAMPLE_EXTENSION}`,
            "A7": `A7.${PIANO_SAMPLE_EXTENSION}`,
            "C8": `C8.${PIANO_SAMPLE_EXTENSION}`
          },
          release: 1,
          baseUrl: "assets/audio/salamander/"
        }).connect(masterPianoVolume);
      }
      function scheduleRelease(callback, delayMs) {
        const currentEpoch = epoch;
        const currentNoteEpoch = pendingNoteEpoch;
        const id = ports.setTimer(() => {
          releaseTimers.delete(id);
          if (!disposed && currentEpoch === epoch && currentNoteEpoch === pendingNoteEpoch) callback();
        }, delayMs);
        releaseTimers.add(id);
      }
      function getToneContextHandle() {
        try {
          return typeof Tone2?.getContext === "function" ? Tone2.getContext() : Tone2?.context;
        } catch (_) {
          return null;
        }
      }
      function captureToneLatencyProfile() {
        const ctx = getToneContextHandle();
        return {
          lookAhead: Number.isFinite(Number(ctx?.lookAhead)) ? Number(ctx.lookAhead) : null,
          updateInterval: Number.isFinite(Number(ctx?.updateInterval)) ? Number(ctx.updateInterval) : null,
          latencyHint: ctx?.latencyHint ?? null
        };
      }
      function applyToneLatencyProfileForMode(mode = state.mode) {
        const ctx = getToneContextHandle();
        if (!ctx)
          return;
        const useFollowProfile = mode === "follow";
        const nextProfile = useFollowProfile ? FOLLOW_ME_TONE_LATENCY_PROFILE : DEFAULT_TONE_LATENCY_PROFILE;
        try {
          if (!nextProfile)
            return;
          if (nextProfile.lookAhead != null && "lookAhead" in ctx) {
            Reflect.set(ctx, "lookAhead", nextProfile.lookAhead);
          }
          if (nextProfile.updateInterval != null && "updateInterval" in ctx) {
            Reflect.set(ctx, "updateInterval", nextProfile.updateInterval);
          }
          if (nextProfile.latencyHint != null && "latencyHint" in ctx) {
            Reflect.set(ctx, "latencyHint", nextProfile.latencyHint);
          }
        } catch (err) {
          ports.warn("Could not apply Tone.js latency profile for mode.", err);
        }
      }
      function ensurePianoSamplerLoaded() {
        if (disposed)
          return Promise.resolve(false);
        init();
        if (pianoSamplerReady)
          return Promise.resolve(true);
        if (!pianoSamplerReadyPromise) {
          const currentEpoch = epoch;
          pianoSamplerReadyPromise = Promise.resolve(typeof Tone2.loaded === "function" ? Tone2.loaded() : null).then(() => {
            if (disposed || currentEpoch !== epoch)
              return false;
            pianoSamplerReady = true;
            return true;
          }).catch((err) => {
            ports.warn("Piano sampler assets did not finish loading.", err);
            throw err;
          });
        }
        return pianoSamplerReadyPromise;
      }
      function getSamplerNoteName(midi) {
        const value = Number(midi);
        if (!Number.isFinite(value))
          return null;
        try {
          return Tone2.Frequency(value, "midi").toNote();
        } catch (_) {
          return null;
        }
      }
      function shouldUseLowLatencyPlaybackPath() {
        if (!state.lowLatencyPlaybackEnabled)
          return false;
        return state.mode === "follow" || state.mode === "realtime";
      }
      function playLowLatencyPlaybackNote(midi, velocity = 100, durationMs = null) {
        if (disposed)
          return;
        init();
        const noteName = getSamplerNoteName(midi);
        if (!noteName)
          return;
        const normalized = normalizeLiveVelocity(velocity);
        const liveTime = getLiveAudioTime();
        if (Number.isFinite(durationMs) && durationMs > 0) {
          lowLatencyPlaybackSynth.triggerAttackRelease(noteName, Math.max(0.01, durationMs / 1e3), liveTime, normalized.gain);
          return;
        }
        lowLatencyPlaybackSynth.triggerRelease(noteName, liveTime);
        lowLatencyPlaybackSynth.triggerAttack(noteName, liveTime, normalized.gain);
      }
      function playScheduledPlaybackNote(midi, velocity = 100, durationMs = null) {
        if (shouldUseLowLatencyPlaybackPath()) {
          playLowLatencyPlaybackNote(midi, velocity, durationMs);
          return;
        }
        playLocalPianoNote(midi, velocity, durationMs);
      }
      async function ensureLiveAudioReady() {
        const currentEpoch = epoch;
        try {
          await ensurePianoSamplerLoaded().catch(() => false);
          if (disposed || currentEpoch !== epoch) return;
          if (Tone2.context.state !== "running") {
            await Tone2.start();
            if (disposed || currentEpoch !== epoch) return;
            await Tone2.context.resume();
          }
        } catch (err) {
          ports.warn("Could not resume Tone.js audio context from user gesture.", err);
        }
      }
      function getLiveAudioTime() {
        if (typeof Tone2?.immediate === "function")
          return Tone2.immediate();
        return Tone2.now();
      }
      function playLocalPianoNote(midi, velocity = 100, durationMs = null, options = {}) {
        if (disposed)
          return;
        init();
        if (!Number.isFinite(midi) || midi < 0)
          return;
        const noteName = getSamplerNoteName(midi);
        if (!noteName)
          return;
        if (!pianoSamplerReady) {
          const currentEpoch = epoch;
          const currentNoteEpoch = pendingNoteEpoch;
          ensurePianoSamplerLoaded().then(() => {
            if (disposed || epoch !== currentEpoch || pendingNoteEpoch !== currentNoteEpoch)
              return;
            if (!state.audioEnabled?.virtual && !state.audioEnabled?.instrument && !state.audioEnabled?.left && !state.audioEnabled?.right && !state.audioEnabled?.other)
              return;
            playLocalPianoNote(midi, velocity, durationMs, options);
          }).catch(() => {
          });
          return;
        }
        const normalized = normalizeLiveVelocity(velocity);
        const liveTime = getLiveAudioTime();
        if (options.lowLatencyLive || options.retrigger !== false) {
          pianoSampler.triggerRelease(noteName, liveTime);
        }
        pianoSampler.triggerAttack(noteName, liveTime, normalized.gain);
        if (Number.isFinite(durationMs) && durationMs > 0) {
          scheduleRelease(() => pianoSampler.triggerRelease(noteName, getLiveAudioTime()), durationMs);
        }
      }
      function releaseLocalPianoNote(midi) {
        const noteName = getSamplerNoteName(midi);
        if (noteName)
          pianoSampler?.triggerRelease(noteName, getLiveAudioTime());
      }
      function silence() {
        try {
          pianoSampler?.releaseAll?.();
          lowLatencyPlaybackSynth?.releaseAll?.();
        } catch (error) {
          ports.warn("Could not release Tone.js playback voices immediately.", error);
        }
      }
      function releaseLowLatencyPlayback() {
        try {
          lowLatencyPlaybackSynth?.releaseAll?.();
        } catch (_) {
        }
      }
      function setPianoVolume(percent) {
        if (!masterPianoVolume)
          return;
        if (percent === 0)
          masterPianoVolume.volume.value = -Infinity;
        else
          masterPianoVolume.volume.value = 20 * Math.log10(percent / 100);
      }
      function resumeWithoutWaiting() {
        if (Tone2.context.state !== "running") Tone2.context.resume();
      }
      function suspend() {
        pendingNoteEpoch++;
        for (const id of releaseTimers) ports.clearTimer(id);
        releaseTimers.clear();
        silence();
      }
      function dispose() {
        disposed = true;
        epoch++;
        for (const id of releaseTimers)
          ports.clearTimer(id);
        releaseTimers.clear();
        silence();
        pianoSampler?.dispose();
        lowLatencyPlaybackSynth?.dispose();
        masterPianoVolume?.dispose();
        pianoSampler = null;
        lowLatencyPlaybackSynth = null;
        masterPianoVolume = null;
        pianoSamplerReady = false;
        pianoSamplerReadyPromise = null;
      }
      return {
        init,
        suspend,
        dispose,
        ensurePianoSamplerLoaded,
        ensureLiveAudioReady,
        applyToneLatencyProfileForMode,
        getLiveAudioTime,
        getSamplerNoteName,
        playLocalPianoNote,
        playLowLatencyPlaybackNote,
        playScheduledPlaybackNote,
        shouldUseLowLatencyPlaybackPath,
        releaseLocalPianoNote,
        silence,
        releaseLowLatencyPlayback,
        setPianoVolume,
        resumeWithoutWaiting,
        isReady: () => pianoSamplerReady
      };
    }
    PianoTrainerAudioOutput2.create = create;
  })(PianoTrainerAudioOutput || (PianoTrainerAudioOutput = {}));

  // src/audio/tone-transport.ts
  var PianoTrainerToneTransport;
  ((PianoTrainerToneTransport2) => {
    function create(tone) {
      return {
        stop: () => {
          tone.Transport.stop();
        },
        pause: () => {
          tone.Transport.pause();
        },
        start: () => {
          tone.Transport.start();
        },
        setBpm: (value) => {
          tone.Transport.bpm.value = value;
        }
      };
    }
    PianoTrainerToneTransport2.create = create;
  })(PianoTrainerToneTransport || (PianoTrainerToneTransport = {}));

  // src/domain/hand-routing.ts
  var PianoTrainerHandRouting;
  ((PianoTrainerHandRouting2) => {
    function defaultAssignment(stavesCount) {
      return { left: (stavesCount || 2) > 1 ? 2 : null, right: 1 };
    }
    PianoTrainerHandRouting2.defaultAssignment = defaultAssignment;
    function parseAssignment(value) {
      if (value === "" || value === "-" || value == null) return null;
      const parsed = Number.parseInt(String(value), 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    PianoTrainerHandRouting2.parseAssignment = parseAssignment;
    function formatAssignment(value) {
      const parsed = parseAssignment(value);
      return parsed == null ? "" : String(parsed);
    }
    PianoTrainerHandRouting2.formatAssignment = formatAssignment;
    function create(state) {
      function getAssignedHandRoleForStaff(staffId) {
        const sid = Number(staffId);
        if (!Number.isFinite(sid)) return null;
        if (sid === Number(state.hands.right)) return "right";
        if (sid === Number(state.hands.left)) return "left";
        return null;
      }
      function normalizeFollowModeSettings() {
        const follow = state.modeSettings.follow;
        const left = !!follow.practice.left, right = !!follow.practice.right;
        const useLeft = left && !right, useRight = !useLeft;
        follow.practice.left = useLeft;
        follow.practice.right = useRight;
        follow.playback.left = !useLeft;
        follow.playback.right = useLeft;
      }
      function getCurrentModeSettings() {
        const modeKey = state.mode === "wait" ? "wait" : state.mode === "follow" ? "follow" : "realtime";
        if (!state.modeSettings[modeKey]) {
          state.modeSettings[modeKey] = { practice: { left: true, right: true }, playback: { left: true, right: true } };
        }
        if (modeKey === "follow") normalizeFollowModeSettings();
        return state.modeSettings[modeKey];
      }
      function syncActiveHandStateFromMode() {
        const settings = getCurrentModeSettings();
        state.practice.left = !!settings.practice.left;
        state.practice.right = !!settings.practice.right;
        state.playback.left = !!settings.playback.left;
        state.playback.right = !!settings.playback.right;
      }
      function setFollowPracticeHand(hand) {
        const follow = state.modeSettings.follow, useLeft = hand === "left";
        follow.practice.left = useLeft;
        follow.practice.right = !useLeft;
        follow.playback.left = !useLeft;
        follow.playback.right = useLeft;
        if (state.mode === "follow") syncActiveHandStateFromMode();
      }
      function isPracticeHandEnabledForStaff(staffId) {
        const role = getAssignedHandRoleForStaff(staffId);
        return role === "right" && state.practice.right || role === "left" && state.practice.left;
      }
      return { getAssignedHandRoleForStaff, getCurrentModeSettings, syncActiveHandStateFromMode, setFollowPracticeHand, isPracticeHandEnabledForStaff };
    }
    PianoTrainerHandRouting2.create = create;
  })(PianoTrainerHandRouting || (PianoTrainerHandRouting = {}));

  // src/domain/playable-range.ts
  var FULL_PIANO_MIDI_MIN = 21;
  var FULL_PIANO_MIDI_MAX = 108;
  var FULL_PIANO_KEY_COUNT = 88;
  var PLAYER_PIANO_SIZES = [88, 76, 73, 61, 49, 37, 32, 25];
  function normalizePlayerPianoType(value) {
    const numericValue = Number(value);
    return PLAYER_PIANO_SIZES.includes(numericValue) ? numericValue : 88;
  }
  function derivePlayerRangeFromKeyboardSize(keyCount) {
    const normalizedKeyCount = normalizePlayerPianoType(keyCount);
    const keysTrimmed = FULL_PIANO_KEY_COUNT - normalizedKeyCount;
    const trimLow = Math.floor(keysTrimmed / 2);
    const trimHigh = keysTrimmed - trimLow;
    const minMidi = FULL_PIANO_MIDI_MIN + trimLow;
    const maxMidi = FULL_PIANO_MIDI_MAX - trimHigh;
    return {
      keyCount: normalizedKeyCount,
      minMidi,
      maxMidi,
      trimmedLowKeys: trimLow,
      trimmedHighKeys: trimHigh
    };
  }
  function isMidiInPlayableRange(midi, range) {
    return Number(midi) >= range.minMidi && Number(midi) <= range.maxMidi;
  }
  function getPlayableRangePosition01(midi, range) {
    const playableSpan = Math.max(1, range.maxMidi - range.minMidi);
    return (Number(midi) - range.minMidi) / playableSpan;
  }

  // src/domain/preference-values.ts
  var PianoTrainerPreferenceValues;
  ((PianoTrainerPreferenceValues2) => {
    function normalizeLedCount(value) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue))
        return 88;
      return Math.max(1, Math.min(500, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues2.normalizeLedCount = normalizeLedCount;
    function normalizeLedMasterBrightness(value) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue))
        return 70;
      return Math.max(1, Math.min(100, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues2.normalizeLedMasterBrightness = normalizeLedMasterBrightness;
    function normalizeLedFuturePct(value, fallback) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue))
        return fallback;
      return Math.max(0, Math.min(100, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues2.normalizeLedFuturePct = normalizeLedFuturePct;
    function normalizeMidiChannel(value, fallback = 1) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue))
        return fallback;
      return Math.max(1, Math.min(16, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues2.normalizeMidiChannel = normalizeMidiChannel;
    function normalizeMidiInputChannel(value, fallback = 0) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue))
        return fallback;
      if (numericValue <= 0)
        return 0;
      return Math.max(1, Math.min(16, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues2.normalizeMidiInputChannel = normalizeMidiInputChannel;
  })(PianoTrainerPreferenceValues || (PianoTrainerPreferenceValues = {}));

  // src/domain/timing.ts
  var PianoTrainerTiming;
  ((PianoTrainerTiming2) => {
    function getRemainingMeasureWaitWhole(options = {}) {
      const {
        currentMeasureIdx,
        currentTimestamp,
        fallbackLength = 1,
        getMeasureTimingInfo
      } = options;
      const fallbackWhole = Number.isFinite(fallbackLength) && fallbackLength > 0 ? fallbackLength : 0.25;
      const timing = typeof getMeasureTimingInfo === "function" ? getMeasureTimingInfo(currentMeasureIdx) : null;
      const measureStart = Number.isFinite(timing?.startTimestamp) ? timing.startTimestamp : null;
      const measureLength = Number.isFinite(timing?.actualLengthWhole) && timing.actualLengthWhole > 0 ? timing.actualLengthWhole : Number.isFinite(timing?.nominalMeasureLengthWhole) && timing.nominalMeasureLengthWhole > 0 ? timing.nominalMeasureLengthWhole : null;
      if (!Number.isFinite(currentTimestamp) || measureStart == null || measureLength == null) {
        return fallbackWhole;
      }
      const measureEnd = measureStart + measureLength;
      const remainingWhole = measureEnd - currentTimestamp;
      if (!Number.isFinite(remainingWhole) || remainingWhole <= 1e-6) {
        return fallbackWhole;
      }
      return Math.max(1e-6, remainingWhole);
    }
    PianoTrainerTiming2.getRemainingMeasureWaitWhole = getRemainingMeasureWaitWhole;
    function getTraversalBeatsToWait(options = {}) {
      const {
        currentMeasureIdx,
        currentTimestamp,
        nextMeasureIdx,
        nextTimestamp,
        fallbackLength = 1,
        getMeasureTimingInfo
      } = options;
      const remainingMeasureWhole = getRemainingMeasureWaitWhole({
        currentMeasureIdx,
        currentTimestamp,
        fallbackLength,
        getMeasureTimingInfo
      });
      if (nextTimestamp < currentTimestamp) {
        return remainingMeasureWhole * 4;
      }
      if (nextMeasureIdx > currentMeasureIdx + 1) {
        return remainingMeasureWhole * 4;
      }
      return (nextTimestamp - currentTimestamp) * 4;
    }
    PianoTrainerTiming2.getTraversalBeatsToWait = getTraversalBeatsToWait;
  })(PianoTrainerTiming || (PianoTrainerTiming = {}));

  // src/midi/midi-input.ts
  var PianoTrainerMidiInput;
  ((PianoTrainerMidiInput2) => {
    function decode(data, selectedChannel, receivedAtMs) {
      if (!data) return null;
      const status = data[0];
      const note = data[1];
      const velocity = data.length > 2 ? data[2] : 0;
      const messageChannel = ((status ?? 0) & 15) + 1;
      if (selectedChannel > 0 && messageChannel !== selectedChannel) return null;
      const command = (status ?? 0) & 240;
      if (command !== 144 && command !== 128) return null;
      if (status === void 0 || note === void 0 || velocity === void 0 || !Number.isInteger(status) || status < 0 || status > 255 || !Number.isInteger(note) || note < 0 || note > 127 || !Number.isInteger(velocity) || velocity < 0 || velocity > 127) return null;
      return {
        kind: command === 144 && velocity > 0 ? "note-on" : "note-off",
        note,
        velocity,
        source: "midi",
        // The mask above proves 1..16; configuration's Any=0 is not a channel.
        channel: messageChannel,
        receivedAtMs
      };
    }
    PianoTrainerMidiInput2.decode = decode;
    function createEchoFilter(state, nowMs) {
      function remember(status, note, velocity) {
        const now = nowMs();
        state.recentMidiEchoes.push({ status, note, velocity, time: now });
        if (state.recentMidiEchoes.length > 256) {
          state.recentMidiEchoes = state.recentMidiEchoes.slice(-128);
        }
      }
      function isRecent(status, note, velocity) {
        const now = nowMs();
        state.recentMidiEchoes = state.recentMidiEchoes.filter((m) => now - m.time < 120);
        return state.recentMidiEchoes.some((m) => m.status === status && m.note === note && m.velocity === velocity && now - m.time < 120);
      }
      return { remember, isRecent };
    }
    PianoTrainerMidiInput2.createEchoFilter = createEchoFilter;
  })(PianoTrainerMidiInput || (PianoTrainerMidiInput = {}));

  // src/midi/midi-output.ts
  var PianoTrainerMidiOutput;
  ((PianoTrainerMidiOutput2) => {
    function expressionValue(value) {
      const percent = Math.max(0, Math.min(100, Number(value) || 0));
      return Math.max(0, Math.min(127, Math.round(percent / 100 * 127)));
    }
    PianoTrainerMidiOutput2.expressionValue = expressionValue;
    function create(ports) {
      const timers = /* @__PURE__ */ new Set();
      let percussionEpoch = 0;
      const status = (base) => base + (ports.normalizeChannel(ports.getChannel() || 1) - 1);
      function noteOn(midi, velocity = 100) {
        const output = ports.getOutput();
        if (!output) return false;
        const messageStatus = status(144);
        const finalVelocity = ports.normalizeVelocity(velocity);
        ports.remember(messageStatus, midi, finalVelocity);
        output.send([messageStatus, midi, finalVelocity]);
        return true;
      }
      function noteOff(midi) {
        const output = ports.getOutput();
        if (!output) return false;
        const messageStatus = status(128);
        ports.remember(messageStatus, midi, 0);
        output.send([messageStatus, midi, 0]);
        return true;
      }
      function expression(value = ports.getVolume()) {
        const output = ports.getOutput();
        if (!output) return false;
        output.send([status(176), 11, expressionValue(value)]);
        return true;
      }
      function scheduleNote(midi, durationMs, velocity = 100) {
        if (!noteOn(midi, velocity)) return;
        const id = ports.setTimer(() => {
          timers.delete(id);
          noteOff(midi);
        }, Math.max(0, Number(durationMs) || 0));
        timers.add(id);
      }
      function silence() {
        const output = ports.getOutput();
        if (!output) return;
        const controlStatus = status(176);
        output.send([controlStatus, 64, 0]);
        output.send([controlStatus, 123, 0]);
        output.send([controlStatus, 120, 0]);
      }
      function percussionClick(note, velocity, durationMs = 80) {
        const output = ports.getOutput();
        if (!output) return false;
        const generation = percussionEpoch;
        const noteNumber = Math.max(0, Math.min(127, Math.round(Number(note) || 0)));
        const onStatus = 144 + (ports.normalizeChannel(10) - 1);
        const offStatus = 128 + (ports.normalizeChannel(10) - 1);
        ports.remember(onStatus, noteNumber, velocity);
        output.send([onStatus, noteNumber, velocity]);
        const id = ports.setTimer(() => {
          timers.delete(id);
          if (generation !== percussionEpoch) return;
          ports.remember(offStatus, noteNumber, 0);
          output.send([offStatus, noteNumber, 0]);
        }, Math.max(20, Number(durationMs) || 80));
        timers.add(id);
        return true;
      }
      function dispose() {
        percussionEpoch++;
        for (const id of timers) ports.clearTimer(id);
        timers.clear();
      }
      return { noteOn, noteOff, expression, scheduleNote, percussionClick, silence, dispose, status, getOutput: ports.getOutput };
    }
    PianoTrainerMidiOutput2.create = create;
  })(PianoTrainerMidiOutput || (PianoTrainerMidiOutput = {}));

  // src/midi/midi-service.ts
  var PianoTrainerMidiService;
  ((PianoTrainerMidiService2) => {
    function create(ports) {
      let access = null;
      let activeInput = null;
      let activeCallback = null;
      let pending = null;
      let epoch = 0;
      function detachInput() {
        if (activeInput && activeInput.onmidimessage === activeCallback) activeInput.onmidimessage = null;
        activeInput = null;
        activeCallback = null;
      }
      function selectInput(id) {
        detachInput();
        if (id === "none") return;
        const input = access?.inputs.get(id);
        if (!input) return;
        activeInput = input;
        activeCallback = (event) => {
          const data = event.data;
          if (!data) return;
          const status = data[0];
          const note = data[1];
          const velocity = data.length > 2 ? data[2] : 0;
          if (ports.isEcho(status, note, velocity)) return;
          const decoded = PianoTrainerMidiInput.decode(data, ports.selectedInputChannel(), ports.nowMs());
          if (decoded) ports.dispatch(decoded);
        };
        input.onmidimessage = activeCallback;
      }
      function isInputBound(id) {
        return !!activeInput && activeInput.id === id && activeInput === access?.inputs.get(id) && activeInput.onmidimessage === activeCallback;
      }
      const onStateChange = () => {
        ports.onDevicesChanged();
        if (activeInput && !isInputBound(activeInput.id)) selectInput(activeInput.id);
      };
      function init() {
        if (pending) return pending;
        if (access || !ports.requestAccess) return Promise.resolve();
        const currentEpoch = epoch;
        const requestAccess = ports.requestAccess;
        const work = (async () => {
          try {
            const nextAccess = await requestAccess();
            if (epoch !== currentEpoch) return;
            access = nextAccess;
            ports.onReady();
            if (epoch === currentEpoch && access === nextAccess) nextAccess.onstatechange = onStateChange;
          } catch (error) {
            if (epoch === currentEpoch) ports.onAccessError(error);
          }
        })();
        const tracked = work.finally(() => {
          if (pending === tracked) pending = null;
        });
        pending = tracked;
        return tracked;
      }
      function dispose() {
        epoch++;
        detachInput();
        if (access?.onstatechange === onStateChange) access.onstatechange = null;
        access = null;
        pending = null;
      }
      function getPort(direction, id) {
        return direction === "input" ? access?.inputs.get(id) : access?.outputs.get(id);
      }
      function getOutput(id) {
        return access?.outputs.get(id);
      }
      function listInputs() {
        return access ? Array.from(access.inputs.values()) : [];
      }
      function listOutputs() {
        return access ? Array.from(access.outputs.values()) : [];
      }
      const isReady = () => access !== null;
      return { init, dispose, selectInput, isInputBound, getPort, getOutput, listInputs, listOutputs, isReady };
    }
    PianoTrainerMidiService2.create = create;
  })(PianoTrainerMidiService || (PianoTrainerMidiService = {}));

  // src/optional/led/legacy-led-adapter.ts
  var PianoTrainerOptionalLed;
  ((PianoTrainerOptionalLed2) => {
    function createNoop() {
      const noop = () => {
      };
      return {
        enabled: false,
        initControls: noop,
        initOutput: noop,
        refreshMapping: noop,
        invalidate: noop,
        positionCalibrationPanel: noop,
        render: noop,
        renderOutputs: noop,
        updateHardware: noop,
        wipeHardware: noop,
        clearOutputs: async () => {
        },
        start: noop,
        dispose: noop
      };
    }
    PianoTrainerOptionalLed2.createNoop = createNoop;
    function createLegacy(ports) {
      let rafId = null;
      let running = false;
      let active = true;
      let generation = 0;
      function tick(token) {
        if (!running || token !== generation) return;
        if (ports.isCalibrating()) ports.renderKeyboard();
        else ports.renderOutputs();
        rafId = ports.requestFrame(() => tick(token));
      }
      return {
        enabled: true,
        initControls: () => {
          active = true;
          ports.initControls();
        },
        initOutput: () => {
          active = true;
          ports.initOutput();
        },
        refreshMapping: () => ports.refreshMapping(),
        invalidate: () => ports.invalidate(),
        positionCalibrationPanel: () => ports.positionCalibrationPanel(),
        render: (states, depth) => ports.render(states, depth),
        renderOutputs: () => ports.renderOutputs(),
        updateHardware: (midi, next, previous) => ports.updateHardware(midi, next, previous),
        wipeHardware: () => ports.wipeHardware(),
        clearOutputs: () => ports.clearOutputs(),
        start() {
          if (running) return;
          active = true;
          running = true;
          const token = generation;
          rafId = ports.requestFrame(() => tick(token));
        },
        dispose() {
          if (!active) return;
          active = false;
          generation += 1;
          running = false;
          if (rafId !== null) ports.cancelFrame(rafId);
          rafId = null;
          ports.stopHardwareResources();
        }
      };
    }
    PianoTrainerOptionalLed2.createLegacy = createLegacy;
  })(PianoTrainerOptionalLed || (PianoTrainerOptionalLed = {}));

  // src/optional/led/legacy-led-resources.ts
  var PianoTrainerLegacyLedResources;
  ((PianoTrainerLegacyLedResources2) => {
    function create(ports) {
      let active = true;
      let generation = 0;
      const listeners = [];
      const markers = [];
      const timers = /* @__PURE__ */ new Set(), intervals = /* @__PURE__ */ new Set(), frames = /* @__PURE__ */ new Set();
      const waits = /* @__PURE__ */ new Map();
      const readers = /* @__PURE__ */ new Set(), requests = /* @__PURE__ */ new Set();
      const urls = /* @__PURE__ */ new Set(), links = /* @__PURE__ */ new Set();
      const captures = /* @__PURE__ */ new Map();
      function isCurrent(token) {
        return active && token === generation;
      }
      function guard(callback) {
        const token = generation;
        return (...args) => isCurrent(token) ? callback(...args) : void 0;
      }
      function setTimer(callback, delayMs) {
        if (!active) return 0;
        const token = generation;
        const id = ports.setTimer(() => {
          timers.delete(id);
          if (isCurrent(token)) callback();
        }, delayMs);
        timers.add(id);
        return id;
      }
      function clearTimer(id) {
        if (timers.delete(id)) ports.clearTimer(id);
      }
      function wait(delayMs) {
        if (!active) return Promise.resolve(false);
        return new Promise((resolve) => {
          const id = setTimer(() => {
            waits.delete(id);
            resolve(true);
          }, delayMs);
          waits.set(id, resolve);
        });
      }
      function finishReader(reader) {
        readers.delete(reader);
        reader.onload = null;
        reader.onloadend = null;
      }
      return {
        get generation() {
          return generation;
        },
        get active() {
          return active;
        },
        isCurrent,
        guard,
        setTimer,
        clearTimer,
        wait,
        activate() {
          if (!active) active = true;
        },
        on(target, event, listener, options) {
          if (!active) return;
          const wrapped = guard((value) => {
            if (event === "lostpointercapture" && "pointerId" in value && typeof value.pointerId === "number") {
              const ids = captures.get(target);
              ids?.delete(value.pointerId);
              if (ids?.size === 0) captures.delete(target);
            }
            listener(value);
          });
          target.addEventListener(event, wrapped, options);
          listeners.push(() => target.removeEventListener(event, wrapped, options));
        },
        markDataset(element, key) {
          if (!active) return;
          element.dataset[key] = "true";
          markers.push(() => {
            if (element.dataset[key] === "true") delete element.dataset[key];
          });
        },
        setInterval(callback, delayMs) {
          if (!active) return 0;
          const id = ports.setInterval(guard(callback), delayMs);
          intervals.add(id);
          return id;
        },
        clearInterval(id) {
          if (intervals.delete(id)) ports.clearInterval(id);
        },
        requestFrame(callback) {
          if (!active) return 0;
          const token = generation;
          const id = ports.requestFrame((time) => {
            frames.delete(id);
            if (isCurrent(token)) callback(time);
          });
          frames.add(id);
          return id;
        },
        capture(element, pointerId) {
          element.setPointerCapture(pointerId);
          let ids = captures.get(element);
          if (!ids) captures.set(element, ids = /* @__PURE__ */ new Set());
          ids.add(pointerId);
        },
        createReader() {
          return ports.createReader();
        },
        readText(reader, file) {
          if (!active) return;
          readers.add(reader);
          reader.onloadend = () => finishReader(reader);
          try {
            reader.readAsText(file);
          } catch (error) {
            finishReader(reader);
            throw error;
          }
        },
        createRequest() {
          const controller = ports.createRequest();
          if (active) requests.add(controller);
          else controller.abort();
          return controller;
        },
        releaseRequest(controller) {
          requests.delete(controller);
        },
        createUrl(blob) {
          const url = ports.createUrl(blob);
          urls.add(url);
          return url;
        },
        revokeUrl(url) {
          ports.revokeUrl(url);
          urls.delete(url);
        },
        createLink() {
          const link = ports.createLink();
          links.add(link);
          return link;
        },
        removeLink(link) {
          link.remove();
          links.delete(link);
        },
        snapshot() {
          return {
            active,
            listeners: listeners.length,
            markers: markers.length,
            timers: timers.size,
            intervals: intervals.size,
            frames: frames.size,
            waits: waits.size,
            readers: readers.size,
            requests: requests.size,
            urls: urls.size,
            links: links.size,
            captures: [...captures.values()].reduce((sum, ids) => sum + ids.size, 0)
          };
        },
        dispose() {
          if (!active) return;
          active = false;
          generation += 1;
          for (const release of listeners.splice(0).reverse()) release();
          for (const release of markers.splice(0).reverse()) release();
          for (const id of timers) ports.clearTimer(id);
          timers.clear();
          for (const id of intervals) ports.clearInterval(id);
          intervals.clear();
          for (const id of frames) ports.cancelFrame(id);
          frames.clear();
          for (const resolve of waits.values()) resolve(false);
          waits.clear();
          for (const reader of readers) {
            reader.onload = null;
            reader.onloadend = null;
            if (reader.readyState === 1) reader.abort();
          }
          readers.clear();
          for (const controller of requests) controller.abort();
          requests.clear();
          for (const [element, ids] of captures) for (const id of ids) {
            try {
              if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
            } catch {
            }
          }
          captures.clear();
          for (const link of links) link.remove();
          links.clear();
          for (const url of urls) ports.revokeUrl(url);
          urls.clear();
        }
      };
    }
    PianoTrainerLegacyLedResources2.create = create;
  })(PianoTrainerLegacyLedResources || (PianoTrainerLegacyLedResources = {}));

  // src/practice/early-grace.ts
  var PianoTrainerEarlyGrace;
  ((PianoTrainerEarlyGrace2) => {
    function create(ports) {
      const state = ports.state;
      function getSinglePracticedHandRole() {
        const left = !!state.practice.left;
        const right = !!state.practice.right;
        if (left === right) return null;
        return left ? "left" : "right";
      }
      function getRenderableNotesForHandFromTimelineEvent(event, handRole) {
        if (!event?.notes?.length || !handRole) return [];
        return event.notes.filter((note) => ports.getHandRole(note.staffId) === handRole);
      }
      function findSingleHandPracticeTimelineWindow() {
        const handRole = getSinglePracticedHandRole();
        const ctx = state.currentExpectedContext;
        if (!handRole || !ctx) return null;
        const timeline = ports.getTimeline();
        if (!Array.isArray(timeline) || timeline.length === 0) return null;
        const exactIndex = ctx.traceStepIndex === void 0 ? -1 : timeline.findIndex((event) => event.traceStepIndex === ctx.traceStepIndex);
        const currentIndex = exactIndex >= 0 ? exactIndex : ports.findTimelineIndex(
          timeline,
          ctx.measureIndex,
          ctx.timestamp,
          ctx.signature,
          0
        );
        if (currentIndex < 0) return null;
        let referenceEvent = null;
        let referenceIndex = -1;
        for (let i = currentIndex; i >= 0; i--) {
          const notes = getRenderableNotesForHandFromTimelineEvent(timeline[i], handRole);
          if (notes.length > 0) {
            referenceEvent = {
              // Nonempty filtered notes prove this timeline entry exists.
              measureIndex: timeline[i].measureIndex,
              timestamp: timeline[i].timestamp,
              notes
            };
            referenceIndex = i;
            break;
          }
        }
        let nextEvent = null;
        let nextIndex = -1;
        for (let i = currentIndex + 1; i < timeline.length; i++) {
          const notes = getRenderableNotesForHandFromTimelineEvent(timeline[i], handRole);
          if (notes.length > 0) {
            nextEvent = {
              measureIndex: timeline[i].measureIndex,
              timestamp: timeline[i].timestamp,
              notes
            };
            nextIndex = i;
            break;
          }
        }
        return {
          handRole,
          timeline,
          currentIndex,
          referenceEvent,
          referenceIndex,
          nextEvent,
          nextIndex
        };
      }
      function findNextSingleHandPracticeTimelineEvent() {
        return findSingleHandPracticeTimelineWindow()?.nextEvent || null;
      }
      function getSingleHandPracticeBeatsUntilNextEvent(windowInfo) {
        const nextEvent = windowInfo?.nextEvent;
        if (!nextEvent) return Number.POSITIVE_INFINITY;
        const referenceEvent = windowInfo?.referenceEvent;
        if (!referenceEvent) {
          const ctx = state.currentExpectedContext;
          if (!ctx || !Number.isFinite(ctx.measureIndex) || !Number.isFinite(ctx.timestamp)) {
            return Number.POSITIVE_INFINITY;
          }
          return ports.getBeatsToWait({
            currentMeasureIdx: ctx.measureIndex,
            currentTimestamp: ctx.timestamp,
            nextMeasureIdx: nextEvent.measureIndex,
            nextTimestamp: nextEvent.timestamp,
            fallbackLength: 0.25,
            getMeasureTimingInfo: ports.getMeasureTimingInfo
          });
        }
        return ports.getBeatsToWait({
          currentMeasureIdx: referenceEvent.measureIndex,
          currentTimestamp: referenceEvent.timestamp,
          nextMeasureIdx: nextEvent.measureIndex,
          nextTimestamp: nextEvent.timestamp,
          fallbackLength: 0.25,
          getMeasureTimingInfo: ports.getMeasureTimingInfo
        });
      }
      function tryReserveSingleHandEarlyGrace(midi) {
        if (!state.isPlaying) return null;
        if (state.mode !== "follow" && state.mode !== "realtime") return null;
        if (!getSinglePracticedHandRole()) return null;
        if (state.expectedNotes.length > 0 && !state.expectedNotes.every((n) => n.hit)) return null;
        const practiceWindow = findSingleHandPracticeTimelineWindow();
        const nextEvent = practiceWindow?.nextEvent || null;
        if (!nextEvent) return null;
        const matched = nextEvent.notes.find((note) => note.midi === midi);
        if (!matched) return null;
        const beatsUntilTarget = getSingleHandPracticeBeatsUntilNextEvent(practiceWindow);
        const allowTapCarry = state.mode === "follow" ? true : Number.isFinite(beatsUntilTarget) && beatsUntilTarget <= 1.05;
        const reservation = {
          midi,
          staffId: matched.staffId,
          measureIndex: nextEvent.measureIndex,
          timestamp: nextEvent.timestamp,
          allowTapCarry,
          beatsUntilTarget: Number.isFinite(beatsUntilTarget) ? beatsUntilTarget : null
        };
        state.earlyGraceReservations.set(midi, reservation);
        state.heldCorrectNotes.set(midi, matched.staffId);
        state.preExpectedHeldNotes.add(midi);
        return reservation;
      }
      function tryReserveRealtimeUpcomingHeldNote(midi) {
        if (!state.isPlaying || state.mode !== "realtime") return null;
        if (!Number.isFinite(midi)) return null;
        if (!state.currentExpectedContext) return null;
        const timeline = ports.getTimeline();
        if (!Array.isArray(timeline) || timeline.length === 0) return null;
        const ctx = state.currentExpectedContext;
        const exactIndex = ctx.traceStepIndex === void 0 ? -1 : timeline.findIndex((event) => event.traceStepIndex === ctx.traceStepIndex);
        const currentIndex = exactIndex >= 0 ? exactIndex : ports.findTimelineIndex(
          timeline,
          ctx.measureIndex,
          ctx.timestamp,
          ctx.signature,
          state.ledPreviewTraversalIndex >= 0 ? state.ledPreviewTraversalIndex : 0
        );
        if (currentIndex < 0) return null;
        const maxLookaheadBeats = 1.1;
        for (let i = currentIndex + 1; i < timeline.length; i++) {
          const event = timeline[i];
          if (!event?.notes?.length) continue;
          const beatsUntilTarget = ports.getBeatsToWait({
            currentMeasureIdx: ctx.measureIndex,
            currentTimestamp: ctx.timestamp,
            nextMeasureIdx: event.measureIndex,
            nextTimestamp: event.timestamp,
            fallbackLength: 0.25,
            getMeasureTimingInfo: ports.getMeasureTimingInfo
          });
          if (!Number.isFinite(beatsUntilTarget)) continue;
          if (beatsUntilTarget > maxLookaheadBeats) break;
          const matched = event.notes.find((note) => note.midi === midi && ports.isPracticeHandEnabled(note.staffId));
          if (!matched) continue;
          const reservation = {
            midi,
            staffId: matched.staffId,
            measureIndex: event.measureIndex,
            timestamp: event.timestamp,
            allowTapCarry: false,
            beatsUntilTarget
          };
          state.earlyGraceReservations.set(midi, reservation);
          state.heldCorrectNotes.set(midi, matched.staffId);
          state.preExpectedHeldNotes.add(midi);
          return reservation;
        }
        return null;
      }
      return { getSinglePracticedHandRole, getRenderableNotesForHandFromTimelineEvent, findSingleHandPracticeTimelineWindow, findNextSingleHandPracticeTimelineEvent, getSingleHandPracticeBeatsUntilNextEvent, tryReserveSingleHandEarlyGrace, tryReserveRealtimeUpcomingHeldNote };
    }
    PianoTrainerEarlyGrace2.create = create;
  })(PianoTrainerEarlyGrace || (PianoTrainerEarlyGrace = {}));

  // src/practice/expected-notes.ts
  var PianoTrainerExpectedNotes;
  ((PianoTrainerExpectedNotes2) => {
    function create(ports) {
      const state = ports.state;
      function build(entries, currentMeasureIdx, currentTimestamp = null) {
        state.expectedNotes = [];
        state.visualNotesToStart = [];
        state.outOfRangeCurrentNotes = [];
        const mergedExpected = /* @__PURE__ */ new Map();
        const mergedVisuals = /* @__PURE__ */ new Map();
        const mergedOutOfRange = /* @__PURE__ */ new Map();
        for (const e of entries) {
          const sid = e.staffId;
          const handRole = ports.getHandRole(sid);
          const isRH = handRole === "right";
          const isLH = handRole === "left";
          const isPracticingThisHand = isRH && state.practice.right || isLH && state.practice.left;
          if (isPracticingThisHand) {
            for (const n of e.notes) {
              const isInvisibleCue = n.notehead === "none" || n.printObject === false || n.cue === true;
              if (isInvisibleCue) {
                continue;
              }
              if (!n.rest) {
                const isTieContinuation = n.tieContinuation;
                if (!isTieContinuation) {
                  const midi = n.midi;
                  const key = `${sid}|${midi}`;
                  if (!ports.isMidiInRange(midi)) {
                    if (!mergedOutOfRange.has(key)) {
                      mergedOutOfRange.set(key, { midi, staffId: sid, mIdx: currentMeasureIdx });
                    }
                    continue;
                  }
                  const combinedLength = n.combinedLengthWhole;
                  const noteDurationSeconds = combinedLength * 4 * (60 / (state.baseBpm * state.speedPercent));
                  const durationMs = noteDurationSeconds * 1e3;
                  let visualDurationMs = durationMs * 0.85;
                  let visualEndTimestamp = null;
                  if (state.mode === "wait" && Number.isFinite(currentTimestamp)) {
                    visualEndTimestamp = currentTimestamp + combinedLength * 0.85;
                  }
                  const staffIdx = Number(sid) - 1;
                  const anchor = ports.getAnchor(n.noteRef, currentMeasureIdx, staffIdx);
                  const existingExpected = mergedExpected.get(key);
                  if (!existingExpected) {
                    mergedExpected.set(key, { midi, staffId: sid, hit: false, mIdx: currentMeasureIdx, anchor, noteRef: n.noteRef });
                  } else {
                    ports.debugAnchor("EXPECTED_NOTE_DEDUPE_COLLISION", {
                      key,
                      currentMeasureIdx,
                      incoming: {
                        midi,
                        staffId: sid,
                        anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
                        note: ports.describeNote(n.noteRef, currentMeasureIdx, staffIdx)
                      },
                      existing: {
                        midi: existingExpected.midi,
                        staffId: existingExpected.staffId,
                        anchor: existingExpected.anchor ? { x: existingExpected.anchor.x, y: existingExpected.anchor.y } : null
                      }
                    });
                    if (!existingExpected.anchor && anchor) {
                      existingExpected.anchor = anchor;
                      existingExpected.noteRef = n.noteRef;
                    }
                  }
                  const existingVisual = mergedVisuals.get(key);
                  if (!existingVisual) {
                    mergedVisuals.set(key, {
                      midi,
                      staffId: sid,
                      durationMs: visualDurationMs,
                      endTimestamp: visualEndTimestamp,
                      mIdx: currentMeasureIdx
                    });
                  } else {
                    existingVisual.durationMs = Math.max(existingVisual.durationMs, visualDurationMs);
                    if (Number.isFinite(visualEndTimestamp)) {
                      existingVisual.endTimestamp = Number.isFinite(existingVisual.endTimestamp) ? Math.max(existingVisual.endTimestamp, visualEndTimestamp) : visualEndTimestamp;
                    }
                  }
                }
              }
            }
          }
        }
        state.expectedNotes = Array.from(mergedExpected.values());
        state.visualNotesToStart = Array.from(mergedVisuals.values());
        state.outOfRangeCurrentNotes = Array.from(mergedOutOfRange.values());
        state.realtimeWrongPressInCurrentContext = false;
        const consumedReservationMidis = [];
        state.expectedNotes.forEach((expected) => {
          const reservation = state.earlyGraceReservations.get(expected.midi);
          if (!reservation) return;
          if (reservation.measureIndex !== currentMeasureIdx || reservation.timestamp !== currentTimestamp) return;
          const isStillHeld = state.pressedKeys.has(expected.midi);
          const canCarryTap = !!reservation.allowTapCarry;
          if (!isStillHeld && !canCarryTap) return;
          expected.hit = true;
          if (isStillHeld) {
            state.heldCorrectNotes.set(expected.midi, expected.staffId);
            state.preExpectedHeldNotes.add(expected.midi);
          }
          ports.feedback.drawFeedbackNote(expected.midi, true, expected.staffId, currentMeasureIdx, expected.anchor);
          ports.scoring.correct();
          consumedReservationMidis.push(expected.midi);
        });
        if (state.earlyGraceReservations.size > 0) {
          for (const [midi, reservation] of state.earlyGraceReservations.entries()) {
            const isPastTarget = reservation.measureIndex < currentMeasureIdx || reservation.measureIndex === currentMeasureIdx && Number(reservation.timestamp) < Number(currentTimestamp);
            const isCurrentTargetWithoutExpected = reservation.measureIndex === currentMeasureIdx && reservation.timestamp === currentTimestamp && !state.expectedNotes.some((expected) => expected.midi === midi);
            if (isPastTarget || isCurrentTargetWithoutExpected || consumedReservationMidis.includes(midi)) {
              state.earlyGraceReservations.delete(midi);
            }
          }
        }
        if (consumedReservationMidis.length > 0) {
          ports.scoring.updateDisplay();
        }
        ports.pushDebugFrame({
          kind: "expected",
          measureIndex: currentMeasureIdx,
          timestamp: ports.getTraversalTimestamp(),
          notes: state.expectedNotes.map((n) => ({
            midi: n.midi,
            staffId: n.staffId,
            anchor: n.anchor,
            hit: n.hit,
            kind: "expected"
          }))
        });
        ports.debugLog("EXPECTED_NOTES_BUILT", {
          measureIndex: currentMeasureIdx,
          count: state.expectedNotes.length,
          outOfRangeCount: state.outOfRangeCurrentNotes.length,
          expected: state.expectedNotes.map((n) => ({
            midi: n.midi,
            staffId: n.staffId,
            mIdx: n.mIdx,
            hit: n.hit,
            anchor: n.anchor ? { x: n.anchor.x, y: n.anchor.y } : null
          })),
          outOfRange: state.outOfRangeCurrentNotes.map((n) => ({
            midi: n.midi,
            staffId: n.staffId,
            mIdx: n.mIdx
          })),
          visuals: state.visualNotesToStart.map((n) => ({
            midi: n.midi,
            staffId: n.staffId,
            durationMs: n.durationMs,
            mIdx: n.mIdx
          }))
        });
      }
      return { build };
    }
    PianoTrainerExpectedNotes2.create = create;
  })(PianoTrainerExpectedNotes || (PianoTrainerExpectedNotes = {}));

  // src/practice/feedback-state.ts
  var PianoTrainerFeedbackState;
  ((PianoTrainerFeedbackState2) => {
    function create(ports) {
      const state = ports.state;
      function getFeedbackContextKey(measureIndex = null, timestamp = null) {
        const event = ports.getPerformanceEvent?.();
        const suffix = event ? `|${event.scoreRevision}/${event.runId}/${event.eventId}` : "";
        return `${Number.isFinite(measureIndex) ? measureIndex : "na"}|${Number.isFinite(timestamp) ? timestamp : "na"}${suffix}`;
      }
      function getCurrentFeedbackContext() {
        const measureIndex = state.currentExpectedContext?.measureIndex ?? ports.getTraversalPosition()?.measureIndex ?? null;
        const timestamp = state.currentExpectedContext?.timestamp ?? ports.getTraversalPosition()?.timestampWhole ?? null;
        return {
          measureIndex,
          timestamp,
          key: getFeedbackContextKey(measureIndex, timestamp)
        };
      }
      function registerHeldIncorrectFeedback(midi, targetStaffId, forceMIdx = null, anchorOrExactY = null) {
        if (!state.feedbackEnabled) return;
        const anchor = ports.resolveAnchor(midi, targetStaffId, forceMIdx, anchorOrExactY);
        if (!anchor) return;
        const context = getCurrentFeedbackContext();
        state.activeHeldIncorrectFeedback.set(midi, {
          midi,
          staffId: targetStaffId,
          anchor,
          isCorrect: false,
          measureIndex: context.measureIndex,
          timestamp: context.timestamp,
          contextKey: context.key,
          ...ports.captureDisplay?.(midi, targetStaffId, anchor)
        });
        ports.renderOverlay();
        ports.pushDebugFrame({
          kind: "feedback",
          measureIndex: forceMIdx,
          notes: [{
            midi,
            staffId: targetStaffId,
            anchor,
            hit: false,
            kind: "feedback"
          }]
        });
      }
      function releaseHeldIncorrectFeedback(midi) {
        const marker = state.activeHeldIncorrectFeedback.get(midi);
        if (!marker) return;
        state.activeHeldIncorrectFeedback.delete(midi);
        state.releasedIncorrectFeedback.push(marker);
        ports.renderOverlay();
      }
      function drawFeedbackNote(midi, isCorrect, targetStaffId, forceMIdx = null, anchorOrExactY = null) {
        if (!state.feedbackEnabled) return;
        const anchor = ports.resolveAnchor(midi, targetStaffId, forceMIdx, anchorOrExactY);
        if (!anchor) return;
        const context = getCurrentFeedbackContext();
        const marker = {
          midi,
          staffId: targetStaffId,
          anchor,
          isCorrect: !!isCorrect,
          measureIndex: forceMIdx,
          timestamp: context.timestamp,
          contextKey: getFeedbackContextKey(forceMIdx, context.timestamp),
          ...ports.captureDisplay?.(midi, targetStaffId, anchor)
        };
        if (isCorrect) {
          state.correctFeedbackHistory.push(marker);
        } else {
          state.releasedIncorrectFeedback.push(marker);
        }
        ports.renderOverlay();
        ports.pushDebugFrame({
          kind: "feedback",
          measureIndex: forceMIdx,
          notes: [{
            midi,
            staffId: targetStaffId,
            anchor,
            hit: isCorrect,
            kind: "feedback"
          }]
        });
      }
      function clearPreserveScoring() {
        ports.clearOverlay();
        state.activeHeldIncorrectFeedback.clear();
        state.releasedIncorrectFeedback = [];
        state.correctFeedbackHistory = [];
        state.realtimeWrongPressInCurrentContext = false;
        ports.clearDebug();
      }
      return { getFeedbackContextKey, getCurrentFeedbackContext, registerHeldIncorrectFeedback, releaseHeldIncorrectFeedback, drawFeedbackNote, clearPreserveScoring };
    }
    PianoTrainerFeedbackState2.create = create;
  })(PianoTrainerFeedbackState || (PianoTrainerFeedbackState = {}));

  // src/practice/input-controller.ts
  var PianoTrainerInputController;
  ((PianoTrainerInputController2) => {
    function create(ports) {
      const state = ports.state;
      function receive(midi, isPressed, source = "midi", velocity = 100) {
        if (isPressed) {
          state.pressedKeys.add(midi);
          ports.audio.monitorNoteOn(midi, source, velocity);
          if (state.ledCalibrationMode) {
            ports.selectCalibration(midi);
            ports.renderKeyboard();
            return;
          }
          if (state.isPlaying) {
            const expectedMatch = ports.matching.findExpectedMatchForMidi(midi);
            const sustainMatch = !expectedMatch ? ports.matching.findSatisfiedOrSustainedMatchForMidi(midi) : null;
            const repeatCarryReservation = !expectedMatch && sustainMatch?.source === "already-hit" ? ports.early.tryReserveSingleHandEarlyGrace(midi) : null;
            const realtimeUpcomingReservation = !expectedMatch && !sustainMatch && !repeatCarryReservation ? ports.early.tryReserveRealtimeUpcomingHeldNote(midi) : null;
            const earlyGraceReservation = !expectedMatch && !sustainMatch && !realtimeUpcomingReservation ? ports.early.tryReserveSingleHandEarlyGrace(midi) : realtimeUpcomingReservation || repeatCarryReservation;
            const isCorrect = !!expectedMatch;
            const isAcceptedRepeat = !expectedMatch && !!sustainMatch;
            const isEarlyGraceReserved = !!earlyGraceReservation;
            const targetStaffId = expectedMatch ? expectedMatch.staffId : sustainMatch ? sustainMatch.staffId : earlyGraceReservation ? earlyGraceReservation.staffId : null;
            if (state.practice.left || state.practice.right) {
              const forceMIdx = expectedMatch ? expectedMatch.mIdx : null;
              const anchor = expectedMatch ? expectedMatch.anchor : null;
              ports.debugLog("KEY_PRESS_MATCH_RESULT", {
                midi,
                isCorrect,
                isAcceptedRepeat,
                isEarlyGraceReserved,
                targetStaffId,
                forceMIdx,
                sustainMatch: sustainMatch ? {
                  midi: sustainMatch.midi,
                  staffId: sustainMatch.staffId,
                  mIdx: sustainMatch.mIdx,
                  source: sustainMatch.source
                } : null,
                anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
                expectedMatch: expectedMatch ? {
                  midi: expectedMatch.midi,
                  staffId: expectedMatch.staffId,
                  mIdx: expectedMatch.mIdx,
                  hit: expectedMatch.hit
                } : null
              });
              if (isCorrect) {
                ports.feedback.drawFeedbackNote(midi, true, targetStaffId, forceMIdx, anchor);
                ports.scoring.correct();
                state.heldCorrectNotes.set(midi, targetStaffId);
                ports.scoring.updateDisplay();
              } else if (isAcceptedRepeat || isEarlyGraceReserved) {
                state.heldCorrectNotes.set(midi, targetStaffId);
              } else {
                if (state.mode === "realtime") {
                  state.realtimeWrongPressInCurrentContext = true;
                }
                ports.feedback.registerHeldIncorrectFeedback(midi, targetStaffId, forceMIdx, anchor);
                ports.scoring.wrong();
                ports.scoring.updateDisplay();
              }
            }
            if (isCorrect) {
              expectedMatch.hit = true;
              if (state.mode === "wait" || state.mode === "follow") {
                ports.advanceAfterHit();
              }
            }
          }
        } else {
          state.pressedKeys.delete(midi);
          state.heldCorrectNotes.delete(midi);
          state.preExpectedHeldNotes.delete(midi);
          const earlyReservation = state.earlyGraceReservations.get(midi);
          if (!earlyReservation || !earlyReservation.allowTapCarry) {
            state.earlyGraceReservations.delete(midi);
          }
          ports.feedback.releaseHeldIncorrectFeedback(midi);
          ports.audio.monitorNoteOff(midi, source);
        }
        ports.renderKeyboard();
      }
      return { receive, handle: (input) => receive(input.note, input.kind === "note-on", input.source, input.velocity) };
    }
    PianoTrainerInputController2.create = create;
  })(PianoTrainerInputController || (PianoTrainerInputController = {}));

  // src/practice/input-matching.ts
  var PianoTrainerInputMatching;
  ((PianoTrainerInputMatching2) => {
    function create(ports) {
      const state = ports.state;
      function findExpectedMatchForMidi(midi) {
        const candidates = state.expectedNotes.filter((n) => n.midi === midi && !n.hit);
        if (state.debugMatchLogs) {
          ports.debugLog("MATCH_CANDIDATES", {
            midi,
            count: candidates.length,
            candidates: candidates.map((n) => ({
              midi: n.midi,
              staffId: n.staffId,
              mIdx: n.mIdx,
              hit: n.hit,
              anchor: n.anchor ? { x: n.anchor.x, y: n.anchor.y } : null
            }))
          });
        }
        if (candidates.length === 0) return null;
        const first = candidates[0];
        if (candidates.length === 1) {
          if (state.debugMatchLogs) {
            ports.debugLog("MATCH_CHOSEN", {
              midi,
              reason: "single-candidate",
              chosen: {
                staffId: first.staffId,
                mIdx: first.mIdx,
                anchor: first.anchor ? { x: first.anchor.x, y: first.anchor.y } : null
              }
            });
          }
          return first;
        }
        const cursorX = ports.getCursorX();
        if (cursorX == null) {
          if (state.debugMatchLogs) {
            ports.debugLog("MATCH_CHOSEN", {
              midi,
              reason: "no-cursor-x",
              chosen: {
                staffId: first.staffId,
                mIdx: first.mIdx,
                anchor: first.anchor ? { x: first.anchor.x, y: first.anchor.y } : null
              }
            });
          }
          return first;
        }
        const chosen = candidates.slice().sort((a, b) => {
          const ax = a.anchor?.x ?? cursorX;
          const bx = b.anchor?.x ?? cursorX;
          return Math.abs(ax - cursorX) - Math.abs(bx - cursorX);
        })[0];
        if (state.debugMatchLogs) {
          ports.debugLog("MATCH_CHOSEN", {
            midi,
            reason: "closest-to-cursor-x",
            cursorX,
            chosen: {
              staffId: chosen.staffId,
              mIdx: chosen.mIdx,
              anchor: chosen.anchor ? { x: chosen.anchor.x, y: chosen.anchor.y } : null
            }
          });
        }
        return chosen;
      }
      function findSatisfiedOrSustainedMatchForMidi(midi) {
        const alreadyHit = state.expectedNotes.find((n) => n.midi === midi && n.hit);
        if (alreadyHit) {
          return { midi, staffId: alreadyHit.staffId, mIdx: alreadyHit.mIdx, source: "already-hit" };
        }
        const sustained = state.sustainedVisuals.find((n) => n.midi === midi) || state.visualNotesToStart.find((n) => n.midi === midi);
        if (sustained) {
          return { midi, staffId: sustained.staffId, mIdx: sustained.mIdx ?? null, source: "sustained-visual" };
        }
        return null;
      }
      return { findExpectedMatchForMidi, findSatisfiedOrSustainedMatchForMidi };
    }
    PianoTrainerInputMatching2.create = create;
  })(PianoTrainerInputMatching || (PianoTrainerInputMatching = {}));

  // src/practice/mode-policy.ts
  var PianoTrainerModePolicy;
  ((PianoTrainerModePolicy2) => {
    PianoTrainerModePolicy2.FOLLOW_ME_MIN_WAIT_RATIO = 0.6;
    function waitAdvance() {
      return { kind: "wait", delayMs: 10, guard: "wait" };
    }
    function inputGroup(notes) {
      return notes.length > 0 ? { kind: "input", alreadyHit: notes.every((note) => note.hit) } : { kind: "input-gap" };
    }
    function deferInputAccompaniment(expectedCount, practicingHand) {
      return expectedCount > 0 && !practicingHand;
    }
    PianoTrainerModePolicy2.wait = {
      kind: "wait",
      waitsForInput: true,
      usesRelativeAnchor: true,
      startsWaitMetronome: true,
      deferAccompaniment: deferInputAccompaniment,
      deferMetronome: () => false,
      followInfo: () => null,
      afterHit: waitAdvance,
      group: inputGroup
    };
    PianoTrainerModePolicy2.follow = {
      kind: "follow",
      waitsForInput: true,
      usesRelativeAnchor: true,
      startsWaitMetronome: false,
      deferAccompaniment: deferInputAccompaniment,
      deferMetronome: (expectedCount) => expectedCount > 0,
      followInfo: (window2) => ({
        currentMeasureIdx: window2.displayed.measureIndex,
        currentTimestamp: window2.displayed.timestampWhole,
        waitSeconds: window2.waitSeconds,
        beatsToWait: window2.beatsToWait
      }),
      afterHit: (info) => info && Number.isFinite(info.waitSeconds) ? { kind: "follow", info, fullWaitSeconds: Math.max(0, info.waitSeconds), guard: "follow" } : waitAdvance(),
      group: inputGroup
    };
    PianoTrainerModePolicy2.realtime = {
      kind: "realtime",
      waitsForInput: false,
      usesRelativeAnchor: false,
      startsWaitMetronome: false,
      deferAccompaniment: () => false,
      deferMetronome: () => false,
      followInfo: () => null,
      afterHit: waitAdvance,
      group: () => ({ kind: "timed" })
    };
    function forMode(mode) {
      return mode === "wait" ? PianoTrainerModePolicy2.wait : mode === "follow" ? PianoTrainerModePolicy2.follow : PianoTrainerModePolicy2.realtime;
    }
    PianoTrainerModePolicy2.forMode = forMode;
    function followWaitSeconds(fullWaitSeconds, rawRemainingSeconds) {
      let effectiveWaitSeconds = rawRemainingSeconds > 0 ? rawRemainingSeconds : fullWaitSeconds;
      if (effectiveWaitSeconds < fullWaitSeconds * PianoTrainerModePolicy2.FOLLOW_ME_MIN_WAIT_RATIO) effectiveWaitSeconds = fullWaitSeconds;
      return Math.max(0, effectiveWaitSeconds);
    }
    PianoTrainerModePolicy2.followWaitSeconds = followWaitSeconds;
    function followHitDelayMs(waitSeconds) {
      return Math.max(0, Math.round(waitSeconds * 1e3));
    }
    PianoTrainerModePolicy2.followHitDelayMs = followHitDelayMs;
    function inputGap(mode, timeToWaitMs) {
      return { delayMs: mode === "follow" ? Math.max(0, timeToWaitMs) : 10, repeatMetronome: mode === "follow" };
    }
    PianoTrainerModePolicy2.inputGap = inputGap;
    function allowsAdvance(guard, state) {
      if (guard === "wait") return state.isPlaying && state.mode === "wait";
      if (guard === "follow") return state.isPlaying && state.mode === "follow";
      if (guard === "input-modes") return state.isPlaying && (state.mode === "wait" || state.mode === "follow");
      return state.isPlaying;
    }
    PianoTrainerModePolicy2.allowsAdvance = allowsAdvance;
  })(PianoTrainerModePolicy || (PianoTrainerModePolicy = {}));

  // src/practice/playback-coordinator.ts
  var PianoTrainerPlaybackCoordinator;
  ((PianoTrainerPlaybackCoordinator2) => {
    function create(ports) {
      const state = ports.state;
      let epoch = 0, disposed = false;
      let displayWindow = null;
      const policy = () => PianoTrainerModePolicy.forMode(state.mode);
      function scheduleAdvance(delayMs, guard, gradeMisses) {
        ports.clock.setTimer(() => {
          if (!PianoTrainerModePolicy.allowsAdvance(guard, state)) return;
          if (gradeMisses) ports.practice.processMisses();
          ports.score.update();
          ports.ui.scroll();
          playbackLoop();
        }, delayMs);
      }
      function checkWaitModeAdvance() {
        if (!state.isPlaying || !policy().waitsForInput || !state.isAudioBusy) return;
        if (state.expectedNotes.length === 0) return;
        const allHit = state.expectedNotes.every((n) => n.hit);
        if (allHit) {
          state.isAudioBusy = false;
          state.pendingAudio.forEach((audio) => {
            ports.audio.schedule(audio.midi, audio.durationMs, audio.velocity ?? 100, { toLocalAudio: !!audio.toLocalAudio, toMidiOut: !!audio.toMidiOut });
          });
          state.pendingAudio = [];
          ports.practice.startSustains();
          const followInfo = state.followAdvanceInfo || null;
          const hitAdvance = policy().afterHit(followInfo);
          if (hitAdvance.kind === "follow") {
            const fullWaitSeconds = hitAdvance.fullWaitSeconds;
            const rawRemainingSeconds = Number.isFinite(state.anchorTime) ? state.anchorTime - ports.clock.nowSeconds() : fullWaitSeconds;
            const effectiveWaitSeconds = PianoTrainerModePolicy.followWaitSeconds(fullWaitSeconds, rawRemainingSeconds);
            ports.metronome.scheduleMetronomeForPlaybackWindow(
              ports.clock.nowSeconds(),
              hitAdvance.info.currentMeasureIdx,
              hitAdvance.info.currentTimestamp,
              effectiveWaitSeconds,
              hitAdvance.info.beatsToWait
            );
            scheduleAdvance(PianoTrainerModePolicy.followHitDelayMs(effectiveWaitSeconds), hitAdvance.guard, false);
            return;
          }
          scheduleAdvance(hitAdvance.delayMs, hitAdvance.guard, false);
        }
      }
      async function startPlaybackFromToolbar() {
        if (!ports.score.hasCursor() || state.isPlaying) return;
        disposed = false;
        const generation = epoch;
        if (state.fullscreenOnPlay && !ports.ui.isFullscreenActive()) {
          await ports.ui.requestFullscreen();
          if (generation !== epoch) return;
        }
        await ports.audio.ensureReady();
        if (generation !== epoch) return;
        await ports.presentation?.prepare?.();
        if (generation !== epoch) return;
        state.isPlaying = true;
        ports.ui.updatePlayPause();
        ports.ui.hidePanels();
        ports.transport.stop();
        ports.metronome.clearScheduledMetronomeEvents();
        ports.metronome.stopWaitModeMetronome();
        state.lastLedPreviewEvents = [];
        state.ledPreviewTraversalIndex = -1;
        ports.ui.preserveScroll(() => {
          ports.ensureTimeline();
        });
        ports.audio.applyLatencyProfile();
        ports.metronome.doCountInAndStart(() => {
          if (generation !== epoch) return;
          state.anchorTime = ports.clock.nowSeconds();
          ports.score.show();
          ports.ui.scroll();
          ports.transport.setBpm(state.baseBpm * state.speedPercent);
          ports.transport.start();
          if (policy().startsWaitMetronome && ports.controls.isMetronomeEnabled()) {
            ports.metronome.startWaitModeMetronome(ports.score.hasCursor() ? ports.score.getMeasureIndex() : 0);
          }
          playbackLoop();
        });
      }
      function silencePlaybackOutputsImmediately() {
        ports.audio.silence();
        ports.midi.silence();
      }
      function stopPlaybackState({ pauseTransport = true } = {}) {
        displayWindow = null;
        ports.ui.cancelViewport();
        state.isPlaying = false;
        state.countInActive = false;
        state.lastLedPreviewEvents = [];
        state.ledPreviewTraversalIndex = -1;
        ports.transitions.clearTransient();
        if (pauseTransport) {
          ports.transport.pause();
        } else {
          ports.transport.stop();
        }
        ports.metronome.clearScheduledMetronomeEvents();
        ports.metronome.stopWaitModeMetronome();
        silencePlaybackOutputsImmediately();
        ports.metronome.clearTempoVisualPulse();
        ports.audio.applyLatencyProfile();
        ports.ui.updatePlayPause();
        if (state.ledOutputMode === "midi") {
          ports.led.wipeHardware();
        }
        if (state.ledOutputMode === "wled") {
          ports.led.clearOutputs().catch(() => {
          });
        }
      }
      function pausePlaybackFromToolbar() {
        stopPlaybackState({ pauseTransport: true });
      }
      function resetPlaybackForLoadedScore() {
        stopPlaybackState({ pauseTransport: false });
        ports.ui.clearSvgFeedback();
        state.pendingAudio = [];
        state.score.correct = 0;
        state.score.wrong = 0;
        ports.ui.updateScore();
        ports.transitions.clearVisuals();
      }
      function playbackLoop() {
        if (disposed || !state.isPlaying) return;
        displayWindow = null;
        const generation = epoch;
        if (ports.score.isEndReached()) {
          const isLoopEnabledAtEnd = ports.controls.isLoopEnabledAtEnd();
          if (!isLoopEnabledAtEnd) {
            pausePlaybackFromToolbar();
            ports.score.update();
            ports.ui.scroll();
          }
          return;
        }
        const entries = ports.score.readEvent();
        ports.presentation?.present();
        if (entries.isEmpty) {
          ports.score.advance();
          ports.score.update();
          ports.clock.requestFrame(playbackLoop);
          return;
        }
        const displayed = { timestampWhole: ports.score.getTimestamp(), measureIndex: ports.score.getMeasureIndex() };
        const currentTimestamp = displayed.timestampWhole;
        const currentMeasureIdx = displayed.measureIndex;
        const tempoInBpm = ports.score.getTempo(currentMeasureIdx);
        if (tempoInBpm && tempoInBpm !== state.baseBpm) {
          state.baseBpm = tempoInBpm;
          ports.ui.updateTempoPercent(state.speedPercent * 100);
        }
        ports.practice.buildExpected(entries.entries, currentMeasureIdx, currentTimestamp);
        state.currentExpectedContext = {
          measureIndex: currentMeasureIdx,
          timestamp: currentTimestamp,
          signature: entries.signature,
          ...ports.presentation ? { traceStepIndex: ports.presentation.traceStepIndex() } : {}
        };
        ports.ui.renderFeedback();
        ports.ui.renderEventKeyboard(entries, currentMeasureIdx, currentTimestamp);
        for (const e of entries.entries) {
          const handRole = ports.practice.getHandRole(e.staffId);
          const isRH = handRole === "right";
          const isLH = handRole === "left";
          const isOther = !isRH && !isLH;
          const isPracticingThisHand = isRH && state.practice.right || isLH && state.practice.left;
          const playbackLeftEnabled = !!state.playback.left;
          const playbackRightEnabled = !!state.playback.right;
          const isSelectedHandPlayback = isRH && playbackRightEnabled || isLH && playbackLeftEnabled;
          const routeToLocalAudio = (isRH || isLH) && isSelectedHandPlayback && state.audioEnabled.hands || isOther && state.audioEnabled.other;
          const routeToMidiOut = (isRH || isLH) && isSelectedHandPlayback && state.midiOutEnabled.hands || isOther && state.midiOutEnabled.other;
          if (routeToLocalAudio || routeToMidiOut) {
            for (const n of e.notes) {
              if (!n.rest) {
                if (!n.tieContinuation) {
                  const m = n.midi;
                  const combinedLength = n.combinedLengthWhole;
                  const noteDurationSeconds = combinedLength * 4 * (60 / (state.baseBpm * state.speedPercent));
                  const durationMs = noteDurationSeconds * 1e3 * 0.9;
                  if (policy().deferAccompaniment(state.expectedNotes.length, isPracticingThisHand)) {
                    state.pendingAudio.push({ midi: m, durationMs, velocity: 100, toLocalAudio: routeToLocalAudio, toMidiOut: routeToMidiOut });
                  } else {
                    ports.audio.schedule(m, durationMs, 100, { toLocalAudio: routeToLocalAudio, toMidiOut: routeToMidiOut });
                  }
                }
              }
            }
          }
        }
        ports.score.advance();
        const prefetched = { measureIndex: ports.score.getMeasureIndex(), timestampWhole: ports.score.getTimestamp() };
        const nextMeasureIdx = prefetched.measureIndex;
        let nextTimestamp = prefetched.timestampWhole;
        const isEndReached = ports.score.isEndReached();
        const fallbackLength = entries.fallbackLengthWhole;
        if (isEndReached) {
          nextTimestamp = currentTimestamp + fallbackLength;
        }
        const beatsToWait = ports.timing.getTraversalBeatsToWait({
          currentMeasureIdx,
          currentTimestamp,
          nextMeasureIdx,
          nextTimestamp,
          fallbackLength,
          getMeasureTimingInfo: ports.timing.getMeasureTimingInfo
        });
        const currentRunningBpm = state.baseBpm * state.speedPercent;
        const waitSeconds = beatsToWait * (60 / currentRunningBpm);
        const playbackWindowStartSec = policy().usesRelativeAnchor ? ports.clock.nowSeconds() : state.anchorTime;
        displayWindow = {
          eventId: ports.presentation?.eventId?.() ?? null,
          traceStepIndex: state.currentExpectedContext?.traceStepIndex ?? -1,
          measureIndex: currentMeasureIdx,
          timestampWhole: currentTimestamp,
          startSec: playbackWindowStartSec,
          endSec: playbackWindowStartSec + waitSeconds
        };
        const deferMetronomeWindow = policy().deferMetronome(state.expectedNotes.length);
        if (!deferMetronomeWindow) {
          ports.metronome.scheduleMetronomeForPlaybackWindow(
            playbackWindowStartSec,
            currentMeasureIdx,
            currentTimestamp,
            waitSeconds,
            beatsToWait
          );
        } else {
          ports.metronome.clearScheduledMetronomeEvents();
          ports.metronome.clearTempoVisualPulse();
        }
        let timeToWaitMs = waitSeconds * 1e3;
        const isLoopEnabled = ports.controls.isLoopEnabled();
        const maxLoop = ports.controls.readLoopMax();
        const minLoop = ports.controls.readLoopMin();
        if (isLoopEnabled && (isEndReached || ports.score.getMeasureIndex() + 1 > maxLoop)) {
          ports.clock.setTimer(() => {
            if (!state.isPlaying) return;
            ports.practice.processMisses();
            ports.transport.stop();
            ports.score.reset();
            while (!ports.score.isEndReached() && ports.score.getMeasureIndex() < minLoop - 1) {
              ports.score.advance();
            }
            ports.score.update();
            ports.ui.scroll();
            ports.transitions.clearVisuals();
            const restartLoopPlayback = () => {
              if (generation !== epoch) return;
              ports.ui.clearSvgFeedback();
              state.pendingAudio = [];
              state.score.correct = 0;
              state.score.wrong = 0;
              ports.ui.updateScore();
              state.anchorTime = ports.clock.nowSeconds();
              ports.presentation?.loop();
              ports.transport.start();
              playbackLoop();
            };
            if (state.loopCountInEnabled) {
              ports.metronome.doCountInAndStart(restartLoopPlayback);
            } else {
              restartLoopPlayback();
            }
          }, timeToWaitMs);
          return;
        }
        if (policy().usesRelativeAnchor) {
          state.anchorTime = ports.clock.nowSeconds() + waitSeconds;
        } else {
          state.anchorTime += waitSeconds;
        }
        timeToWaitMs = (state.anchorTime - ports.clock.nowSeconds()) * 1e3;
        if (timeToWaitMs < 0) {
          timeToWaitMs = 0;
          if (policy().usesRelativeAnchor) {
            state.anchorTime = ports.clock.nowSeconds();
          }
        }
        if (policy().waitsForInput) {
          state.isAudioBusy = true;
          state.followAdvanceInfo = policy().followInfo({ displayed, waitSeconds, beatsToWait });
        }
        const groupDecision = policy().group(state.expectedNotes);
        if (groupDecision.kind === "input") {
          if (groupDecision.alreadyHit) {
            ports.clock.setTimer(() => {
              if (!PianoTrainerModePolicy.allowsAdvance("input-modes", state)) return;
              checkWaitModeAdvance();
            }, 0);
          }
        } else if (groupDecision.kind === "input-gap") {
          ports.practice.startSustains();
          const gap = PianoTrainerModePolicy.inputGap(state.mode, timeToWaitMs);
          if (gap.repeatMetronome) {
            ports.metronome.scheduleMetronomeForPlaybackWindow(
              playbackWindowStartSec,
              currentMeasureIdx,
              currentTimestamp,
              waitSeconds,
              beatsToWait
            );
          }
          scheduleAdvance(gap.delayMs, "input-modes", true);
        } else {
          ports.practice.startSustains();
          scheduleAdvance(timeToWaitMs, "playing", true);
        }
      }
      function resetPlaybackFromToolbar() {
        ports.ui.cancelViewport();
        state.isPlaying = false;
        state.countInActive = false;
        ports.transport.stop();
        ports.metronome.clearScheduledMetronomeEvents();
        ports.metronome.stopWaitModeMetronome();
        silencePlaybackOutputsImmediately();
        ports.metronome.clearTempoVisualPulse();
        ports.audio.applyLatencyProfile();
        ports.ui.clearSvgFeedback();
        ports.transitions.clearTransient();
        state.score.correct = 0;
        state.score.wrong = 0;
        ports.ui.updateScore();
        ports.score.reset();
        const isLoopEnabled = ports.controls.isLoopEnabled();
        if (isLoopEnabled) {
          const minLoop = ports.controls.readLoopMin();
          while (!ports.score.isEndReached() && ports.score.getMeasureIndex() < minLoop - 1) {
            ports.score.advance();
          }
        }
        ports.score.update();
        ports.presentation?.navigate("reset");
        ports.ui.scroll();
        state.ledPreviewTraversalIndex = -1;
        state.lastLedPreviewEvents = [];
        ports.transitions.clearVisuals();
        if (state.ledOutputMode === "wled") {
          ports.led.clearOutputs().catch(() => {
          });
        }
        ports.ui.hidePanels();
        ports.ui.updatePlayPause();
      }
      function enforceLooperBounds() {
        if (!ports.controls.isLoopEnabled() || !ports.score.hasCursor()) return;
        const minLoop = state.looper.min;
        const maxLoop = state.looper.max;
        const current = ports.score.getMeasureIndex() + 1;
        if (current < minLoop || current > maxLoop) {
          ports.score.reset();
          while (!ports.score.isEndReached() && ports.score.getMeasureIndex() < minLoop - 1) {
            ports.score.advance();
          }
          ports.score.update();
          ports.presentation?.navigate("seek");
          ports.ui.scroll();
        }
      }
      function dispose() {
        if (disposed) return;
        disposed = true;
        epoch++;
        stopPlaybackState({ pauseTransport: false });
        ports.clock.dispose();
        ports.metronome.dispose();
      }
      function suspend() {
        epoch++;
        pausePlaybackFromToolbar();
        ports.clock.dispose();
        ports.metronome.dispose();
      }
      return {
        checkWaitModeAdvance,
        startPlaybackFromToolbar,
        silencePlaybackOutputsImmediately,
        readDisplayWindow: () => displayWindow ? { ...displayWindow } : null,
        stopPlaybackState,
        pausePlaybackFromToolbar,
        resetPlaybackForLoadedScore,
        resetPlaybackFromToolbar,
        playbackLoop,
        enforceLooperBounds,
        suspend,
        dispose
      };
    }
    PianoTrainerPlaybackCoordinator2.create = create;
  })(PianoTrainerPlaybackCoordinator || (PianoTrainerPlaybackCoordinator = {}));

  // src/practice/playback-state.ts
  var PianoTrainerPlaybackState;
  ((PianoTrainerPlaybackState2) => {
    function create(ports) {
      const state = ports.state;
      function clearVisuals() {
        ports.clearFeedbackPreserveScoring();
        state.activeTimeouts.forEach((id) => ports.clearTimer(id));
        state.activeTimeouts = [];
        state.sustainedVisuals = [];
        state.visualNotesToStart = [];
        state.expectedNotes = [];
        state.outOfRangeCurrentNotes = [];
        state.activeHeldIncorrectFeedback.clear();
        state.releasedIncorrectFeedback = [];
        state.correctFeedbackHistory = [];
        state.realtimeWrongPressInCurrentContext = false;
        state.heldCorrectNotes.clear();
        state.preExpectedHeldNotes.clear();
        state.lastLedPreviewEvents = [];
        state.ledPreviewTraversalIndex = -1;
        state.followAdvanceInfo = null;
        state.currentExpectedContext = null;
        state.earlyGraceReservations.clear();
        ports.wipeHardware();
        ports.renderKeyboard();
      }
      function clearTransient({ clearVisualState = false } = {}) {
        state.pendingAudio = [];
        state.followAdvanceInfo = null;
        state.currentExpectedContext = null;
        state.earlyGraceReservations.clear();
        state.isAudioBusy = false;
        state.expectedNotes = [];
        state.realtimeWrongPressInCurrentContext = false;
        state.preExpectedHeldNotes.clear();
        if (clearVisualState) clearVisuals();
      }
      return { clearVisuals, clearTransient };
    }
    PianoTrainerPlaybackState2.create = create;
  })(PianoTrainerPlaybackState || (PianoTrainerPlaybackState = {}));

  // src/practice/scoring.ts
  var PianoTrainerScoring;
  ((PianoTrainerScoring2) => {
    function create(ports) {
      const state = ports.state;
      function correct() {
        state.score.correct++;
      }
      function wrong() {
        state.score.wrong++;
      }
      function processMissedNotes() {
        let missedCount = 0;
        const suppressMissedVisuals = state.mode === "realtime" && state.realtimeWrongPressInCurrentContext;
        state.expectedNotes.forEach((n) => {
          if (!n.hit) {
            if (!suppressMissedVisuals) {
              ports.feedback.drawFeedbackNote(n.midi, false, n.staffId, n.mIdx, n.anchor);
            }
            wrong();
            missedCount++;
          }
        });
        if (missedCount > 0) ports.updateDisplay();
      }
      return { correct, wrong, processMissedNotes, updateDisplay: ports.updateDisplay };
    }
    PianoTrainerScoring2.create = create;
  })(PianoTrainerScoring || (PianoTrainerScoring = {}));

  // src/practice/sustain-state.ts
  var PianoTrainerSustainState;
  ((PianoTrainerSustainState2) => {
    function create(ports) {
      const state = ports.state;
      const timers = /* @__PURE__ */ new Set();
      let active = true, generation = 0;
      function setTimer(callback, delayMs) {
        const started = generation;
        const id = ports.setTimer(() => {
          timers.delete(id);
          if (active && generation === started) callback();
        }, delayMs);
        timers.add(id);
        return id;
      }
      function cancelTimer(id) {
        timers.delete(id);
        ports.clearTimer(id);
      }
      function init() {
        active = true;
      }
      function dispose() {
        if (!active) return;
        active = false;
        generation++;
        for (const id of timers) ports.clearTimer(id);
        timers.clear();
      }
      function startVisualSustains() {
        if (!active) return;
        const RETRIGGER_GAP_MS = 35;
        const pendingVisuals = state.visualNotesToStart.slice();
        state.visualNotesToStart = [];
        const startOneVisual = (n) => {
          const vis = { midi: n.midi, staffId: n.staffId, mIdx: n.mIdx, endTimestamp: n.endTimestamp };
          state.sustainedVisuals.push(vis);
          ports.renderKeyboard();
          if (!((state.mode === "wait" || state.mode === "follow") && Number.isFinite(n.endTimestamp))) {
            const tId = setTimer(() => {
              const idx = state.sustainedVisuals.indexOf(vis);
              if (idx > -1) {
                state.sustainedVisuals.splice(idx, 1);
                ports.renderKeyboard();
              }
            }, n.durationMs);
            state.activeTimeouts.push(tId);
          }
        };
        pendingVisuals.forEach((n) => {
          const sameMeasureAlreadyActive = state.sustainedVisuals.some(
            (v) => v.midi === n.midi && v.staffId === n.staffId && v.mIdx === n.mIdx
          );
          if (sameMeasureAlreadyActive) {
            return;
          }
          const olderSamePitchActive = state.sustainedVisuals.some(
            (v) => v.midi === n.midi && v.staffId === n.staffId && v.mIdx !== n.mIdx
          );
          if (olderSamePitchActive) {
            state.sustainedVisuals = state.sustainedVisuals.filter(
              (v) => !(v.midi === n.midi && v.staffId === n.staffId)
            );
            ports.renderKeyboard();
            const gapId = setTimer(() => {
              startOneVisual(n);
            }, RETRIGGER_GAP_MS);
            state.activeTimeouts.push(gapId);
          } else {
            startOneVisual(n);
          }
        });
      }
      function pruneAtTimestamp(currentTimestamp) {
        if ((state.mode === "wait" || state.mode === "follow") && Number.isFinite(currentTimestamp)) {
          state.sustainedVisuals = state.sustainedVisuals.filter((n) => !Number.isFinite(n.endTimestamp) || currentTimestamp < n.endTimestamp);
        }
      }
      function markHeldPreview(midi, previewState) {
        if (state.heldCorrectNotes.has(midi) && (previewState === "future1-l" || previewState === "future1-r")) {
          state.preExpectedHeldNotes.add(midi);
        }
      }
      return { init, dispose, cancelTimer, startVisualSustains, pruneAtTimestamp, markHeldPreview };
    }
    PianoTrainerSustainState2.create = create;
  })(PianoTrainerSustainState || (PianoTrainerSustainState = {}));

  // src/render/feedback-overlay.ts
  var PianoTrainerFeedbackOverlay;
  ((PianoTrainerFeedbackOverlay2) => {
    function create(ports) {
      const state = ports.state;
      function getGroup() {
        return ports.ensureGroup("pt-feedback-group");
      }
      function clear() {
        ports.getSvg()?.querySelector("#pt-feedback-group")?.replaceChildren();
      }
      function drawMarker(anchor, isCorrect) {
        if (!state.feedbackEnabled || !anchor) return;
        const group = getGroup();
        if (!group) return;
        const circle = ports.document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(anchor.x));
        circle.setAttribute("cy", String(anchor.y));
        circle.setAttribute("r", "4.5");
        circle.setAttribute("fill", isCorrect ? "rgba(46, 204, 113, 0.55)" : "rgba(231, 76, 60, 0.55)");
        circle.setAttribute("stroke", isCorrect ? "rgba(39, 174, 96, 0.9)" : "rgba(192, 57, 43, 0.9)");
        circle.setAttribute("stroke-width", "1.5");
        group.appendChild(circle);
      }
      function drawStoredMarker(marker) {
        if (!marker?.anchor) return;
        drawMarker(ports.projectMarker ? ports.projectMarker(marker) : marker.anchor, !!marker.isCorrect);
      }
      function render() {
        clear();
        if (!state.feedbackEnabled) return;
        const currentContextKey = ports.getCurrentContextKey();
        state.correctFeedbackHistory.forEach((marker) => drawStoredMarker(marker));
        state.releasedIncorrectFeedback.forEach((marker) => {
          if (marker?.contextKey === currentContextKey) return;
          drawStoredMarker(marker);
        });
        state.activeHeldIncorrectFeedback.forEach((marker) => {
          if (marker?.contextKey !== currentContextKey) return;
          drawStoredMarker(marker);
        });
      }
      return { getGroup, clear, drawMarker, drawStoredMarker, render };
    }
    PianoTrainerFeedbackOverlay2.create = create;
  })(PianoTrainerFeedbackOverlay || (PianoTrainerFeedbackOverlay = {}));

  // src/render/geometry-engine.ts
  var PianoTrainerGeometry;
  ((PianoTrainerGeometry2) => {
    function create(ports) {
      const engine = {
        unitsToPx: 10,
        noteAnchorCache: /* @__PURE__ */ new WeakMap(),
        measureBoxCache: /* @__PURE__ */ new Map(),
        invalidate() {
          this.noteAnchorCache = /* @__PURE__ */ new WeakMap();
          this.measureBoxCache.clear();
          ports.clearOverlays();
        },
        getSvg() {
          return ports.getSvg();
        },
        getSvgViewBox() {
          const svg = this.getSvg();
          return svg?.viewBox?.baseVal || null;
        },
        getSvgClientRect() {
          const svg = this.getSvg();
          return svg ? svg.getBoundingClientRect() : null;
        },
        clientPointToSvg(clientX, clientY) {
          const rect = this.getSvgClientRect();
          const viewBox = this.getSvgViewBox();
          if (!rect || !viewBox || rect.width === 0 || rect.height === 0)
            return null;
          return {
            x: (clientX - rect.left) / rect.width * viewBox.width + viewBox.x,
            y: (clientY - rect.top) / rect.height * viewBox.height + viewBox.y
          };
        },
        getCursorSvgX() {
          const cursor = ports.score.getCursorElement();
          if (!cursor) return null;
          const rect = cursor.getBoundingClientRect();
          const point = this.clientPointToSvg(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return point ? point.x : null;
        },
        resolveFeedbackAnchor(midi, targetStaffId, forceMIdx = null, anchorOrExactY = null) {
          if (anchorOrExactY && typeof anchorOrExactY === "object" && anchorOrExactY.x != null && anchorOrExactY.y != null) {
            return { x: anchorOrExactY.x, y: anchorOrExactY.y };
          }
          let anchor = null;
          const cursor = ports.score.getCursorElement();
          if (cursor) {
            const rect = cursor.getBoundingClientRect();
            const center = this.clientPointToSvg(rect.left + rect.width / 2, rect.top + rect.height / 2);
            if (center) {
              let yPos;
              if (typeof anchorOrExactY === "number") yPos = anchorOrExactY;
              else {
                const mIdx = forceMIdx !== null ? forceMIdx : ports.score.getCurrentMeasureIndex();
                if (!targetStaffId) {
                  const hands = ports.fallbackHands();
                  const fallbackStaffId = midi >= 60 ? hands.right : hands.left;
                  targetStaffId = fallbackStaffId ?? hands.right ?? 1;
                }
                const staffIdx = Math.max(0, (Number(targetStaffId) || 1) - 1);
                const staffTopY = ports.score.getStaffTopY(mIdx, staffIdx);
                const pitchMap = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
                const step = (Math.floor(midi / 12) - 1) * 7 + (pitchMap[midi % 12] ?? NaN);
                const fallbackAnchor = staffIdx === 0 ? 38 : 26;
                yPos = staffTopY + (fallbackAnchor - step) * 5;
              }
              anchor = { x: center.x, y: yPos };
            }
          }
          return anchor;
        },
        ensureGroup(id) {
          const svg = this.getSvg();
          if (!svg)
            return null;
          let group = svg.querySelector(`#${id}`);
          if (!group) {
            group = ports.document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("id", id);
            group.setAttribute("pointer-events", "none");
            svg.appendChild(group);
          }
          return group;
        },
        makeNoteKey(sourceNote, measureIndex, staffIndex) {
          const voice = sourceNote?.ParentVoiceEntry;
          const timestamp = voice?.Timestamp?.RealValue ?? "na";
          const halfTone = sourceNote?.halfTone ?? "na";
          const length = sourceNote?.Length?.RealValue ?? "na";
          const staffId = sourceNote?.ParentStaff?.id ?? "na";
          return `${measureIndex}|${staffIndex}|${staffId}|${timestamp}|${halfTone}|${length}`;
        },
        getNoteheadShape(graphicalNote) {
          if (!graphicalNote)
            return null;
          const directCandidates = [
            graphicalNote.Notehead,
            graphicalNote.notehead,
            graphicalNote.NoteHead,
            graphicalNote.noteHead,
            graphicalNote.GraphicalNotehead,
            graphicalNote.graphicalNotehead,
            graphicalNote.graphicalNoteHead,
            graphicalNote.NoteHeads?.[0],
            graphicalNote.noteHeads?.[0],
            graphicalNote.noteheadShape,
            graphicalNote.NoteheadShape
          ].filter(Boolean);
          for (const candidate of directCandidates) {
            if (candidate?.PositionAndShape?.AbsolutePosition) {
              return candidate.PositionAndShape;
            }
          }
          const mainShape = graphicalNote?.PositionAndShape;
          const mainCenterX = ((mainShape?.AbsolutePosition?.x ?? 0) + (mainShape?.Size?.width ?? 0) / 2) * this.unitsToPx;
          const mainCenterY = ((mainShape?.AbsolutePosition?.y ?? 0) + (mainShape?.Size?.height ?? 0) / 2) * this.unitsToPx;
          const seen = /* @__PURE__ */ new WeakSet();
          const compactShapes = [];
          const bannedPathPattern = /(fing|finger|technical|techniq|lyric|text|label|annotation|ornament|artic|dynam|tempo|express|rehears|string|pedal)/i;
          const visit = (node, depth = 0, path = "") => {
            if (!node || typeof node !== "object" || depth > 4)
              return;
            if (seen.has(node))
              return;
            seen.add(node);
            if (path && bannedPathPattern.test(path))
              return;
            const ps = Reflect.get(node, "PositionAndShape");
            if (ps?.AbsolutePosition && ps?.Size) {
              const wPx = (ps.Size.width ?? 0) * this.unitsToPx;
              const hPx = (ps.Size.height ?? 0) * this.unitsToPx;
              if (wPx >= 3 && wPx <= 22 && hPx >= 3 && hPx <= 18) {
                compactShapes.push(ps);
              }
            }
            if (Array.isArray(node)) {
              for (let idx = 0; idx < node.length; idx++) {
                visit(node[idx], depth + 1, `${path}[${idx}]`);
              }
              return;
            }
            for (const key of Object.keys(node)) {
              if (key === "parent" || key === "Parent" || key === "sourceNote")
                continue;
              const nextPath = path ? `${path}.${key}` : key;
              if (bannedPathPattern.test(nextPath))
                continue;
              try {
                visit(Reflect.get(node, key), depth + 1, nextPath);
              } catch (e) {
              }
            }
          };
          visit(graphicalNote, 0, "graphicalNote");
          if (compactShapes.length === 0)
            return null;
          compactShapes.sort((a, b) => {
            const aw = (a.Size?.width ?? 0) * this.unitsToPx;
            const ah = (a.Size?.height ?? 0) * this.unitsToPx;
            const bw = (b.Size?.width ?? 0) * this.unitsToPx;
            const bh = (b.Size?.height ?? 0) * this.unitsToPx;
            const aArea = aw * ah;
            const bArea = bw * bh;
            const aCenterX = (a.AbsolutePosition.x + (a.Size?.width ?? 0) / 2) * this.unitsToPx;
            const aCenterY = (a.AbsolutePosition.y + (a.Size?.height ?? 0) / 2) * this.unitsToPx;
            const bCenterX = (b.AbsolutePosition.x + (b.Size?.width ?? 0) / 2) * this.unitsToPx;
            const bCenterY = (b.AbsolutePosition.y + (b.Size?.height ?? 0) / 2) * this.unitsToPx;
            const aAspect = aw / Math.max(ah, 1e-3);
            const bAspect = bw / Math.max(bh, 1e-3);
            const score = (area, aspect, cx, cy) => {
              const areaPenalty = Math.abs(area - 70);
              const aspectPenalty = Math.abs(aspect - 1.6) * 18;
              const distPenalty = Math.abs(cx - mainCenterX) * 0.65 + Math.abs(cy - mainCenterY) * 0.45;
              return areaPenalty + aspectPenalty + distPenalty;
            };
            return score(aArea, aAspect, aCenterX, aCenterY) - score(bArea, bAspect, bCenterX, bCenterY);
          });
          return compactShapes[0];
        },
        getSvgNoteheadAnchor(graphicalNote, preferredAnchor = null, debugContext = null) {
          if (!graphicalNote?.getSVGGElement)
            return null;
          let root = null;
          try {
            root = graphicalNote.getSVGGElement();
          } catch (e) {
            root = null;
          }
          if (!root || !root.querySelectorAll)
            return null;
          const rootBox = (() => {
            try {
              return root.getBBox();
            } catch (e) {
              return null;
            }
          })();
          const rootCenterX = rootBox ? rootBox.x + rootBox.width / 2 : null;
          const rootCenterY = rootBox ? rootBox.y + rootBox.height / 2 : null;
          const preferredX = preferredAnchor?.x ?? null;
          const preferredY = preferredAnchor?.y ?? null;
          const nodes = Array.from(root.querySelectorAll("*"));
          const candidates = [];
          for (const node of nodes) {
            if (!node || typeof node.getBBox !== "function")
              continue;
            const tag = (node.tagName || "").toLowerCase();
            if (!["path", "ellipse", "circle", "polygon"].includes(tag))
              continue;
            let box;
            try {
              box = node.getBBox();
            } catch (e) {
              continue;
            }
            const w = box?.width ?? 0;
            const h = box?.height ?? 0;
            if (w < 3 || w > 24 || h < 3 || h > 18)
              continue;
            const aspect = w / Math.max(h, 1e-3);
            if (aspect < 0.45 || aspect > 3.2)
              continue;
            const cx = box.x + w / 2;
            const cy = box.y + h / 2;
            const fill = (node.getAttribute("fill") || ports.getComputedStyle(node).fill || "").toLowerCase();
            const stroke = (node.getAttribute("stroke") || ports.getComputedStyle(node).stroke || "").toLowerCase();
            const filled = fill && fill !== "none" && fill !== "transparent" && !fill.includes("rgba(0, 0, 0, 0)");
            const stroked = stroke && stroke !== "none" && stroke !== "transparent" && !stroke.includes("rgba(0, 0, 0, 0)");
            const dx = preferredX == null ? 0 : Math.abs(cx - preferredX);
            const dy = preferredY == null ? 0 : Math.abs(cy - preferredY);
            const area = w * h;
            const relDx = preferredX == null ? null : cx - preferredX;
            const relDy = preferredY == null ? null : cy - preferredY;
            const isTinyDotLike = w <= 9.5 && h <= 9.5 || area <= 52;
            const isRoundDotLike = aspect >= 0.65 && aspect <= 1.55;
            const isRightSideDotLike = preferredX != null && preferredY != null && relDx >= 2 && relDx <= 18 && Math.abs(relDy) <= 5.6 && isTinyDotLike && isRoundDotLike;
            const isVerticalDotLike = preferredX != null && preferredY != null && Math.abs(relDx) <= 4.6 && Math.abs(relDy) >= 2 && Math.abs(relDy) <= 14 && isTinyDotLike && isRoundDotLike;
            const isDiagonalRightDotLike = preferredX != null && preferredY != null && relDx >= 2 && relDx <= 14 && Math.abs(relDy) >= 2 && Math.abs(relDy) <= 8 && isTinyDotLike && isRoundDotLike;
            if (isRightSideDotLike || isVerticalDotLike || isDiagonalRightDotLike) {
              ports.debugLog("SVG_NOTEHEAD_REJECT_DOTLIKE", {
                context: debugContext,
                preferredAnchor,
                rejected: {
                  x: cx,
                  y: cy,
                  w,
                  h,
                  area,
                  aspect,
                  dx: relDx,
                  dy: relDy,
                  reason: isRightSideDotLike ? "right-side-dot" : isVerticalDotLike ? "vertical-dot" : "diagonal-right-dot"
                }
              });
              continue;
            }
            const areaPenalty = Math.abs(area - 70);
            const aspectPenalty = Math.abs(aspect - 1.6) * 18;
            const centerXPenalty = rootCenterX == null ? 0 : Math.abs(cx - rootCenterX) * 0.25;
            const centerYPenalty = rootCenterY == null ? 0 : Math.abs(cy - rootCenterY) * 0.1;
            const preferredXPenalty = preferredX == null ? 0 : Math.abs(cx - preferredX) * 0.5;
            const preferredYPenalty = preferredY == null ? 0 : Math.abs(cy - preferredY) * 2.8;
            const fillBonus = filled ? -18 : 0;
            const strokePenalty = filled ? 0 : stroked ? 6 : 10;
            const score = areaPenalty + aspectPenalty + centerXPenalty + centerYPenalty + preferredXPenalty + preferredYPenalty + fillBonus + strokePenalty;
            candidates.push({ node, box, score });
          }
          if (candidates.length === 0) {
            ports.debugLog("SVG_NOTEHEAD_CANDIDATES_NONE", {
              context: debugContext,
              preferredAnchor
            });
            return null;
          }
          candidates.sort((a, b) => a.score - b.score);
          const selectCandidate = (() => {
            if (preferredX == null && preferredY == null)
              return candidates[0];
            const annotate = (items) => items.map((c) => {
              const cx = c.box.x + c.box.width / 2;
              const cy = c.box.y + c.box.height / 2;
              return {
                entry: c,
                cx,
                cy,
                xDistance: preferredX == null ? 0 : Math.abs(cx - preferredX),
                yDistance: preferredY == null ? 0 : Math.abs(cy - preferredY)
              };
            });
            const topScore = candidates[0].score;
            const closeScoreCandidates = candidates.filter((c) => c.score - topScore <= 18);
            const closeScoreAnnotated = annotate(closeScoreCandidates);
            const closeScoreMinCx = closeScoreAnnotated.length ? Math.min(...closeScoreAnnotated.map((item) => item.cx)) : null;
            const closeScoreMaxCx = closeScoreAnnotated.length ? Math.max(...closeScoreAnnotated.map((item) => item.cx)) : null;
            const closeScoreXSpan = closeScoreMinCx == null || closeScoreMaxCx == null ? Infinity : closeScoreMaxCx - closeScoreMinCx;
            const useChordClusterTieBreak = preferredY != null && closeScoreAnnotated.length > 1 && closeScoreXSpan <= 18;
            const anchorNeighborhood = useChordClusterTieBreak ? [] : annotate(candidates).filter((item) => item.xDistance <= 14 && item.yDistance <= 10);
            const geometricPool = useChordClusterTieBreak ? closeScoreAnnotated : anchorNeighborhood.length > 0 ? anchorNeighborhood : closeScoreAnnotated;
            if (geometricPool.length <= 1)
              return geometricPool[0]?.entry || closeScoreCandidates[0] || candidates[0];
            const ranked = geometricPool.sort((a, b) => {
              if (useChordClusterTieBreak) {
                if (a.yDistance !== b.yDistance)
                  return a.yDistance - b.yDistance;
                if (a.xDistance !== b.xDistance)
                  return a.xDistance - b.xDistance;
                return a.entry.score - b.entry.score;
              }
              if (a.xDistance !== b.xDistance)
                return a.xDistance - b.xDistance;
              if (a.yDistance !== b.yDistance)
                return a.yDistance - b.yDistance;
              return a.entry.score - b.entry.score;
            });
            const winner = ranked[0]?.entry || candidates[0];
            const logType = useChordClusterTieBreak ? "SVG_NOTEHEAD_CHORD_CLUSTER_TIEBREAK" : anchorNeighborhood.length > 0 ? "SVG_NOTEHEAD_ANCHOR_NEIGHBORHOOD_TIEBREAK" : "SVG_NOTEHEAD_X_PROXIMITY_TIEBREAK";
            ports.debugLog(logType, {
              context: debugContext,
              preferredAnchor,
              topScore,
              sameClusterXSpan: closeScoreXSpan,
              usedAnchorNeighborhood: anchorNeighborhood.length > 0,
              shortlisted: ranked.map((item) => ({
                x: item.cx,
                y: item.cy,
                w: item.entry.box.width,
                h: item.entry.box.height,
                score: item.entry.score,
                xDistance: item.xDistance,
                yDistance: item.yDistance
              })),
              chosen: {
                x: winner.box.x + winner.box.width / 2,
                y: winner.box.y + winner.box.height / 2,
                w: winner.box.width,
                h: winner.box.height,
                score: winner.score
              }
            });
            return winner;
          })();
          const best = selectCandidate.box;
          const selected = {
            x: best.x + best.width / 2,
            y: best.y + best.height / 2
          };
          ports.debugLog("SVG_NOTEHEAD_CANDIDATES", {
            context: debugContext,
            preferredAnchor,
            selected,
            candidates: candidates.slice(0, 6).map((c) => ({
              x: c.box.x + c.box.width / 2,
              y: c.box.y + c.box.height / 2,
              w: c.box.width,
              h: c.box.height,
              score: c.score
            }))
          });
          return selected;
        },
        getSafeFallbackAnchor(graphicalNote, measureIndex, staffIndex) {
          const noteheadShape = this.getNoteheadShape(graphicalNote);
          const shape = noteheadShape || graphicalNote?.PositionAndShape;
          if (!shape?.AbsolutePosition)
            return null;
          return {
            x: (shape.AbsolutePosition.x + (shape.Size?.width || 0) / 2) * this.unitsToPx,
            y: (shape.AbsolutePosition.y + (shape.Size?.height || 0) / 2) * this.unitsToPx,
            measureIndex,
            staffIndex
          };
        },
        getNoteAnchor(sourceNote, measureIndex, staffIndex) {
          if (this.noteAnchorCache.has(sourceNote)) {
            const cached = this.noteAnchorCache.get(sourceNote);
            ports.debugLog("ANCHOR_CACHE_HIT", {
              note: ports.describeNote(sourceNote, measureIndex, staffIndex),
              anchor: cached ? { x: cached.x, y: cached.y, measureIndex: cached.measureIndex, staffIndex: cached.staffIndex } : null
            });
            return cached;
          }
          const debugContext = {
            note: ports.describeNote(sourceNote, measureIndex, staffIndex),
            noteKey: this.makeNoteKey(sourceNote, measureIndex, staffIndex)
          };
          const graphicalNote = ports.score.getGraphicalNote(sourceNote, measureIndex, staffIndex);
          if (!graphicalNote) {
            ports.debugLog("ANCHOR_GRAPHICAL_NOTE_MISSING", debugContext);
            return null;
          }
          let anchor = null;
          let preferredAnchor = null;
          const noteheadShape = this.getNoteheadShape(graphicalNote);
          if (noteheadShape?.AbsolutePosition) {
            preferredAnchor = {
              x: (noteheadShape.AbsolutePosition.x + (noteheadShape.Size?.width || 0) / 2) * this.unitsToPx,
              y: (noteheadShape.AbsolutePosition.y + (noteheadShape.Size?.height || 0) / 2) * this.unitsToPx,
              measureIndex,
              staffIndex
            };
          } else {
            preferredAnchor = this.getSafeFallbackAnchor(graphicalNote, measureIndex, staffIndex);
          }
          ports.debugLog("ANCHOR_PREFERRED", {
            ...debugContext,
            graphical: ports.describeGraphicalNote(graphicalNote),
            preferredAnchor
          });
          const svgAnchor = this.getSvgNoteheadAnchor(graphicalNote, preferredAnchor, debugContext);
          if (svgAnchor) {
            anchor = {
              x: svgAnchor.x,
              y: svgAnchor.y,
              measureIndex,
              staffIndex
            };
          } else {
            anchor = preferredAnchor;
          }
          ports.debugLog("ANCHOR_FINAL", {
            ...debugContext,
            preferredAnchor,
            svgAnchor,
            finalAnchor: anchor
          });
          if (anchor)
            this.noteAnchorCache.set(sourceNote, anchor);
          return anchor;
        },
        getMeasureBox(measureIndex, staffIndex = 0) {
          const key = `${measureIndex}|${staffIndex}`;
          if (this.measureBoxCache.has(key))
            return this.measureBoxCache.get(key);
          const box = ports.score.getMeasureBox(measureIndex, staffIndex, this.unitsToPx);
          if (box)
            this.measureBoxCache.set(key, box);
          return box;
        }
      };
      return engine;
    }
    PianoTrainerGeometry2.create = create;
  })(PianoTrainerGeometry || (PianoTrainerGeometry = {}));

  // src/render/loop-overlay.ts
  var PianoTrainerLoopOverlay;
  ((PianoTrainerLoopOverlay2) => {
    function create(ports) {
      function getGroup() {
        return ports.ensureGroup("pt-looper-group");
      }
      function clear() {
        ports.getSvg()?.querySelector("#pt-looper-group")?.replaceChildren();
      }
      function render() {
        clear();
        if (!ports.enabled()) return;
        const count = ports.measureCount();
        if (count === null) return;
        const group = getGroup();
        if (!group) return;
        const minIdx = ports.bounds.min - 1, maxIdx = ports.bounds.max - 1;
        const displayed = ports.displayMeasures?.() || Array.from({ length: count }, (_, index) => ({ index, box: ports.measureBox(index, 0) }));
        for (const { index: i, box } of displayed) {
          if (!box) continue;
          if (i < minIdx || i > maxIdx) {
            const shade = ports.document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shade.setAttribute("x", String(box.x));
            shade.setAttribute("y", String(box.y));
            shade.setAttribute("width", String(box.width));
            shade.setAttribute("height", String(box.height));
            shade.setAttribute("fill", "rgba(128, 128, 128, 0.35)");
            group.appendChild(shade);
          }
          if (i === minIdx || i === maxIdx) {
            const bracket = ports.document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bracket.setAttribute("x", String(i === minIdx ? box.x : box.x + box.width - 6));
            bracket.setAttribute("y", String(box.y));
            bracket.setAttribute("width", "6");
            bracket.setAttribute("height", String(box.height));
            bracket.setAttribute("fill", "#3498db");
            group.appendChild(bracket);
          }
        }
      }
      return { getGroup, clear, render };
    }
    PianoTrainerLoopOverlay2.create = create;
  })(PianoTrainerLoopOverlay || (PianoTrainerLoopOverlay = {}));

  // src/render/score-renderer.ts
  var PianoTrainerScoreRenderer;
  ((PianoTrainerScoreRenderer2) => {
    function create(ports) {
      function renderScoreAndRefreshGeometry() {
        if (!ports.score.isReady()) return;
        ports.beforeRender?.();
        ports.score.render();
        ports.invalidateGeometry();
        ports.afterRender();
        ports.renderFeedback();
        ports.renderLoop();
        ports.renderDebug();
      }
      return { renderScoreAndRefreshGeometry };
    }
    PianoTrainerScoreRenderer2.create = create;
  })(PianoTrainerScoreRenderer || (PianoTrainerScoreRenderer = {}));

  // src/render/traditional-scroll-policy.ts
  var PianoTrainerTraditionalScroll;
  ((PianoTrainerTraditionalScroll2) => {
    function classify(previous, current) {
      if (!previous || previous.scoreRevision !== current.scoreRevision) return "navigation";
      const freshEvent = current.eventId !== previous.eventId || current.runId !== previous.runId;
      if (freshEvent && current.reason && current.reason !== "advance" || current.runId !== null && previous.runId !== null && current.runId !== previous.runId || current.loopIteration !== null && previous.loopIteration !== null && current.loopIteration !== previous.loopIteration || current.traceStepIndex < previous.traceStepIndex || current.measureIndex < previous.measureIndex || current.measureIndex === previous.measureIndex && (current.timestampWhole !== null && previous.timestampWhole !== null && current.timestampWhole < previous.timestampWhole || current.occurrenceId !== null && previous.occurrenceId !== null && current.occurrenceId !== previous.occurrenceId)) return "navigation";
      if (current.layoutRevision !== previous.layoutRevision) return "visibility";
      if (current.systemId === previous.systemId) return "same";
      return current.systemId !== null && previous.systemId !== null && current.systemId === previous.systemId + 1 ? "adjacent" : "visibility";
    }
    PianoTrainerTraditionalScroll2.classify = classify;
    PianoTrainerTraditionalScroll2.dockingFraction = 0.06;
    PianoTrainerTraditionalScroll2.completionFraction = 0.6;
    PianoTrainerTraditionalScroll2.smoothingMilliseconds = 150;
    const clamp = (value, low, high) => Math.max(low, Math.min(value, high));
    function decide(input) {
      const { height: h, cursor, system } = input;
      const s = input.scrollTop, max = Math.max(0, input.maxScroll);
      const margin = clamp(h * 0.04, 12, 32), pt = Math.max(margin, input.topObstruction || 0), pb = margin;
      const hold = { dock: s, minimum: s };
      if (!Number.isFinite(h) || h <= 0 || ![s, max, cursor.top, cursor.bottom].every(Number.isFinite)) return hold;
      const safe = (box) => box.top - s >= pt - 3 && box.bottom - s <= h - pb + 3;
      let target = s;
      const valid = system && [system.top, system.bottom].every(Number.isFinite) && system.bottom > system.top;
      const low = valid ? Math.max(0, system.bottom - h + pb) : Infinity;
      const high = valid ? Math.min(max, system.top - pt) : -Infinity;
      if (valid && low <= high) {
        target = clamp(system.top - (pt + Math.max(0, h - pt - pb) * PianoTrainerTraditionalScroll2.dockingFraction), low, high);
        if (safe(system) && target <= s + 3) return hold;
        return { dock: target, minimum: clamp(s, low, high) };
      } else {
        if (cursor.bottom - cursor.top > h - pt - pb) {
          if (cursor.top - s >= pt - 3 && cursor.top - s <= h - pb + 3) return hold;
          target = cursor.top - pt;
        } else if (safe(cursor)) return hold;
        else if (cursor.top - s < pt) target = cursor.top - pt;
        else if (cursor.bottom - s > h - pb) target = cursor.bottom - h + pb;
      }
      target = clamp(target, 0, max);
      if (Math.abs(target - s) <= 3) return hold;
      return { dock: target, minimum: target };
    }
    PianoTrainerTraditionalScroll2.decide = decide;
    function progressTarget(from, dock, progress) {
      return from + Math.max(0, dock - from) * clamp(progress / PianoTrainerTraditionalScroll2.completionFraction, 0, 1);
    }
    PianoTrainerTraditionalScroll2.progressTarget = progressTarget;
    function approach(current, target, elapsedMs) {
      if (Math.abs(target - current) <= 0.5) return target;
      return current + (target - current) * (1 - Math.exp(-clamp(elapsedMs, 0, 50) / PianoTrainerTraditionalScroll2.smoothingMilliseconds));
    }
    PianoTrainerTraditionalScroll2.approach = approach;
  })(PianoTrainerTraditionalScroll || (PianoTrainerTraditionalScroll = {}));

  // src/render/score-viewport.ts
  var PianoTrainerScoreViewport;
  ((PianoTrainerScoreViewport2) => {
    function create(ports) {
      const { elements, score, state } = ports;
      let mode = "traditional";
      let defaults = null;
      let frame = null, targetLeft = 0, previousTime = 0;
      let initialized = false;
      let verticalFrame = null, generation = 0, dirty = false;
      let previous = null, recheck = null;
      let resume = false, nativeScroll = false, framesRun = 0, framesRequested = 0;
      let vertical = null, verticalTime = 0;
      let snapshot = null;
      let measuredSystem = null;
      let lastKind = null;
      let renderedTop = null;
      const area = () => elements.area;
      const isHorizontal = () => mode === "horizontal";
      const follows = () => elements.autoScroll.checked !== false;
      function stopNativeScroll() {
        if (nativeScroll) area().scrollTo({ top: area().scrollTop, behavior: "instant" });
        nativeScroll = false;
      }
      function cancel() {
        if (frame !== null) ports.cancelFrame(frame);
        frame = null;
        previousTime = 0;
        generation++;
        if (verticalFrame !== null) ports.cancelFrame(verticalFrame);
        verticalFrame = null;
        vertical = null;
        snapshot = null;
        verticalTime = 0;
        dirty = false;
        recheck = null;
        resume = true;
        stopNativeScroll();
      }
      function scheduleVertical() {
        if (verticalFrame !== null || !initialized || !follows() || isHorizontal()) return;
        if (ports.traditional?.lifecycle?.visibilityState === "hidden") return;
        const epoch = generation;
        framesRequested++;
        verticalFrame = ports.requestFrame((time) => {
          if (epoch === generation) animateVertical(time);
        });
      }
      function legacyPosition(cursor) {
        vertical = null;
        stopNativeScroll();
        const viewport = area(), height = viewport.getBoundingClientRect().height;
        const screenY = cursor.top - viewport.scrollTop;
        if (screenY > height * 0.6 || screenY < 0) {
          const target = Math.max(0, Math.min(viewport.scrollHeight - viewport.clientHeight, cursor.top - height * 0.1));
          if (ports.prefersReducedMotion()) viewport.scrollTop = target;
          else {
            viewport.scrollTo({ top: target, behavior: "smooth" });
            nativeScroll = true;
          }
        }
      }
      function animateVertical(time) {
        verticalFrame = null;
        framesRun++;
        if (!follows() || isHorizontal()) return;
        if (dirty) {
          dirty = false;
          snapshot = ports.traditional?.read() ?? null;
          if (snapshot) {
            const classification = PianoTrainerTraditionalScroll.classify(previous, snapshot.position);
            const unchanged = previous && previous.scoreRevision === snapshot.position.scoreRevision && previous.layoutRevision === snapshot.position.layoutRevision && previous.traceStepIndex === snapshot.position.traceStepIndex && previous.eventId === snapshot.position.eventId && previous.runId === snapshot.position.runId;
            const kind = recheck === "align" ? "align" : classification === "navigation" ? classification : recheck || (resume ? "align" : classification);
            lastKind = kind;
            const reevaluate = !!recheck || resume;
            recheck = null;
            resume = false;
            previous = { ...snapshot.position };
            measuredSystem = snapshot.system;
            if (!unchanged || reevaluate) {
              if (kind === "navigation") {
                vertical = null;
                legacyPosition(snapshot.cursor);
              }
              if (!vertical || vertical.navigation || kind !== "same" || reevaluate || nativeScroll || Math.abs(area().scrollTop - vertical.value) > 2) {
                if (kind !== "navigation") stopNativeScroll();
                const decision = PianoTrainerTraditionalScroll.decide({
                  height: area().clientHeight,
                  scrollTop: area().scrollTop,
                  maxScroll: area().scrollHeight - area().clientHeight,
                  system: snapshot.system,
                  cursor: snapshot.cursor,
                  topObstruction: snapshot.topObstruction
                });
                const profile = kind === "same" && vertical?.navigation ? vertical.profile : snapshot.system ? ports.traditional.buildProgress(snapshot.system, snapshot.position) : null;
                const point = profile?.steps.find((point2) => point2.traceStepIndex === snapshot.position.traceStepIndex) ?? null;
                const playback = snapshot.mode === "realtime" ? ports.traditional.readPlayback(snapshot.position) : null;
                vertical = {
                  from: area().scrollTop,
                  value: area().scrollTop,
                  dock: decision.dock,
                  minimum: decision.minimum,
                  target: kind === "navigation" ? area().scrollTop : decision.minimum,
                  navigation: kind === "navigation",
                  systemId: snapshot.position.systemId,
                  profile,
                  point,
                  progress: 0,
                  consumedAtStart: reevaluate && point ? point.durationBeats * (playback?.fraction ?? 0) : 0
                };
                verticalTime = time;
              } else {
                vertical.point = vertical.profile?.steps.find((point) => point.traceStepIndex === snapshot.position.traceStepIndex) ?? null;
              }
            }
          } else vertical = null;
        }
        let tracking = false, approaching = false;
        if (vertical && snapshot && !vertical.navigation && !nativeScroll) {
          if (Math.abs(area().scrollTop - vertical.value) > 2) {
            cancel();
            resume = false;
            return;
          }
          const playback = snapshot.mode === "realtime" && ports.traditional.isPlaying() ? ports.traditional.readPlayback(snapshot.position) : null;
          const { profile, point, consumedAtStart } = vertical;
          if (profile && point && profile.totalBeats > consumedAtStart) {
            const completed = point.completedBeats + point.durationBeats * (playback?.fraction ?? 0);
            vertical.progress = Math.max(vertical.progress, Math.min(1, Math.max(
              0,
              (completed - consumedAtStart) / (profile.totalBeats - consumedAtStart)
            )));
            vertical.target = vertical.dock < vertical.from ? vertical.minimum : Math.max(vertical.minimum, PianoTrainerTraditionalScroll.progressTarget(vertical.from, vertical.dock, vertical.progress));
            tracking = !!playback?.moving && vertical.progress < PianoTrainerTraditionalScroll.completionFraction && vertical.dock > vertical.from + 0.5;
          }
          const elapsed = verticalTime ? time - verticalTime : 16;
          verticalTime = time;
          vertical.value = ports.prefersReducedMotion() ? vertical.target : PianoTrainerTraditionalScroll.approach(vertical.value, vertical.target, elapsed);
          approaching = Math.abs(vertical.value - vertical.target) > 0.5;
          if (!approaching) vertical.value = vertical.target;
          area().scrollTop = vertical.value;
        }
        if (dirty || tracking || approaching) scheduleVertical();
      }
      function animate(time) {
        frame = null;
        if (!isHorizontal() || !follows()) return;
        const viewport = area();
        targetLeft = getTargetLeft(viewport);
        const delta = targetLeft - viewport.scrollLeft;
        const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
        previousTime = time;
        if (Math.abs(delta) < 1) {
          viewport.scrollLeft = targetLeft;
          previousTime = 0;
          return;
        }
        const step = Math.max(1, Math.abs(delta) * (1 - Math.exp(-elapsed / 90)));
        viewport.scrollLeft += Math.sign(delta) * Math.min(Math.abs(delta), step);
        frame = ports.requestFrame(animate);
      }
      function getTargetLeft(viewport) {
        const cursor = score.getCursorElement();
        if (!cursor || cursor.style.display === "none") return viewport.scrollLeft;
        const bounds = viewport.getBoundingClientRect(), rect = cursor.getBoundingClientRect();
        const contentX = viewport.scrollLeft + rect.left + rect.width / 2 - bounds.left - viewport.clientLeft;
        return Math.max(0, Math.min(contentX - viewport.clientWidth * 0.33, viewport.scrollWidth - viewport.clientWidth));
      }
      function follow({ immediate = false } = {}) {
        if (!isHorizontal()) return;
        if (!follows()) {
          cancel();
          return;
        }
        const viewport = area();
        targetLeft = getTargetLeft(viewport);
        if (immediate || ports.prefersReducedMotion()) {
          cancel();
          viewport.scrollLeft = targetLeft;
        } else if (frame === null) frame = ports.requestFrame(animate);
      }
      function beforeRender() {
        cancel();
        renderedTop = isHorizontal() ? null : area().scrollTop;
      }
      function afterRender() {
        cancel();
        ports.refreshPresentation?.();
        for (const expected of state.expectedNotes) {
          if (expected.noteRef) expected.anchor = ports.getAnchor(expected.noteRef, expected.mIdx, Number(expected.staffId) - 1);
        }
        score.afterRender(true);
        if (!isHorizontal()) {
          if (renderedTop !== null) area().scrollTop = Math.max(0, Math.min(renderedTop, area().scrollHeight - area().clientHeight));
          renderedTop = null;
          resume = false;
          recheck = "visibility";
          autoScroll();
          return;
        }
        const width = ports.getSvg()?.getBoundingClientRect().width || 0;
        elements.wrapper.style.width = `${Math.max(area().clientWidth, width)}px`;
        score.getCursorElement()?.classList.add("horizontal-score-cursor");
        follow({ immediate: true });
      }
      function autoScroll() {
        if (isHorizontal()) {
          follow();
          return;
        }
        if (!follows()) return;
        if (ports.traditional) {
          dirty = true;
          scheduleVertical();
          return;
        }
        const cursor = score.getCursorElement();
        if (!cursor) return;
        const viewport = area(), bounds = viewport.getBoundingClientRect(), rect = cursor.getBoundingClientRect();
        const cursorScreenY = rect.top - bounds.top;
        if (cursorScreenY > bounds.height * 0.6 || cursorScreenY < 0) {
          viewport.scrollTo({ top: Math.max(0, viewport.scrollTop + cursorScreenY - bounds.height * 0.1), behavior: "smooth" });
        }
      }
      function setMode(value, { save = true } = {}) {
        const next = value === "horizontal" ? "horizontal" : "traditional";
        elements.layout.value = next;
        if (save) {
          try {
            ports.storage.setItem(ports.storageKey, next);
          } catch (_) {
          }
        }
        if (next === mode) return;
        if (!defaults) throw new Error("Score viewport must be initialized before changing layout.");
        cancel();
        mode = next;
        area().classList.toggle("score-horizontal", isHorizontal());
        elements.wrapper.style.width = "";
        score.getCursorElement()?.classList.remove("horizontal-score-cursor");
        score.setLayout(isHorizontal(), defaults);
        area().scrollLeft = 0;
        area().scrollTop = 0;
        if (score.isReady()) {
          const wrongPress = state.realtimeWrongPressInCurrentContext;
          if (!ports.refreshPresentation) ports.clearFeedbackPreserveScoring();
          state.realtimeWrongPressInCurrentContext = wrongPress;
          ports.renderScoreAndRefreshGeometry();
          autoScroll();
        }
      }
      const onLayoutChange = (event) => {
        if (event.target instanceof HTMLSelectElement) setMode(event.target.value);
      };
      const onAutoScrollChange = () => {
        ports.refreshPresentation?.();
        if (follows()) {
          if (isHorizontal()) follow();
          else {
            recheck = "align";
            autoScroll();
          }
        } else cancel();
      };
      const onManualScroll = () => {
        cancel();
        resume = false;
      };
      const onVisibility = () => {
        if (ports.traditional?.lifecycle?.visibilityState !== "visible") cancel();
        else if (ports.traditional.isPlaying()) autoScroll();
      };
      function init() {
        if (initialized) return;
        defaults ?? (defaults = score.getDefaults());
        let saved;
        try {
          saved = ports.storage.getItem(ports.storageKey);
        } catch (_) {
        }
        setMode(saved, { save: false });
        elements.layout.addEventListener("change", onLayoutChange);
        elements.autoScroll.addEventListener("change", onAutoScrollChange);
        area().addEventListener("wheel", onManualScroll, { passive: true });
        area().addEventListener("touchstart", onManualScroll, { passive: true });
        ports.traditional?.lifecycle?.addEventListener("visibilitychange", onVisibility);
        initialized = true;
      }
      function dispose() {
        cancel();
        elements.layout.removeEventListener("change", onLayoutChange);
        elements.autoScroll.removeEventListener("change", onAutoScrollChange);
        area().removeEventListener("wheel", onManualScroll);
        area().removeEventListener("touchstart", onManualScroll);
        ports.traditional?.lifecycle?.removeEventListener("visibilitychange", onVisibility);
        initialized = false;
      }
      return {
        init,
        dispose,
        setMode,
        isHorizontal,
        follow,
        beforeRender,
        afterRender,
        autoScroll,
        cancel,
        readTraditionalState: () => ({
          framePending: verticalFrame !== null,
          active: verticalFrame !== null,
          framesRun,
          framesRequested,
          position: previous ? { ...previous } : null,
          system: measuredSystem ? { ...measuredSystem } : null,
          animation: vertical ? {
            from: vertical.from,
            target: vertical.target,
            dock: vertical.dock,
            progress: vertical.progress,
            totalBeats: vertical.profile?.totalBeats ?? null,
            systemId: vertical.systemId
          } : null,
          lastKind
        })
      };
    }
    PianoTrainerScoreViewport2.create = create;
  })(PianoTrainerScoreViewport || (PianoTrainerScoreViewport = {}));

  // src/render/traditional-scroll-geometry.ts
  function systemBoundsInContent(bounds, svg, area) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const rect = area.getBoundingClientRect();
    const point = (x, y) => ({
      x: matrix.a * x + matrix.c * y + matrix.e - rect.left - area.clientLeft + area.scrollLeft,
      y: matrix.b * x + matrix.d * y + matrix.f - rect.top - area.clientTop + area.scrollTop
    });
    const corners = [point(bounds.left, bounds.top), point(bounds.right, bounds.top), point(bounds.left, bounds.bottom), point(bounds.right, bounds.bottom)];
    return {
      ...bounds,
      left: Math.min(...corners.map((p) => p.x)),
      right: Math.max(...corners.map((p) => p.x)),
      top: Math.min(...corners.map((p) => p.y)),
      bottom: Math.max(...corners.map((p) => p.y))
    };
  }

  // src/score/system-progress.ts
  function buildSystemProgress(input) {
    const steps = [];
    let totalBeats = 0;
    for (let index = input.traceStepIndex; index < input.trace.steps.length; index++) {
      if (steps.length >= 1e5) return null;
      const step = input.trace.steps[index], next = input.trace.steps[index + 1];
      const measure = step.source.sourceMeasureIndex;
      if (measure < input.firstMeasureIndex || measure > input.lastMeasureIndex || input.loopMax !== null && measure > input.loopMax) break;
      const fallbackLength = step.notes[0]?.lengthWhole ?? 1;
      const durationBeats = PianoTrainerTiming.getTraversalBeatsToWait({
        currentMeasureIdx: measure,
        currentTimestamp: step.source.timestampWhole,
        nextMeasureIdx: next?.source.sourceMeasureIndex ?? measure,
        nextTimestamp: next?.source.timestampWhole ?? step.source.timestampWhole + fallbackLength,
        fallbackLength,
        getMeasureTimingInfo: input.getMeasureTimingInfo
      });
      if (!Number.isFinite(durationBeats) || durationBeats < 0) return null;
      steps.push({ traceStepIndex: index, completedBeats: totalBeats, durationBeats });
      totalBeats += durationBeats;
      if (!next || next.source.sourceMeasureIndex < measure || next.source.timestampWhole < step.source.timestampWhole || next.source.sourceMeasureIndex === measure && next.measureOccurrenceId !== step.measureOccurrenceId) break;
    }
    return Number.isFinite(totalBeats) && totalBeats > 0 ? { totalBeats, steps } : null;
  }

  // src/render/horizontal-chunks.ts
  var PianoTrainerHorizontalChunks;
  ((PianoTrainerHorizontalChunks2) => {
    PianoTrainerHorizontalChunks2.MEASURES_PER_CHUNK = 8;
    PianoTrainerHorizontalChunks2.WINDOW_CHUNKS = 7;
    PianoTrainerHorizontalChunks2.CACHE_MODELS = 16;
    function split(path, prefix, loop) {
      const result = [];
      for (let start = 0; start < path.length; start += PianoTrainerHorizontalChunks2.MEASURES_PER_CHUNK) {
        const end = Math.min(path.length, start + PianoTrainerHorizontalChunks2.MEASURES_PER_CHUNK);
        result.push({
          key: `${prefix}/${start}`,
          measures: path.slice(start, end),
          context: { path, start, end, cyclic: loop },
          before: path[start - 1] || (loop ? path[path.length - 1] : null),
          after: path[end] || (loop ? path[0] : null),
          width: 0,
          height: 0,
          offset: 0
        });
      }
      return result;
    }
    function define(trace, loop, currentOccurrence = 0) {
      const start = trace.measures.findIndex((measure) => measure.sourceMeasureIndex >= loop.min - 1);
      let stop = trace.measures.findIndex((measure, index) => index >= Math.max(0, start) && measure.sourceMeasureIndex > loop.max - 1);
      if (stop < 0) stop = trace.measures.length;
      let initialStop = loop.enabled ? trace.measures.findIndex((measure, index) => index > currentOccurrence && measure.sourceMeasureIndex > loop.max - 1) : -1;
      if (initialStop < 0) initialStop = trace.measures.length;
      const initial = split(trace.measures.slice(0, initialStop), "initial", false);
      const repeated = loop.enabled && start >= 0 ? split(trace.measures.slice(start, stop), "loop", true) : [];
      let initialWidth = 0, repeatedWidth = 0;
      function layout() {
        initialWidth = 0;
        repeatedWidth = 0;
        for (const definition of initial) {
          definition.offset = initialWidth;
          initialWidth += definition.width;
        }
        for (const definition of repeated) {
          definition.offset = repeatedWidth;
          repeatedWidth += definition.width;
        }
      }
      function address(index) {
        if (index < 0 || !Number.isInteger(index)) return null;
        if (index < initial.length) {
          const definition2 = initial[index];
          return { index, iteration: 0, definition: definition2, offset: definition2.offset };
        }
        if (!repeated.length) return null;
        const relative = index - initial.length;
        const iteration = Math.floor(relative / repeated.length) + 1;
        const definition = repeated[relative % repeated.length];
        return { index, iteration, definition, offset: initialWidth + (iteration - 1) * repeatedWidth + definition.offset };
      }
      function forEvent(event) {
        const definitions = event.loopIteration > 0 && repeated.length ? repeated : initial;
        const index = definitions.findIndex((definition) => definition.measures.some((measure) => measure.measureOccurrenceId === event.measureOccurrenceId));
        if (index < 0) return null;
        return address(definitions === initial ? index : initial.length + (event.loopIteration - 1) * repeated.length + index);
      }
      return {
        initial,
        repeated,
        layout,
        address,
        forEvent,
        definitions: [...initial, ...repeated],
        finiteCount: () => repeated.length ? null : initial.length
      };
    }
    PianoTrainerHorizontalChunks2.define = define;
    function windowAround(index, finiteCount) {
      const start = Math.max(0, index - 2);
      return { start, end: Math.min(start + PianoTrainerHorizontalChunks2.WINDOW_CHUNKS - 1, finiteCount === null ? Infinity : finiteCount - 1) };
    }
    PianoTrainerHorizontalChunks2.windowAround = windowAround;
    function compensatedScroll(oldScroll, oldOrigin, newOrigin, zoom) {
      return oldScroll + (oldOrigin - newOrigin) * zoom;
    }
    PianoTrainerHorizontalChunks2.compensatedScroll = compensatedScroll;
  })(PianoTrainerHorizontalChunks || (PianoTrainerHorizontalChunks = {}));

  // src/score/score-traversal.ts
  var PianoTrainerScoreTraversal;
  ((PianoTrainerScoreTraversal2) => {
    function isRenderableAttackNote(note) {
      if (!note || note.isRest && note.isRest())
        return false;
      const isInvisibleCue = note.Notehead === "none" || note.PrintObject === false || note.isCueNote === true;
      if (isInvisibleCue)
        return false;
      const tie = note.NoteTie;
      const isTieContinuation = !!(tie && tie.StartNote && tie.StartNote !== note);
      if (isTieContinuation)
        return false;
      return true;
    }
    PianoTrainerScoreTraversal2.isRenderableAttackNote = isRenderableAttackNote;
    function makeEntrySignature(entries) {
      const parts = [];
      (entries || []).forEach((entry) => {
        (entry?.Notes || []).forEach((note) => {
          const staffId = Number(note?.ParentStaff?.id) || 0;
          const midi = note?.halfTone != null ? note.halfTone + 12 : "rest";
          const length = note?.Length?.RealValue ?? "na";
          const tieState = note?.NoteTie && note.NoteTie.StartNote && note.NoteTie.StartNote !== note ? "tiecont" : "attack";
          const restFlag = note?.isRest && note.isRest() ? "rest" : "note";
          parts.push(`${staffId}:${midi}:${length}:${tieState}:${restFlag}`);
        });
      });
      parts.sort();
      return parts.join("|");
    }
    PianoTrainerScoreTraversal2.makeEntrySignature = makeEntrySignature;
    function findMatchingTimelineIndex(timeline, measureIndex, timestamp, signature, startIndex = 0) {
      if (!Array.isArray(timeline) || timeline.length === 0)
        return -1;
      for (let i = Math.max(0, startIndex); i < timeline.length; i++) {
        const event = timeline[i];
        if (event.measureIndex === measureIndex && event.timestamp === timestamp && event.signature === signature) {
          return i;
        }
      }
      return -1;
    }
    PianoTrainerScoreTraversal2.findMatchingTimelineIndex = findMatchingTimelineIndex;
    function create(ports) {
      const state = ports.state;
      function getHandStatePrefix(staffId) {
        return ports.getHandRole(staffId) === "left" ? "l" : "r";
      }
      function describeEntries(entries, measureIndex = null, timestamp = null) {
        if (!entries || entries.length === 0) {
          return { measureIndex, timestamp, notes: [] };
        }
        const notes = [];
        entries.forEach((entry) => {
          (entry.Notes || []).forEach((note) => {
            notes.push({
              staffId: ports.resolveStaffId(note),
              midi: note?.halfTone != null ? note.halfTone + 12 : null,
              isRest: !!(note?.isRest && note.isRest()),
              isTieContinuation: !!(note?.NoteTie && note.NoteTie.StartNote && note.NoteTie.StartNote !== note)
            });
          });
        });
        return { measureIndex, timestamp, notes };
      }
      function collectRenderablePreviewNotes(entries, previewDepthIndex) {
        const mergedNotes = /* @__PURE__ */ new Map();
        (entries || []).forEach((entry) => {
          (entry?.Notes || []).forEach((note) => {
            const staffId = ports.resolveStaffId(note);
            if (!ports.isPracticeHandEnabled(staffId))
              return;
            if (!isRenderableAttackNote(note))
              return;
            const midi = note.halfTone + 12;
            if (!ports.isMidiInRange(midi))
              return;
            const key = `${staffId}|${midi}`;
            if (!mergedNotes.has(key)) {
              mergedNotes.set(key, {
                midi,
                staffId,
                state: `future${previewDepthIndex}-${getHandStatePrefix(staffId)}`
              });
            }
          });
        });
        return Array.from(mergedNotes.values());
      }
      function buildTimelineEvent(entries, measureIndex, timestamp) {
        return {
          measureIndex,
          timestamp,
          signature: makeEntrySignature(entries),
          notes: collectRenderablePreviewNotes(entries, 1)
        };
      }
      function restoreToMeasureAndTimestamp(targetMeasureIndex, targetTimestamp) {
        const cursor = ports.getCursor();
        if (!cursor)
          return;
        cursor.reset();
        const safetyMax = 1e5;
        let safety = 0;
        while (!cursor.Iterator.EndReached && safety < safetyMax) {
          const measureIndex = cursor.Iterator.CurrentMeasureIndex;
          const timestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;
          if (measureIndex === targetMeasureIndex && timestamp === targetTimestamp) {
            break;
          }
          cursor.Iterator.moveToNext();
          safety += 1;
        }
        cursor.update();
      }
      function ensurePreviewTimelineBuilt() {
        if (!state.ledPreviewTimelineDirty && Array.isArray(state.ledPreviewTimeline) && state.ledPreviewTimeline.length > 0) {
          return state.ledPreviewTimeline;
        }
        const cursor = ports.getCursor();
        if (!cursor?.Iterator) {
          state.ledPreviewTimeline = [];
          return state.ledPreviewTimeline;
        }
        const savedMeasureIndex = cursor.Iterator.CurrentMeasureIndex;
        const savedTimestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;
        const timeline = [];
        const safetyMax = 1e5;
        let safety = 0;
        const iterator = ports.getIndependentIterator?.() || (cursor.reset(), cursor.Iterator);
        while (!iterator.EndReached && safety < safetyMax) {
          const entries = iterator.CurrentVoiceEntries;
          if (entries && entries.length > 0) {
            timeline.push({ ...buildTimelineEvent(entries, iterator.CurrentMeasureIndex, iterator.currentTimeStamp?.RealValue ?? null), traceStepIndex: safety });
          }
          iterator.moveToNext();
          safety += 1;
        }
        if (!iterator.EndReached) throw new Error(`Preview traversal exceeds ${safetyMax} events.`);
        if (!ports.getIndependentIterator) restoreToMeasureAndTimestamp(savedMeasureIndex, savedTimestamp);
        state.ledPreviewTimeline = timeline;
        state.ledPreviewTimelineDirty = false;
        state.ledPreviewTraversalIndex = -1;
        return timeline;
      }
      function resolveTraversalIndex(currentEntries, currentMeasureIdx, currentTimestamp) {
        const timeline = ensurePreviewTimelineBuilt();
        if (!timeline.length)
          return -1;
        const signature = makeEntrySignature(currentEntries);
        const currentIndex = state.ledPreviewTraversalIndex;
        if (currentIndex >= 0 && currentIndex < timeline.length) {
          const currentEvent = timeline[currentIndex];
          if (currentEvent.measureIndex === currentMeasureIdx && currentEvent.timestamp === currentTimestamp && currentEvent.signature === signature) {
            return currentIndex;
          }
        }
        const forwardIndex = findMatchingTimelineIndex(timeline, currentMeasureIdx, currentTimestamp, signature, currentIndex >= 0 ? currentIndex + 1 : 0);
        if (forwardIndex !== -1) {
          state.ledPreviewTraversalIndex = forwardIndex;
          return forwardIndex;
        }
        const restartIndex = findMatchingTimelineIndex(timeline, currentMeasureIdx, currentTimestamp, signature, 0);
        state.ledPreviewTraversalIndex = restartIndex;
        return restartIndex;
      }
      function collectFuturePreviewEvents(currentEntries, currentMeasureIdx, currentTimestamp, depth) {
        const requestedDepth = Math.max(0, Math.min(2, Number(depth) || 0));
        if (requestedDepth <= 0)
          return [];
        if (!state.isPlaying || state.countInActive)
          return [];
        ports.debugLog("LED_PREVIEW_CURSOR_EVENT", describeEntries(currentEntries, currentMeasureIdx, currentTimestamp));
        const timeline = ensurePreviewTimelineBuilt();
        const currentIndex = resolveTraversalIndex(currentEntries, currentMeasureIdx, currentTimestamp);
        if (!timeline.length || currentIndex < 0) {
          for (let i = 0; i < requestedDepth; i++) {
            ports.debugLog(`LED_FUTURE_${i + 1}_SELECTED`, { skipped: true, reason: "timeline-index-unresolved" });
          }
          return [];
        }
        const currentEvent = timeline[currentIndex];
        if (!currentEvent?.notes?.length) {
          for (let i = 0; i < requestedDepth; i++) {
            ports.debugLog(`LED_FUTURE_${i + 1}_SELECTED`, { skipped: true, reason: "current-event-has-no-renderable-attacks" });
          }
          return [];
        }
        const results = [];
        for (let i = currentIndex + 1; i < timeline.length && results.length < requestedDepth; i++) {
          const event = timeline[i];
          if (!event?.notes?.length)
            continue;
          const depthIndex = results.length + 1;
          const previewEvent = {
            measureIndex: event.measureIndex,
            timestamp: event.timestamp,
            notes: event.notes.map((note) => ({
              ...note,
              state: `future${depthIndex}-${getHandStatePrefix(note.staffId)}`
            }))
          };
          results.push(previewEvent);
          ports.debugLog(`LED_FUTURE_${depthIndex}_SELECTED`, {
            measureIndex: previewEvent.measureIndex,
            timestamp: previewEvent.timestamp,
            notes: previewEvent.notes.map((note) => ({ midi: note.midi, staffId: note.staffId, state: note.state }))
          });
        }
        for (let i = results.length; i < requestedDepth; i++) {
          ports.debugLog(`LED_FUTURE_${i + 1}_SELECTED`, { skipped: true, reason: "end-reached-or-no-playable-event" });
        }
        return results;
      }
      return {
        describeEntries,
        collectRenderablePreviewNotes,
        buildTimelineEvent,
        restoreToMeasureAndTimestamp,
        ensurePreviewTimelineBuilt,
        resolveTraversalIndex,
        collectFuturePreviewEvents
      };
    }
    PianoTrainerScoreTraversal2.create = create;
  })(PianoTrainerScoreTraversal || (PianoTrainerScoreTraversal = {}));

  // src/score/performance-trace.ts
  var PianoTrainerPerformanceTrace;
  ((PianoTrainerPerformanceTrace2) => {
    function scan(iterator, readNotes, limit = 1e5) {
      const steps = [];
      const measures = [];
      const ordinals = /* @__PURE__ */ new Map();
      let previousStart = null;
      while (!iterator.EndReached) {
        if (steps.length >= limit) throw new Error(`Performance traversal exceeds ${limit} events.`);
        const sourceMeasureIndex = iterator.CurrentMeasureIndex;
        const timestampWhole = iterator.currentTimeStamp?.RealValue;
        const relativeTimestampWhole = iterator.CurrentRelativeInMeasureTimestamp.RealValue;
        const enrolledStart = iterator.CurrentEnrolledTimestamp.RealValue - relativeTimestampWhole;
        if (!Number.isFinite(timestampWhole) || !Number.isFinite(relativeTimestampWhole)) throw new Error("Invalid performance timestamp.");
        let occurrence = measures[measures.length - 1];
        if (!occurrence || occurrence.sourceMeasureIndex !== sourceMeasureIndex || previousStart === null || Math.abs(previousStart - enrolledStart) > 1e-8 || iterator.JumpOccurred) {
          occurrence = { measureOccurrenceId: measures.length, sourceMeasureIndex, firstTraceStepIndex: steps.length, lastTraceStepIndex: steps.length };
          measures.push(occurrence);
        }
        previousStart = enrolledStart;
        const notes = readNotes();
        const key = `${relativeTimestampWhole}|${notes.map((note) => note.structureKey).join(";")}`;
        let measureOrdinals = ordinals.get(String(sourceMeasureIndex));
        if (!measureOrdinals) {
          measureOrdinals = /* @__PURE__ */ new Map();
          ordinals.set(String(sourceMeasureIndex), measureOrdinals);
        }
        if (!measureOrdinals.has(key)) measureOrdinals.set(key, measureOrdinals.size);
        steps.push({
          traceStepIndex: steps.length,
          measureOccurrenceId: occurrence.measureOccurrenceId,
          source: { sourceMeasureIndex, timestampWhole, sourceEventOrdinal: measureOrdinals.get(key) },
          relativeTimestampWhole,
          notes
        });
        occurrence.lastTraceStepIndex = steps.length - 1;
        iterator.moveToNext();
      }
      return { steps, measures };
    }
    PianoTrainerPerformanceTrace2.scan = scan;
  })(PianoTrainerPerformanceTrace || (PianoTrainerPerformanceTrace = {}));

  // src/score/source-note-index.ts
  var PianoTrainerSourceNoteIndex;
  ((PianoTrainerSourceNoteIndex2) => {
    function measure(measure2) {
      const result = /* @__PURE__ */ new Map();
      for (const [containerIndex, container] of (measure2.VerticalSourceStaffEntryContainers || []).entries()) {
        for (const [staffIndex, staff] of container.StaffEntries.entries()) {
          for (const [voiceIndex, voice] of (staff?.VoiceEntries || []).entries()) {
            for (const [noteIndex, note] of voice.Notes.entries()) {
              const structureKey = `${staffIndex}/${containerIndex}/${voiceIndex}/${noteIndex}`;
              result.set(structureKey, { note, staffIndex, structureKey });
            }
          }
        }
      }
      return result;
    }
    PianoTrainerSourceNoteIndex2.measure = measure;
  })(PianoTrainerSourceNoteIndex || (PianoTrainerSourceNoteIndex = {}));

  // src/score/osmd-adapter.ts
  var PianoTrainerOsmdAdapter;
  ((PianoTrainerOsmdAdapter2) => {
    function create(ports) {
      let currentSheet, scoreRevision = 0, noteSequence = 0;
      let noteRefs = /* @__PURE__ */ new WeakMap();
      const sourceNotes = /* @__PURE__ */ new Map();
      let globalStaffIdentityMap = /* @__PURE__ */ new Map();
      let displayedIterator = null;
      let displayedSheet;
      let trace = null;
      let traceStepIndex = 0;
      let paintedTraceStepIndex = 0, restoringPainted = false, layoutRevision = 0;
      let systemBounds = null;
      let measureSystems = /* @__PURE__ */ new Map();
      function invalidateSystems() {
        layoutRevision++;
        systemBounds = null;
        measureSystems.clear();
      }
      let ownedHook = null;
      function syncSheet() {
        const sheet = ports.getRenderer().Sheet;
        if (sheet !== currentSheet) {
          currentSheet = sheet;
          scoreRevision++;
          noteSequence = 0;
          noteRefs = /* @__PURE__ */ new WeakMap();
          sourceNotes.clear();
          trace = null;
          traceStepIndex = 0;
          invalidateSystems();
        }
        return sheet;
      }
      function noteRef(note) {
        syncSheet();
        const existing = noteRefs.get(note);
        if (existing) return existing;
        const ref = Object.freeze({ scoreRevision, id: `note-${++noteSequence}` });
        noteRefs.set(note, ref);
        sourceNotes.set(ref.id, note);
        return ref;
      }
      function resolveNote(ref) {
        syncSheet();
        return ref.scoreRevision === scoreRevision ? sourceNotes.get(ref.id) || null : null;
      }
      function getIndependentIterator() {
        const sheet = syncSheet(), settings = sheet?.SheetPlaybackSetting, savedRhythm = settings?.rhythm;
        const iterator = sheet?.MusicPartManager?.getIterator();
        if (settings) settings.rhythm = savedRhythm;
        if (!iterator) throw new Error("This score has no independent performance iterator.");
        const advance = iterator.moveToNext.bind(iterator);
        iterator.moveToNext = () => {
          const rhythm = settings?.rhythm;
          try {
            advance();
          } finally {
            if (settings) settings.rhythm = rhythm;
          }
        };
        return iterator;
      }
      function getPerformanceTrace() {
        const sheet = syncSheet();
        if (trace) return trace;
        const addresses = /* @__PURE__ */ new WeakMap();
        for (const measure of sheet?.SourceMeasures || []) {
          for (const { note, staffIndex, structureKey } of PianoTrainerSourceNoteIndex.measure(measure).values()) {
            addresses.set(note, {
              sourceNoteRef: noteRef(note),
              staffIndex,
              structureKey,
              midi: note.halfTone + 12,
              lengthWhole: note.Length?.RealValue ?? 0,
              rest: !!note.isRest?.()
            });
          }
        }
        const iterator = getIndependentIterator();
        trace = PianoTrainerPerformanceTrace.scan(iterator, () => (iterator.CurrentVoiceEntries || []).flatMap((entry) => (entry.Notes || []).map((source) => {
          const address = addresses.get(source);
          if (!address) throw new Error("Performance note has no structural address.");
          return address;
        })));
        return trace;
      }
      function seekTraceStep(index) {
        const cursor = ports.getRenderer().cursor;
        if (!cursor) return;
        const steps = getPerformanceTrace().steps;
        if (!Number.isInteger(index) || index < 0 || index >= steps.length) throw new Error("Invalid performance step.");
        cursor.reset();
        for (let step = 0; step < index; step++) cursor.Iterator.moveToNext();
        traceStepIndex = index;
      }
      function detachHook() {
        if (ownedHook && ownedHook.cursor.update === ownedHook.wrapper) ownedHook.cursor.update = ownedHook.original;
        ownedHook = null;
      }
      function attachHook(cursor) {
        if (ownedHook?.cursor === cursor && cursor.update === ownedHook.wrapper) return;
        detachHook();
        const original = cursor.update;
        const update = original.bind(cursor);
        const wrapper = () => {
          const iterator = cursor.Iterator;
          displayedIterator = Object.assign(Object.create(Object.getPrototypeOf(iterator)), iterator);
          for (const key of Object.keys(displayedIterator)) {
            const value = Reflect.get(displayedIterator, key);
            if (Array.isArray(value)) Reflect.set(displayedIterator, key, value.slice());
          }
          displayedSheet = syncSheet();
          if (!restoringPainted) paintedTraceStepIndex = traceStepIndex;
          return update();
        };
        cursor.update = wrapper;
        ownedHook = { cursor, original, wrapper };
      }
      function afterRender(preservePaintedPosition) {
        const sheet = syncSheet(), cursor = ports.getRenderer().cursor;
        if (!cursor) return;
        if (preservePaintedPosition && displayedIterator && displayedSheet === sheet) {
          const playbackIterator = cursor.Iterator;
          cursor.iterator = displayedIterator;
          restoringPainted = true;
          try {
            cursor.update();
          } finally {
            cursor.iterator = playbackIterator;
            restoringPainted = false;
          }
        }
        attachHook(cursor);
      }
      function getDefaults() {
        const renderer = ports.getRenderer(), rules = renderer.EngravingRules;
        return { maximumWidth: rules.SheetMaximumWidth, options: {
          renderSingleHorizontalStaffline: false,
          newSystemFromXML: rules.NewSystemAtXMLNewSystemAttribute,
          newSystemFromNewPageInXML: rules.NewSystemAtXMLNewPageAttribute,
          newPageFromXML: rules.NewPageAtXMLNewPageAttribute,
          followCursor: renderer.FollowCursor
        } };
      }
      function setLayout(horizontal, defaults) {
        const renderer = ports.getRenderer();
        renderer.setOptions(horizontal ? {
          renderSingleHorizontalStaffline: true,
          newSystemFromXML: false,
          newSystemFromNewPageInXML: false,
          newPageFromXML: false,
          followCursor: false
        } : defaults.options);
        renderer.EngravingRules.SheetMaximumWidth = horizontal ? 1e7 : defaults.maximumWidth;
      }
      function getGraphicalNote(logicalNote, mIdx, staffIdx) {
        try {
          const renderer = ports.getRenderer();
          if (!renderer.GraphicSheet || !renderer.GraphicSheet.MeasureList) return null;
          const measure = renderer.GraphicSheet.MeasureList[mIdx][staffIdx];
          if (!measure || !measure.staffEntries) return null;
          const debugCandidates = [];
          for (let i = 0; i < measure.staffEntries.length; i++) {
            const se = measure.staffEntries[i];
            if (!se.graphicalVoiceEntries) continue;
            for (let j = 0; j < se.graphicalVoiceEntries.length; j++) {
              const gve = se.graphicalVoiceEntries[j];
              if (!gve.notes) continue;
              for (let k = 0; k < gve.notes.length; k++) {
                const gn = gve.notes[k], src = gn?.sourceNote;
                if (src) {
                  debugCandidates.push({
                    isExact: src === logicalNote,
                    sameHalfTone: src?.halfTone === logicalNote?.halfTone,
                    sameTimestamp: (src?.ParentVoiceEntry?.Timestamp?.RealValue ?? null) === (logicalNote?.ParentVoiceEntry?.Timestamp?.RealValue ?? null),
                    sameLength: (src?.Length?.RealValue ?? null) === (logicalNote?.Length?.RealValue ?? null),
                    ...ports.describeGraphicalNote(gn)
                  });
                }
                if (gn.sourceNote === logicalNote) {
                  ports.debugLog("GRAPHICAL_NOTE_MATCH", {
                    target: ports.describeNote(logicalNote, mIdx, staffIdx),
                    chosen: ports.describeGraphicalNote(gn),
                    nearby: debugCandidates.filter((c) => c.sameHalfTone || c.sameTimestamp || c.isExact).slice(0, 12)
                  });
                  return gn;
                }
              }
            }
          }
          ports.debugLog("GRAPHICAL_NOTE_MISS", {
            target: ports.describeNote(logicalNote, mIdx, staffIdx),
            nearby: debugCandidates.filter((c) => c.sameHalfTone || c.sameTimestamp).slice(0, 12)
          });
        } catch (error) {
          ports.reportError("Error finding graphical note:", error);
        }
        return null;
      }
      function readPositions() {
        const sheet = syncSheet(), cursor = ports.getRenderer().cursor;
        const position = (iterator) => iterator ? { measureIndex: iterator.CurrentMeasureIndex, timestampWhole: iterator.currentTimeStamp?.RealValue ?? null } : null;
        return {
          scoreRevision,
          traversal: position(cursor?.Iterator),
          painted: displayedSheet === sheet ? position(displayedIterator) : null
        };
      }
      function getSystemBounds() {
        syncSheet();
        if (systemBounds) return systemBounds.map((bounds) => ({ ...bounds }));
        const graphic = ports.getRenderer().GraphicSheet;
        const index = /* @__PURE__ */ new Map();
        const pages = graphic?.MusicPages || [];
        for (const [measureIndex, row] of (graphic?.MeasureList || []).entries()) {
          for (const measure of row) {
            const system = measure.ParentStaffLine?.ParentMusicSystem;
            if (!system) continue;
            let bounds = index.get(system);
            if (!bounds) {
              const pageIndex = pages.findIndex((page) => page.MusicSystems.includes(system));
              if (pageIndex < 0) continue;
              const pagePosition = pages[pageIndex]?.PositionAndShape?.AbsolutePosition || { x: 0, y: 0 };
              const shape = system.PositionAndShape, origin = shape.AbsolutePosition;
              let top = origin.y + (shape.BorderTop ?? 0), bottom = origin.y + (shape.BorderBottom ?? shape.Size.height);
              for (const staff of system.StaffLines || []) {
                const box = staff.PositionAndShape;
                top = Math.min(top, box.AbsolutePosition.y + Math.min(0, box.BorderTop ?? 0));
                bottom = Math.max(bottom, box.AbsolutePosition.y + Math.max(4, box.BorderBottom ?? 4));
              }
              bounds = {
                systemId: index.size,
                layoutRevision,
                pageIndex,
                firstMeasureIndex: measureIndex,
                lastMeasureIndex: measureIndex,
                left: (origin.x + (shape.BorderLeft ?? 0) - pagePosition.x) * 10,
                right: (origin.x + (shape.BorderRight ?? shape.Size.width) - pagePosition.x) * 10,
                top: (top - pagePosition.y) * 10,
                bottom: (bottom - pagePosition.y) * 10
              };
              index.set(system, bounds);
            }
            bounds.lastMeasureIndex = measureIndex;
            measureSystems.set(measureIndex, bounds);
          }
        }
        systemBounds = [...index.values()];
        return systemBounds.map((bounds) => ({ ...bounds }));
      }
      function getSystemForMeasure(index) {
        syncSheet();
        if (!systemBounds) getSystemBounds();
        const bounds = measureSystems.get(index);
        return bounds ? { ...bounds } : null;
      }
      function readPaintedPosition() {
        const positions = readPositions();
        return positions.painted ? { ...positions.painted, scoreRevision: positions.scoreRevision, layoutRevision, traceStepIndex: paintedTraceStepIndex } : null;
      }
      function getMeasureBox(measureIndex, staffIndex, unitsToPx) {
        const measure = ports.getRenderer().GraphicSheet?.MeasureList?.[measureIndex]?.[staffIndex];
        if (!measure?.ParentStaffLine) return null;
        const sys = measure.ParentStaffLine.ParentMusicSystem;
        let topYUnits = sys.PositionAndShape.AbsolutePosition.y;
        let bottomYUnits = topYUnits + sys.PositionAndShape.Size.height;
        if (sys.StaffLines && sys.StaffLines.length > 0) {
          topYUnits = sys.StaffLines[0].PositionAndShape.AbsolutePosition.y;
          bottomYUnits = sys.StaffLines[sys.StaffLines.length - 1].PositionAndShape.AbsolutePosition.y + 4;
        }
        const paddingUnits = 4;
        return {
          x: measure.PositionAndShape.AbsolutePosition.x * unitsToPx,
          y: (topYUnits - paddingUnits) * unitsToPx,
          width: measure.PositionAndShape.Size.width * unitsToPx,
          height: (bottomYUnits + paddingUnits - (topYUnits - paddingUnits)) * unitsToPx
        };
      }
      function getCombinedTieLength(note) {
        if (!note) return 0;
        let total = 0;
        let current = note;
        const seen = /* @__PURE__ */ new Set();
        while (current && !seen.has(current)) {
          seen.add(current);
          if (current.Length && typeof current.Length.RealValue === "number") {
            total += current.Length.RealValue;
          }
          const tie = current.NoteTie;
          if (!tie) break;
          const next = tie.Notes?.find((n) => n !== current) || tie.NextNote || tie.nextNote || null;
          if (!next) break;
          if (next.halfTone !== current.halfTone) break;
          current = next;
        }
        return total || (note.Length?.RealValue ?? 0);
      }
      function* readPracticeEntries(entries, resolveStaffId) {
        const entryCount = entries.length;
        for (let entryIndex = 0; entryIndex < entryCount; entryIndex++) {
          if (!(entryIndex in entries)) continue;
          const entry = entries[entryIndex];
          const staffId = resolveStaffId(entry);
          const notes = {
            *[Symbol.iterator]() {
              const sourceNotes2 = entry.Notes, noteCount = sourceNotes2.length;
              for (let noteIndex = 0; noteIndex < noteCount; noteIndex++) {
                if (!(noteIndex in sourceNotes2)) continue;
                const note = sourceNotes2[noteIndex];
                yield {
                  get midi() {
                    return note.halfTone + 12;
                  },
                  get noteRef() {
                    return noteRef(note);
                  },
                  get notehead() {
                    return note.Notehead;
                  },
                  get printObject() {
                    return note.PrintObject;
                  },
                  get cue() {
                    return note.isCueNote;
                  },
                  get rest() {
                    return note.isRest();
                  },
                  get tieContinuation() {
                    return !!note.NoteTie && note.NoteTie.StartNote !== note;
                  },
                  get combinedLengthWhole() {
                    return note.NoteTie && note.NoteTie.StartNote === note ? getCombinedTieLength(note) : note.Length.RealValue;
                  }
                };
              }
            }
          };
          yield { staffId, notes };
        }
      }
      const playbackEntries = /* @__PURE__ */ new WeakMap();
      function rebuildStaffIdentity() {
        globalStaffIdentityMap = /* @__PURE__ */ new Map();
        trace = null;
        invalidateSystems();
        const instruments = ports.getRenderer()?.Sheet?.Instruments || ports.getRenderer()?.Sheet?.instruments || [];
        let nextId = 1;
        instruments.forEach((instrument) => {
          const staves = instrument?.Staves || instrument?.staves || instrument?.Staffs || instrument?.staffs || [];
          staves.forEach((staff) => {
            if (staff && !globalStaffIdentityMap.has(staff)) globalStaffIdentityMap.set(staff, nextId++);
          });
        });
      }
      function resolveStaffIdFromNote(note) {
        const candidates = [
          note?.ParentStaff,
          note?.parentStaff,
          note?.ParentVoiceEntry?.ParentSourceStaffEntry?.ParentStaff,
          note?.parentVoiceEntry?.parentSourceStaffEntry?.parentStaff,
          note?.SourceStaff,
          note?.sourceStaff
        ].filter((staff) => Boolean(staff));
        for (const staff of candidates) {
          if (globalStaffIdentityMap.has(staff)) return globalStaffIdentityMap.get(staff);
        }
        const fallback = Number(candidates[0]?.id ?? note?.ParentStaff?.id ?? note?.parentStaff?.id);
        return Number.isFinite(fallback) ? fallback : null;
      }
      function resolveStaffIdFromEntry(entry) {
        const first = entry?.Notes?.[0] || entry?.notes?.[0] || null;
        return resolveStaffIdFromNote(first);
      }
      function readPlaybackEvent(resolveStaffId) {
        const entries = ports.getRenderer().cursor.Iterator.CurrentVoiceEntries;
        const event = {
          get isEmpty() {
            return !entries || entries.length === 0;
          },
          get entries() {
            return readPracticeEntries(entries, resolveStaffId);
          },
          get signature() {
            return PianoTrainerScoreTraversal.makeEntrySignature(entries);
          },
          get fallbackLengthWhole() {
            return entries?.[0]?.Notes && entries[0].Notes.length > 0 ? entries[0].Notes[0].Length.RealValue : 1;
          }
        };
        playbackEntries.set(event, entries);
        return event;
      }
      function dispose() {
        detachHook();
        invalidateSystems();
        displayedIterator = null;
        displayedSheet = void 0;
        noteRefs = /* @__PURE__ */ new WeakMap();
        sourceNotes.clear();
        scoreRevision++;
        globalStaffIdentityMap = /* @__PURE__ */ new Map();
        trace = null;
      }
      return {
        getCombinedTieLength,
        readPracticeEntries,
        readPlaybackEvent,
        noteRef,
        resolveNote,
        afterRender,
        getDefaults,
        setLayout,
        getGraphicalNote,
        getMeasureBox,
        readPositions,
        dispose,
        getIndependentIterator,
        getPerformanceTrace,
        seekTraceStep,
        getSystemBounds,
        getSystemForMeasure,
        readPaintedPosition,
        getTraceStepIndex: () => {
          syncSheet();
          return traceStepIndex;
        },
        getScoreRevision: () => {
          syncSheet();
          return scoreRevision;
        },
        rebuildStaffIdentity,
        resolveStaffIdFromNote,
        resolveStaffIdFromEntry,
        getTraversalCursor: () => ports.getRenderer()?.cursor,
        hasGraphicSheet: () => !!ports.getRenderer().GraphicSheet,
        getGraphicalMeasureCount: () => ports.getRenderer().GraphicSheet.MeasureList.length,
        getLoadedStaffCount: () => ports.getRenderer().GraphicSheet.MeasureList[0].length,
        getFirstScoreTempo: () => {
          const measures = ports.getRenderer().Sheet.SourceMeasures;
          return measures.length > 0 ? measures[0].TempoInBPM : void 0;
        },
        setZoom: (value) => {
          ports.getRenderer().zoom = value;
          invalidateSystems();
        },
        getZoom: () => ports.getRenderer().zoom,
        getHorizontalMetrics: () => {
          let gap = 0, top = 80, bottom = 80, staffCount = 1;
          for (const row of ports.getRenderer().GraphicSheet?.MeasureList || []) {
            const system = row[0]?.ParentStaffLine?.ParentMusicSystem, staves = system?.StaffLines || [];
            staffCount = Math.max(staffCount, staves.length);
            for (let i = 1; i < staves.length; i++) gap = Math.max(gap, staves[i].PositionAndShape.AbsolutePosition.y - staves[i - 1].PositionAndShape.AbsolutePosition.y);
            const firstY = staves[0]?.PositionAndShape.AbsolutePosition.y, lastY = staves[staves.length - 1]?.PositionAndShape.AbsolutePosition.y;
            if (firstY === void 0 || lastY === void 0 || !system) continue;
            top = Math.max(top, (firstY - system.PositionAndShape.AbsolutePosition.y) * 10 + 20);
            bottom = Math.max(bottom, (system.PositionAndShape.AbsolutePosition.y + system.PositionAndShape.Size.height - lastY - 4) * 10 + 20);
            for (const [staff, measure] of row.entries()) for (const entry of measure.staffEntries || []) for (const voice of entry.graphicalVoiceEntries || []) for (const note of voice.notes || []) {
              const y = note.PositionAndShape?.AbsolutePosition.y;
              if (y === void 0) continue;
              if (staff === 0) top = Math.max(top, (firstY - y) * 10 + 60);
              if (staff === row.length - 1) bottom = Math.max(bottom, (y - lastY - 4) * 10 + 60);
            }
          }
          return { gap: Math.max(8, gap), top, bottom, staffCount };
        },
        // Transitional UI wrapper consumes the captured entries only at this boundary.
        legacyEntriesForPlayback: (event) => playbackEntries.get(event),
        hasCursor: () => !!ports.getRenderer().cursor,
        load: (rawData) => ports.getRenderer().load(rawData),
        isEndReached: () => ports.getRenderer().cursor.Iterator.EndReached,
        getCurrentTimestamp: () => ports.getRenderer().cursor.Iterator.currentTimeStamp.RealValue,
        getPlaybackTempo: (index) => ports.getRenderer().Sheet.SourceMeasures[index]?.TempoInBPM,
        advance: () => {
          syncSheet();
          ports.getRenderer().cursor.Iterator.moveToNext();
          traceStepIndex++;
        },
        reset: () => {
          syncSheet();
          ports.getRenderer().cursor.reset();
          traceStepIndex = 0;
        },
        updateCursor: () => {
          ports.getRenderer().cursor.update();
        },
        showCursor: () => {
          ports.getRenderer().cursor.show();
        },
        getSourceMeasure: (measureIndex) => ports.getRenderer().Sheet?.SourceMeasures?.[measureIndex] || null,
        getSourceMeasureCount: () => ports.getRenderer().Sheet?.SourceMeasures?.length || 0,
        getCountInBeats: (measureIndex) => {
          const measures = ports.getRenderer().Sheet.SourceMeasures;
          if (measures[measureIndex]?.ActiveTimeSignature) return measures[measureIndex].ActiveTimeSignature.Numerator;
          if (measures[0]?.ActiveTimeSignature) return measures[0].ActiveTimeSignature.Numerator;
          return 4;
        },
        getMeasureCount: () => ports.getRenderer().GraphicSheet?.MeasureList.length ?? null,
        getSystemCount: () => ports.getRenderer().GraphicSheet?.MusicPages?.reduce((count, page) => count + page.MusicSystems.length, 0) ?? 0,
        // Legacy wrong-note fallback is called with a loaded cursor/sheet.
        // Preserve its missing-measure exception semantics in this boundary.
        getCurrentMeasureIndex: () => ports.getRenderer().cursor.Iterator.CurrentMeasureIndex,
        getCurrentMeasureIndexIfAvailable: () => ports.getRenderer()?.cursor?.Iterator?.CurrentMeasureIndex,
        getDefaultStaffCount: () => ports.getRenderer()?.GraphicSheet?.MeasureList?.[0]?.length || 2,
        readHandAssignmentFrame: () => {
          const iterator = ports.getRenderer()?.cursor?.Iterator;
          if (!iterator) return null;
          const entries = iterator.CurrentVoiceEntries || [];
          const measureIndex = iterator.CurrentMeasureIndex;
          const timestamp = iterator.currentTimeStamp?.RealValue ?? null;
          return { entries, measureIndex, timestamp };
        },
        getStaffTopY: (measureIndex, staffIndex) => {
          const measures = ports.getRenderer().GraphicSheet.MeasureList;
          const measure = measures[measureIndex][staffIndex] || measures[measureIndex][0];
          return measure.PositionAndShape.AbsolutePosition.y * 10;
        },
        isReady: () => ports.getRenderer().IsReadyToRender(),
        render: () => {
          invalidateSystems();
          ports.getRenderer().render();
        },
        getCursorElement: () => ports.getRenderer().cursor?.cursorElement || null
      };
    }
    PianoTrainerOsmdAdapter2.create = create;
  })(PianoTrainerOsmdAdapter || (PianoTrainerOsmdAdapter = {}));

  // src/score/horizontal-display-adapter.ts
  var PianoTrainerHorizontalDisplay;
  ((PianoTrainerHorizontalDisplay2) => {
    function create(host, renderer, occurrences, trace) {
      const adapter = PianoTrainerOsmdAdapter.create({
        getRenderer: () => renderer,
        describeNote: () => ({}),
        describeGraphicalNote: () => ({}),
        debugLog: () => {
        },
        reportError: (message, error) => console.error(message, error)
      });
      const geometry = PianoTrainerGeometry.create({
        score: adapter,
        document,
        getSvg: () => host.querySelector("svg"),
        getComputedStyle: (node) => getComputedStyle(node),
        clearOverlays: () => {
        },
        fallbackHands: () => ({ left: 2, right: 1 }),
        describeNote: () => ({}),
        describeGraphicalNote: () => ({}),
        debugLog: () => {
        }
      });
      const notes = /* @__PURE__ */ new Map();
      const measureIndices = /* @__PURE__ */ new Map();
      let disposed = false;
      function validate() {
        notes.clear();
        measureIndices.clear();
        const measures = renderer.Sheet?.SourceMeasures || [];
        if (measures.length !== occurrences.length) throw new Error("Display measure count does not match the performance path.");
        for (const [index, occurrence] of occurrences.entries()) {
          measureIndices.set(occurrence.measureOccurrenceId, index);
          const displayNotes = PianoTrainerSourceNoteIndex.measure(measures[index]);
          for (let stepIndex = occurrence.firstTraceStepIndex; stepIndex <= occurrence.lastTraceStepIndex; stepIndex++) {
            for (const source of trace.steps[stepIndex].notes) {
              const mapped = displayNotes.get(source.structureKey);
              if (!mapped || mapped.note.halfTone + 12 !== source.midi || !!mapped.note.isRest?.() !== source.rest || Math.abs((mapped.note.Length?.RealValue ?? 0) - source.lengthWhole) > 1e-8) {
                throw new Error(`Ambiguous display note mapping at source measure ${occurrence.sourceMeasureIndex}, address ${source.structureKey}.`);
              }
              notes.set(`${occurrence.measureOccurrenceId}/${source.sourceNoteRef.id}`, { note: mapped.note, measure: index, staff: source.staffIndex });
            }
          }
        }
      }
      async function load(xml, zoom, staffGap) {
        await renderer.load(xml);
        if (disposed) return;
        adapter.setLayout(true, adapter.getDefaults());
        if (staffGap !== void 0) {
          renderer.EngravingRules.MinimumStaffLineDistance = staffGap - 4;
          renderer.EngravingRules.MinSkyBottomDistBetweenStaves = -1e5;
        }
        adapter.setZoom(zoom);
        renderer.render();
        if (renderer.cursor?.cursorElement) renderer.cursor.cursorElement.style.display = "none";
        validate();
      }
      function anchor(occurrenceId, ref) {
        const mapped = notes.get(`${occurrenceId}/${ref.id}`);
        return mapped ? geometry.getNoteAnchor(mapped.note, mapped.measure, mapped.staff) : null;
      }
      function box(occurrenceId, staff = 0) {
        const index = measureIndices.get(occurrenceId);
        return index === void 0 ? null : geometry.getMeasureBox(index, staff);
      }
      function eventAnchor(step) {
        const points = step.notes.map((note) => anchor(step.measureOccurrenceId, note.sourceNoteRef)).filter((point) => !!point);
        const bounds = box(step.measureOccurrenceId);
        if (!bounds) return null;
        let x = points.length ? Math.min(...points.map((point) => point.x)) : bounds.x;
        if (!points.length) {
          const occurrence = occurrences.find((measure) => measure.measureOccurrenceId === step.measureOccurrenceId);
          let before = { time: 0, x: bounds.x }, after = { time: 1, x: bounds.x + bounds.width };
          for (let index = occurrence.firstTraceStepIndex; index <= occurrence.lastTraceStepIndex; index++) {
            const candidate = trace.steps[index], anchors = candidate.notes.map((note) => anchor(step.measureOccurrenceId, note.sourceNoteRef)).filter((point2) => !!point2);
            if (!anchors.length) continue;
            const point = { time: candidate.relativeTimestampWhole, x: Math.min(...anchors.map((anchor2) => anchor2.x)) };
            if (point.time <= step.relativeTimestampWhole) before = point;
            else {
              after = point;
              break;
            }
          }
          after.time = Math.max(after.time, step.relativeTimestampWhole);
          const fraction = after.time > before.time ? (step.relativeTimestampWhole - before.time) / (after.time - before.time) : 0;
          x = before.x + Math.max(0, Math.min(1, fraction)) * (after.x - before.x);
        }
        return {
          x,
          y: bounds.y,
          height: bounds.height
        };
      }
      function dispose() {
        disposed = true;
        adapter.dispose();
        notes.clear();
        measureIndices.clear();
        geometry.invalidate();
        host.replaceChildren();
        host.remove();
      }
      return {
        load,
        anchor,
        box,
        eventAnchor,
        dispose,
        getSvg: () => geometry.getSvg(),
        staffTopY: (occurrenceId, staff) => {
          const index = measureIndices.get(occurrenceId);
          return index === void 0 ? null : adapter.getStaffTopY(index, staff);
        },
        readResources: () => ({ mappedNotes: notes.size, measures: measureIndices.size }),
        width: () => geometry.getSvg()?.getBoundingClientRect().width || 0,
        height: () => geometry.getSvg()?.getBoundingClientRect().height || 0
      };
    }
    PianoTrainerHorizontalDisplay2.create = create;
  })(PianoTrainerHorizontalDisplay || (PianoTrainerHorizontalDisplay = {}));

  // src/score/unfold-musicxml.ts
  var PianoTrainerUnfoldMusicXml;
  ((PianoTrainerUnfoldMusicXml2) => {
    const navigationAttributes = ["dacapo", "dalsegno", "tocoda", "fine", "segno", "coda", "forward-repeat"];
    const children = (node, name) => Array.from(node.children).filter((child) => child.localName === name);
    const attributeKey = (node) => `${node.localName}/${node.getAttribute("number") || ""}`;
    const serialize = (document2) => {
      const xml = new XMLSerializer().serializeToString(document2);
      return xml.startsWith("<?xml") ? xml : `<?xml version="1.0" encoding="UTF-8"?>
${xml}`;
    };
    function displayIds(measure, partId, occurrence) {
      const prefix = `display-${partId}-measure-${occurrence}`;
      measure.setAttribute("id", prefix);
      for (const [index, node] of Array.from(measure.querySelectorAll("note[id], direction[id], barline[id], harmony[id]")).entries()) node.setAttribute("id", `${prefix}-${node.localName}-${index}`);
    }
    function stripNavigation(measure) {
      for (const node of Array.from(measure.querySelectorAll("repeat, ending, segno, coda, multiple-rest"))) node.remove();
      for (const print of children(measure, "print")) print.remove();
      for (const sound of Array.from(measure.querySelectorAll("sound"))) {
        for (const attribute of navigationAttributes) sound.removeAttribute(attribute);
      }
      for (const words of Array.from(measure.querySelectorAll("direction-type > words"))) {
        if (/^\s*(?:D\.?\s*[CS]\.?|Da\s+Capo|Dal\s+Segno|(?:To\s+)?Coda|Fine)(?:\s|$)/i.test(words.textContent || "")) words.remove();
      }
      for (const type of Array.from(measure.querySelectorAll("direction-type"))) if (!type.children.length) type.remove();
      for (const direction of children(measure, "direction")) {
        const meaningfulSound = direction.querySelector("sound")?.attributes.length;
        if (!direction.querySelector("direction-type") && !meaningfulSound) direction.remove();
      }
    }
    function contexts(measures) {
      const result = [];
      const attributes2 = /* @__PURE__ */ new Map();
      let tempo = null;
      for (const measure of measures) {
        result.push({ attributes: new Map(attributes2), tempo });
        for (const block of children(measure, "attributes")) {
          for (const attribute of Array.from(block.children)) {
            if (!["measure-style"].includes(attribute.localName)) attributes2.set(attributeKey(attribute), attribute);
          }
        }
        for (const direction of children(measure, "direction")) {
          if (direction.querySelector("sound[tempo], metronome")) tempo = direction;
        }
      }
      return result;
    }
    function restoreContext(document2, measure, context) {
      const block = document2.createElement("attributes");
      const order = ["divisions", "key", "time", "staves", "part-symbol", "instruments", "clef", "staff-details", "transpose", "directive"];
      for (const name of order) for (const attribute of context.attributes.values()) {
        if (attribute.localName === name) block.appendChild(attribute.cloneNode(true));
      }
      if (block.children.length) measure.insertBefore(block, measure.firstChild);
      if (context.tempo) {
        const direction = context.tempo.cloneNode(true);
        for (const type of children(direction, "direction-type")) {
          for (const child of Array.from(type.children)) if (child.localName !== "metronome") child.remove();
          if (!type.children.length) type.remove();
        }
        const sound = direction.querySelector("sound");
        if (sound) {
          for (const attribute of Array.from(sound.attributes)) if (attribute.name !== "tempo") sound.removeAttribute(attribute.name);
        }
        direction.querySelector("offset")?.remove();
        measure.insertBefore(direction, block.nextSibling);
      }
    }
    function repairConnections(part, occurrences) {
      const spans = [];
      const pendingTies = /* @__PURE__ */ new Map();
      const pendingLines = /* @__PURE__ */ new Map();
      let divisions = 1, elapsed = 0, meter = 4;
      function line(link, key, index, start, stop) {
        const prior = pendingLines.get(key);
        if (stop) {
          if (prior) {
            spans.push({ start: prior.index, end: index });
            pendingLines.delete(key);
          } else link.remove();
        }
        if (start) {
          pendingLines.get(key)?.link.remove();
          pendingLines.set(key, { link, index });
        }
      }
      for (const [index, measure] of children(part, "measure").entries()) {
        if (index && occurrences[index].sourceMeasureIndex <= occurrences[index - 1].sourceMeasureIndex) {
          for (const entry of pendingLines.values()) entry.link.remove();
          pendingLines.clear();
        }
        const voices = /* @__PURE__ */ new Map();
        let time = 0, duration = 0;
        for (const node of Array.from(measure.children)) {
          if (node.localName === "attributes") {
            divisions = Number(node.querySelector("divisions")?.textContent) || divisions;
            const signature = node.querySelector("time");
            if (signature?.querySelector("beats") && signature.querySelector("beat-type")) meter = Number(signature.querySelector("beats").textContent) * 4 / Number(signature.querySelector("beat-type").textContent);
          } else if (node.localName === "backup") time -= Number(node.querySelector("duration")?.textContent) / divisions;
          else if (node.localName === "forward") time += Number(node.querySelector("duration")?.textContent) / divisions;
          else if (node.localName === "note") {
            const voice = node.querySelector("voice")?.textContent || `staff-${node.querySelector("staff")?.textContent || "1"}`;
            const groups = voices.get(voice) || [], chord = !!node.querySelector("chord"), grace = !!node.querySelector("grace");
            if (chord && groups.length) groups[groups.length - 1].notes.push(node);
            else groups.push({ time, grace, notes: [node] });
            voices.set(voice, groups);
            if (!chord && !grace) time += (Number(node.querySelector("duration")?.textContent) || 0) / divisions;
          }
          duration = Math.max(duration, time);
          const staff = node.querySelector("staff")?.textContent || "1";
          for (const link of Array.from(node.querySelectorAll("wedge, pedal, dashes, bracket"))) {
            const type = link.getAttribute("type");
            line(
              link,
              `${link.localName}/${staff}/${link.getAttribute("number") || "1"}`,
              index,
              ["start", "crescendo", "diminuendo", "sostenuto", "resume", "change"].includes(type || ""),
              ["stop", "discontinue", "change"].includes(type || "")
            );
          }
        }
        for (const [voice, groups] of voices) {
          groups.sort((a, b) => a.time - b.time || Number(b.grace) - Number(a.grace));
          for (const group of groups) {
            const prior = pendingTies.get(voice) || /* @__PURE__ */ new Map();
            const next = /* @__PURE__ */ new Map();
            for (const note of group.notes) {
              const pitch = note.querySelector("pitch")?.textContent?.replace(/\s/g, "") || "rest";
              const ties = Array.from(note.querySelectorAll("tie, tied")), stops = ties.filter((tie) => tie.getAttribute("type") === "stop");
              const pending = prior.get(pitch);
              if (stops.length && pending && Math.abs(pending.end - elapsed - group.time) < 1e-8) {
                spans.push({ start: pending.index, end: index });
                prior.delete(pitch);
              } else stops.forEach((tie) => tie.remove());
              const starts = ties.filter((tie) => tie.getAttribute("type") === "start");
              if (starts.length) next.set(pitch, { links: starts, index, end: elapsed + group.time + (Number(note.querySelector("duration")?.textContent) || 0) / divisions });
              for (const slur of Array.from(note.querySelectorAll("slur"))) {
                line(
                  slur,
                  `slur/${voice}/${slur.getAttribute("number") || "1"}`,
                  index,
                  slur.getAttribute("type") === "start",
                  slur.getAttribute("type") === "stop"
                );
              }
              for (const extend of Array.from(note.querySelectorAll("lyric > extend"))) {
                line(
                  extend,
                  `lyric/${voice}/${extend.parentElement?.getAttribute("number") || "1"}`,
                  index,
                  extend.getAttribute("type") === "start",
                  extend.getAttribute("type") === "stop"
                );
              }
            }
            for (const entry of prior.values()) entry.links.forEach((link) => link.remove());
            pendingTies.set(voice, next);
          }
        }
        elapsed += measure.getAttribute("implicit") === "yes" ? duration : Math.max(duration, meter);
      }
      for (const pending of pendingTies.values()) for (const entry of pending.values()) entry.links.forEach((link) => link.remove());
      for (const entry of pendingLines.values()) entry.link.remove();
      return spans;
    }
    function unfold(xml, occurrences, { drawTitle = true, repairLinks = true } = {}) {
      const document2 = new DOMParser().parseFromString(xml, "application/xml");
      if (document2.querySelector("parsererror") || document2.documentElement.localName !== "score-partwise") throw new Error("Horizontal display requires valid partwise MusicXML.");
      if (!occurrences.length) throw new Error("The performance path is empty.");
      if (!drawTitle) for (const node of Array.from(document2.querySelectorAll("work, movement-title, identification, credit"))) node.remove();
      for (const part of children(document2.documentElement, "part")) {
        const sourceMeasures = children(part, "measure"), inherited = contexts(sourceMeasures);
        const copies = [];
        for (const [index, occurrence] of occurrences.entries()) {
          const source = sourceMeasures[occurrence.sourceMeasureIndex];
          if (!source) throw new Error(`Part ${part.getAttribute("id")} is missing source measure ${occurrence.sourceMeasureIndex}.`);
          const measure = source.cloneNode(true);
          stripNavigation(measure);
          displayIds(measure, part.getAttribute("id") || "part", occurrence.measureOccurrenceId);
          if (index === 0 || occurrences[index - 1].sourceMeasureIndex + 1 !== occurrence.sourceMeasureIndex) {
            restoreContext(document2, measure, inherited[occurrence.sourceMeasureIndex]);
          }
          copies.push(measure);
        }
        sourceMeasures.forEach((measure) => measure.remove());
        copies.forEach((measure) => part.appendChild(measure));
        if (repairLinks) repairConnections(part, occurrences);
      }
      return { xml: serialize(document2), measures: occurrences };
    }
    PianoTrainerUnfoldMusicXml2.unfold = unfold;
    function prepare(xml, path, cyclic) {
      const occurrences = cyclic ? [...path, ...path, ...path] : [...path];
      const document2 = new DOMParser().parseFromString(unfold(xml, occurrences, { drawTitle: false }).xml, "application/xml");
      const parts = children(document2.documentElement, "part");
      const spans = parts.flatMap((part) => repairConnections(part, occurrences));
      const inherited = parts.map((part) => contexts(children(part, "measure")));
      return { excerpt(start, end) {
        if (cyclic) {
          start += path.length;
          end += path.length;
        }
        let left = Math.max(0, start - 1), right = Math.min(occurrences.length, end + 1);
        for (const span of spans) if (span.start < end && span.end >= start) {
          left = Math.min(left, span.start);
          right = Math.max(right, span.end + 1);
        }
        const excerpt = document2.cloneNode(true);
        const selected = occurrences.slice(left, right).map((occurrence, index) => ({
          ...occurrence,
          measureOccurrenceId: left + index >= start && left + index < end ? occurrence.measureOccurrenceId : -index - 1
        }));
        for (const [partIndex, part] of children(excerpt.documentElement, "part").entries()) {
          const measures = children(part, "measure");
          measures.forEach((measure, index) => {
            if (index < left || index >= right) measure.remove();
            else displayIds(measure, part.getAttribute("id") || "part", selected[index - left].measureOccurrenceId);
          });
          restoreContext(excerpt, measures[left], inherited[partIndex][left]);
        }
        return { xml: serialize(excerpt), measures: selected };
      } };
    }
    PianoTrainerUnfoldMusicXml2.prepare = prepare;
  })(PianoTrainerUnfoldMusicXml || (PianoTrainerUnfoldMusicXml = {}));

  // src/render/horizontal-chunk-model.ts
  var PianoTrainerHorizontalChunkModel;
  ((PianoTrainerHorizontalChunkModel2) => {
    const contexts = /* @__PURE__ */ new WeakMap();
    function cropGraphics(source, copy2, left, right) {
      const inverse = source.getScreenCTM()?.inverse();
      if (!inverse) return;
      const selector = "path,text,rect,line,circle,ellipse,polygon,polyline,image,use";
      const originals = source.querySelectorAll(selector), copies = copy2.querySelectorAll(selector);
      originals.forEach((element, index) => {
        if (element.closest("defs")) return;
        const transform = element.getScreenCTM();
        if (!transform) return;
        const bounds = element.getBBox(), matrix = inverse.multiply(transform);
        const points = [[bounds.x, bounds.y], [bounds.x + bounds.width, bounds.y], [bounds.x, bounds.y + bounds.height], [bounds.x + bounds.width, bounds.y + bounds.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
        if (Math.max(...points.map((point) => point.x)) < left - 1 || Math.min(...points.map((point) => point.x)) > right + 1) copies[index]?.remove();
      });
      for (const group of Array.from(copy2.querySelectorAll("g")).reverse()) if (!group.children.length) group.remove();
    }
    async function load(xml, definition, trace, zoom, isActive, metrics) {
      const context = definition.context;
      let prepared = contexts.get(context.path);
      if (!prepared) {
        prepared = PianoTrainerUnfoldMusicXml.prepare(xml, context.path, context.cyclic);
        contexts.set(context.path, prepared);
      }
      const excerpt = prepared.excerpt(context.start, context.end);
      const host = document.createElement("div");
      host.style.cssText = "position:fixed;left:-100000px;top:0;width:1200px;";
      document.body.append(host);
      const block = PianoTrainerHorizontalDisplay.create(
        host,
        new opensheetmusicdisplay.OpenSheetMusicDisplay(host, { autoResize: false, drawTitle: false }),
        excerpt.measures,
        trace
      );
      try {
        await block.load(excerpt.xml, zoom, metrics.gap);
        if (!isActive()) throw new DOMException("Expired horizontal chunk.", "AbortError");
        const first = block.box(definition.measures[0].measureOccurrenceId), last = block.box(definition.measures[definition.measures.length - 1].measureOccurrenceId);
        const svg = block.getSvg();
        if (!svg || !first || !last) throw new Error("Missing rendered chunk geometry.");
        const width = last.x + last.width - first.x, height = (metrics.staffCount - 1) * metrics.gap * 10 + 40 + metrics.top + metrics.bottom;
        const top = first.y + 40 - metrics.top;
        const template = svg.cloneNode(true);
        cropGraphics(svg, template, first.x, first.x + width);
        template.setAttribute("viewBox", `${first.x} ${top} ${width} ${height}`);
        template.setAttribute("width", String(width));
        template.setAttribute("height", String(height));
        template.style.cssText = "overflow:hidden;";
        const model = { template, width, height, anchors: /* @__PURE__ */ new Map(), boxes: /* @__PURE__ */ new Map(), events: /* @__PURE__ */ new Map(), staffTops: /* @__PURE__ */ new Map() };
        for (const occurrence of definition.measures) {
          const box = block.box(occurrence.measureOccurrenceId);
          model.boxes.set(occurrence.measureOccurrenceId, { ...box, x: box.x - first.x, y: box.y - top });
          for (let index = occurrence.firstTraceStepIndex; index <= occurrence.lastTraceStepIndex; index++) {
            const step = trace.steps[index], point = block.eventAnchor(step);
            if (!point) throw new Error("Missing performed event anchor in chunk.");
            model.events.set(index, { ...point, x: point.x - first.x, y: point.y - top });
            for (const note of step.notes) {
              const anchor = block.anchor(occurrence.measureOccurrenceId, note.sourceNoteRef);
              if (!anchor) throw new Error("Missing display note anchor in chunk.");
              model.anchors.set(`${occurrence.measureOccurrenceId}/${note.sourceNoteRef.id}`, { x: anchor.x - first.x, y: anchor.y - top });
              const staffTop = block.staffTopY(occurrence.measureOccurrenceId, note.staffIndex);
              if (staffTop !== null) model.staffTops.set(`${occurrence.measureOccurrenceId}/${note.staffIndex}`, staffTop - top);
            }
          }
        }
        definition.width = width;
        definition.height = height;
        return model;
      } finally {
        block.dispose();
      }
    }
    PianoTrainerHorizontalChunkModel2.load = load;
    function copy(model, instanceId) {
      const svg = model.template.cloneNode(true);
      const ids = /* @__PURE__ */ new Map();
      for (const [index, element] of [svg, ...Array.from(svg.querySelectorAll("[id]"))].entries()) {
        if (!element.id) {
          element.removeAttribute("id");
          continue;
        }
        const prior = element.id, next = `${instanceId}-node-${index}-${prior}`;
        if (!ids.has(prior)) ids.set(prior, next);
        element.id = next;
      }
      for (const element of [svg, ...Array.from(svg.querySelectorAll("*"))]) for (const attribute of Array.from(element.attributes)) {
        let value = attribute.value;
        value = value.replace(/url\(#([^)]+)\)/g, (match, id) => ids.has(id) ? `url(#${ids.get(id)})` : match);
        if (value.startsWith("#") && ids.has(value.slice(1))) value = `#${ids.get(value.slice(1))}`;
        if (value !== attribute.value) element.setAttribute(attribute.name, value);
      }
      return svg;
    }
    PianoTrainerHorizontalChunkModel2.copy = copy;
  })(PianoTrainerHorizontalChunkModel || (PianoTrainerHorizontalChunkModel = {}));

  // src/render/horizontal-score.ts
  var PianoTrainerHorizontalScore;
  ((PianoTrainerHorizontalScore2) => {
    function create(ports) {
      const ns = "http://www.w3.org/2000/svg";
      const sourceHost = document.createElement("div");
      sourceHost.id = "source-score";
      ports.container.append(sourceHost);
      const host = document.createElement("div");
      host.className = "horizontal-score-content";
      host.style.position = "relative";
      host.hidden = true;
      ports.container.append(host);
      const svg = document.createElementNS(ns, "svg");
      svg.classList.add("pt-horizontal-canvas");
      svg.style.display = "block";
      host.append(svg);
      const cursor = document.createElement("div");
      cursor.className = "horizontal-score-cursor pt-performance-cursor";
      cursor.setAttribute("aria-hidden", "true");
      host.append(cursor);
      let xml = null, trace = null;
      let sequence = null;
      const cache = /* @__PURE__ */ new Map();
      const requests = /* @__PURE__ */ new WeakMap();
      let renderQueue = Promise.resolve();
      const mounted = /* @__PURE__ */ new Map();
      const yields = /* @__PURE__ */ new Map();
      let generation = 0, horizontal = false, disposed = false, loadedZoom = 1;
      let loadedMetrics = { gap: 8, top: 80, bottom: 80, staffCount: 1 };
      let preparedKey = "", origin = 0, windowStart = -1, windowEnd = -1, rendering = 0;
      let pending = null;
      let pendingWindow = null;
      let loading = false;
      let rebasing = false;
      let wasFollowing = ports.follows();
      let lastRebase = null;
      function yieldToPlayback() {
        return new Promise((resolve) => {
          const id = window.setTimeout(() => {
            yields.delete(id);
            resolve();
          }, 0);
          yields.set(id, resolve);
        });
      }
      function cancelYields() {
        for (const [id, resolve] of yields) {
          window.clearTimeout(id);
          resolve();
        }
        yields.clear();
      }
      function desiredWindow(index, navigate = false) {
        const result = PianoTrainerHorizontalChunks.windowAround(index, sequence?.finiteCount() ?? null);
        const event = ports.currentEvent();
        if (!navigate && mounted.size && sequence && event && (event.reason === "advance" || event.reason === "loop")) {
          const worldLeft = ports.area.scrollLeft / loadedZoom + origin;
          if ((sequence.address(result.start)?.offset || 0) > worldLeft) {
            let low = 0, high = result.start;
            while (low < high) {
              const middle = Math.ceil((low + high) / 2);
              if ((sequence.address(middle)?.offset || 0) <= worldLeft) low = middle;
              else high = middle - 1;
            }
            result.start = low;
            result.end = Math.min(low + PianoTrainerHorizontalChunks.WINDOW_CHUNKS - 1, (sequence.finiteCount() ?? Infinity) - 1);
          }
        }
        return result;
      }
      function showSource() {
        sourceHost.style.cssText = "";
        sourceHost.removeAttribute("aria-hidden");
        ports.container.prepend(sourceHost);
        host.hidden = true;
      }
      function showDisplay() {
        sourceHost.style.cssText = `position:fixed;left:-100000px;top:0;width:${Math.max(900, ports.area.clientWidth)}px;opacity:0;pointer-events:none;`;
        sourceHost.setAttribute("aria-hidden", "true");
        document.body.append(sourceHost);
        host.hidden = false;
      }
      function clearWindow() {
        for (const node of mounted.values()) node.svg.remove();
        mounted.clear();
        windowStart = windowEnd = -1;
        origin = 0;
      }
      function trimCache() {
        const pinned = new Set([...mounted.values()].map((node) => node.key));
        const current = ports.currentEvent(), address = current && sequence?.forEvent(current);
        if (address) pinned.add(address.definition.key);
        for (const key of cache.keys()) {
          if (cache.size <= PianoTrainerHorizontalChunks.CACHE_MODELS) break;
          if (!pinned.has(key)) cache.delete(key);
        }
      }
      async function model(definition, token, target = cache, zoom = loadedZoom, metrics = loadedMetrics) {
        const existing = target.get(definition.key);
        if (existing) {
          target.delete(definition.key);
          target.set(definition.key, existing);
          return existing;
        }
        if (!xml || !trace) throw new Error("No horizontal score model.");
        let inflight = requests.get(target);
        if (!inflight) {
          inflight = /* @__PURE__ */ new Map();
          requests.set(target, inflight);
        }
        const requestKey = `${token}/${zoom}/${definition.key}`, prior = inflight.get(requestKey);
        if (prior) return prior;
        const currentXml = xml, currentTrace = trace;
        const task = renderQueue.then(async () => {
          if (disposed || token !== generation) throw new DOMException("Expired horizontal model.", "AbortError");
          rendering++;
          try {
            const result = await PianoTrainerHorizontalChunkModel.load(currentXml, definition, currentTrace, zoom, () => !disposed && token === generation, metrics);
            if (disposed || token !== generation) throw new DOMException("Expired horizontal model.", "AbortError");
            target.set(definition.key, result);
            if (target === cache) trimCache();
            else while (target.size > PianoTrainerHorizontalChunks.CACHE_MODELS) target.delete(target.keys().next().value);
            return result;
          } finally {
            rendering--;
          }
        });
        renderQueue = task.catch(() => {
        });
        inflight.set(requestKey, task);
        try {
          return await task;
        } finally {
          inflight.delete(requestKey);
        }
      }
      function localPoint(ref, event) {
        const address = sequence?.forEvent(event), rendered = address && cache.get(address.definition.key);
        if (!address || !rendered) return null;
        const point = rendered.anchors.get(`${event.measureOccurrenceId}/${ref.id}`);
        return point ? { x: address.offset - origin + point.x, y: point.y } : null;
      }
      function anchor(ref, event = ports.currentEvent()) {
        return horizontal && preparedKey && event ? localPoint(ref, event) : null;
      }
      function paintCursor() {
        const event = ports.currentEvent(), address = event && sequence?.forEvent(event);
        const point = event && address && cache.get(address.definition.key)?.events.get(event.traceStepIndex);
        if (!event || !address || !point) return;
        const worldX = address.offset + point.x;
        cursor.style.left = `${(worldX - origin) * loadedZoom - 5}px`;
        cursor.style.top = `${point.y * loadedZoom}px`;
        cursor.style.height = `${point.height * loadedZoom}px`;
        cursor.dataset.eventId = String(event.eventId);
        cursor.dataset.logicalX = String(worldX * loadedZoom);
      }
      function commitWindow(index, immediate = false, navigate = false) {
        if (!sequence) return false;
        const window2 = desiredWindow(index, navigate);
        if (window2.start === windowStart && window2.end === windowEnd) {
          paintCursor();
          return true;
        }
        const addresses = [];
        for (let i = window2.start; i <= window2.end; i++) {
          const address = sequence.address(i);
          if (!address || !cache.has(address.definition.key)) return false;
          addresses.push(address);
        }
        if (!addresses.length) return false;
        const priorOrigin = origin, scroll = ports.area.scrollLeft;
        const event = ports.currentEvent(), activeAddress = event && sequence.forEvent(event);
        const activePoint = event && activeAddress && cache.get(activeAddress.definition.key)?.events.get(event.traceStepIndex);
        const before = activeAddress && activePoint ? (activeAddress.offset + activePoint.x - priorOrigin) * loadedZoom - scroll : null;
        origin = addresses[0].offset;
        const end = addresses[addresses.length - 1], width = end.offset + end.definition.width - origin;
        const height = Math.max(...addresses.map((address) => address.definition.height));
        rebasing = true;
        for (const [i, node] of mounted) if (i < window2.start || i > window2.end) {
          node.svg.remove();
          mounted.delete(i);
        }
        for (const address of addresses) {
          let node = mounted.get(address.index);
          if (!node) {
            const copy = PianoTrainerHorizontalChunkModel.copy(cache.get(address.definition.key), `chunk-${generation}-${address.index}`);
            copy.dataset.chunkIndex = String(address.index);
            copy.dataset.loopIteration = String(address.iteration);
            svg.insertBefore(copy, svg.firstChild);
            node = { key: address.definition.key, svg: copy };
            mounted.set(address.index, node);
          }
          node.svg.setAttribute("x", String(address.offset - origin));
          node.svg.setAttribute("y", "0");
        }
        const tail = ports.area.clientWidth * 0.7 / loadedZoom;
        svg.setAttribute("viewBox", `0 0 ${width + tail} ${height}`);
        svg.setAttribute("width", String((width + tail) * loadedZoom));
        svg.setAttribute("height", String(height * loadedZoom));
        host.style.width = `${(width + tail) * loadedZoom}px`;
        host.style.overflow = "hidden";
        windowStart = window2.start;
        windowEnd = window2.end;
        paintCursor();
        showDisplay();
        ports.area.scrollLeft = Math.max(0, PianoTrainerHorizontalChunks.compensatedScroll(scroll, priorOrigin, origin, loadedZoom));
        if (before !== null && activeAddress && activePoint && priorOrigin !== origin) {
          const after = (activeAddress.offset + activePoint.x - origin) * loadedZoom - ports.area.scrollLeft;
          lastRebase = { before, after, error: Math.abs(before - after) };
        }
        rebasing = false;
        trimCache();
        ports.refreshed(immediate);
        return true;
      }
      async function ensureWindow(index, immediate = false, navigate = false) {
        if (commitWindow(index, immediate, navigate)) return;
        if (pendingWindow) {
          const token2 = generation;
          try {
            await pendingWindow;
          } catch (error) {
            if (token2 === generation && !disposed) ports.reportError(error);
            return;
          }
          if (token2 !== generation || disposed || commitWindow(index, immediate, navigate)) return;
        }
        const token = generation, window2 = desiredWindow(index, navigate);
        const task = (async () => {
          for (let i = window2.start; i <= window2.end; i++) {
            const address = sequence?.address(i);
            if (address) await model(address.definition, token);
          }
          if (!disposed && token === generation) commitWindow(index, immediate, navigate);
        })();
        pendingWindow = task;
        try {
          await task;
        } catch (error) {
          if (token === generation && !disposed) ports.reportError(error);
        } finally {
          if (pendingWindow === task) pendingWindow = null;
        }
      }
      function paint() {
        if (!horizontal || !preparedKey) return;
        const event = ports.currentEvent(), address = event && sequence?.forEvent(event);
        if (!address) return;
        const following = ports.follows(), resumed = following && !wasFollowing;
        wasFollowing = following;
        if (following || windowStart < 0) void ensureWindow(address.index, resumed, resumed);
        const token = generation;
        if (!cache.has(address.definition.key)) void model(address.definition, token).then(() => {
          if (token === generation) paintCursor();
        }, (error) => {
          if (!disposed && token === generation) ports.reportError(error);
        });
        paintCursor();
      }
      async function refresh() {
        if (!horizontal || !xml || !trace || disposed || loading) return;
        const loop = ports.loopSettings(), zoom = ports.source.getZoom();
        const key = `${ports.source.getScoreRevision()}/${zoom}/${loop.enabled}/${loop.min}/${loop.max}`;
        if (preparedKey === key) {
          paint();
          return;
        }
        if (pending) return pending;
        const token = ++generation, current = ports.currentEvent();
        const nextSequence = PianoTrainerHorizontalChunks.define(trace, loop, current?.measureOccurrenceId || 0);
        const nextCache = /* @__PURE__ */ new Map();
        const nextMetrics = ports.source.getHorizontalMetrics();
        const task = (async () => {
          for (const definition of nextSequence.definitions) {
            await model(definition, token, nextCache, zoom, nextMetrics);
            if (disposed || token !== generation) return;
            await yieldToPlayback();
            if (disposed || token !== generation) return;
          }
          if (disposed || token !== generation || !horizontal) return;
          nextSequence.layout();
          loadedZoom = zoom;
          loadedMetrics = nextMetrics;
          sequence = nextSequence;
          clearWindow();
          cache.clear();
          for (const [key2, value] of nextCache) cache.set(key2, value);
          preparedKey = key;
          const latest2 = ports.currentEvent(), address = latest2 && sequence.forEvent(latest2);
          await ensureWindow(address?.index || 0, true);
        })();
        pending = task;
        try {
          await task;
        } catch (error) {
          if (token === generation && !disposed) {
            preparedKey = "";
            showSource();
            ports.reportError(error);
          }
        } finally {
          if (pending === task) pending = null;
        }
        const latest = ports.loopSettings();
        if (!disposed && horizontal && token === generation && preparedKey && (zoom !== ports.source.getZoom() || loop.enabled !== latest.enabled || loop.min !== latest.min || loop.max !== latest.max)) await refresh();
      }
      function setMode(value) {
        horizontal = value;
        if (value) {
          if (preparedKey) {
            showDisplay();
            paint();
          }
          void refresh();
        } else {
          generation++;
          cancelYields();
          pending = null;
          pendingWindow = null;
          showSource();
        }
      }
      async function loaded(currentXml) {
        loading = false;
        generation++;
        cancelYields();
        pending = pendingWindow = null;
        xml = currentXml;
        trace = ports.source.getPerformanceTrace();
        preparedKey = "";
        sequence = null;
        cache.clear();
        clearWindow();
        showSource();
        await refresh();
      }
      function hitTest(clientX, clientY) {
        if (!horizontal || !preparedKey || !sequence) return null;
        const rect = svg.getBoundingClientRect(), viewBox = svg.viewBox.baseVal;
        const x = (clientX - rect.left) / rect.width * viewBox.width, y = (clientY - rect.top) / rect.height * viewBox.height;
        for (const [index, node] of mounted) {
          const address = sequence.address(index), rendered = cache.get(node.key);
          for (const occurrence of address.definition.measures) {
            const box = rendered.boxes.get(occurrence.measureOccurrenceId), left = address.offset - origin + box.x;
            if (x >= left && x <= left + box.width && y >= box.y && y <= box.y + box.height) return {
              sourceMeasureIndex: occurrence.sourceMeasureIndex,
              traceStepIndex: occurrence.firstTraceStepIndex,
              loopIteration: address.iteration
            };
          }
        }
        return null;
      }
      function onScroll() {
        if (rebasing || !horizontal || !preparedKey || !sequence || !mounted.size) return;
        const area = ports.area, first = sequence.address(windowStart), last = sequence.address(windowEnd);
        if (area.scrollLeft < area.clientWidth * 0.25 && windowStart > 0) void ensureWindow(windowStart + 1);
        else if (area.scrollLeft + area.clientWidth > (last.offset + last.definition.width - first.offset) * loadedZoom - area.clientWidth * 0.25 && sequence.address(windowEnd + 1)) void ensureWindow(windowEnd - 1);
      }
      ports.area.addEventListener("scroll", onScroll, { passive: true });
      function dispose() {
        disposed = true;
        generation++;
        cancelYields();
        ports.area.removeEventListener("scroll", onScroll);
        clearWindow();
        cache.clear();
        sequence = null;
        trace = null;
        xml = null;
        pending = pendingWindow = null;
        sourceHost.remove();
        host.remove();
      }
      async function ready() {
        let token;
        do {
          token = generation;
          try {
            await refresh();
            await pending;
            await pendingWindow;
            await renderQueue;
          } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
          }
          if (disposed || !horizontal || loading) return;
        } while (token !== generation || pending || pendingWindow);
      }
      return {
        sourceHost,
        setMode,
        refresh,
        loaded,
        paint,
        anchor,
        hitTest,
        dispose,
        beginLoad: () => {
          loading = true;
          generation++;
          cancelYields();
          pending = pendingWindow = null;
        },
        getSvg: () => horizontal && preparedKey ? svg : sourceHost.querySelector("svg"),
        getCursorElement: () => horizontal && preparedKey ? cursor : ports.source.getCursorElement(),
        staffTopY: (staff) => {
          const event = ports.currentEvent(), address = event && sequence?.forEvent(event);
          return horizontal && event && address ? cache.get(address.definition.key)?.staffTops.get(`${event.measureOccurrenceId}/${staff}`) ?? null : null;
        },
        isActive: () => horizontal && !!preparedKey,
        measureBoxes: () => {
          if (!horizontal || !preparedKey || !sequence) return null;
          return [...mounted].flatMap(([index, node]) => {
            const address = sequence.address(index), rendered = cache.get(node.key);
            return address.definition.measures.map((measure) => {
              const box = rendered.boxes.get(measure.measureOccurrenceId);
              return {
                index: measure.sourceMeasureIndex,
                measureOccurrenceId: measure.measureOccurrenceId,
                traceStepIndex: measure.firstTraceStepIndex,
                loopIteration: address.iteration,
                box: { ...box, x: box.x + address.offset - origin }
              };
            });
          });
        },
        ready,
        readResources: () => ({
          generation,
          pending: !!pending || !!pendingWindow,
          instances: rendering,
          models: cache.size,
          callbacks: yields.size,
          templateNodes: [...cache.values()].reduce((count, model2) => count + model2.template.querySelectorAll("*").length, 0),
          mountedNodes: svg.querySelectorAll("*").length,
          mappedNotes: [...cache.values()].reduce((count, model2) => count + model2.anchors.size, 0),
          chunks: mounted.size,
          maxChunks: PianoTrainerHorizontalChunks.WINDOW_CHUNKS,
          maxModels: PianoTrainerHorizontalChunks.CACHE_MODELS,
          origin,
          windowStart,
          windowEnd,
          definitions: sequence?.definitions.length || 0,
          lastRebase: lastRebase ? { ...lastRebase } : null
        })
      };
    }
    PianoTrainerHorizontalScore2.create = create;
  })(PianoTrainerHorizontalScore || (PianoTrainerHorizontalScore = {}));

  // src/score/performance-position.ts
  var PianoTrainerPerformancePosition;
  ((PianoTrainerPerformancePosition2) => {
    function create(ports) {
      let runId = 0, eventId = 0, loopIteration = 0;
      let current = null;
      let reason = "load";
      function present() {
        const step = ports.getTrace().steps[ports.getTraceStepIndex()];
        if (!step) return current;
        const scoreRevision = ports.getScoreRevision();
        if (current?.traceStepIndex === step.traceStepIndex && current.loopIteration === loopIteration && current.runId === runId && current.scoreRevision === scoreRevision) return current;
        current = { ...step, scoreRevision, runId, eventId: ++eventId, loopIteration, reason };
        reason = "advance";
        ports.changed(current);
        return current;
      }
      function navigate(nextReason, iteration = 0) {
        runId++;
        loopIteration = iteration;
        current = null;
        reason = nextReason;
        return present();
      }
      function loop() {
        loopIteration++;
        reason = "loop";
      }
      return { present, navigate, loop, current: () => current };
    }
    PianoTrainerPerformancePosition2.create = create;
  })(PianoTrainerPerformancePosition || (PianoTrainerPerformancePosition = {}));

  // src/render/virtual-keyboard.ts
  var PianoTrainerVirtualKeyboardView;
  ((PianoTrainerVirtualKeyboardView2) => {
    const classes = ["expected-l", "expected-r", "pressed-l", "pressed-r", "wrong", "active", "future1-l", "future1-r"];
    function create(ports) {
      function drawKey(midi, desiredClass, calibration = false) {
        const node = ports.document.querySelector(`.key[data-midi="${midi}"]`);
        if (!node) return;
        if (!(node instanceof HTMLElement)) throw Error("Invalid virtual keyboard key: " + midi);
        node.classList.toggle("out-of-range", !ports.isMidiInRange(midi));
        if (calibration) {
          classes.forEach((value) => node.classList.remove(value));
          if (desiredClass) node.classList.add(desiredClass);
        } else {
          const current = [...node.classList].find((value) => classes.includes(value));
          if (current !== desiredClass) {
            if (current) node.classList.remove(current);
            if (desiredClass) node.classList.add(desiredClass);
          }
        }
        node.style.filter = "";
        node.style.boxShadow = "";
        node.style.transform = "";
      }
      return { drawKey };
    }
    PianoTrainerVirtualKeyboardView2.create = create;
  })(PianoTrainerVirtualKeyboardView || (PianoTrainerVirtualKeyboardView = {}));

  // src/score/measure-timing.ts
  var PianoTrainerMeasureTiming;
  ((PianoTrainerMeasureTiming2) => {
    function create(ports) {
      let measureTimingCache = [];
      function getInfo(measureIndex) {
        const measure = ports.getMeasure(measureIndex);
        const cached = measureTimingCache[measureIndex] || null;
        const activeTimeSignature = measure?.ActiveTimeSignature || ports.getMeasure(0)?.ActiveTimeSignature || null;
        const numerator = Math.max(1, Number(activeTimeSignature?.Numerator) || 4);
        const denominator = Math.max(1, Number(activeTimeSignature?.Denominator) || 4);
        const beatLengthWhole = 1 / denominator;
        const nominalMeasureLengthWhole = numerator * beatLengthWhole;
        const startTimestamp = Number.isFinite(cached?.startTimestamp) ? cached.startTimestamp : 0;
        return {
          numerator,
          denominator,
          beatLengthWhole,
          nominalMeasureLengthWhole,
          actualLengthWhole: Number.isFinite(cached?.actualLengthWhole) ? cached.actualLengthWhole : nominalMeasureLengthWhole,
          startTimestamp
        };
      }
      function rebuild() {
        const cursor = ports.getCursor();
        if (!cursor?.Iterator) {
          measureTimingCache = [];
          return measureTimingCache;
        }
        const savedMeasureIndex = cursor.Iterator.CurrentMeasureIndex;
        const savedTimestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;
        const totalMeasures = ports.getMeasureCount();
        const nextStarts = new Array(totalMeasures).fill(null);
        const firstEvents = new Array(totalMeasures).fill(null);
        const iterator = ports.getIndependentIterator?.() || (cursor.reset(), cursor.Iterator);
        const safetyMax = 1e5;
        let safety = 0;
        let previousMeasureIndex = null;
        while (!iterator.EndReached && safety < safetyMax) {
          const measureIndex = iterator.CurrentMeasureIndex;
          const timestamp = iterator.currentTimeStamp?.RealValue ?? null;
          if (firstEvents[measureIndex] == null && Number.isFinite(timestamp)) {
            firstEvents[measureIndex] = timestamp;
          }
          if (previousMeasureIndex != null && measureIndex !== previousMeasureIndex && nextStarts[previousMeasureIndex] == null && Number.isFinite(timestamp)) {
            nextStarts[previousMeasureIndex] = timestamp;
          }
          previousMeasureIndex = measureIndex;
          iterator.moveToNext();
          safety += 1;
        }
        measureTimingCache = [];
        let runningStart = 0;
        for (let i = 0; i < totalMeasures; i++) {
          const measure = ports.getMeasure(i);
          const activeTimeSignature = measure?.ActiveTimeSignature || ports.getMeasure(0)?.ActiveTimeSignature || null;
          const numerator = Math.max(1, Number(activeTimeSignature?.Numerator) || 4);
          const denominator = Math.max(1, Number(activeTimeSignature?.Denominator) || 4);
          const nominalMeasureLengthWhole = numerator / denominator;
          const firstTimestamp = Number.isFinite(firstEvents[i]) ? firstEvents[i] : null;
          const explicitStart = firstTimestamp != null ? firstTimestamp : runningStart;
          const nextStart = Number.isFinite(nextStarts[i]) ? nextStarts[i] : null;
          const actualLengthWhole = nextStart != null && Number.isFinite(explicitStart) ? Math.max(0, nextStart - explicitStart) : nominalMeasureLengthWhole;
          measureTimingCache[i] = {
            startTimestamp: explicitStart,
            actualLengthWhole,
            nominalMeasureLengthWhole,
            numerator,
            denominator
          };
          runningStart = explicitStart + actualLengthWhole;
        }
        if (!iterator.EndReached) throw new Error(`Timing traversal exceeds ${safetyMax} events.`);
        if (!ports.getIndependentIterator) ports.restoreToPosition(savedMeasureIndex, savedTimestamp);
        return measureTimingCache;
      }
      return { getInfo, rebuild, getCachedMeasureCount: () => measureTimingCache.length, readCache: () => measureTimingCache.map((entry) => ({ ...entry })) };
    }
    PianoTrainerMeasureTiming2.create = create;
  })(PianoTrainerMeasureTiming || (PianoTrainerMeasureTiming = {}));

  // src/score/musicxml-io.ts
  var PianoTrainerMusicXmlIO;
  ((PianoTrainerMusicXmlIO2) => {
    function sliceView(view) {
      return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
    }
    function create(ports) {
      function getScoreFileTypeFromName(fileName = "") {
        const lowered = String(fileName || "").toLowerCase();
        if (lowered.endsWith(".mxl")) return "mxl";
        if (lowered.endsWith(".musicxml")) return "musicxml";
        return "xml";
      }
      function getScoreDisplayTitle(fileName = "", fallback = "Untitled Score") {
        const base = String(fileName || "").trim();
        if (!base) return fallback;
        return base.replace(/\.(musicxml|xml|mxl)$/i, "").trim() || fallback;
      }
      function cloneScoreRawData(rawData) {
        if (typeof rawData === "string") return rawData;
        if (rawData instanceof ArrayBuffer) return rawData.slice(0);
        if (ArrayBuffer.isView(rawData)) {
          return sliceView(rawData);
        }
        if (typeof Blob !== "undefined" && rawData instanceof Blob) {
          return rawData.slice(0, rawData.size, rawData.type || "");
        }
        return rawData;
      }
      function readUint16LE(bytes, offset) {
        return (bytes[offset] ?? 0) | (bytes[offset + 1] ?? 0) << 8;
      }
      function readUint32LE(bytes, offset) {
        return ((bytes[offset] ?? 0) | (bytes[offset + 1] ?? 0) << 8 | (bytes[offset + 2] ?? 0) << 16 | (bytes[offset + 3] ?? 0) << 24) >>> 0;
      }
      function normalizeZipEntryPath(path) {
        return String(path || "").replace(/^\/+/, "").replace(/\\/g, "/");
      }
      function getZipEntryDepth(path) {
        const normalized = normalizeZipEntryPath(path);
        if (!normalized) return Number.MAX_SAFE_INTEGER;
        return normalized.split("/").length - 1;
      }
      async function rawDataToArrayBuffer(rawData) {
        if (rawData instanceof ArrayBuffer) return rawData;
        if (ArrayBuffer.isView(rawData)) {
          return sliceView(rawData);
        }
        if (typeof Blob !== "undefined" && rawData instanceof Blob) {
          return await rawData.arrayBuffer();
        }
        return null;
      }
      function listZipEntries(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        const eocdSignature = 101010256;
        const centralSignature = 33639248;
        const minEocdSize = 22;
        const maxCommentLength = 65535;
        const searchStart = Math.max(0, bytes.length - (minEocdSize + maxCommentLength));
        let eocdOffset = -1;
        for (let offset2 = bytes.length - minEocdSize; offset2 >= searchStart; offset2 -= 1) {
          if (readUint32LE(bytes, offset2) === eocdSignature) {
            eocdOffset = offset2;
            break;
          }
        }
        if (eocdOffset < 0) {
          throw new Error("Could not find the ZIP directory in this MXL file.");
        }
        const entryCount = readUint16LE(bytes, eocdOffset + 10);
        const centralDirectoryOffset = readUint32LE(bytes, eocdOffset + 16);
        let offset = centralDirectoryOffset;
        const decoder = new TextDecoder("utf-8");
        const entries = [];
        for (let index = 0; index < entryCount; index += 1) {
          if (offset + 46 > bytes.length || readUint32LE(bytes, offset) !== centralSignature) {
            throw new Error("Could not read the ZIP entries from this MXL file.");
          }
          const compressionMethod = readUint16LE(bytes, offset + 10);
          const compressedSize = readUint32LE(bytes, offset + 20);
          const uncompressedSize = readUint32LE(bytes, offset + 24);
          const fileNameLength = readUint16LE(bytes, offset + 28);
          const extraFieldLength = readUint16LE(bytes, offset + 30);
          const fileCommentLength = readUint16LE(bytes, offset + 32);
          const localHeaderOffset = readUint32LE(bytes, offset + 42);
          const fileNameStart = offset + 46;
          const fileNameEnd = fileNameStart + fileNameLength;
          const fileName = decoder.decode(bytes.slice(fileNameStart, fileNameEnd));
          entries.push({
            fileName,
            compressionMethod,
            compressedSize,
            uncompressedSize,
            localHeaderOffset
          });
          offset = fileNameEnd + extraFieldLength + fileCommentLength;
        }
        return entries;
      }
      async function inflateZipEntryData(compressedBytes, compressionMethod) {
        if (compressionMethod === 0) {
          return compressedBytes;
        }
        if (compressionMethod !== 8) {
          throw new Error(`Unsupported MXL compression method: ${compressionMethod}.`);
        }
        if (typeof DecompressionStream !== "function") {
          throw new Error("This browser does not support ZIP decompression for transpose.");
        }
        const stream = new Blob([compressedBytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        const inflatedBuffer = await new Response(stream).arrayBuffer();
        return new Uint8Array(inflatedBuffer);
      }
      async function extractZipEntryText(arrayBuffer, entry) {
        const bytes = new Uint8Array(arrayBuffer);
        const localSignature = 67324752;
        const localOffset = entry.localHeaderOffset;
        if (localOffset + 30 > bytes.length || readUint32LE(bytes, localOffset) !== localSignature) {
          throw new Error(`Could not read ZIP entry "${entry.fileName}".`);
        }
        const fileNameLength = readUint16LE(bytes, localOffset + 26);
        const extraFieldLength = readUint16LE(bytes, localOffset + 28);
        const dataStart = localOffset + 30 + fileNameLength + extraFieldLength;
        const dataEnd = dataStart + entry.compressedSize;
        const compressedBytes = bytes.slice(dataStart, dataEnd);
        const inflatedBytes = await inflateZipEntryData(compressedBytes, entry.compressionMethod);
        return new TextDecoder("utf-8").decode(inflatedBytes);
      }
      function chooseMusicXmlEntry(entries, containerPath = "") {
        const normalizedContainerPath = normalizeZipEntryPath(containerPath).toLowerCase();
        const xmlEntries = entries.filter((entry) => {
          const normalizedPath = normalizeZipEntryPath(entry.fileName);
          if (!normalizedPath) return false;
          if (normalizedPath.toLowerCase() === "meta-inf/container.xml") return false;
          return /\.(xml|musicxml)$/i.test(normalizedPath);
        });
        if (!xmlEntries.length) return null;
        if (normalizedContainerPath) {
          const containerMatch = xmlEntries.find((entry) => normalizeZipEntryPath(entry.fileName).toLowerCase() === normalizedContainerPath);
          if (containerMatch) return containerMatch;
        }
        const rootLevelEntry = xmlEntries.filter((entry) => getZipEntryDepth(entry.fileName) === 0).sort((left, right) => normalizeZipEntryPath(left.fileName).localeCompare(normalizeZipEntryPath(right.fileName)))[0];
        if (rootLevelEntry) return rootLevelEntry;
        return xmlEntries.sort((left, right) => {
          const depthDelta = getZipEntryDepth(left.fileName) - getZipEntryDepth(right.fileName);
          if (depthDelta !== 0) return depthDelta;
          return normalizeZipEntryPath(left.fileName).localeCompare(normalizeZipEntryPath(right.fileName));
        })[0];
      }
      async function extractMusicXmlFromMxl(rawData) {
        const arrayBuffer = await rawDataToArrayBuffer(rawData);
        if (!arrayBuffer) return null;
        const entries = listZipEntries(arrayBuffer);
        const containerEntry = entries.find((entry) => normalizeZipEntryPath(entry.fileName).toLowerCase() === "meta-inf/container.xml");
        let containerPath = "";
        if (containerEntry) {
          try {
            const containerText = await extractZipEntryText(arrayBuffer, containerEntry);
            const match = containerText.match(/full-path\s*=\s*["']([^"']+)["']/i);
            if (match && match[1]) {
              containerPath = match[1];
            }
          } catch (_) {
          }
        }
        const xmlEntry = chooseMusicXmlEntry(entries, containerPath);
        if (!xmlEntry) {
          throw new Error("Could not find the embedded MusicXML inside this MXL file.");
        }
        return await extractZipEntryText(arrayBuffer, xmlEntry);
      }
      async function getCanonicalMusicXmlForTranspose(rawData, { fileName = "Untitled Score", fileType = "xml" } = {}) {
        if (typeof rawData === "string" && /^\s*(?:<\?xml\b|<score-partwise\b)/.test(rawData)) return rawData;
        const resolvedType = String(fileType || getScoreFileTypeFromName(fileName || "") || "xml").toLowerCase();
        if (resolvedType === "xml" || resolvedType === "musicxml") {
          return typeof rawData === "string" ? rawData : rawData instanceof Blob ? await rawData.text() : null;
        }
        if (resolvedType === "mxl") {
          try {
            return await extractMusicXmlFromMxl(rawData);
          } catch (extractErr) {
            const normalize = ports.getNormalizer();
            if (normalize) {
              try {
                return await normalize(rawData, { fileName, fileType: resolvedType });
              } catch (normalizeErr) {
                ports.warn("Could not normalize MXL to MusicXML for transpose support.", normalizeErr);
                ports.warn("Direct MXL XML extraction also failed.", extractErr);
                return null;
              }
            }
            ports.warn("Could not extract MXL to MusicXML for transpose support.", extractErr);
            return null;
          }
        }
        return null;
      }
      function getOsmdLoadPayload(rawData, fileType = "xml", fileName = "Untitled Score") {
        const resolvedType = String(fileType || getScoreFileTypeFromName(fileName || "") || "xml").toLowerCase();
        if (resolvedType !== "mxl") return rawData;
        const resolvedName = fileName || "Untitled Score.mxl";
        if (rawData instanceof File) return rawData;
        if (rawData instanceof Blob) {
          if (typeof File === "function") {
            return new File([rawData], resolvedName);
          }
          Object.assign(rawData, { name: resolvedName });
          return rawData;
        }
        if (rawData instanceof ArrayBuffer) {
          if (typeof File === "function") {
            return new File([rawData], resolvedName);
          }
          const blob = new Blob([rawData]);
          Object.assign(blob, { name: resolvedName });
          return blob;
        }
        if (ArrayBuffer.isView(rawData)) {
          const slice = sliceView(rawData);
          if (typeof File === "function") {
            return new File([slice], resolvedName);
          }
          const blob = new Blob([slice]);
          Object.assign(blob, { name: resolvedName });
          return blob;
        }
        return rawData;
      }
      return { getScoreFileTypeFromName, getScoreDisplayTitle, cloneScoreRawData, readUint16LE, readUint32LE, normalizeZipEntryPath, getZipEntryDepth, rawDataToArrayBuffer, listZipEntries, inflateZipEntryData, extractZipEntryText, chooseMusicXmlEntry, extractMusicXmlFromMxl, getCanonicalMusicXmlForTranspose, getOsmdLoadPayload };
    }
    PianoTrainerMusicXmlIO2.create = create;
  })(PianoTrainerMusicXmlIO || (PianoTrainerMusicXmlIO = {}));

  // src/score/osmd-debug-observation.ts
  var PianoTrainerOsmdDebugObservation;
  ((PianoTrainerOsmdDebugObservation2) => {
    function describeLogicalNoteForDebug(note, measureIndex = null, staffIndex = null) {
      const voice = note?.ParentVoiceEntry;
      return {
        measureIndex,
        staffIndex,
        staffId: note?.ParentStaff?.id ?? null,
        midi: note?.halfTone != null ? note.halfTone + 12 : null,
        halfTone: note?.halfTone ?? null,
        length: note?.Length?.RealValue ?? null,
        timestamp: voice?.Timestamp?.RealValue ?? null,
        isRest: !!(note?.isRest && note.isRest()),
        hasTie: !!note?.NoteTie
      };
    }
    PianoTrainerOsmdDebugObservation2.describeLogicalNoteForDebug = describeLogicalNoteForDebug;
    function describeGraphicalNoteForDebug(gn) {
      const src = gn?.sourceNote, shape = gn?.PositionAndShape;
      return {
        midi: src?.halfTone != null ? src.halfTone + 12 : null,
        halfTone: src?.halfTone ?? null,
        staffId: src?.ParentStaff?.id ?? null,
        timestamp: src?.ParentVoiceEntry?.Timestamp?.RealValue ?? null,
        length: src?.Length?.RealValue ?? null,
        absX: shape?.AbsolutePosition?.x ?? null,
        absY: shape?.AbsolutePosition?.y ?? null,
        width: shape?.Size?.width ?? null,
        height: shape?.Size?.height ?? null
      };
    }
    PianoTrainerOsmdDebugObservation2.describeGraphicalNoteForDebug = describeGraphicalNoteForDebug;
  })(PianoTrainerOsmdDebugObservation || (PianoTrainerOsmdDebugObservation = {}));

  // src/score/webmscore-adapter.ts
  var PianoTrainerWebmscoreAdapter;
  ((PianoTrainerWebmscoreAdapter2) => {
    PianoTrainerWebmscoreAdapter2.SCRIPT_URL = "assets/vendor/webmscore/webmscore.js";
    function bufferLike(data) {
      if (data && (typeof data === "object" || typeof data === "function") && "buffer" in data && data.buffer instanceof ArrayBuffer) {
        return data;
      }
      return null;
    }
    function uint8ArrayToString(data) {
      if (typeof data === "string") return data;
      if (data instanceof ArrayBuffer) return new TextDecoder("utf-8").decode(new Uint8Array(data));
      if (ArrayBuffer.isView(data)) return new TextDecoder("utf-8").decode(data);
      const view = bufferLike(data);
      if (view) return new TextDecoder("utf-8").decode(new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || view.buffer.byteLength));
      throw new Error("Converted score was not returned as text.");
    }
    PianoTrainerWebmscoreAdapter2.uint8ArrayToString = uint8ArrayToString;
    function bytesForNormalization(rawData) {
      if (rawData instanceof Uint8Array) return rawData;
      if (rawData instanceof ArrayBuffer) return new Uint8Array(rawData);
      const view = bufferLike(rawData);
      return view ? new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || view.buffer.byteLength) : null;
    }
    PianoTrainerWebmscoreAdapter2.bytesForNormalization = bytesForNormalization;
    function create(ports) {
      let scriptPromise = null, readyPromise = null;
      let ownedScript = null, rejectScript = null, generation = 0;
      function assertActive(started) {
        if (started !== generation) throw new DOMException("Score conversion disposed.", "AbortError");
      }
      async function ensureWebMscoreLoaded() {
        const started = generation;
        if (ports.getVendor() && ports.getVendor().ready) {
          await ports.getVendor().ready;
          assertActive(started);
          return ports.getVendor();
        }
        if (!scriptPromise) {
          scriptPromise = new Promise((resolve, reject) => {
            const existing = ports.document.querySelector('script[data-webmscore-loader="true"]');
            if (existing) {
              resolve();
              return;
            }
            const script = ports.document.createElement("script");
            ownedScript = script;
            rejectScript = reject;
            script.src = PianoTrainerWebmscoreAdapter2.SCRIPT_URL;
            script.async = true;
            script.dataset.webmscoreLoader = "true";
            script.onload = () => {
              if (started !== generation) return;
              rejectScript = null;
              resolve();
            };
            script.onerror = () => {
              if (started !== generation) return;
              rejectScript = null;
              reject(new Error("Could not load the local webmscore converter files. Download them into assets/vendor/webmscore first."));
            };
            ports.document.head.appendChild(script);
          });
        }
        await scriptPromise;
        assertActive(started);
        if (!ports.getVendor() || !ports.getVendor().ready) throw new Error("webmscore did not initialize correctly.");
        if (!readyPromise) readyPromise = ports.getVendor().ready;
        await readyPromise;
        assertActive(started);
        return ports.getVendor();
      }
      function dispose() {
        generation++;
        if (rejectScript) rejectScript(new DOMException("Score conversion disposed.", "AbortError"));
        rejectScript = null;
        if (ownedScript) {
          ownedScript.onload = ownedScript.onerror = null;
          ownedScript.remove();
          ownedScript = null;
        }
        scriptPromise = null;
        readyPromise = null;
      }
      return { ensureWebMscoreLoaded, dispose };
    }
    PianoTrainerWebmscoreAdapter2.create = create;
  })(PianoTrainerWebmscoreAdapter || (PianoTrainerWebmscoreAdapter = {}));

  // src/score/score-conversion.ts
  var PianoTrainerScoreConversion;
  ((PianoTrainerScoreConversion2) => {
    const FORMATS = Object.freeze({
      ".mid": "midi",
      ".midi": "midi",
      ".mscz": "mscz",
      ".mscx": "mscx",
      ".gp": "gp",
      ".gp3": "gp3",
      ".gp4": "gp4",
      ".gp5": "gp5",
      ".gpx": "gpx",
      ".gtp": "gtp",
      ".ptb": "ptb"
    });
    function create(ports) {
      let generation = 0;
      const owned = /* @__PURE__ */ new Set();
      function assertActive(started) {
        if (started !== generation) throw new DOMException("Score conversion disposed.", "AbortError");
      }
      function getFileExtension(fileName = "") {
        const match = String(fileName || "").trim().toLowerCase().match(/(\.[^.]+)$/);
        return match ? match[1] : "";
      }
      function getBaseTitle(fileName = "") {
        const base = String(fileName || "").trim();
        return base ? base.replace(/\.[^.]+$/i, "").trim() || "Imported Score" : "Imported Score";
      }
      function getWebMscoreFormat(fileName = "") {
        return FORMATS[getFileExtension(fileName)] || null;
      }
      function isConverterImportFileName(fileName = "") {
        return !!getWebMscoreFormat(fileName);
      }
      function track(score) {
        const resource = { score, softDestroyed: false, hardDestroyed: false };
        owned.add(resource);
        return resource;
      }
      function destroy(resource, hard = false) {
        if (hard ? resource.hardDestroyed : resource.softDestroyed || resource.hardDestroyed) return;
        if (hard) resource.hardDestroyed = true;
        else resource.softDestroyed = true;
        if (typeof resource.score.destroy === "function") {
          try {
            if (hard) resource.score.destroy(false);
            else resource.score.destroy();
          } catch (_) {
          }
        }
      }
      async function exportMusicXmlText(score) {
        const method = !score ? null : typeof score.saveXml === "function" ? "saveXml" : typeof score.saveMusicXml === "function" ? "saveMusicXml" : typeof score.saveMxml === "function" ? "saveMxml" : typeof score.saveMusicXML === "function" ? "saveMusicXML" : null;
        if (!method) throw new Error("webmscore loaded, but this build does not expose a MusicXML export function.");
        return PianoTrainerWebmscoreAdapter.uint8ArrayToString(await score[method]());
      }
      async function convertFileToScore(file) {
        const started = generation;
        if (!file) throw new Error("No file selected.");
        const format = getWebMscoreFormat(file.name || "");
        if (!format) throw new Error("That file type is not supported for conversion.");
        const vendor = await ports.ensureWebMscoreLoaded();
        assertActive(started);
        const bytes = new Uint8Array(await ports.readArrayBuffer(file));
        assertActive(started);
        let resource = null;
        try {
          const score = await vendor.load(format, bytes);
          resource = score ? track(score) : null;
          if (started !== generation) {
            if (resource) destroy(resource, true);
            assertActive(started);
          }
          const rawData = await exportMusicXmlText(score);
          assertActive(started);
          return { rawData, fileName: `${getBaseTitle(file.name || "")}.musicxml`, fileType: "musicxml", title: getBaseTitle(file.name || "") };
        } catch (error) {
          if (started !== generation) throw new DOMException("Score conversion disposed.", "AbortError");
          ports.reportError("Converted score import failed", error);
          throw new Error(`Could not convert "${file.name || "that file"}". Some MIDI, MuseScore, or Guitar Pro files may need cleanup in MuseScore before importing.`);
        } finally {
          if (resource) destroy(resource);
        }
      }
      async function normalizeScoreToMusicXml(rawData, { fileName = "Untitled Score", fileType = "" } = {}) {
        const started = generation, resolvedType = String(fileType || getFileExtension(fileName || "") || "").toLowerCase().replace(/^\./, "");
        if (resolvedType === "xml" || resolvedType === "musicxml") return PianoTrainerWebmscoreAdapter.uint8ArrayToString(rawData);
        if (resolvedType !== "mxl") throw new Error("Only MusicXML text and compressed MXL are supported for transpose normalization.");
        const vendor = await ports.ensureWebMscoreLoaded();
        assertActive(started);
        const bytes = rawData instanceof Blob ? new Uint8Array(await rawData.arrayBuffer()) : PianoTrainerWebmscoreAdapter.bytesForNormalization(rawData);
        assertActive(started);
        if (!bytes) throw new Error("Could not normalize this score for transpose.");
        let resource = null;
        try {
          const score = await vendor.load("mxl", bytes);
          resource = score ? track(score) : null;
          if (started !== generation) {
            if (resource) destroy(resource, true);
            assertActive(started);
          }
          const xml = await exportMusicXmlText(score);
          assertActive(started);
          return xml;
        } finally {
          if (resource) destroy(resource);
        }
      }
      async function convertAndLoadScoreFile(file) {
        const started = generation, converted = await convertFileToScore(file);
        assertActive(started);
        const load = ports.getLoader();
        if (typeof load !== "function") throw new Error("loadScoreIntoApp() is not available.");
        await load(converted.rawData, converted);
        assertActive(started);
        return converted;
      }
      function dispose() {
        generation++;
        for (const resource of owned) destroy(resource, true);
        owned.clear();
      }
      return {
        getWebMscoreFormat,
        isConverterImportFileName,
        ensureWebMscoreLoaded: ports.ensureWebMscoreLoaded,
        convertFileToScore,
        convertAndLoadScoreFile,
        convertAndLoadMidiFile: convertAndLoadScoreFile,
        normalizeScoreToMusicXml,
        supportedExtensions: Object.freeze(Object.keys(FORMATS)),
        dispose
      };
    }
    PianoTrainerScoreConversion2.create = create;
  })(PianoTrainerScoreConversion || (PianoTrainerScoreConversion = {}));

  // src/score/library-backup.ts
  var PianoTrainerLibraryBackup;
  ((PianoTrainerLibraryBackup2) => {
    function arrayBufferToByteArray(buffer) {
      return Array.from(new Uint8Array(buffer));
    }
    PianoTrainerLibraryBackup2.arrayBufferToByteArray = arrayBufferToByteArray;
    function byteArrayToArrayBuffer(bytes) {
      return new Uint8Array(Array.isArray(bytes) ? bytes : []).buffer;
    }
    PianoTrainerLibraryBackup2.byteArrayToArrayBuffer = byteArrayToArrayBuffer;
    function serializeScoreRawData(rawData) {
      if (rawData instanceof ArrayBuffer)
        return { kind: "arraybuffer", bytes: arrayBufferToByteArray(rawData) };
      return { kind: "text", text: String(rawData ?? "") };
    }
    PianoTrainerLibraryBackup2.serializeScoreRawData = serializeScoreRawData;
    function deserializeScoreRawData(payload) {
      if (!payload || typeof payload !== "object")
        return "";
      const kind = Reflect.get(payload, "kind");
      if (kind === "arraybuffer")
        return byteArrayToArrayBuffer(Reflect.get(payload, "bytes"));
      return String(Reflect.get(payload, "text") ?? "");
    }
    PianoTrainerLibraryBackup2.deserializeScoreRawData = deserializeScoreRawData;
    function readArrays(payload) {
      const top = payload;
      return {
        folders: Array.isArray(top?.folders) ? top.folders : [],
        scores: Array.isArray(top?.scores) ? top.scores : []
      };
    }
    PianoTrainerLibraryBackup2.readArrays = readArrays;
  })(PianoTrainerLibraryBackup || (PianoTrainerLibraryBackup = {}));

  // src/score/score-library.ts
  var PianoTrainerScoreLibrary;
  ((PianoTrainerScoreLibrary2) => {
    const SCORE_LIBRARY_DB_NAME = "pianoTrainerLibrary", SCORE_LIBRARY_DB_VERSION = 1;
    const SCORE_LIBRARY_FOLDER_STORE = "folders", SCORE_LIBRARY_SCORE_STORE = "scores";
    PianoTrainerScoreLibrary2.STARTER_LIBRARY_IMPORT_STORAGE_KEY = "pt_starterLibraryImported_v1";
    function create(ports) {
      let generation = 0, database = null, rejectOpen = null;
      const ownedTransactions = /* @__PURE__ */ new Set();
      const ownedReadResults = /* @__PURE__ */ new Set();
      const aborted = () => new DOMException("Score library disposed.", "AbortError");
      function assertActive(started) {
        if (started !== generation)
          throw aborted();
      }
      const service = {
        dbPromise: null,
        async init() {
          const started = generation;
          if (!ports.hasIndexedDB()) {
            throw new Error("IndexedDB is not available in this browser.");
          }
          if (!this.dbPromise) {
            this.dbPromise = new Promise((resolve, reject) => {
              rejectOpen = reject;
              const request = ports.getIndexedDB().open(SCORE_LIBRARY_DB_NAME, SCORE_LIBRARY_DB_VERSION);
              request.onerror = () => {
                if (started === generation)
                  rejectOpen = null;
                reject(request.error || new Error("Could not open the score library database."));
              };
              request.onupgradeneeded = () => {
                const db = request.result;
                if (started !== generation) {
                  request.transaction?.abort();
                  return;
                }
                if (!db.objectStoreNames.contains(SCORE_LIBRARY_FOLDER_STORE)) {
                  const folderStore = db.createObjectStore(SCORE_LIBRARY_FOLDER_STORE, { keyPath: "id" });
                  folderStore.createIndex("by_name", "name", { unique: false });
                }
                if (!db.objectStoreNames.contains(SCORE_LIBRARY_SCORE_STORE)) {
                  const scoreStore = db.createObjectStore(SCORE_LIBRARY_SCORE_STORE, { keyPath: "id" });
                  scoreStore.createIndex("by_folderId", "folderId", { unique: false });
                  scoreStore.createIndex("by_lastOpenedAt", "lastOpenedAt", { unique: false });
                  scoreStore.createIndex("by_title", "title", { unique: false });
                }
              };
              request.onsuccess = () => {
                if (started !== generation) {
                  request.result.close();
                  reject(aborted());
                  return;
                }
                rejectOpen = null;
                database = request.result;
                resolve(request.result);
              };
            });
          }
          return this.dbPromise;
        },
        async transaction(storeNames, mode, executor) {
          const started = generation;
          const db = await this.init();
          assertActive(started);
          return new Promise((resolve, reject) => {
            const tx = db.transaction(storeNames, mode);
            ownedTransactions.add(tx);
            const stores = Object.fromEntries(storeNames.map((name) => [name, tx.objectStore(name)]));
            let result;
            tx.oncomplete = () => {
              ownedTransactions.delete(tx);
              if (result instanceof Promise)
                ownedReadResults.delete(result);
              resolve(result);
            };
            tx.onerror = () => reject(tx.error || new Error("Library transaction failed."));
            tx.onabort = () => {
              ownedTransactions.delete(tx);
              if (result instanceof Promise)
                ownedReadResults.delete(result);
              reject(tx.error || new Error("Library transaction was aborted."));
            };
            try {
              result = executor(stores, tx);
              if (result instanceof Promise) {
                if (started !== generation)
                  result.catch(() => {
                  });
                else
                  ownedReadResults.add(result);
              }
            } catch (err) {
              reject(err);
              try {
                tx.abort();
              } catch (e) {
              }
            }
          });
        },
        requestToPromise(request) {
          return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error("Library request failed."));
          });
        },
        async getAllFolders() {
          return this.transaction([SCORE_LIBRARY_FOLDER_STORE], "readonly", ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => this.requestToPromise(store.getAll())).then((items) => (items || []).sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))));
        },
        async getAllScores() {
          return this.transaction([SCORE_LIBRARY_SCORE_STORE], "readonly", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => this.requestToPromise(store.getAll())).then((items) => (items || []).sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""))));
        },
        async getRecentScores(limit = 8) {
          const started = generation;
          const scores = await this.getAllScores();
          assertActive(started);
          return scores.filter((score) => !!score.lastOpenedAt).sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0)).slice(0, limit);
        },
        async createFolder(name) {
          const started = generation;
          const trimmed = String(name || "").trim();
          if (!trimmed)
            throw new Error("Folder name is required.");
          const folder = {
            id: ports.makeId(),
            name: trimmed,
            createdAt: ports.now(),
            updatedAt: ports.now()
          };
          await this.transaction([SCORE_LIBRARY_FOLDER_STORE], "readwrite", ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => {
            store.put(folder);
          });
          assertActive(started);
          return folder;
        },
        async renameFolder(folderId, nextName) {
          const started = generation;
          const trimmed = String(nextName || "").trim();
          if (!folderId)
            throw new Error("Folder not found.");
          if (!trimmed)
            throw new Error("Folder name is required.");
          const folder = await this.transaction([SCORE_LIBRARY_FOLDER_STORE], "readonly", ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => this.requestToPromise(store.get(folderId)));
          assertActive(started);
          if (!folder)
            throw new Error("Folder not found.");
          folder.name = trimmed;
          folder.updatedAt = ports.now();
          await this.transaction([SCORE_LIBRARY_FOLDER_STORE], "readwrite", ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => {
            store.put(folder);
          });
          assertActive(started);
          return folder;
        },
        async deleteFolder(folderId) {
          const started = generation;
          if (!folderId)
            throw new Error("Folder not found.");
          const scores = await this.getAllScores();
          assertActive(started);
          const inFolder = scores.filter((score) => score.folderId === folderId);
          if (inFolder.length > 0)
            throw new Error("Folder must be empty before deleting.");
          await this.transaction([SCORE_LIBRARY_FOLDER_STORE], "readwrite", ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => {
            store.delete(folderId);
          });
          assertActive(started);
          return true;
        },
        async deleteFolderAndScores(folderId) {
          const started = generation;
          const ids = Array.from(new Set([folderId].filter(Boolean)));
          if (!ids.length)
            throw new Error("Folder not found.");
          await this.deleteFoldersAndScores(ids);
          assertActive(started);
          return true;
        },
        async deleteFoldersAndScores(folderIds) {
          const started = generation;
          const ids = Array.from(new Set((folderIds || []).filter(Boolean)));
          if (!ids.length)
            return 0;
          await this.transaction([SCORE_LIBRARY_FOLDER_STORE, SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_FOLDER_STORE]: folderStore, [SCORE_LIBRARY_SCORE_STORE]: scoreStore }) => {
            const getAllScoresRequest = scoreStore.getAll();
            getAllScoresRequest.onsuccess = () => {
              const allScores = Array.isArray(getAllScoresRequest.result) ? getAllScoresRequest.result : [];
              allScores.forEach((score) => {
                if (ids.includes(score.folderId)) {
                  scoreStore.delete(score.id);
                }
              });
              ids.forEach((folderId) => folderStore.delete(folderId));
            };
          });
          assertActive(started);
          return ids.length;
        },
        async saveScore({ title, folderId = null, fileName, fileType, rawData, lastOpenedAt = null }) {
          const started = generation;
          const now = ports.now();
          const score = {
            id: ports.makeId(),
            title: String(title || ports.format.getScoreDisplayTitle(fileName || "") || "Untitled Score").trim() || "Untitled Score",
            folderId: folderId || null,
            fileName: fileName || "Untitled Score.xml",
            fileType: fileType || ports.format.getScoreFileTypeFromName(fileName || ""),
            rawData,
            createdAt: now,
            updatedAt: now,
            lastOpenedAt
          };
          await this.transaction([SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
            store.put(score);
          });
          assertActive(started);
          return score;
        },
        async getScoreById(scoreId) {
          if (!scoreId)
            return null;
          return this.transaction([SCORE_LIBRARY_SCORE_STORE], "readonly", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => this.requestToPromise(store.get(scoreId)));
        },
        async renameScore(scoreId, nextTitle) {
          const started = generation;
          const trimmed = String(nextTitle || "").trim();
          if (!scoreId)
            throw new Error("Score not found.");
          if (!trimmed)
            throw new Error("Score name is required.");
          const score = await this.getScoreById(scoreId);
          assertActive(started);
          if (!score)
            throw new Error("Score not found.");
          score.title = trimmed;
          score.updatedAt = ports.now();
          await this.transaction([SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
            store.put(score);
          });
          assertActive(started);
          return score;
        },
        async markScoreOpened(scoreId) {
          const started = generation;
          const score = await this.getScoreById(scoreId);
          assertActive(started);
          if (!score)
            return null;
          score.lastOpenedAt = ports.now();
          score.updatedAt = ports.now();
          await this.transaction([SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
            store.put(score);
          });
          assertActive(started);
          return score;
        },
        async moveScoresToFolder(scoreIds, folderId = null) {
          const started = generation;
          const ids = Array.from(new Set((scoreIds || []).filter(Boolean)));
          if (!ids.length)
            return 0;
          await this.transaction([SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
            ids.forEach((scoreId) => {
              const request = store.get(scoreId);
              request.onsuccess = () => {
                const score = request.result;
                if (!score)
                  return;
                score.folderId = folderId || null;
                score.updatedAt = ports.now();
                store.put(score);
              };
            });
          });
          assertActive(started);
          return ids.length;
        },
        async deleteScores(scoreIds) {
          const started = generation;
          const ids = Array.from(new Set((scoreIds || []).filter(Boolean)));
          if (!ids.length)
            return 0;
          await this.transaction([SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
            ids.forEach((scoreId) => store.delete(scoreId));
          });
          assertActive(started);
          return ids.length;
        },
        async exportBackup() {
          const started = generation;
          const folders = await this.getAllFolders();
          assertActive(started);
          const scores = await this.getAllScores();
          assertActive(started);
          return {
            version: 1,
            exportedAt: ports.isoNow(),
            folders: folders.map((folder) => ({ ...folder })),
            scores: scores.map((score) => ({
              ...score,
              rawData: PianoTrainerLibraryBackup.serializeScoreRawData(score.rawData)
            }))
          };
        },
        async importBackup(payload) {
          const started = generation;
          const { folders, scores } = PianoTrainerLibraryBackup.readArrays(payload);
          const folderIdMap = /* @__PURE__ */ new Map();
          await this.transaction([SCORE_LIBRARY_FOLDER_STORE, SCORE_LIBRARY_SCORE_STORE], "readwrite", ({ [SCORE_LIBRARY_FOLDER_STORE]: folderStore, [SCORE_LIBRARY_SCORE_STORE]: scoreStore }) => {
            folders.forEach((folder) => {
              const newId = ports.makeId();
              folderIdMap.set(folder.id, newId);
              folderStore.put({
                id: newId,
                name: String(folder.name || "New Folder").trim() || "New Folder",
                createdAt: Number(folder.createdAt) || ports.now(),
                updatedAt: Number(folder.updatedAt) || ports.now()
              });
            });
            scores.forEach((score) => {
              scoreStore.put({
                id: ports.makeId(),
                title: String(score.title || ports.format.getScoreDisplayTitle(score.fileName || "") || "Untitled Score").trim() || "Untitled Score",
                folderId: folderIdMap.get(score.folderId) || null,
                fileName: score.fileName || "Imported Score.xml",
                fileType: score.fileType || ports.format.getScoreFileTypeFromName(score.fileName || ""),
                rawData: PianoTrainerLibraryBackup.deserializeScoreRawData(score.rawData),
                createdAt: Number(score.createdAt) || ports.now(),
                updatedAt: ports.now(),
                lastOpenedAt: Number(score.lastOpenedAt) || null
              });
            });
          });
          assertActive(started);
        },
        async importStarterLibraryOnce() {
          const started = generation;
          if (ports.storage.getItem(PianoTrainerScoreLibrary2.STARTER_LIBRARY_IMPORT_STORAGE_KEY) === "true")
            return false;
          const existingScores = await this.getAllScores();
          assertActive(started);
          if (existingScores.length > 0) {
            ports.storage.setItem(PianoTrainerScoreLibrary2.STARTER_LIBRARY_IMPORT_STORAGE_KEY, "true");
            return false;
          }
          const response = await ports.fetch(ports.starterUrl, { cache: "no-store" });
          assertActive(started);
          if (!response.ok) {
            throw new Error(`Could not load starter library (${response.status}).`);
          }
          const payload = await response.json();
          assertActive(started);
          await this.importBackup(payload);
          assertActive(started);
          ports.storage.setItem(PianoTrainerScoreLibrary2.STARTER_LIBRARY_IMPORT_STORAGE_KEY, "true");
          return true;
        },
        dispose() {
          generation++;
          for (const result of ownedReadResults)
            result.catch(() => {
            });
          ownedReadResults.clear();
          if (rejectOpen)
            rejectOpen(aborted());
          rejectOpen = null;
          for (const tx of ownedTransactions) {
            try {
              tx.abort();
            } catch (_) {
            }
          }
          ownedTransactions.clear();
          database?.close();
          database = null;
          this.dbPromise = null;
        }
      };
      return service;
    }
    PianoTrainerScoreLibrary2.create = create;
    function getScoreLibraryFolderLabel(folderId, folders) {
      if (folderId === "__all__")
        return "All Scores";
      if (folderId == null || folderId === "__unfiled__")
        return "Unfiled";
      const folder = (folders || []).find((item) => item.id === folderId);
      return folder?.name || "Unknown Folder";
    }
    PianoTrainerScoreLibrary2.getScoreLibraryFolderLabel = getScoreLibraryFolderLabel;
  })(PianoTrainerScoreLibrary || (PianoTrainerScoreLibrary = {}));

  // src/score/score-loader.ts
  var PianoTrainerScoreLoader;
  ((PianoTrainerScoreLoader2) => {
    function create(ports) {
      const state = ports.state, format = ports.format;
      let disposed = false;
      let generation = 0, vendorLoad = Promise.resolve();
      function assertActive(token) {
        if (disposed || token !== generation) throw new DOMException("Score loading expired.", "AbortError");
      }
      async function loadScoreIntoApp(rawData, {
        fileName = "Untitled Score",
        fileType = "xml",
        libraryScoreId = null,
        title = null,
        originalRawData = void 0,
        originalFileName = void 0,
        originalFileType = void 0,
        skipTransposeReset = false
      } = {}) {
        const token = ++generation;
        try {
          assertActive(token);
          ports.beginLoad?.();
          ports.resetPlayback();
          if (!skipTransposeReset) ports.resetTempo();
          const resolvedOriginalRawData = originalRawData !== void 0 ? originalRawData : rawData;
          const resolvedOriginalFileName = originalFileName !== void 0 ? originalFileName : fileName || "Untitled Score";
          const resolvedOriginalFileType = originalFileType !== void 0 ? originalFileType : fileType || format.getScoreFileTypeFromName(fileName);
          const transposeSourceRawData = format.cloneScoreRawData(resolvedOriginalRawData);
          const osmdSourceRawData = format.cloneScoreRawData(rawData);
          const canonicalOriginalMusicXml = await format.getCanonicalMusicXmlForTranspose(transposeSourceRawData, {
            fileName: resolvedOriginalFileName,
            fileType: resolvedOriginalFileType
          });
          assertActive(token);
          const osmdLoadPayload = format.getOsmdLoadPayload(osmdSourceRawData, fileType, fileName);
          const load = vendorLoad.then(() => {
            assertActive(token);
            return ports.score.load(osmdLoadPayload);
          });
          vendorLoad = load.catch(() => {
          });
          await load;
          assertActive(token);
          ports.render();
          ports.initSongUI();
          if (ports.score.hasCursor()) {
            ports.score.reset();
            ports.score.showCursor();
            ports.score.updateCursor();
            ports.scroll();
          }
          state.ledPreviewTimeline = [];
          state.ledPreviewTimelineDirty = true;
          state.ledPreviewTraversalIndex = -1;
          state.lastLedPreviewEvents = [];
          state.currentScoreData = rawData;
          state.currentScoreOriginalData = canonicalOriginalMusicXml || resolvedOriginalRawData;
          state.currentScoreFileName = fileName || "Untitled Score";
          state.currentScoreOriginalFileName = resolvedOriginalFileName;
          state.currentScoreFileType = fileType || format.getScoreFileTypeFromName(fileName);
          state.currentScoreOriginalFileType = resolvedOriginalFileType;
          state.currentScoreLibraryId = libraryScoreId ?? null;
          state.currentScoreTitle = title || format.getScoreDisplayTitle(fileName || "");
          await ports.prepareDisplay?.(rawData, { fileName, fileType }, () => !disposed && token === generation);
          assertActive(token);
          const library = libraryScoreId ? ports.getLibrary() : void 0;
          if (libraryScoreId && library) {
            await library.markScoreOpened(libraryScoreId);
            assertActive(token);
            await ports.refreshLibrary();
            assertActive(token);
          }
          ports.notifyTranspose(skipTransposeReset);
          ports.success();
        } catch (error) {
          if (!disposed && token === generation) ports.reportError(error);
          throw error;
        }
      }
      function dispose() {
        disposed = true;
        generation++;
      }
      return { loadScoreIntoApp, dispose };
    }
    PianoTrainerScoreLoader2.create = create;
  })(PianoTrainerScoreLoader || (PianoTrainerScoreLoader = {}));

  // src/score/transpose-controller.ts
  var PianoTrainerTransposeController;
  ((PianoTrainerTransposeController2) => {
    function getDefaultState() {
      return {
        available: false,
        sourceKeyLabel: "No score loaded",
        sourceKeyFound: false,
        mode: "key",
        semitones: 0,
        targetKey: null,
        updateKeySignature: true,
        active: false,
        activeLabel: "Original score",
        disableReason: "Load a MusicXML-based score to enable transpose."
      };
    }
    PianoTrainerTransposeController2.getDefaultState = getDefaultState;
    function create(ports) {
      let generation = 0, disposed = false;
      function ensureTransposeState() {
        const app2 = ports.getApp();
        if (!app2) return getDefaultState();
        if (!app2.transpose || typeof app2.transpose !== "object") app2.transpose = getDefaultState();
        return app2.transpose;
      }
      function refreshAvailabilityFromCurrentScore() {
        const state = ensureTransposeState(), app2 = ports.getApp();
        const originalData = app2.currentScoreOriginalData, fallbackData = app2.currentScoreData;
        const engine = ports.getEngine();
        const source = engine && engine.isXmlString(originalData) ? originalData : engine && engine.isXmlString(fallbackData) ? fallbackData : null;
        state.available = !!(engine && source);
        if (!state.available) {
          state.sourceKeyLabel = app2.currentScoreData ? "Unavailable for this score" : "No score loaded";
          state.sourceKeyFound = false;
          state.disableReason = app2.currentScoreData ? "Transpose works on XML, MusicXML, normalized MXL, and imported files that convert to MusicXML." : "Load a MusicXML-based score to enable transpose.";
          state.active = false;
          state.activeLabel = "Original score";
          return state;
        }
        const detected = engine.detectScoreKey(engine.parseXml(source));
        state.sourceKeyLabel = detected.label || "Unknown";
        state.sourceKeyFound = !!detected.found;
        state.disableReason = "";
        if (detected.found) {
          const inferred = detected.presetValue ? engine.getPresetByValue(detected.presetValue) : null;
          const hasValidTarget = !!engine.getPresetByValue(state.targetKey);
          if (inferred && (!state.targetKey || !hasValidTarget)) state.targetKey = inferred.value;
        } else if (!engine.getPresetByValue(state.targetKey)) state.targetKey = "sig-0";
        return state;
      }
      function handleScoreLoaded() {
        Object.assign(ensureTransposeState(), getDefaultState());
        refreshAvailabilityFromCurrentScore();
        ports.syncUi();
      }
      async function applyTranspose() {
        if (disposed) return;
        const started = generation, state = ensureTransposeState();
        refreshAvailabilityFromCurrentScore();
        if (!state.available) {
          ports.syncUi();
          return;
        }
        const engine = ports.getEngine(), load = ports.getLoader();
        if (!engine || typeof load !== "function") return;
        const app2 = ports.getApp();
        try {
          if (state.mode === "key" && state.sourceKeyFound) {
            const selected = engine.getPresetByValue(state.targetKey), originalXml = app2.currentScoreOriginalData;
            const detected = engine.isXmlString(originalXml) ? engine.detectScoreKey(engine.parseXml(originalXml)) : null;
            if (selected && detected?.presetValue && selected.value === detected.presetValue) {
              ports.setStatus("Target key already matches the current key. Choose a different key or use semitones.", true);
              return;
            }
          }
          const result = engine.transposeXml(app2.currentScoreOriginalData, {
            mode: state.mode,
            semitones: Number(state.semitones || 0),
            targetKey: state.targetKey,
            updateKeySignature: state.updateKeySignature !== false
          });
          const originalName = app2.currentScoreOriginalFileName || app2.currentScoreFileName || "Untitled Score.musicxml";
          await load(result.xmlString, {
            fileName: originalName.replace(/\.(mxl)$/i, ".musicxml"),
            fileType: "musicxml",
            libraryScoreId: app2.currentScoreLibraryId,
            title: app2.currentScoreTitle,
            originalRawData: app2.currentScoreOriginalData,
            originalFileName: app2.currentScoreOriginalFileName || app2.currentScoreFileName,
            originalFileType: app2.currentScoreOriginalFileType || app2.currentScoreFileType,
            skipTransposeReset: true
          });
          if (started !== generation) return;
          state.active = true;
          state.activeLabel = state.mode === "key" ? `to ${result.targetKeyLabel}` : `${result.semitoneDelta > 0 ? "+" : ""}${result.semitoneDelta} semitones`;
          ports.setStatus(`Applied: ${state.activeLabel}`);
          ports.syncUi();
        } catch (error) {
          if (started !== generation) return;
          ports.reportError("Transpose apply failed", error);
          ports.setStatus(ports.errorText(error, "Could not transpose this score."), true);
        }
      }
      async function resetTranspose() {
        if (disposed) return;
        const started = generation, state = ensureTransposeState(), app2 = ports.getApp();
        const load = ports.getLoader();
        if (!app2.currentScoreOriginalData || typeof load !== "function") {
          handleScoreLoaded();
          return;
        }
        try {
          await load(app2.currentScoreOriginalData, {
            fileName: app2.currentScoreOriginalFileName || app2.currentScoreFileName || "Untitled Score.musicxml",
            fileType: app2.currentScoreOriginalFileType || app2.currentScoreFileType || "musicxml",
            libraryScoreId: app2.currentScoreLibraryId,
            title: app2.currentScoreTitle,
            originalRawData: app2.currentScoreOriginalData,
            originalFileName: app2.currentScoreOriginalFileName || app2.currentScoreFileName,
            originalFileType: app2.currentScoreOriginalFileType || app2.currentScoreFileType,
            skipTransposeReset: true
          });
          if (started !== generation) return;
          state.active = false;
          state.activeLabel = "Original score";
          state.semitones = 0;
          refreshAvailabilityFromCurrentScore();
          const originalXml = app2.currentScoreOriginalData, engine = ports.getEngine();
          const detected = engine && engine.isXmlString(originalXml) ? engine.detectScoreKey(engine.parseXml(originalXml)) : null;
          const inferred = detected?.presetValue ? engine.getPresetByValue(detected.presetValue) : null;
          state.targetKey = inferred?.value || "sig-0";
          ports.syncUi();
        } catch (error) {
          if (started !== generation) return;
          ports.reportError("Transpose reset failed", error);
          ports.setStatus(ports.errorText(error, "Could not reset transpose."), true);
        }
      }
      function init() {
        disposed = false;
      }
      function dispose() {
        if (!disposed) {
          disposed = true;
          generation++;
        }
      }
      return { ensureTransposeState, refreshAvailabilityFromCurrentScore, handleScoreLoaded, applyTranspose, resetTranspose, init, dispose };
    }
    PianoTrainerTransposeController2.create = create;
  })(PianoTrainerTransposeController || (PianoTrainerTransposeController = {}));

  // src/score/transpose-engine.ts
  var PianoTrainerTransposeEngine;
  ((PianoTrainerTransposeEngine2) => {
    const NOTE_NAMES_SHARP = [
      { step: "C", alter: 0 },
      { step: "C", alter: 1 },
      { step: "D", alter: 0 },
      { step: "D", alter: 1 },
      { step: "E", alter: 0 },
      { step: "F", alter: 0 },
      { step: "F", alter: 1 },
      { step: "G", alter: 0 },
      { step: "G", alter: 1 },
      { step: "A", alter: 0 },
      { step: "A", alter: 1 },
      { step: "B", alter: 0 }
    ];
    const NOTE_NAMES_FLAT = [
      { step: "C", alter: 0 },
      { step: "D", alter: -1 },
      { step: "D", alter: 0 },
      { step: "E", alter: -1 },
      { step: "E", alter: 0 },
      { step: "F", alter: 0 },
      { step: "G", alter: -1 },
      { step: "G", alter: 0 },
      { step: "A", alter: -1 },
      { step: "A", alter: 0 },
      { step: "B", alter: -1 },
      { step: "B", alter: 0 }
    ];
    const STEP_TO_SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const MAJOR_KEY_BY_FIFTHS = {
      "-7": { tonic: 11, label: "Cb major", bias: "flat" },
      "-6": { tonic: 6, label: "Gb major", bias: "flat" },
      "-5": { tonic: 1, label: "Db major", bias: "flat" },
      "-4": { tonic: 8, label: "Ab major", bias: "flat" },
      "-3": { tonic: 3, label: "Eb major", bias: "flat" },
      "-2": { tonic: 10, label: "Bb major", bias: "flat" },
      "-1": { tonic: 5, label: "F major", bias: "flat" },
      "0": { tonic: 0, label: "C major", bias: "sharp" },
      "1": { tonic: 7, label: "G major", bias: "sharp" },
      "2": { tonic: 2, label: "D major", bias: "sharp" },
      "3": { tonic: 9, label: "A major", bias: "sharp" },
      "4": { tonic: 4, label: "E major", bias: "sharp" },
      "5": { tonic: 11, label: "B major", bias: "sharp" },
      "6": { tonic: 6, label: "F# major", bias: "sharp" },
      "7": { tonic: 1, label: "C# major", bias: "sharp" }
    };
    const MINOR_KEY_BY_FIFTHS = {
      "-7": { tonic: 8, label: "Ab minor", bias: "flat" },
      "-6": { tonic: 3, label: "Eb minor", bias: "flat" },
      "-5": { tonic: 10, label: "Bb minor", bias: "flat" },
      "-4": { tonic: 5, label: "F minor", bias: "flat" },
      "-3": { tonic: 0, label: "C minor", bias: "flat" },
      "-2": { tonic: 7, label: "G minor", bias: "flat" },
      "-1": { tonic: 2, label: "D minor", bias: "flat" },
      "0": { tonic: 9, label: "A minor", bias: "sharp" },
      "1": { tonic: 4, label: "E minor", bias: "sharp" },
      "2": { tonic: 11, label: "B minor", bias: "sharp" },
      "3": { tonic: 6, label: "F# minor", bias: "sharp" },
      "4": { tonic: 1, label: "C# minor", bias: "sharp" },
      "5": { tonic: 8, label: "G# minor", bias: "sharp" },
      "6": { tonic: 3, label: "D# minor", bias: "sharp" },
      "7": { tonic: 10, label: "A# minor", bias: "sharp" }
    };
    const SIGNATURE_PRESETS = [
      { value: "sig--7", label: "Cb major / Ab minor", tonic: 11, fifths: -7, bias: "flat" },
      { value: "sig--6", label: "Gb major / Eb minor", tonic: 6, fifths: -6, bias: "flat" },
      { value: "sig--5", label: "Db major / Bb minor", tonic: 1, fifths: -5, bias: "flat" },
      { value: "sig--4", label: "Ab major / F minor", tonic: 8, fifths: -4, bias: "flat" },
      { value: "sig--3", label: "Eb major / C minor", tonic: 3, fifths: -3, bias: "flat" },
      { value: "sig--2", label: "Bb major / G minor", tonic: 10, fifths: -2, bias: "flat" },
      { value: "sig--1", label: "F major / D minor", tonic: 5, fifths: -1, bias: "flat" },
      { value: "sig-0", label: "C major / A minor", tonic: 0, fifths: 0, bias: "sharp" },
      { value: "sig-1", label: "G major / E minor", tonic: 7, fifths: 1, bias: "sharp" },
      { value: "sig-2", label: "D major / B minor", tonic: 2, fifths: 2, bias: "sharp" },
      { value: "sig-3", label: "A major / F# minor", tonic: 9, fifths: 3, bias: "sharp" },
      { value: "sig-4", label: "E major / C# minor", tonic: 4, fifths: 4, bias: "sharp" },
      { value: "sig-5", label: "B major / G# minor", tonic: 11, fifths: 5, bias: "sharp" },
      { value: "sig-6", label: "F# major / D# minor", tonic: 6, fifths: 6, bias: "sharp" },
      { value: "sig-7", label: "C# major / A# minor", tonic: 1, fifths: 7, bias: "sharp" }
    ];
    const KEY_PRESET_BY_VALUE = new Map(SIGNATURE_PRESETS.map((entry) => [entry.value, entry]));
    function mod(n, m) {
      return (n % m + m) % m;
    }
    function isXmlString(rawData) {
      return typeof rawData === "string" && /<score-partwise\b|<score-timewise\b/i.test(rawData);
    }
    PianoTrainerTransposeEngine2.isXmlString = isXmlString;
    function parseXml(xmlString) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "application/xml");
      const errorNode = xml.querySelector("parsererror");
      if (errorNode) {
        throw new Error("Could not parse MusicXML for transposition.");
      }
      return xml;
    }
    PianoTrainerTransposeEngine2.parseXml = parseXml;
    function serializeXml(xmlDoc) {
      return new XMLSerializer().serializeToString(xmlDoc);
    }
    PianoTrainerTransposeEngine2.serializeXml = serializeXml;
    function getFirstText(parent, selector) {
      const node = parent ? parent.querySelector(selector) : null;
      return node ? String(node.textContent || "").trim() : "";
    }
    function ensureChild(parent, name) {
      let child = Array.from(parent.children || []).find((node) => node.tagName === name);
      if (!child) {
        child = parent.ownerDocument.createElement(name);
        parent.appendChild(child);
      }
      return child;
    }
    function setOrRemoveChildText(parent, name, value) {
      const existing = Array.from(parent.children || []).find((node) => node.tagName === name);
      const numeric = Number(value || 0);
      if (!Number.isFinite(numeric) || numeric === 0) {
        if (existing) existing.remove();
        return null;
      }
      const child = existing || parent.ownerDocument.createElement(name);
      child.textContent = String(numeric);
      if (!existing) parent.appendChild(child);
      return child;
    }
    function pitchSemitone(step, alter) {
      return mod((STEP_TO_SEMITONE[String(step || "").toUpperCase()] ?? 0) + Number(alter || 0), 12);
    }
    function tonicFromKeySignature(fifths, mode) {
      const lookup = String(mode || "major").toLowerCase() === "minor" ? MINOR_KEY_BY_FIFTHS : MAJOR_KEY_BY_FIFTHS;
      return lookup[String(fifths)] || null;
    }
    function getGroupedLabelForFifths(fifths) {
      const majorInfo = MAJOR_KEY_BY_FIFTHS[String(fifths)] || null;
      const minorInfo = MINOR_KEY_BY_FIFTHS[String(fifths)] || null;
      if (majorInfo && minorInfo) return `${majorInfo.label} / ${minorInfo.label}`;
      return majorInfo?.label || minorInfo?.label || "Unknown";
    }
    function detectScoreKey(xmlDoc) {
      const keyNode = xmlDoc.querySelector("part > measure attributes key, measure attributes key, attributes key");
      if (!keyNode) {
        return {
          found: false,
          label: "Unknown",
          mode: "major",
          tonic: null,
          fifths: null,
          bias: "sharp"
        };
      }
      const fifths = Number.parseInt(getFirstText(keyNode, "fifths"), 10);
      const mode = (getFirstText(keyNode, "mode") || "major").toLowerCase() === "minor" ? "minor" : "major";
      const majorInfo = MAJOR_KEY_BY_FIFTHS[String(fifths)] || null;
      const presetValue = Number.isFinite(fifths) ? `sig-${fifths}` : null;
      const inferredPreset = presetValue ? KEY_PRESET_BY_VALUE.get(presetValue) || null : null;
      return {
        found: Number.isFinite(fifths) && !!majorInfo,
        label: getGroupedLabelForFifths(fifths),
        mode,
        tonic: majorInfo?.tonic ?? null,
        fifths: Number.isFinite(fifths) ? fifths : null,
        presetValue,
        bias: majorInfo?.bias || (Number(fifths) < 0 ? "flat" : "sharp"),
        inferredPreset
      };
    }
    PianoTrainerTransposeEngine2.detectScoreKey = detectScoreKey;
    function getKeyPresets() {
      return SIGNATURE_PRESETS.map((entry) => ({ ...entry }));
    }
    PianoTrainerTransposeEngine2.getKeyPresets = getKeyPresets;
    function getPresetByValue(value) {
      return KEY_PRESET_BY_VALUE.get(String(value || "").trim()) || null;
    }
    PianoTrainerTransposeEngine2.getPresetByValue = getPresetByValue;
    function chooseSpellingForPitchClass(pitchClass, bias = "sharp") {
      const table = bias === "flat" ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
      return table[mod(pitchClass, 12)];
    }
    function chooseKeySignatureForTonic(tonic, mode, preferredBias = "sharp") {
      const lookup = String(mode || "major").toLowerCase() === "minor" ? MINOR_KEY_BY_FIFTHS : MAJOR_KEY_BY_FIFTHS;
      const matches = Object.entries(lookup).filter(([, info]) => info.tonic === mod(tonic, 12)).map(([fifths, info]) => ({ fifths: Number(fifths), ...info }));
      if (!matches.length) return null;
      const exactBias = matches.find((entry) => entry.bias === preferredBias);
      if (exactBias) return exactBias;
      return matches.slice().sort((a, b) => Math.abs(a.fifths) - Math.abs(b.fifths))[0];
    }
    function rewritePitchNode(pitchNode, semitoneDelta, keyBias) {
      if (!pitchNode) return;
      const stepNode = pitchNode.querySelector("step");
      const octaveNode = pitchNode.querySelector("octave");
      if (!stepNode || !octaveNode) return;
      const step = String(stepNode.textContent || "").trim().toUpperCase();
      const alterNode = pitchNode.querySelector("alter");
      const alter = alterNode ? Number.parseInt(alterNode.textContent || "0", 10) : 0;
      const octave = Number.parseInt(octaveNode.textContent || "0", 10);
      if (!Number.isFinite(octave) || !(step in STEP_TO_SEMITONE)) return;
      const absoluteSemitone = octave * 12 + pitchSemitone(step, alter) + Number(semitoneDelta || 0);
      const nextPitchClass = mod(absoluteSemitone, 12);
      const nextOctave = Math.floor(absoluteSemitone / 12);
      const spelling = chooseSpellingForPitchClass(nextPitchClass, keyBias);
      stepNode.textContent = spelling.step;
      setOrRemoveChildText(pitchNode, "alter", spelling.alter);
      octaveNode.textContent = String(nextOctave);
    }
    function rewriteHarmonyNode(harmonyNode, semitoneDelta, keyBias) {
      if (!harmonyNode) return;
      const root = harmonyNode.querySelector("root");
      const bass = harmonyNode.querySelector("bass");
      [root, bass].forEach((section) => {
        if (!section) return;
        const stepNode = section.querySelector("root-step, bass-step");
        const alterNode = section.querySelector("root-alter, bass-alter");
        if (!stepNode) return;
        const step = String(stepNode.textContent || "").trim().toUpperCase();
        const alter = alterNode ? Number.parseInt(alterNode.textContent || "0", 10) : 0;
        if (!(step in STEP_TO_SEMITONE)) return;
        const pitchClass = pitchSemitone(step, alter) + Number(semitoneDelta || 0);
        const spelling = chooseSpellingForPitchClass(pitchClass, keyBias);
        stepNode.textContent = spelling.step;
        const alterTag = /root/i.test(stepNode.tagName) ? "root-alter" : "bass-alter";
        setOrRemoveChildText(section, alterTag, spelling.alter);
      });
    }
    function rewriteKeyNode(keyNode, semitoneDelta, options) {
      if (!keyNode) return { bias: options.defaultBias || "sharp", mode: "major", fifths: 0 };
      const fifthsNode = keyNode.querySelector("fifths");
      const modeNode = keyNode.querySelector("mode");
      const fifths = Number.parseInt(fifthsNode?.textContent || "0", 10);
      const currentMode = (modeNode?.textContent || options.targetMode || "major").toLowerCase() === "minor" ? "minor" : "major";
      const tonicInfo = tonicFromKeySignature(fifths, currentMode);
      const preferredBias = options.targetBias || tonicInfo?.bias || options.defaultBias || (fifths < 0 ? "flat" : "sharp");
      const transposed = chooseKeySignatureForTonic((tonicInfo?.tonic ?? 0) + Number(semitoneDelta || 0), currentMode, preferredBias);
      if (transposed && fifthsNode) fifthsNode.textContent = String(transposed.fifths);
      if (modeNode) modeNode.textContent = currentMode;
      return {
        bias: transposed?.bias || preferredBias,
        mode: currentMode,
        fifths: transposed?.fifths ?? fifths
      };
    }
    function transposeXml(xmlString, options = {}) {
      if (!isXmlString(xmlString)) {
        throw new Error("This score is not available as raw MusicXML text, so transpose is disabled for it right now.");
      }
      const xmlDoc = parseXml(xmlString);
      const detectedKey = detectScoreKey(xmlDoc);
      const mode = String(options.mode || "semitone").toLowerCase();
      let semitoneDelta = Number.parseInt(String(options.semitones || "0"), 10);
      let targetPreset = null;
      if (mode === "key") {
        targetPreset = getPresetByValue(options.targetKey);
        if (!targetPreset) {
          throw new Error("Choose a target key before applying transpose.");
        }
        if (!detectedKey.found || detectedKey.tonic == null) {
          throw new Error("This score does not expose a readable key signature. Use semitones for this score.");
        }
        semitoneDelta = mod(targetPreset.tonic - detectedKey.tonic, 12);
        if (semitoneDelta > 6) semitoneDelta -= 12;
      }
      if (!Number.isFinite(semitoneDelta)) semitoneDelta = 0;
      if (mode === "key" && targetPreset && detectedKey.found && detectedKey.presetValue === targetPreset.value) {
        return {
          xmlString,
          semitoneDelta: 0,
          sourceKey: detectedKey,
          targetKeyLabel: targetPreset.label,
          targetPreset
        };
      }
      if (semitoneDelta === 0 && mode === "semitone" && !options.forceKeySignatureUpdate) {
        return {
          xmlString,
          semitoneDelta,
          sourceKey: detectedKey,
          targetKeyLabel: detectedKey.label,
          targetPreset: null
        };
      }
      const updateKeySignature = options.updateKeySignature !== false;
      const defaultBias = targetPreset?.bias || detectedKey.bias || "sharp";
      const parts = Array.from(xmlDoc.querySelectorAll("part"));
      parts.forEach((partNode) => {
        let currentBias = defaultBias;
        Array.from(partNode.children || []).filter((node) => node.tagName === "measure").forEach((measureNode) => {
          Array.from(measureNode.children || []).forEach((child) => {
            if (child.tagName === "attributes") {
              const keyNode = child.querySelector("key");
              if (keyNode) {
                if (updateKeySignature) {
                  const rewritten = rewriteKeyNode(keyNode, semitoneDelta, {
                    targetBias: targetPreset?.bias || null,
                    targetMode: detectedKey.mode,
                    defaultBias
                  });
                  currentBias = rewritten.bias || currentBias;
                } else {
                  const currentFifths = Number.parseInt(getFirstText(keyNode, "fifths") || "0", 10);
                  currentBias = currentFifths < 0 ? "flat" : "sharp";
                }
              }
            }
            if (child.tagName === "note") {
              const pitchNode = Array.from(child.children || []).find((node) => node.tagName === "pitch");
              if (pitchNode) rewritePitchNode(pitchNode, semitoneDelta, currentBias);
            }
            if (child.tagName === "harmony") {
              rewriteHarmonyNode(child, semitoneDelta, currentBias);
            }
          });
        });
      });
      const targetKeyInfo = targetPreset ? { label: targetPreset.label, fifths: targetPreset.fifths, bias: targetPreset.bias, tonic: targetPreset.tonic } : detectScoreKey(xmlDoc);
      return {
        xmlString: serializeXml(xmlDoc),
        semitoneDelta,
        sourceKey: detectedKey,
        targetKeyLabel: targetKeyInfo.label,
        targetPreset: targetPreset || null
      };
    }
    PianoTrainerTransposeEngine2.transposeXml = transposeXml;
  })(PianoTrainerTransposeEngine || (PianoTrainerTransposeEngine = {}));

  // src/state/app-state.ts
  var PianoTrainerAppState;
  ((PianoTrainerAppState2) => {
    function readMetadata(ports) {
      const manifest = ports.manifest || {};
      const repoSlug = "ztbishop/piano-trainer-studio";
      const version = String(ports.assetVersion || manifest.version || "dev").trim();
      const manifestUrl = ports.getManifestUrl() || "/version.json";
      const releaseUrl = String(manifest.releaseUrl || `https://github.com/${repoSlug}/releases/latest`).trim();
      const downloadUrl = String(manifest.downloadUrl || `https://github.com/${repoSlug}/archive/refs/tags/v${version}.zip`).trim();
      return { version, manifestUrl, releaseUrl, downloadUrl };
    }
    PianoTrainerAppState2.readMetadata = readMetadata;
    function create() {
      return {
        mode: "realtime",
        followAdvanceInfo: null,
        currentExpectedContext: null,
        earlyGraceReservations: /* @__PURE__ */ new Map(),
        isPlaying: false,
        isAudioBusy: false,
        zoom: 1,
        baseBpm: 120,
        speedPercent: 1,
        looper: { enabled: false, min: 1, max: 100 },
        hands: { left: 2, right: 1 },
        practice: { left: true, right: true },
        playback: { left: true, right: true },
        modeSettings: {
          realtime: { practice: { left: true, right: true }, playback: { left: true, right: true } },
          wait: { practice: { left: true, right: true }, playback: { left: false, right: false } },
          follow: { practice: { left: false, right: true }, playback: { left: true, right: false } }
        },
        audioEnabled: { hands: true, other: false, instrument: false, virtual: true },
        midiOutEnabled: { hands: false, other: false, instrument: false, virtual: false },
        midiOutVolume: 65,
        midiInBoost: 100,
        expectedNotes: [],
        pressedKeys: /* @__PURE__ */ new Set(),
        heldCorrectNotes: /* @__PURE__ */ new Map(),
        preExpectedHeldNotes: /* @__PURE__ */ new Set(),
        activeHeldIncorrectFeedback: /* @__PURE__ */ new Map(),
        releasedIncorrectFeedback: [],
        correctFeedbackHistory: [],
        realtimeWrongPressInCurrentContext: false,
        pendingAudio: [],
        feedbackEnabled: true,
        anchorTime: 0,
        score: { correct: 0, wrong: 0 },
        sustainedVisuals: [],
        visualNotesToStart: [],
        activeTimeouts: [],
        hardwareLEDState: /* @__PURE__ */ new Map(),
        recentMidiEchoes: [],
        debugPersistentAnchors: false,
        debugEventFlow: false,
        debugMatchLogs: false,
        debugAnchorResolution: false,
        debugStickyFrameLimit: 30,
        debugFrameSeq: 0,
        debugAnchorHistory: [],
        futurePreviewEnabled: true,
        futurePreviewDepth: 1,
        correctHighlightEnabled: false,
        wledDdpDebugEnabled: false,
        helperVersion: "",
        updateManifestUrl: "",
        updateStatus: "",
        updateLastCheckedAt: 0,
        updateInfo: null,
        countInActive: false,
        lastLedPreviewEvents: [],
        ledPreviewTimeline: [],
        ledPreviewTimelineDirty: true,
        ledPreviewTraversalIndex: -1,
        playerPianoType: 88,
        playerRange: null,
        outOfRangeCurrentNotes: [],
        ledOutputMode: "none",
        midiInChannel: 0,
        midiOutChannel: 1,
        midiLightsChannel: 1,
        midiLedLowVelocity: false,
        ledReverse: false,
        wledIp: "",
        wledTransport: "http-json",
        wledActiveTransport: "http-json",
        wledHelperAvailable: false,
        wledHelperStatus: "Helper: Not detected.",
        wledStatus: "WLED idle.",
        wledConnectionState: "none",
        ledCalibrationMode: false,
        ledCalibrationSelectedMidi: null,
        visualPulseEnabled: true,
        accentedDownbeatEnabled: true,
        loopCountInEnabled: true,
        metronomeMidiOutEnabled: false,
        currentScoreData: null,
        currentScoreOriginalData: null,
        currentScoreFileName: "",
        currentScoreOriginalFileName: "",
        inputVelocityEnabled: true,
        liveLowLatencyMonitoringEnabled: true,
        lowLatencyPlaybackEnabled: false,
        currentScoreFileType: "",
        currentScoreOriginalFileType: "",
        currentScoreLibraryId: null,
        currentScoreTitle: "",
        fullscreenOnPlay: false,
        pseudoFullscreenActive: false,
        transpose: {
          available: false,
          sourceKeyLabel: "No score loaded",
          sourceKeyFound: false,
          mode: "key",
          semitones: 0,
          targetKey: "sig-0",
          updateKeySignature: true,
          active: false,
          activeLabel: "Original score",
          disableReason: "Load a MusicXML-based score to enable transpose."
        },
        scoreLibrarySelectedFolderId: "__all__",
        scoreLibraryView: "folders",
        scoreLibraryManageMode: false,
        scoreLibrarySelectedScoreIds: []
      };
    }
    PianoTrainerAppState2.create = create;
  })(PianoTrainerAppState || (PianoTrainerAppState = {}));

  // src/state/player-range.ts
  var PianoTrainerPlayerRange;
  ((PianoTrainerPlayerRange2) => {
    function create(AppState) {
      function getPlayerPlayableRange() {
        if (!AppState.playerRange || AppState.playerRange.keyCount !== AppState.playerPianoType) {
          AppState.playerRange = derivePlayerRangeFromKeyboardSize(AppState.playerPianoType);
        }
        return AppState.playerRange;
      }
      function isCurrentOutOfRangeScoreNote(midi) {
        return AppState.outOfRangeCurrentNotes.some((note) => Number(note.midi) === Number(midi));
      }
      function isMidiInPlayerRange(midi) {
        return isMidiInPlayableRange(midi, getPlayerPlayableRange());
      }
      function getMidiKeyPosition01(midi) {
        return getPlayableRangePosition01(midi, getPlayerPlayableRange());
      }
      return { getPlayerPlayableRange, isCurrentOutOfRangeScoreNote, isMidiInPlayerRange, getMidiKeyPosition01 };
    }
    PianoTrainerPlayerRange2.create = create;
  })(PianoTrainerPlayerRange || (PianoTrainerPlayerRange = {}));

  // src/state/preferences.ts
  var PianoTrainerPreferences;
  ((PianoTrainerPreferences2) => {
    PianoTrainerPreferences2.DEFAULT_PREFERENCES = Object.freeze({
      playerPianoType: 88,
      ledCount: 88,
      trainerPianoVolume: 80,
      trainerMidiOutVolume: 65,
      trainerMidiInBoost: 100,
      metronomeVolume: 25,
      ledMasterBrightness: 25,
      ledFuture1Pct: 1,
      ledFuture2Pct: 1
    });
    function create(ports) {
      const { state: AppState, storage: localStorage2, session: sessionStorage2, resettableKeys: RESETTABLE_PREFERENCE_KEYS2 } = ports;
      const {
        SKIP_FIRST_RUN_ONCE_STORAGE_KEY: SKIP_FIRST_RUN_ONCE_STORAGE_KEY2,
        FIRST_RUN_INIT_STORAGE_KEY: FIRST_RUN_INIT_STORAGE_KEY2,
        PLAYER_PIANO_STORAGE_KEY: PLAYER_PIANO_STORAGE_KEY2,
        LED_COUNT_STORAGE_KEY: LED_COUNT_STORAGE_KEY2,
        TRAINER_PIANO_VOL_STORAGE_KEY: TRAINER_PIANO_VOL_STORAGE_KEY2,
        TRAINER_MIDIOUT_VOL_STORAGE_KEY: TRAINER_MIDIOUT_VOL_STORAGE_KEY2,
        TRAINER_MIDIIN_BOOST_STORAGE_KEY: TRAINER_MIDIIN_BOOST_STORAGE_KEY2,
        METRONOME_VOL_STORAGE_KEY: METRONOME_VOL_STORAGE_KEY2,
        LED_MASTER_BRIGHTNESS_STORAGE_KEY: LED_MASTER_BRIGHTNESS_STORAGE_KEY2,
        LED_FUTURE1_PCT_STORAGE_KEY: LED_FUTURE1_PCT_STORAGE_KEY2,
        LED_FUTURE2_PCT_STORAGE_KEY: LED_FUTURE2_PCT_STORAGE_KEY2,
        MIDI_IN_CHANNEL_STORAGE_KEY: MIDI_IN_CHANNEL_STORAGE_KEY2,
        MIDI_OUT_CHANNEL_STORAGE_KEY: MIDI_OUT_CHANNEL_STORAGE_KEY2,
        MIDI_LIGHTS_CHANNEL_STORAGE_KEY: MIDI_LIGHTS_CHANNEL_STORAGE_KEY2,
        MIDI_LED_LOW_VELOCITY_STORAGE_KEY: MIDI_LED_LOW_VELOCITY_STORAGE_KEY2,
        LED_REVERSE_STORAGE_KEY: LED_REVERSE_STORAGE_KEY2,
        TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY: TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY2,
        TRAINER_INPUT_VELOCITY_STORAGE_KEY: TRAINER_INPUT_VELOCITY_STORAGE_KEY2,
        TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY: TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY2
      } = ports.keys;
      const { normalizeMidiChannel, normalizeMidiInputChannel } = PianoTrainerPreferenceValues;
      let initialized = false;
      let pendingFirstRunNotice = false;
      function seedFirstRunDefaults() {
        const skipOnce = sessionStorage2.getItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY2) === "true";
        if (skipOnce) {
          sessionStorage2.removeItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY2);
          localStorage2.setItem(FIRST_RUN_INIT_STORAGE_KEY2, "true");
          pendingFirstRunNotice = false;
          return;
        }
        if (localStorage2.getItem(FIRST_RUN_INIT_STORAGE_KEY2) === "true")
          return;
        localStorage2.setItem(PLAYER_PIANO_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.playerPianoType));
        localStorage2.setItem(LED_COUNT_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.ledCount));
        localStorage2.setItem(TRAINER_PIANO_VOL_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.trainerPianoVolume));
        localStorage2.setItem(TRAINER_MIDIOUT_VOL_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.trainerMidiOutVolume));
        localStorage2.setItem(TRAINER_MIDIIN_BOOST_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.trainerMidiInBoost));
        localStorage2.setItem(METRONOME_VOL_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.metronomeVolume));
        localStorage2.setItem(LED_MASTER_BRIGHTNESS_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.ledMasterBrightness));
        localStorage2.setItem(LED_FUTURE1_PCT_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.ledFuture1Pct));
        localStorage2.setItem(LED_FUTURE2_PCT_STORAGE_KEY2, String(PianoTrainerPreferences2.DEFAULT_PREFERENCES.ledFuture2Pct));
        localStorage2.setItem(FIRST_RUN_INIT_STORAGE_KEY2, "true");
        pendingFirstRunNotice = true;
      }
      function consumePendingFirstRunNotice() {
        const shouldShow = pendingFirstRunNotice;
        pendingFirstRunNotice = false;
        return shouldShow;
      }
      function getStoredBool(key, fallback) {
        const value = localStorage2.getItem(key);
        if (value === null)
          return fallback;
        if (value === "true")
          return true;
        if (value === "false")
          return false;
        return fallback;
      }
      function getStoredNumber(key, fallback) {
        const value = Number(localStorage2.getItem(key));
        return Number.isFinite(value) ? value : fallback;
      }
      function getClampedNumber(key, min, max, defaultVal) {
        const raw = localStorage2.getItem(key);
        if (raw === null || raw === "")
          return Math.min(max, Math.max(min, defaultVal));
        const num = Number(raw);
        return Math.min(max, Math.max(min, Number.isFinite(num) ? num : defaultVal));
      }
      function setStoredBool(key, value) {
        localStorage2.setItem(key, value ? "true" : "false");
      }
      function clearSavedPreferences() {
        RESETTABLE_PREFERENCE_KEYS2.forEach((key) => localStorage2.removeItem(key));
        localStorage2.removeItem(FIRST_RUN_INIT_STORAGE_KEY2);
        sessionStorage2.removeItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY2);
      }
      function init() {
        if (initialized)
          return;
        initialized = true;
        seedFirstRunDefaults();
        AppState.midiInChannel = normalizeMidiInputChannel(localStorage2.getItem(MIDI_IN_CHANNEL_STORAGE_KEY2), 0);
        AppState.midiOutChannel = normalizeMidiChannel(localStorage2.getItem(MIDI_OUT_CHANNEL_STORAGE_KEY2), 1);
        AppState.midiLightsChannel = normalizeMidiChannel(localStorage2.getItem(MIDI_LIGHTS_CHANNEL_STORAGE_KEY2), 1);
        AppState.midiLedLowVelocity = getStoredBool(MIDI_LED_LOW_VELOCITY_STORAGE_KEY2, false);
        AppState.ledReverse = getStoredBool(LED_REVERSE_STORAGE_KEY2, false);
        AppState.inputVelocityEnabled = true;
        AppState.liveLowLatencyMonitoringEnabled = true;
        AppState.lowLatencyPlaybackEnabled = getStoredBool(TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY2, false);
        setStoredBool(TRAINER_INPUT_VELOCITY_STORAGE_KEY2, true);
        setStoredBool(TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY2, true);
      }
      function cancelPendingFirstRunNotice() {
        pendingFirstRunNotice = false;
      }
      function dispose() {
        initialized = false;
        cancelPendingFirstRunNotice();
      }
      return { init, dispose, seedFirstRunDefaults, consumePendingFirstRunNotice, cancelPendingFirstRunNotice, getStoredBool, getStoredNumber, getClampedNumber, setStoredBool, clearSavedPreferences };
    }
    PianoTrainerPreferences2.create = create;
  })(PianoTrainerPreferences || (PianoTrainerPreferences = {}));

  // src/state/settings-backup.ts
  var PianoTrainerSettingsBackup;
  ((PianoTrainerSettingsBackup2) => {
    function create(ports) {
      const { storage: localStorage2, session: sessionStorage2, resettableKeys: RESETTABLE_PREFERENCE_KEYS2, appVersion: APP_VERSION, clearSavedPreferences } = ports;
      const { FIRST_RUN_INIT_STORAGE_KEY: FIRST_RUN_INIT_STORAGE_KEY2, SKIP_FIRST_RUN_ONCE_STORAGE_KEY: SKIP_FIRST_RUN_ONCE_STORAGE_KEY2 } = ports.keys;
      function buildSettingsBackupPayload() {
        const settings = {};
        RESETTABLE_PREFERENCE_KEYS2.forEach((key) => {
          const value = localStorage2.getItem(key);
          if (value !== null)
            settings[key] = value;
        });
        return {
          version: 1,
          exportedAt: ports.now().toISOString(),
          appVersion: APP_VERSION,
          settings
        };
      }
      function importSettingsBackupPayload(payload) {
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
          throw new Error("Invalid settings backup payload");
        }
        const record = payload;
        const rawSettings = record && typeof record.settings === "object" && record.settings && !Array.isArray(record.settings) ? record.settings : record;
        const normalizedSettings = {};
        RESETTABLE_PREFERENCE_KEYS2.forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(rawSettings, key))
            return;
          const value = rawSettings[key];
          if (value === null || value === void 0)
            return;
          normalizedSettings[key] = String(value);
        });
        if (Object.keys(normalizedSettings).length === 0) {
          throw new Error("No supported settings found in backup");
        }
        clearSavedPreferences();
        Object.entries(normalizedSettings).forEach(([key, value]) => {
          localStorage2.setItem(key, value);
        });
        sessionStorage2.setItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY2, "true");
        localStorage2.setItem(FIRST_RUN_INIT_STORAGE_KEY2, "true");
        ports.cancelPendingFirstRunNotice();
      }
      return { buildSettingsBackupPayload, importSettingsBackupPayload };
    }
    PianoTrainerSettingsBackup2.create = create;
  })(PianoTrainerSettingsBackup || (PianoTrainerSettingsBackup = {}));

  // src/ui/audio-capabilities.ts
  function getPreferredPianoSampleExtension() {
    try {
      const probe = document.createElement("audio");
      const oggSupport = typeof probe.canPlayType === "function" ? probe.canPlayType('audio/ogg; codecs="vorbis"') : "";
      return oggSupport && oggSupport !== "no" ? "ogg" : "mp3";
    } catch (_) {
      return "mp3";
    }
  }

  // src/ui/controls-dom.ts
  var PianoTrainerControlDom;
  ((PianoTrainerControlDom2) => {
    function create(document2) {
      const listeners = [];
      function typed(id, type, required) {
        const element2 = document2.getElementById(id);
        if (element2 && !(element2 instanceof type)) throw Error("Invalid trainer control: " + id);
        if (!element2 && required) throw Error("Missing required trainer control: " + id);
        return element2;
      }
      function input(id) {
        return typed(id, HTMLInputElement, true);
      }
      function optionalInput(id) {
        return typed(id, HTMLInputElement, false);
      }
      function button(id) {
        return typed(id, HTMLButtonElement, true);
      }
      function optionalButton(id) {
        return typed(id, HTMLButtonElement, false);
      }
      function select(id) {
        return typed(id, HTMLSelectElement, true);
      }
      function optionalSelect(id) {
        return typed(id, HTMLSelectElement, false);
      }
      function element(id) {
        return typed(id, HTMLElement, false);
      }
      function on(target, event, handler, options) {
        if (!target) return;
        target.addEventListener(event, handler, options);
        listeners.push({ target, event, handler, options });
      }
      function onInput(target, event, handler) {
        on(target, event, (event2) => {
          if (event2.target instanceof HTMLInputElement) handler(event2.target);
        });
      }
      function dispose() {
        for (const { target, event, handler, options } of listeners) target.removeEventListener(event, handler, options);
        listeners.length = 0;
      }
      return { input, optionalInput, button, optionalButton, select, optionalSelect, element, on, onInput, dispose };
    }
    PianoTrainerControlDom2.create = create;
  })(PianoTrainerControlDom || (PianoTrainerControlDom = {}));

  // src/ui/audio-level-controls.ts
  var PianoTrainerAudioLevelControls;
  ((PianoTrainerAudioLevelControls2) => {
    function create(ports) {
      const dom = PianoTrainerControlDom.create(ports.document), state = ports.state;
      let initialized = false, active = true;
      function syncPair(sliderId, inputId, value) {
        const slider = dom.optionalInput(sliderId), input = dom.optionalInput(inputId);
        if (slider) slider.value = String(value);
        if (input) input.value = String(value);
      }
      function updatePianoVolume(value, { save = true } = {}) {
        if (!active) return;
        const level = Math.max(0, Math.min(100, parseInt(String(value), 10) || 0));
        syncPair("slider-piano-vol", "val-piano-vol", level);
        if (save) ports.save("pianoVolume", String(level));
        ports.setPianoVolume(level);
      }
      function updateMidiOutVolume(value, { save = true } = {}) {
        if (!active) return;
        const level = Math.max(0, Math.min(100, parseInt(String(value), 10) || 0));
        state.midiOutVolume = level;
        syncPair("slider-midiout-vol", "val-midiout-vol", level);
        if (save) ports.save("midiOutVolume", String(level));
        ports.sendMidiOutExpressionLevel(level);
      }
      function syncMidiInBoostUi() {
        if (active) dom.element("routing-midiin-boost-row")?.classList.toggle("hidden", !state.audioEnabled.instrument);
      }
      function updateMidiInBoost(value, { save = true } = {}) {
        if (!active) return;
        const level = Math.max(50, Math.min(200, parseInt(String(value), 10) || 100));
        state.midiInBoost = level;
        syncPair("slider-midiin-boost", "val-midiin-boost", level);
        if (save) ports.save("midiInBoost", String(level));
        syncMidiInBoostUi();
      }
      function updateMetroVolume(value, { save = true } = {}) {
        if (!active) return;
        const level = Math.max(0, Math.min(100, parseInt(String(value), 10) || 0));
        syncPair("slider-metro-vol", "val-metro-vol", level);
        if (save) ports.save("metroVolume", String(level));
        if (level === 0) ports.setMetronomeVolumeDecibels(-Infinity);
        else ports.setMetronomeVolumeDecibels(20 * Math.log10(level / 100));
      }
      function init() {
        if (initialized) return;
        active = true;
        initialized = true;
        for (const [sliderId, inputId, command] of [
          ["slider-piano-vol", "val-piano-vol", updatePianoVolume],
          ["slider-midiout-vol", "val-midiout-vol", updateMidiOutVolume],
          ["slider-midiin-boost", "val-midiin-boost", updateMidiInBoost],
          ["slider-metro-vol", "val-metro-vol", updateMetroVolume]
        ]) {
          dom.onInput(dom.optionalInput(sliderId), "input", (node) => command(node.value));
          dom.onInput(dom.optionalInput(inputId), "change", (node) => command(node.value));
        }
      }
      function dispose() {
        active = false;
        initialized = false;
        dom.dispose();
      }
      return {
        init,
        dispose,
        updatePianoVolume,
        updateMidiOutVolume,
        updateMidiInBoost,
        updateMetroVolume,
        syncMidiInBoostUi,
        readPianoVolume: () => dom.optionalInput("slider-piano-vol")?.value ?? 80,
        readMetroVolume: () => dom.optionalInput("slider-metro-vol")?.value ?? 50
      };
    }
    PianoTrainerAudioLevelControls2.create = create;
  })(PianoTrainerAudioLevelControls || (PianoTrainerAudioLevelControls = {}));

  // src/ui/connection-status.ts
  var PianoTrainerConnectionStatus;
  ((PianoTrainerConnectionStatus2) => {
    function create(ports) {
      function updateConnectionStatusIndicator(elementId, state, labelText = null) {
        const el = ports.document.getElementById(elementId);
        if (!el)
          return;
        const dot = el.querySelector(".status-dot");
        const label = el.querySelector(".status-label");
        if (!dot || !label)
          return;
        dot.classList.remove("status-connected", "status-disconnected", "status-none");
        el.classList.remove("status-connected-text", "status-disconnected-text", "status-none-text");
        let resolvedText = labelText;
        if (state === "connected") {
          dot.classList.add("status-connected");
          el.classList.add("status-connected-text");
          resolvedText = resolvedText || "Connected";
        } else if (state === "disconnected") {
          dot.classList.add("status-disconnected");
          el.classList.add("status-disconnected-text");
          resolvedText = resolvedText || "Disconnected";
        } else {
          dot.classList.add("status-none");
          el.classList.add("status-none-text");
          resolvedText = resolvedText || "None";
        }
        label.textContent = resolvedText;
      }
      function getSelectedMidiInputState() {
        const midiInSelect = getMidiConnectionSelect("midi-in");
        const selectedId = midiInSelect?.value || "none";
        if (selectedId === "none")
          return "none";
        const input = ports.getPort("input", selectedId);
        return input && input.state !== "disconnected" ? "connected" : "disconnected";
      }
      function getSelectedMidiOutputState() {
        const midiOutSelect = getMidiConnectionSelect("midi-out");
        const selectedId = midiOutSelect?.value || "none";
        if (selectedId === "none")
          return "none";
        const output = ports.getPort("output", selectedId);
        return output && output.state !== "disconnected" ? "connected" : "disconnected";
      }
      function getSelectedLedMidiOutputState() {
        const midiLightsSelect = getMidiConnectionSelect("midi-lights");
        const selectedId = midiLightsSelect?.value || "none";
        if (selectedId === "none")
          return "none";
        const output = ports.getPort("output", selectedId);
        return output && output.state !== "disconnected" ? "connected" : "disconnected";
      }
      function updateConnectionStatuses() {
        ports.syncMidiOutChannelVisibility();
        updateConnectionStatusIndicator("midi-in-connection-status", getSelectedMidiInputState());
        updateConnectionStatusIndicator("midi-out-connection-status", getSelectedMidiOutputState());
        let ledState = "none";
        if (ports.state.ledOutputMode === "midi") {
          ledState = getSelectedLedMidiOutputState();
        } else if (ports.state.ledOutputMode === "wled") {
          if (!String(ports.state.wledIp || "").trim()) {
            ledState = "none";
          } else {
            ledState = ports.state.wledConnectionState || "disconnected";
          }
        }
        updateConnectionStatusIndicator("led-connection-status", ledState);
      }
      function refreshConnectionStatuses() {
        updateConnectionStatuses();
        ports.syncWledStatus();
      }
      function getMidiConnectionSelect(id) {
        const element = ports.document.getElementById(id);
        return element instanceof HTMLSelectElement ? element : null;
      }
      return { updateConnectionStatusIndicator, getSelectedMidiInputState, getSelectedMidiOutputState, getSelectedLedMidiOutputState, updateConnectionStatuses, refreshConnectionStatuses };
    }
    PianoTrainerConnectionStatus2.create = create;
  })(PianoTrainerConnectionStatus || (PianoTrainerConnectionStatus = {}));

  // src/ui/display-controls.ts
  var PianoTrainerDisplayControls;
  ((PianoTrainerDisplayControls2) => {
    function create(ports) {
      const { document: document2, window: window2, state } = ports, dom = PianoTrainerControlDom.create(document2);
      let initialized = false, active = true, generation = 0, resizeTimer;
      let playButton = null, fullscreenButton = null;
      let resetButton = null;
      let playHandler = null, resetHandler = null;
      function getFullscreenElement() {
        return document2.fullscreenElement || document2.webkitFullscreenElement || null;
      }
      function getFullscreenTargetElement() {
        return document2.documentElement;
      }
      function canUseNativeFullscreen() {
        const target = getFullscreenTargetElement();
        return !!(target?.requestFullscreen || target?.webkitRequestFullscreen || document2.exitFullscreen || document2.webkitExitFullscreen);
      }
      function isFullscreenActive() {
        return !!getFullscreenElement() || !!state.pseudoFullscreenActive;
      }
      function syncFullscreenUi() {
        if (!active) return;
        const fullscreenActive = isFullscreenActive(), label = fullscreenActive ? "Exit full screen" : "Enter full screen";
        document2.body.classList.toggle("app-fullscreen-active", fullscreenActive);
        if (fullscreenButton) {
          fullscreenButton.classList.toggle("is-active", fullscreenActive);
          fullscreenButton.textContent = fullscreenActive ? "\u{1F5D7}" : "\u26F6";
          fullscreenButton.setAttribute("aria-label", label);
          fullscreenButton.setAttribute("aria-pressed", fullscreenActive ? "true" : "false");
          fullscreenButton.title = label;
          fullscreenButton.dataset.tooltip = label;
        }
      }
      async function requestAppFullscreen() {
        if (!active) return;
        const token = generation;
        ports.hideToolbarPanels();
        const target = getFullscreenTargetElement();
        try {
          if (target?.requestFullscreen) {
            await target.requestFullscreen();
            if (!active || token !== generation) return;
            state.pseudoFullscreenActive = false;
          } else if (target?.webkitRequestFullscreen) {
            target.webkitRequestFullscreen();
            state.pseudoFullscreenActive = false;
          } else state.pseudoFullscreenActive = true;
        } catch (error) {
          if (!active || token !== generation) return;
          ports.reportWarning("Fullscreen request failed; using in-app fullscreen fallback.", error);
          state.pseudoFullscreenActive = true;
        }
        syncFullscreenUi();
      }
      async function exitAppFullscreen() {
        if (!active) return;
        const token = generation;
        try {
          if (document2.exitFullscreen && document2.fullscreenElement) {
            await document2.exitFullscreen();
            if (!active || token !== generation) return;
          } else if (document2.webkitExitFullscreen && document2.webkitFullscreenElement) document2.webkitExitFullscreen();
        } catch (error) {
          if (!active || token !== generation) return;
          ports.reportWarning("Could not exit native fullscreen cleanly.", error);
        }
        state.pseudoFullscreenActive = false;
        syncFullscreenUi();
      }
      async function toggleAppFullscreen() {
        if (isFullscreenActive()) {
          await exitAppFullscreen();
          return;
        }
        await requestAppFullscreen();
      }
      function updatePlayPauseButton() {
        if (!active) return;
        document2.body.classList.toggle("app-playing", !!state.isPlaying);
        if (playButton) playButton.textContent = state.isPlaying ? "\u23F8 Pause" : "\u25B6 Play";
      }
      function preserveMusicAreaScroll(callback) {
        const area = dom.element("music-area");
        if (!area || typeof callback !== "function") return typeof callback === "function" ? callback() : void 0;
        const top = area.scrollTop, left = area.scrollLeft, result = callback();
        area.scrollTop = top;
        area.scrollLeft = left;
        return result;
      }
      function normalizeZoomValue(value) {
        let normalized = parseInt(String(value), 10);
        if (isNaN(normalized)) return null;
        if (normalized < 50) normalized = 50;
        if (normalized > 150) normalized = 150;
        return normalized;
      }
      function syncZoomControls(value) {
        if (!active) return;
        const normalized = normalizeZoomValue(value);
        if (normalized == null) return;
        dom.input("slider-zoom").value = String(normalized);
        dom.input("val-zoom").value = String(normalized);
      }
      function applyZoom(value, { save = true } = {}) {
        if (!active) return;
        const normalized = normalizeZoomValue(value);
        if (normalized == null) return;
        dom.input("slider-zoom").value = String(normalized);
        dom.input("val-zoom").value = String(normalized);
        state.zoom = normalized / 100;
        if (save) ports.saveZoom(String(normalized));
        if (ports.isReadyToRender()) {
          ports.setZoom(state.zoom);
          ports.clearFeedbackVisualStatePreserveScoring();
          ports.renderScoreAndRefreshGeometry();
        }
      }
      function initPlaybackShell() {
        if (initialized) return;
        active = true;
        initialized = true;
        const token = generation;
        playHandler = async () => {
          if (!active || token !== generation) return;
          if (state.isPlaying) ports.pause();
          else await ports.play();
        };
        resetHandler = () => {
          if (active && token === generation) ports.reset();
        };
        playButton = dom.optionalButton("btn-play");
        fullscreenButton = dom.optionalButton("btn-score-fullscreen");
        resetButton = dom.button("btn-reset");
        dom.on(document2, "fullscreenchange", syncFullscreenUi);
        dom.on(document2, "webkitfullscreenchange", syncFullscreenUi);
        dom.on(fullscreenButton, "click", () => {
          void toggleAppFullscreen();
        });
        if (playButton) playButton.onclick = playHandler;
        resetButton.onclick = resetHandler;
        dom.on(window2, "resize", () => {
          window2.clearTimeout(resizeTimer);
          const token2 = generation;
          resizeTimer = window2.setTimeout(() => {
            resizeTimer = void 0;
            if (!active || token2 !== generation) return;
            if (ports.isReadyToRender()) {
              ports.clearFeedbackVisualStatePreserveScoring();
              ports.renderScoreAndRefreshGeometry();
            }
            ports.positionCalibrationPanel();
          }, 300);
        });
      }
      let zoomInitialized = false;
      function initZoom() {
        if (zoomInitialized) return;
        active = true;
        zoomInitialized = true;
        const slider = dom.input("slider-zoom"), input = dom.input("val-zoom");
        slider.min = "50";
        slider.max = "150";
        input.min = "50";
        input.max = "150";
        dom.onInput(slider, "input", (node) => syncZoomControls(node.value));
        dom.onInput(slider, "change", (node) => applyZoom(node.value));
        dom.onInput(input, "input", (node) => syncZoomControls(node.value));
        dom.onInput(input, "change", (node) => applyZoom(node.value));
      }
      function init() {
        initPlaybackShell();
        initZoom();
      }
      function dispose() {
        if (!active) return;
        active = false;
        generation++;
        initialized = false;
        zoomInitialized = false;
        dom.dispose();
        window2.clearTimeout(resizeTimer);
        resizeTimer = void 0;
        if (playButton?.onclick === playHandler) playButton.onclick = null;
        if (resetButton?.onclick === resetHandler) resetButton.onclick = null;
      }
      return {
        init,
        initPlaybackShell,
        initZoom,
        dispose,
        getFullscreenElement,
        getFullscreenTargetElement,
        canUseNativeFullscreen,
        isFullscreenActive,
        syncFullscreenUi,
        requestAppFullscreen,
        exitAppFullscreen,
        toggleAppFullscreen,
        updatePlayPauseButton,
        preserveMusicAreaScroll,
        normalizeZoomValue,
        syncZoomControls,
        applyZoom
      };
    }
    PianoTrainerDisplayControls2.create = create;
  })(PianoTrainerDisplayControls || (PianoTrainerDisplayControls = {}));

  // src/ui/feedback-debug.ts
  var PianoTrainerFeedbackDebug;
  ((PianoTrainerFeedbackDebug2) => {
    function create(ports) {
      const state = ports.state, dom = PianoTrainerControlDom.create(ports.document), ownedGroups = /* @__PURE__ */ new Set();
      let initialized = false, generation = 0, heartbeat = null, ownedCheckbox = null;
      function ensureOwnedGroup() {
        const existing = ports.getSvg()?.querySelector("#pt-debug-group");
        const group = ports.ensureGroup("pt-debug-group");
        if (!existing && group)
          ownedGroups.add(group);
        return group;
      }
      const service = {
        isDebugEnabled() {
          return !!(state.debugPersistentAnchors || state.debugEventFlow || state.debugMatchLogs || state.debugAnchorResolution);
        },
        syncDebugCheckbox() {
          const checkbox = dom.optionalInput("check-debug");
          if (checkbox)
            checkbox.checked = this.isDebugEnabled();
        },
        debugLogEvent(label, payload = {}) {
          if (!state.debugEventFlow)
            return;
          try {
            ports.log(label, payload);
            ports.warn("[PianoTrainer debug event]", label, payload);
          } catch (e) {
          }
        },
        debugLogAnchorResolution(label, payload = {}) {
          if (!state.debugAnchorResolution)
            return;
          try {
            ports.warn("[PianoTrainer anchor]", label, payload);
          } catch (e) {
          }
        },
        getDebugGroup() {
          return ensureOwnedGroup();
        },
        clearSvgDebug() {
          const group = ports.getSvg()?.querySelector("#pt-debug-group");
          if (group)
            group.replaceChildren();
        },
        pushStickyDebugFrame(frame) {
          if (!state.debugPersistentAnchors || !frame || !Array.isArray(frame.notes) || frame.notes.length === 0)
            return;
          const normalizedNotes = frame.notes.filter((n) => n && n.anchor && Number.isFinite(n.anchor.x) && Number.isFinite(n.anchor.y)).map((n) => ({
            ...ports.captureDisplay?.(n.midi, n.staffId, n.anchor),
            midi: n.midi,
            staffId: n.staffId,
            kind: n.kind || "expected",
            hit: !!n.hit,
            anchor: {
              x: n.anchor.x,
              y: n.anchor.y
            }
          }));
          if (normalizedNotes.length === 0)
            return;
          const entry = {
            seq: ++state.debugFrameSeq,
            measureIndex: frame.measureIndex ?? null,
            timestamp: frame.timestamp ?? null,
            kind: frame.kind || "expected",
            notes: normalizedNotes
          };
          state.debugAnchorHistory.push(entry);
          this.debugLogEvent("STICKY_DEBUG_FRAME_PUSHED", {
            seq: entry.seq,
            measureIndex: entry.measureIndex,
            kind: entry.kind,
            noteCount: entry.notes.length,
            notes: entry.notes.map((n) => ({ midi: n.midi, staffId: n.staffId, kind: n.kind, hit: n.hit, anchor: n.anchor }))
          });
          const maxFrames = Math.max(1, state.debugStickyFrameLimit || 10);
          if (state.debugAnchorHistory.length > maxFrames) {
            state.debugAnchorHistory.splice(0, state.debugAnchorHistory.length - maxFrames);
          }
          this.renderStickyDebug();
        },
        renderStickyDebug() {
          this.clearSvgDebug();
          if (!state.debugPersistentAnchors)
            return;
          const group = this.getDebugGroup();
          if (!group)
            return;
          const history = state.debugAnchorHistory || [];
          if (history.length === 0)
            return;
          const total = history.length;
          this.debugLogEvent("STICKY_DEBUG_RENDER", { frameCount: total });
          history.forEach((frame, frameIndex) => {
            const opacity = 0.95;
            frame.notes.forEach((note, noteIndex) => {
              const anchor = ports.projectNote ? ports.projectNote(note) : note.anchor;
              if (!anchor) return;
              const g = ports.document.createElementNS("http://www.w3.org/2000/svg", "g");
              g.setAttribute("data-debug-seq", String(frame.seq));
              g.setAttribute("data-debug-kind", frame.kind || "expected");
              g.setAttribute("opacity", String(opacity));
              const ring = ports.document.createElementNS("http://www.w3.org/2000/svg", "circle");
              ring.setAttribute("cx", String(anchor.x));
              ring.setAttribute("cy", String(anchor.y));
              ring.setAttribute("r", note.kind === "feedback" ? "8" : "6");
              ring.setAttribute("fill", "none");
              ring.setAttribute("stroke", note.kind === "feedback" ? note.hit ? "rgba(46, 204, 113, 0.95)" : "rgba(231, 76, 60, 0.95)" : "rgba(255, 140, 0, 0.95)");
              ring.setAttribute("stroke-width", note.kind === "feedback" ? "2" : "1.5");
              g.appendChild(ring);
              const h = ports.document.createElementNS("http://www.w3.org/2000/svg", "line");
              h.setAttribute("x1", String(anchor.x - 4));
              h.setAttribute("y1", String(anchor.y));
              h.setAttribute("x2", String(anchor.x + 4));
              h.setAttribute("y2", String(anchor.y));
              h.setAttribute("stroke", "rgba(255, 255, 255, 0.85)");
              h.setAttribute("stroke-width", "1");
              g.appendChild(h);
              const v = ports.document.createElementNS("http://www.w3.org/2000/svg", "line");
              v.setAttribute("x1", String(anchor.x));
              v.setAttribute("y1", String(anchor.y - 4));
              v.setAttribute("x2", String(anchor.x));
              v.setAttribute("y2", String(anchor.y + 4));
              v.setAttribute("stroke", "rgba(255, 255, 255, 0.85)");
              v.setAttribute("stroke-width", "1");
              g.appendChild(v);
              const label = ports.document.createElementNS("http://www.w3.org/2000/svg", "text");
              label.setAttribute("x", String(anchor.x + 7));
              label.setAttribute("y", String(anchor.y - 7 - noteIndex % 2 * 9));
              label.setAttribute("font-size", "9");
              label.setAttribute("font-family", "monospace");
              label.setAttribute("fill", note.kind === "feedback" ? note.hit ? "rgba(46, 204, 113, 0.95)" : "rgba(231, 76, 60, 0.95)" : "rgba(255, 140, 0, 0.95)");
              label.textContent = `${frame.measureIndex ?? "?"}:${note.staffId ?? "?"}:${note.midi ?? "?"}`;
              g.appendChild(label);
              group.appendChild(g);
            });
          });
        },
        setDebugEnabled(enabled, options = {}) {
          const next = !!enabled;
          const { clearHistory = !next, logChange = true, reason = "ui-toggle" } = options;
          state.debugPersistentAnchors = next;
          state.debugEventFlow = next;
          state.debugMatchLogs = next;
          state.debugAnchorResolution = next;
          ports.publishStickyEnabled(next);
          if (!next) {
            if (clearHistory) {
              state.debugAnchorHistory = [];
            }
            this.clearSvgDebug();
            if (clearHistory) {
              this.renderStickyDebug();
            }
          } else {
            this.renderStickyDebug();
          }
          this.syncDebugCheckbox();
          if (logChange) {
            ports.error("[PianoTrainer debug TOGGLE]", {
              enabled: next,
              reason,
              stickyFrames: state.debugStickyFrameLimit,
              stickyHistory: state.debugAnchorHistory.length,
              ts: ports.now().toISOString()
            });
          }
        },
        init() {
          if (initialized)
            return;
          const debugCheckbox = dom.optionalInput("check-debug"), token = generation;
          initialized = true;
          if (debugCheckbox && !debugCheckbox.dataset.ptDebugBound) {
            dom.onInput(debugCheckbox, "change", (input) => {
              if (token !== generation)
                return;
              ports.saveEnabled(input.checked);
              this.setDebugEnabled(input.checked, { clearHistory: !input.checked, logChange: input.checked, reason: "checkbox" });
            });
            debugCheckbox.dataset.ptDebugBound = "1";
            ownedCheckbox = debugCheckbox;
          }
          this.setDebugEnabled(ports.readEnabled(), { clearHistory: !ports.readEnabled(), logChange: false, reason: "startup" });
          heartbeat = ports.setInterval(() => {
            if (token !== generation)
              return;
            try {
              if (!this.isDebugEnabled())
                return;
              if (!state.debugEventFlow && !state.debugMatchLogs)
                return;
              ports.error("[PianoTrainer debug HEARTBEAT]", {
                isPlaying: state.isPlaying,
                expectedNotes: state.expectedNotes.length,
                stickyHistory: state.debugAnchorHistory.length,
                ts: ports.now().toISOString()
              });
            } catch (_) {
            }
          }, 4e3);
        },
        dispose() {
          generation++;
          initialized = false;
          dom.dispose();
          if (heartbeat !== null)
            ports.clearInterval(heartbeat);
          heartbeat = null;
          if (ownedCheckbox?.dataset.ptDebugBound === "1")
            delete ownedCheckbox.dataset.ptDebugBound;
          ownedCheckbox = null;
          for (const group of ownedGroups)
            group.remove();
          ownedGroups.clear();
        },
        forcePianoTrainerDebugStatus(tag = "manual") {
          const snapshot = {
            tag,
            debugAnchors: state.debugPersistentAnchors,
            debugEventFlow: state.debugEventFlow,
            debugMatchLogs: state.debugMatchLogs,
            debugAnchorResolution: state.debugAnchorResolution,
            debugStickyFrames: state.debugStickyFrameLimit,
            stickyHistory: state.debugAnchorHistory.length,
            expectedNotes: state.expectedNotes.length,
            isPlaying: state.isPlaying,
            ts: ports.now().toISOString()
          };
          if (this.isDebugEnabled()) {
            ports.error("[PianoTrainer debug STATUS]", snapshot);
          }
          return snapshot;
        },
        setDebugStickyFrames(count) {
          const nextCount = Math.max(1, parseInt(String(count), 10) || 10);
          state.debugStickyFrameLimit = nextCount;
          if (state.debugAnchorHistory.length > nextCount) {
            state.debugAnchorHistory.splice(0, state.debugAnchorHistory.length - nextCount);
          }
          if (state.debugPersistentAnchors) {
            this.renderStickyDebug();
          } else {
            this.clearSvgDebug();
          }
          return state.debugStickyFrameLimit;
        },
        clearStickyDebug() {
          state.debugAnchorHistory = [];
          if (state.debugPersistentAnchors) {
            this.renderStickyDebug();
          } else {
            this.clearSvgDebug();
          }
        }
      };
      return service;
    }
    PianoTrainerFeedbackDebug2.create = create;
  })(PianoTrainerFeedbackDebug || (PianoTrainerFeedbackDebug = {}));

  // src/ui/hand-assignment-controls.ts
  var PianoTrainerHandAssignmentControls;
  ((PianoTrainerHandAssignmentControls2) => {
    function create(ports) {
      const dom = PianoTrainerControlDom.create(ports.document);
      const owned = [];
      let generation = 0;
      function syncHandAssignmentFromControls({ refreshCurrentFrame = false } = {}) {
        const left = dom.optionalSelect("assign-lh"), right = dom.optionalSelect("assign-rh");
        if (!left || !right) return;
        ports.commit(
          PianoTrainerHandRouting.parseAssignment(left.value),
          PianoTrainerHandRouting.parseAssignment(right.value),
          refreshCurrentFrame
        );
      }
      function init() {
        const left = dom.optionalSelect("assign-lh"), right = dom.optionalSelect("assign-rh");
        if (!left || !right || left.dataset.boundHandAssign === "true") return;
        left.dataset.boundHandAssign = "true";
        right.dataset.boundHandAssign = "true";
        owned.push({ left, right });
        const token = generation;
        const change = () => {
          if (token === generation) syncHandAssignmentFromControls({ refreshCurrentFrame: true });
        };
        dom.on(left, "change", change);
        dom.on(right, "change", change);
      }
      function resetForScore(stavesCount, getDefaults) {
        const left = dom.select("assign-lh"), right = dom.select("assign-rh");
        left.innerHTML = "";
        right.innerHTML = "";
        left.innerHTML = '<option value="">-</option>';
        right.innerHTML = "";
        for (let i = 1; i <= stavesCount; i++) {
          left.innerHTML += `<option value="${i}">${i}</option>`;
          right.innerHTML += `<option value="${i}">${i}</option>`;
        }
        const defaults = getDefaults();
        left.value = PianoTrainerHandRouting.formatAssignment(defaults.left);
        right.value = PianoTrainerHandRouting.formatAssignment(defaults.right);
        init();
        syncHandAssignmentFromControls();
      }
      function dispose() {
        generation++;
        dom.dispose();
        for (const pair of owned) {
          if (pair.left.dataset.boundHandAssign === "true") delete pair.left.dataset.boundHandAssign;
          if (pair.right.dataset.boundHandAssign === "true") delete pair.right.dataset.boundHandAssign;
        }
        owned.length = 0;
      }
      return { init, dispose, resetForScore, syncHandAssignmentFromControls };
    }
    PianoTrainerHandAssignmentControls2.create = create;
  })(PianoTrainerHandAssignmentControls || (PianoTrainerHandAssignmentControls = {}));

  // src/ui/library-controls-state.ts
  var PianoTrainerLibraryControlsState;
  ((PianoTrainerLibraryControlsState2) => {
    function createLifetime() {
      let generation = 0, active = true;
      return {
        capture: () => generation,
        current: (token) => active && token === generation,
        init: () => {
          active = true;
        },
        dispose: () => {
          if (active) {
            active = false;
            generation++;
          }
        }
      };
    }
    PianoTrainerLibraryControlsState2.createLifetime = createLifetime;
    function errorMessage(error, fallback) {
      const message = error == null ? void 0 : Reflect.get(Object(error), "message", error);
      return message || fallback;
    }
    PianoTrainerLibraryControlsState2.errorMessage = errorMessage;
    function create(state) {
      function getFolderLibrarySelectionSet() {
        return new Set((state.scoreLibrarySelectedFolderIds || []).filter(Boolean));
      }
      function setFolderLibrarySelection(ids) {
        state.scoreLibrarySelectedFolderIds = Array.from(new Set((ids || []).filter(Boolean)));
      }
      function clearFolderLibrarySelection() {
        state.scoreLibrarySelectedFolderIds = [];
      }
      function isFolderLibraryManageMode() {
        return !!state.scoreLibraryFolderManageMode;
      }
      function setFolderLibraryManageMode(enabled) {
        state.scoreLibraryFolderManageMode = !!enabled;
        if (!state.scoreLibraryFolderManageMode)
          clearFolderLibrarySelection();
      }
      function toggleFolderLibrarySelection(id) {
        const next = getFolderLibrarySelectionSet();
        if (next.has(id))
          next.delete(id);
        else
          next.add(id);
        setFolderLibrarySelection(Array.from(next));
      }
      function getScoreLibrarySelectionSet() {
        return new Set((state.scoreLibrarySelectedScoreIds || []).filter(Boolean));
      }
      function setScoreLibrarySelection(ids) {
        state.scoreLibrarySelectedScoreIds = Array.from(new Set((ids || []).filter(Boolean)));
      }
      function clearScoreLibrarySelection() {
        state.scoreLibrarySelectedScoreIds = [];
      }
      function isScoreLibraryManageMode() {
        return !!state.scoreLibraryManageMode;
      }
      function setScoreLibraryManageMode(enabled) {
        state.scoreLibraryManageMode = !!enabled;
        if (!state.scoreLibraryManageMode)
          clearScoreLibrarySelection();
      }
      function toggleScoreLibrarySelection(id) {
        const next = getScoreLibrarySelectionSet();
        if (next.has(id))
          next.delete(id);
        else
          next.add(id);
        setScoreLibrarySelection(Array.from(next));
      }
      return {
        getFolderLibrarySelectionSet,
        setFolderLibrarySelection,
        clearFolderLibrarySelection,
        isFolderLibraryManageMode,
        setFolderLibraryManageMode,
        toggleFolderLibrarySelection,
        getScoreLibrarySelectionSet,
        setScoreLibrarySelection,
        clearScoreLibrarySelection,
        isScoreLibraryManageMode,
        setScoreLibraryManageMode,
        toggleScoreLibrarySelection
      };
    }
    PianoTrainerLibraryControlsState2.create = create;
  })(PianoTrainerLibraryControlsState || (PianoTrainerLibraryControlsState = {}));

  // src/ui/library-actions.ts
  var PianoTrainerLibraryActions;
  ((PianoTrainerLibraryActions2) => {
    function create(ports) {
      const document2 = ports.document;
      const state = ports.state;
      const { setFolderLibraryManageMode, setScoreLibraryManageMode } = ports.selection;
      const { getScoreDisplayTitle, getScoreFileTypeFromName } = ports.format;
      const { promptForLibraryFolderChoice } = ports.dialogs;
      const { refreshScoresDrawer, ensureScoresDrawerOpen, readScoreFile } = ports;
      async function importFilesToLibrary(files) {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return;
        const incoming = Array.from(files || []).filter(Boolean);
        if (!incoming.length)
          return;
        try {
          const folders = await ports.library.getAllFolders();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const selectedFolderId = await promptForLibraryFolderChoice({
            title: "Add files to which folder?",
            folders
          });
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (selectedFolderId === "__cancel__")
            return;
          for (const file of incoming) {
            const useConverter = ports.getConverter() && typeof ports.getConverter().isConverterImportFileName === "function" && ports.getConverter().isConverterImportFileName(file.name || "");
            const scoreFile = useConverter ? await ports.getConverter().convertFileToScore(file) : await readScoreFile(file);
            if (!ports.lifetime.current(uiGeneration))
              return;
            await ports.library.saveScore({
              title: scoreFile.title,
              folderId: selectedFolderId,
              fileName: scoreFile.fileName,
              fileType: scoreFile.fileType,
              rawData: scoreFile.rawData
            });
            if (!ports.lifetime.current(uiGeneration))
              return;
          }
          setScoreLibraryManageMode(false);
          setFolderLibraryManageMode(false);
          state.scoreLibrarySelectedFolderId = selectedFolderId ?? "__unfiled__";
          state.scoreLibraryView = "scores";
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
          ensureScoresDrawerOpen();
        } catch (err) {
          if (!ports.lifetime.current(uiGeneration))
            return;
          ports.reportError("Could not import score files", err);
          ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not import one or more score files."));
        }
      }
      async function saveCurrentScoreToLibrary() {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return;
        if (state.currentScoreData == null) {
          ports.alert("Load a score first, then save it to the library.");
          return;
        }
        const defaultTitle = state.currentScoreTitle || getScoreDisplayTitle(state.currentScoreFileName || "Untitled Score");
        const title = ports.prompt("Save to library as:", defaultTitle);
        if (title == null)
          return;
        try {
          const folders = await ports.library.getAllFolders();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const selectedFolderId = await promptForLibraryFolderChoice({
            title: "Save into which folder?",
            folders
          });
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (selectedFolderId === "__cancel__")
            return;
          const saved = await ports.library.saveScore({
            title,
            folderId: selectedFolderId,
            fileName: state.currentScoreFileName || `${title}.xml`,
            fileType: state.currentScoreFileType || getScoreFileTypeFromName(state.currentScoreFileName || ""),
            rawData: state.currentScoreData,
            lastOpenedAt: ports.now()
          });
          if (!ports.lifetime.current(uiGeneration))
            return;
          state.currentScoreLibraryId = saved.id;
          state.currentScoreTitle = saved.title;
          setScoreLibraryManageMode(false);
          setFolderLibraryManageMode(false);
          state.scoreLibrarySelectedFolderId = selectedFolderId ?? "__unfiled__";
          state.scoreLibraryView = "scores";
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        } catch (err) {
          if (!ports.lifetime.current(uiGeneration))
            return;
          ports.reportError("Could not save current score", err);
          ports.alert("Could not save the current score to the library.");
        }
      }
      async function createLibraryFolder() {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return;
        const folderName = ports.prompt("New folder name:");
        if (folderName == null)
          return;
        try {
          const folder = await ports.library.createFolder(folderName);
          if (!ports.lifetime.current(uiGeneration))
            return;
          setFolderLibraryManageMode(false);
          state.scoreLibrarySelectedFolderId = folder.id;
          state.scoreLibraryView = "scores";
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        } catch (err) {
          if (!ports.lifetime.current(uiGeneration))
            return;
          ports.reportError("Could not create library folder", err);
          ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not create that folder."));
        }
      }
      async function exportScoreLibraryBackup() {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return;
        try {
          const payload = await ports.library.exportBackup();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
          const url = ports.url.createObjectURL(blob);
          const link = document2.createElement("a");
          link.href = url;
          link.download = "Scores-Library-Backup.json";
          link.addEventListener("click", (event) => {
            event.stopPropagation();
          });
          document2.body.appendChild(link);
          link.click();
          link.remove();
          ports.url.revokeObjectURL(url);
        } catch (err) {
          if (!ports.lifetime.current(uiGeneration))
            return;
          ports.reportError("Could not export score library", err);
          ports.alert("Could not export the library backup.");
        }
      }
      async function importScoreLibraryBackupFile(file) {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return;
        if (!file)
          return;
        try {
          const text = await file.text();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const payload = JSON.parse(text);
          await ports.library.importBackup(payload);
          if (!ports.lifetime.current(uiGeneration))
            return;
          setScoreLibraryManageMode(false);
          setFolderLibraryManageMode(false);
          state.scoreLibraryView = "folders";
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        } catch (err) {
          if (!ports.lifetime.current(uiGeneration))
            return;
          ports.reportError("Could not import library backup", err);
          ports.alert("Invalid library backup file.");
        }
      }
      return { importFilesToLibrary, saveCurrentScoreToLibrary, createLibraryFolder, exportScoreLibraryBackup, importScoreLibraryBackupFile };
    }
    PianoTrainerLibraryActions2.create = create;
  })(PianoTrainerLibraryActions || (PianoTrainerLibraryActions = {}));

  // src/ui/library-dialogs.ts
  var PianoTrainerLibraryDialogs;
  ((PianoTrainerLibraryDialogs2) => {
    function create(ports) {
      const document2 = ports.document;
      const pending = /* @__PURE__ */ new Set();
      async function promptForLibraryFolderChoice({ allowAll = false, title = "Choose a folder:", folders = null } = {}) {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return "__cancel__";
        const availableFolders = Array.isArray(folders) ? folders : await ports.library.getAllFolders();
        if (!ports.lifetime.current(uiGeneration))
          return "__cancel__";
        const choices = [];
        if (allowAll)
          choices.push({ value: "__all__", label: "All Scores" });
        choices.push({ value: null, label: "Unfiled" });
        availableFolders.forEach((folder) => {
          choices.push({ value: folder.id, label: folder.name || "New Folder" });
        });
        return new Promise((resolve) => {
          const overlay = document2.createElement("div");
          overlay.className = "scores-folder-picker-overlay";
          const panel = document2.createElement("div");
          panel.className = "scores-folder-picker-panel";
          overlay.appendChild(panel);
          const heading = document2.createElement("div");
          heading.className = "scores-folder-picker-title";
          heading.textContent = title;
          panel.appendChild(heading);
          const list = document2.createElement("div");
          list.className = "scores-folder-picker-list";
          panel.appendChild(list);
          const onKeyDown = (e) => {
            if (e.key === "Escape") {
              finish("__cancel__");
            }
          };
          const finish = (value) => {
            document2.removeEventListener("keydown", onKeyDown, true);
            overlay.remove();
            pending.delete(finish);
            resolve(value);
          };
          choices.forEach((choice) => {
            const btn = document2.createElement("button");
            btn.type = "button";
            btn.className = "scores-folder-picker-option";
            if (choice.value !== null && choice.value !== "__all__") btn.setAttribute("data-i18n-skip", "");
            btn.textContent = choice.label;
            btn.addEventListener("click", () => finish(choice.value));
            list.appendChild(btn);
          });
          const footer = document2.createElement("div");
          footer.className = "scores-folder-picker-footer";
          panel.appendChild(footer);
          const cancelBtn = document2.createElement("button");
          cancelBtn.type = "button";
          cancelBtn.className = "scores-folder-picker-cancel";
          cancelBtn.textContent = "Cancel";
          cancelBtn.addEventListener("click", () => finish("__cancel__"));
          footer.appendChild(cancelBtn);
          overlay.addEventListener("click", (e) => {
            if (e.target === overlay)
              finish("__cancel__");
          });
          pending.add(finish);
          document2.addEventListener("keydown", onKeyDown, true);
          document2.body.appendChild(overlay);
        });
      }
      function buildActionMenu({ titleText = "", items = [] } = {}) {
        if (!ports.lifetime.current(ports.lifetime.capture()))
          return Promise.resolve("__cancel__");
        return new Promise((resolve) => {
          const overlay = document2.createElement("div");
          overlay.className = "scores-action-menu-overlay";
          overlay.addEventListener("click", (e) => e.stopPropagation());
          const panel = document2.createElement("div");
          panel.className = "scores-action-menu-panel";
          panel.addEventListener("click", (e) => e.stopPropagation());
          overlay.appendChild(panel);
          const title = document2.createElement("div");
          title.className = "scores-action-menu-title";
          title.textContent = titleText;
          panel.appendChild(title);
          const actions = document2.createElement("div");
          actions.className = "scores-action-menu-actions";
          panel.appendChild(actions);
          const finish = (value) => {
            overlay.remove();
            pending.delete(finish);
            document2.removeEventListener("keydown", onKeyDown, true);
            resolve(value);
          };
          const onKeyDown = (e) => {
            if (e.key === "Escape")
              finish("__cancel__");
          };
          items.forEach((item) => {
            const btn = document2.createElement("button");
            btn.type = "button";
            btn.className = `scores-action-menu-button${item.danger ? " scores-action-menu-button-danger" : ""}`;
            btn.textContent = item.label;
            btn.addEventListener("click", () => finish(item.value));
            actions.appendChild(btn);
          });
          overlay.addEventListener("click", (e) => {
            if (e.target === overlay)
              finish("__cancel__");
          });
          pending.add(finish);
          document2.addEventListener("keydown", onKeyDown, true);
          document2.body.appendChild(overlay);
        });
      }
      function dispose() {
        for (const finish of Array.from(pending))
          finish("__cancel__");
      }
      return { promptForLibraryFolderChoice, buildActionMenu, dispose };
    }
    PianoTrainerLibraryDialogs2.create = create;
  })(PianoTrainerLibraryDialogs || (PianoTrainerLibraryDialogs = {}));

  // src/domain/library-view.ts
  var PianoTrainerLibraryView;
  ((PianoTrainerLibraryView2) => {
    function normalizeComparableScoreName(value) {
      return String(value || "").trim().toLowerCase().replace(/\.(musicxml|xml|mxl)$/i, "").replace(/[^a-z0-9]+/g, "");
    }
    PianoTrainerLibraryView2.normalizeComparableScoreName = normalizeComparableScoreName;
    function shouldShowScoreFileName(title, fileName) {
      const normalizedTitle = normalizeComparableScoreName(title);
      const normalizedFile = normalizeComparableScoreName(fileName);
      if (!normalizedFile)
        return false;
      if (!normalizedTitle)
        return true;
      if (normalizedTitle === normalizedFile)
        return false;
      if (normalizedTitle.startsWith(normalizedFile) || normalizedFile.startsWith(normalizedTitle))
        return false;
      return true;
    }
    PianoTrainerLibraryView2.shouldShowScoreFileName = shouldShowScoreFileName;
    function getFilteredLibraryScores(scores, activeFolderId) {
      return (scores || []).filter((score) => {
        if (activeFolderId === "__all__")
          return true;
        if (activeFolderId === "__unfiled__" || activeFolderId == null)
          return !score.folderId;
        return score.folderId === activeFolderId;
      });
    }
    PianoTrainerLibraryView2.getFilteredLibraryScores = getFilteredLibraryScores;
  })(PianoTrainerLibraryView || (PianoTrainerLibraryView = {}));

  // src/ui/library-list.ts
  var PianoTrainerLibraryList;
  ((PianoTrainerLibraryList2) => {
    function create(ports) {
      const document2 = ports.document;
      const rowBindings = [];
      function bind(node, event, handler) {
        node.addEventListener(event, handler);
        rowBindings.push({ node, event, handler });
      }
      function dispose() {
        for (const { node, event, handler } of rowBindings)
          node.removeEventListener(event, handler);
        rowBindings.length = 0;
      }
      const state = ports.state;
      const { getFolderLibrarySelectionSet, setFolderLibrarySelection, clearFolderLibrarySelection, isFolderLibraryManageMode, setFolderLibraryManageMode, toggleFolderLibrarySelection, getScoreLibrarySelectionSet, setScoreLibrarySelection, isScoreLibraryManageMode, setScoreLibraryManageMode, toggleScoreLibrarySelection } = ports.selection;
      const { getScoreDisplayTitle } = ports.format;
      const { buildActionMenu, promptForLibraryFolderChoice } = ports.dialogs;
      const { refreshScoresDrawer, createLibraryFolder, openScoresImportPicker, closeScoresDrawer, loadScoreIntoApp, getScoreLibraryFolderLabel } = ports;
      const { shouldShowScoreFileName } = PianoTrainerLibraryView;
      function isSystemFolderOption(folderId) {
        return folderId === "__all__" || folderId === "__unfiled__" || folderId == null;
      }
      function showFolderRowActionMenu(folder) {
        return buildActionMenu({
          titleText: String(folder?.name || "New Folder").trim() || "New Folder",
          items: [
            { value: "rename", label: "Rename" },
            { value: "delete", label: "Delete", danger: true }
          ]
        });
      }
      function createFoldersLibraryToolbar({ folders = [], activeFolderId = "__all__" } = {}) {
        const toolbar = document2.createElement("div");
        const realFolders = (folders || []).filter((folder) => folder && folder.id);
        const manageMode = isFolderLibraryManageMode();
        toolbar.className = `scores-library-toolbar${manageMode ? " is-manage-mode" : ""}`;
        const info = document2.createElement("div");
        info.className = "scores-library-toolbar-info";
        toolbar.appendChild(info);
        const actions = document2.createElement("div");
        actions.className = "scores-library-toolbar-actions";
        toolbar.appendChild(actions);
        const selectedSet = getFolderLibrarySelectionSet();
        const selectedCount = selectedSet.size;
        if (!manageMode) {
          info.textContent = "Folders";
          const newFolderBtn = document2.createElement("button");
          newFolderBtn.type = "button";
          newFolderBtn.className = "scores-toolbar-button";
          newFolderBtn.textContent = "New Folder";
          bind(newFolderBtn, "click", createLibraryFolder);
          actions.appendChild(newFolderBtn);
          const manageBtn = document2.createElement("button");
          manageBtn.type = "button";
          manageBtn.className = "scores-toolbar-button";
          manageBtn.textContent = "Manage";
          manageBtn.disabled = realFolders.length === 0;
          bind(manageBtn, "click", async () => {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
              return;
            setFolderLibraryManageMode(true);
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          });
          actions.appendChild(manageBtn);
          return toolbar;
        }
        info.textContent = selectedCount > 0 ? `${selectedCount} selected` : "Select folders to delete";
        const selectAllBtn = document2.createElement("button");
        selectAllBtn.type = "button";
        selectAllBtn.className = "scores-toolbar-button";
        const allVisibleSelected = realFolders.length > 0 && realFolders.every((folder) => selectedSet.has(folder.id));
        selectAllBtn.textContent = allVisibleSelected ? "Deselect All" : "Select All";
        bind(selectAllBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (allVisibleSelected) {
            clearFolderLibrarySelection();
          } else {
            setFolderLibrarySelection(realFolders.map((folder) => folder.id));
          }
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        });
        actions.appendChild(selectAllBtn);
        const deleteBtn = document2.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "scores-toolbar-button scores-toolbar-button-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.disabled = selectedCount === 0;
        bind(deleteBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const selectedIds = Array.from(getFolderLibrarySelectionSet());
          if (!selectedIds.length)
            return;
          const selectedFolders = realFolders.filter((folder) => selectedIds.includes(folder.id));
          const selectedScores = (await ports.library.getAllScores()).filter((score) => selectedIds.includes(score.folderId));
          if (!ports.lifetime.current(uiGeneration))
            return;
          const confirmed = ports.confirm(`Delete ${selectedFolders.length} selected folder${selectedFolders.length === 1 ? "" : "s"}? Any scores inside ${selectedFolders.length === 1 ? "it will" : "them will"} also be deleted.`);
          if (!confirmed)
            return;
          try {
            await ports.library.deleteFoldersAndScores(selectedIds);
            if (!ports.lifetime.current(uiGeneration))
              return;
            if (state.currentScoreLibraryId && selectedScores.some((score) => score.id === state.currentScoreLibraryId)) {
              state.currentScoreLibraryId = null;
            }
            if (selectedIds.includes(state.scoreLibrarySelectedFolderId)) {
              state.scoreLibrarySelectedFolderId = "__all__";
            }
            setFolderLibraryManageMode(false);
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          } catch (err) {
            if (!ports.lifetime.current(uiGeneration))
              return;
            ports.reportError("Could not delete selected folders", err);
            ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not delete the selected folders."));
          }
        });
        actions.appendChild(deleteBtn);
        const cancelBtn = document2.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "scores-toolbar-button";
        cancelBtn.textContent = "Cancel";
        bind(cancelBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          setFolderLibraryManageMode(false);
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        });
        actions.appendChild(cancelBtn);
        return toolbar;
      }
      function createFolderListRow(option, { activeFolderId = "__all__", folders = [], showQuickAction = true } = {}) {
        const isManageMode = isFolderLibraryManageMode();
        const isSystem = isSystemFolderOption(option.value);
        const isActive = String(activeFolderId) === String(option.value);
        if (isManageMode && !isSystem) {
          const selectedSet = getFolderLibrarySelectionSet();
          const row2 = document2.createElement("button");
          row2.type = "button";
          row2.className = "scores-folder-list-item scores-manage-row-button";
          row2.setAttribute("aria-pressed", selectedSet.has(option.value) ? "true" : "false");
          if (selectedSet.has(option.value))
            row2.classList.add("is-selected");
          const indicator = document2.createElement("span");
          indicator.className = "scores-select-indicator";
          indicator.textContent = selectedSet.has(option.value) ? "\u2713" : "";
          row2.appendChild(indicator);
          const label = document2.createElement("span");
          label.setAttribute("data-i18n-skip", "");
          label.textContent = option.label;
          row2.appendChild(label);
          bind(row2, "click", async () => {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
              return;
            toggleFolderLibrarySelection(option.value);
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          });
          return row2;
        }
        const row = document2.createElement("div");
        row.className = "scores-item-row";
        const btn = document2.createElement("button");
        btn.type = "button";
        btn.className = "scores-folder-list-item";
        if (!isSystem) btn.setAttribute("data-i18n-skip", "");
        if (isActive)
          btn.classList.add("is-active");
        btn.textContent = option.label;
        bind(btn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          state.scoreLibrarySelectedFolderId = option.value;
          state.scoreLibraryView = "scores";
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        });
        row.appendChild(btn);
        if (!showQuickAction || isSystem || isManageMode) {
          return row;
        }
        const folder = (folders || []).find((item) => item.id === option.value);
        if (!folder)
          return row;
        const actionBtn = document2.createElement("button");
        actionBtn.type = "button";
        actionBtn.className = "scores-row-action-button";
        actionBtn.setAttribute("aria-label", `Actions for folder ${option.label}`);
        actionBtn.textContent = "\u22EF";
        bind(actionBtn, "click", async (e) => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          e.preventDefault();
          e.stopPropagation();
          const action = await showFolderRowActionMenu(folder);
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (action === "rename") {
            const nextName = ports.prompt("Rename folder:", folder.name || "New Folder");
            if (nextName == null)
              return;
            try {
              await ports.library.renameFolder(folder.id, nextName);
              if (!ports.lifetime.current(uiGeneration))
                return;
              await refreshScoresDrawer();
              if (!ports.lifetime.current(uiGeneration))
                return;
            } catch (err) {
              if (!ports.lifetime.current(uiGeneration))
                return;
              ports.reportError("Could not rename folder", err);
              ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not rename that folder."));
            }
            return;
          }
          if (action === "delete") {
            const folderScores = (await ports.library.getAllScores()).filter((score) => score.folderId === folder.id);
            if (!ports.lifetime.current(uiGeneration))
              return;
            const confirmed = ports.confirm(`Delete folder "${folder.name || "New Folder"}"? ${folderScores.length ? `This will also delete ${folderScores.length} score${folderScores.length === 1 ? "" : "s"} inside it.` : "This cannot be undone."}`);
            if (!confirmed)
              return;
            try {
              await ports.library.deleteFolderAndScores(folder.id);
              if (!ports.lifetime.current(uiGeneration))
                return;
              if (state.currentScoreLibraryId && folderScores.some((score) => score.id === state.currentScoreLibraryId)) {
                state.currentScoreLibraryId = null;
              }
              if (state.scoreLibrarySelectedFolderId === folder.id) {
                state.scoreLibrarySelectedFolderId = "__all__";
              }
              await refreshScoresDrawer();
              if (!ports.lifetime.current(uiGeneration))
                return;
            } catch (err) {
              if (!ports.lifetime.current(uiGeneration))
                return;
              ports.reportError("Could not delete folder", err);
              ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not delete that folder."));
            }
          }
        });
        row.appendChild(actionBtn);
        return row;
      }
      function formatScorePaneSummary(folderId, folders, scoreCount) {
        const countLabel = `${scoreCount} score${scoreCount === 1 ? "" : "s"}`;
        const folderLabel = getScoreLibraryFolderLabel(folderId, folders);
        return `${countLabel} \u2022 ${folderLabel}`;
      }
      function createScoresLibraryToolbar({ filteredScores = [], folders = [], activeFolderId = "__all__" } = {}) {
        const toolbar = document2.createElement("div");
        const manageMode = isScoreLibraryManageMode();
        toolbar.className = `scores-library-toolbar${manageMode ? " is-manage-mode" : ""}`;
        const info = document2.createElement("div");
        info.className = "scores-library-toolbar-info";
        toolbar.appendChild(info);
        const actions = document2.createElement("div");
        actions.className = "scores-library-toolbar-actions";
        toolbar.appendChild(actions);
        const selectedSet = getScoreLibrarySelectionSet();
        const selectedCount = selectedSet.size;
        if (!manageMode) {
          info.textContent = "";
          const addFilesBtn = document2.createElement("button");
          addFilesBtn.type = "button";
          addFilesBtn.className = "scores-toolbar-button";
          addFilesBtn.textContent = "Add File(s)";
          bind(addFilesBtn, "click", openScoresImportPicker);
          actions.appendChild(addFilesBtn);
          const manageBtn = document2.createElement("button");
          manageBtn.type = "button";
          manageBtn.className = "scores-toolbar-button";
          manageBtn.textContent = "Manage";
          bind(manageBtn, "click", async () => {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
              return;
            setScoreLibraryManageMode(true);
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          });
          actions.appendChild(manageBtn);
          return toolbar;
        }
        info.textContent = selectedCount > 0 ? `${selectedCount} selected` : "Select scores to move or delete";
        const selectAllBtn = document2.createElement("button");
        selectAllBtn.type = "button";
        selectAllBtn.className = "scores-toolbar-button";
        const allVisibleSelected = filteredScores.length > 0 && filteredScores.every((score) => selectedSet.has(score.id));
        selectAllBtn.textContent = allVisibleSelected ? "Deselect All" : "Select All";
        bind(selectAllBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (allVisibleSelected) {
            const next = getScoreLibrarySelectionSet();
            filteredScores.forEach((score) => next.delete(score.id));
            setScoreLibrarySelection(Array.from(next));
          } else {
            const next = getScoreLibrarySelectionSet();
            filteredScores.forEach((score) => next.add(score.id));
            setScoreLibrarySelection(Array.from(next));
          }
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        });
        actions.appendChild(selectAllBtn);
        const moveBtn = document2.createElement("button");
        moveBtn.type = "button";
        moveBtn.className = "scores-toolbar-button";
        moveBtn.textContent = "Move";
        moveBtn.disabled = selectedCount === 0;
        bind(moveBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const selectedIds = Array.from(getScoreLibrarySelectionSet());
          if (!selectedIds.length)
            return;
          const selectedFolderId = await promptForLibraryFolderChoice({
            title: `Move ${selectedIds.length} selected score${selectedIds.length === 1 ? "" : "s"} to which folder?`,
            folders
          });
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (selectedFolderId === "__cancel__")
            return;
          try {
            await ports.library.moveScoresToFolder(selectedIds, selectedFolderId);
            if (!ports.lifetime.current(uiGeneration))
              return;
            setScoreLibraryManageMode(false);
            state.scoreLibrarySelectedFolderId = selectedFolderId ?? "__unfiled__";
            state.scoreLibraryView = ports.window.innerWidth >= 900 ? "folders" : "scores";
            if (state.currentScoreLibraryId && selectedIds.includes(state.currentScoreLibraryId)) {
              const moved = await ports.library.getScoreById(state.currentScoreLibraryId);
              if (!ports.lifetime.current(uiGeneration))
                return;
              if (moved)
                state.currentScoreTitle = moved.title || state.currentScoreTitle;
            }
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          } catch (err) {
            if (!ports.lifetime.current(uiGeneration))
              return;
            ports.reportError("Could not move selected scores", err);
            ports.alert("Could not move the selected scores.");
          }
        });
        actions.appendChild(moveBtn);
        const deleteBtn = document2.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "scores-toolbar-button scores-toolbar-button-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.disabled = selectedCount === 0;
        bind(deleteBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const selectedIds = Array.from(getScoreLibrarySelectionSet());
          if (!selectedIds.length)
            return;
          const confirmed = ports.confirm(`Delete ${selectedIds.length} selected score${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`);
          if (!confirmed)
            return;
          try {
            await ports.library.deleteScores(selectedIds);
            if (!ports.lifetime.current(uiGeneration))
              return;
            if (state.currentScoreLibraryId && selectedIds.includes(state.currentScoreLibraryId)) {
              state.currentScoreLibraryId = null;
            }
            setScoreLibraryManageMode(false);
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          } catch (err) {
            if (!ports.lifetime.current(uiGeneration))
              return;
            ports.reportError("Could not delete selected scores", err);
            ports.alert("Could not delete the selected scores.");
          }
        });
        actions.appendChild(deleteBtn);
        const cancelBtn = document2.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "scores-toolbar-button";
        cancelBtn.textContent = "Cancel";
        bind(cancelBtn, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          setScoreLibraryManageMode(false);
          await refreshScoresDrawer();
          if (!ports.lifetime.current(uiGeneration))
            return;
        });
        actions.appendChild(cancelBtn);
        return toolbar;
      }
      function showScoreRowActionMenu(score) {
        return buildActionMenu({
          titleText: String(score?.title || getScoreDisplayTitle(score?.fileName || "") || "Untitled Score").trim() || "Untitled Score",
          items: [
            { value: "rename", label: "Rename" },
            { value: "move", label: "Move" },
            { value: "delete", label: "Delete", danger: true }
          ]
        });
      }
      function createScoreRow(score, { compact = false, manageMode = false } = {}) {
        const resolvedTitle = String(score.title || getScoreDisplayTitle(score.fileName || "") || "Untitled Score").trim() || "Untitled Score";
        const resolvedFileName = String(score.fileName || "").trim();
        const showFileNameMeta = shouldShowScoreFileName(resolvedTitle, resolvedFileName);
        const metaText = showFileNameMeta ? resolvedFileName : "";
        const buildRowContent = ({ includeLoadedBadge = false } = {}) => {
          const content = document2.createElement("div");
          content.className = "scores-item-content";
          const title = document2.createElement("div");
          title.className = "scores-item-title";
          title.textContent = resolvedTitle;
          content.appendChild(title);
          if (metaText) {
            const meta = document2.createElement("div");
            meta.className = "scores-item-meta";
            meta.textContent = metaText;
            content.appendChild(meta);
          }
          if (includeLoadedBadge) {
            const badge = document2.createElement("div");
            badge.className = "scores-item-badge";
            badge.textContent = "Loaded";
            content.appendChild(badge);
          }
          return content;
        };
        if (manageMode) {
          const selectedSet = getScoreLibrarySelectionSet();
          const row2 = document2.createElement("button");
          row2.type = "button";
          row2.className = `${compact ? "scores-item-button is-compact" : "scores-item-button"} scores-manage-row-button`;
          row2.setAttribute("aria-pressed", selectedSet.has(score.id) ? "true" : "false");
          if (selectedSet.has(score.id))
            row2.classList.add("is-selected");
          const indicator = document2.createElement("span");
          indicator.className = "scores-select-indicator";
          indicator.textContent = selectedSet.has(score.id) ? "\u2713" : "";
          row2.appendChild(indicator);
          row2.appendChild(buildRowContent());
          bind(row2, "click", async () => {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
              return;
            toggleScoreLibrarySelection(score.id);
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration))
              return;
          });
          return row2;
        }
        const row = document2.createElement("div");
        row.className = "scores-item-row";
        const button = document2.createElement("button");
        button.type = "button";
        button.className = compact ? "scores-item-button is-compact" : "scores-item-button";
        const isLoaded = !!(state.currentScoreLibraryId && score.id === state.currentScoreLibraryId);
        if (isLoaded) {
          button.classList.add("is-loaded");
        }
        button.appendChild(buildRowContent({ includeLoadedBadge: isLoaded }));
        bind(button, "click", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          try {
            const fullScore = await ports.library.getScoreById(score.id);
            if (!ports.lifetime.current(uiGeneration))
              return;
            if (!fullScore)
              return;
            await loadScoreIntoApp(fullScore.rawData, {
              fileName: fullScore.fileName,
              fileType: fullScore.fileType,
              libraryScoreId: fullScore.id,
              title: fullScore.title
            });
            if (!ports.lifetime.current(uiGeneration))
              return;
            closeScoresDrawer();
          } catch (err) {
            if (!ports.lifetime.current(uiGeneration))
              return;
            ports.reportError("Could not open library score", err);
          }
        });
        row.appendChild(button);
        const actionBtn = document2.createElement("button");
        actionBtn.type = "button";
        actionBtn.className = "scores-row-action-button";
        actionBtn.setAttribute("aria-label", `Actions for ${resolvedTitle}`);
        actionBtn.textContent = "\u22EF";
        bind(actionBtn, "click", async (e) => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          e.preventDefault();
          e.stopPropagation();
          const action = await showScoreRowActionMenu(score);
          if (!ports.lifetime.current(uiGeneration))
            return;
          if (action === "rename") {
            const nextTitle = ports.prompt("Rename score:", resolvedTitle);
            if (nextTitle == null)
              return;
            try {
              await ports.library.renameScore(score.id, nextTitle);
              if (!ports.lifetime.current(uiGeneration))
                return;
              await refreshScoresDrawer();
              if (!ports.lifetime.current(uiGeneration))
                return;
            } catch (err) {
              if (!ports.lifetime.current(uiGeneration))
                return;
              ports.reportError("Could not rename score", err);
              ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not rename that score."));
            }
            return;
          }
          if (action === "move") {
            try {
              const folders = await ports.library.getAllFolders();
              if (!ports.lifetime.current(uiGeneration))
                return;
              const selectedFolderId = await promptForLibraryFolderChoice({
                title: `Move "${resolvedTitle}" to which folder?`,
                folders
              });
              if (!ports.lifetime.current(uiGeneration))
                return;
              if (selectedFolderId === "__cancel__")
                return;
              await ports.library.moveScoresToFolder([score.id], selectedFolderId);
              if (!ports.lifetime.current(uiGeneration))
                return;
              state.scoreLibrarySelectedFolderId = selectedFolderId ?? "__unfiled__";
              await refreshScoresDrawer();
              if (!ports.lifetime.current(uiGeneration))
                return;
            } catch (err) {
              if (!ports.lifetime.current(uiGeneration))
                return;
              ports.reportError("Could not move score", err);
              ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not move that score."));
            }
            return;
          }
          if (action === "delete") {
            const confirmed = ports.confirm(`Delete score "${resolvedTitle}"?`);
            if (!confirmed)
              return;
            try {
              await ports.library.deleteScores([score.id]);
              if (!ports.lifetime.current(uiGeneration))
                return;
              if (state.currentScoreLibraryId === score.id) {
                state.currentScoreLibraryId = null;
              }
              await refreshScoresDrawer();
              if (!ports.lifetime.current(uiGeneration))
                return;
            } catch (err) {
              if (!ports.lifetime.current(uiGeneration))
                return;
              ports.reportError("Could not delete score", err);
              ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, "Could not delete that score."));
            }
          }
        });
        row.appendChild(actionBtn);
        return row;
      }
      return { createFoldersLibraryToolbar, createFolderListRow, createScoresLibraryToolbar, createScoreRow, formatScorePaneSummary, dispose };
    }
    PianoTrainerLibraryList2.create = create;
  })(PianoTrainerLibraryList || (PianoTrainerLibraryList = {}));

  // src/ui/loop-controls.ts
  var PianoTrainerLoopControls;
  ((PianoTrainerLoopControls2) => {
    function create(ports) {
      const { document: document2, window: window2, state } = ports, dom = PianoTrainerControlDom.create(document2);
      let optionsInitialized = false, rangeInitialized = false, active = true, generation = 0, activeLooperHold = null;
      function syncLooperDependentUi() {
        if (!active) return;
        const loop = dom.optionalInput("check-looper"), count = dom.optionalInput("check-loop-countin"), row = dom.element("looper-countin-row"), enabled = !!loop?.checked;
        if (count) {
          count.disabled = !enabled;
          count.checked = !!state.loopCountInEnabled;
        }
        if (row) {
          row.classList.toggle("is-disabled", !enabled);
          row.setAttribute("aria-disabled", String(!enabled));
        }
      }
      function resetRangeForScore(total) {
        if (!active) return;
        dom.input("slider-loop-max").max = String(total);
        dom.input("slider-loop-min").max = String(total);
        dom.input("val-loop-min").min = "1";
        dom.input("val-loop-min").max = String(total);
        dom.input("val-loop-max").min = "1";
        dom.input("val-loop-max").max = String(total);
        dom.input("val-loop-max").value = String(total);
        dom.input("val-loop-min").value = "1";
        state.looper.min = 1;
        state.looper.max = total;
      }
      function syncLooper(_source, changedId) {
        if (!active) return;
        const minInput = dom.input("val-loop-min"), maxInput = dom.input("val-loop-max"), minSlider = dom.input("slider-loop-min"), maxSlider = dom.input("slider-loop-max");
        let min = parseInt(minInput.value, 10), max = parseInt(maxInput.value, 10);
        const allowed = parseInt(maxSlider.max, 10) || 100;
        if (changedId === "slider-loop-min") min = parseInt(minSlider.value, 10);
        if (changedId === "slider-loop-max") max = parseInt(maxSlider.value, 10);
        if (isNaN(min) || min < 1) min = 1;
        if (isNaN(max) || max < 1) max = 1;
        if (min > allowed) min = allowed;
        if (max > allowed) max = allowed;
        if (min > max) {
          if (changedId === "slider-loop-min" || changedId === "val-loop-min") max = min;
          else if (changedId === "slider-loop-max" || changedId === "val-loop-max") min = max;
        }
        minSlider.value = String(min);
        maxSlider.value = String(max);
        minInput.value = String(min);
        maxInput.value = String(max);
        state.looper.min = min;
        state.looper.max = max;
        ports.renderLooper();
        ports.enforceLooperBounds();
      }
      function syncLooperInputIfReady(changedId) {
        const input = changedId === "val-loop-min" ? dom.input("val-loop-min") : dom.input("val-loop-max");
        if (input.value === "") return;
        syncLooper("input", changedId);
      }
      function stepLooperValue(target, delta) {
        if (!active) return;
        const input = dom.input(target === "min" ? "val-loop-min" : "val-loop-max"), fallback = target === "min" ? state.looper.min : state.looper.max, current = parseInt(input.value, 10);
        input.value = String((Number.isNaN(current) ? fallback : current) + delta);
        syncLooper("input", target === "min" ? "val-loop-min" : "val-loop-max");
      }
      function clearLooperHold() {
        if (!activeLooperHold) return;
        if (activeLooperHold.delayTimer) window2.clearTimeout(activeLooperHold.delayTimer);
        if (activeLooperHold.repeatTimer) window2.clearInterval(activeLooperHold.repeatTimer);
        if (activeLooperHold.button.releasePointerCapture && activeLooperHold.pointerId != null) {
          try {
            if (activeLooperHold.button.hasPointerCapture?.(activeLooperHold.pointerId)) activeLooperHold.button.releasePointerCapture(activeLooperHold.pointerId);
          } catch (_) {
          }
        }
        activeLooperHold.button.classList.remove("is-holding");
        activeLooperHold = null;
      }
      function beginLooperHold(button, target, delta, pointerId) {
        if (!active) return;
        clearLooperHold();
        activeLooperHold = { button, pointerId, delayTimer: null, repeatTimer: null };
        button.classList.add("is-holding");
        const token = generation;
        if (button.setPointerCapture && pointerId != null) {
          try {
            button.setPointerCapture(pointerId);
          } catch (_) {
          }
        }
        activeLooperHold.delayTimer = window2.setTimeout(() => {
          if (!active || token !== generation || !activeLooperHold || activeLooperHold.button !== button) return;
          activeLooperHold.repeatTimer = window2.setInterval(() => {
            if (active && token === generation) stepLooperValue(target, delta);
          }, 170);
        }, 320);
      }
      function wireLooperHold(button, target, delta) {
        if (!button) return;
        dom.on(button, "contextmenu", (event) => event.preventDefault());
        dom.on(button, "dragstart", (event) => event.preventDefault());
        dom.on(button, "pointerdown", (event) => {
          if (!(event instanceof PointerEvent)) return;
          if (event.button !== void 0 && event.button !== 0) return;
          event.preventDefault();
          beginLooperHold(button, target, delta, event.pointerId);
        });
        dom.on(button, "pointerup", clearLooperHold);
        dom.on(button, "pointercancel", clearLooperHold);
        dom.on(button, "lostpointercapture", clearLooperHold);
        dom.on(button, "pointerleave", (event) => {
          if (!(event instanceof PointerEvent)) return;
          if (activeLooperHold?.button !== button) return;
          if (event.buttons === 0) clearLooperHold();
        });
      }
      function initOptions() {
        if (optionsInitialized) return;
        active = true;
        optionsInitialized = true;
        dom.on(dom.input("check-looper"), "change", () => {
          ports.renderLooper();
          ports.enforceLooperBounds();
          syncLooperDependentUi();
        });
        dom.onInput(dom.optionalInput("check-loop-countin"), "change", (node) => {
          if (node.disabled) return;
          state.loopCountInEnabled = node.checked;
          ports.saveLoopCountIn(state.loopCountInEnabled);
        });
      }
      function initRange() {
        if (rangeInitialized) return;
        active = true;
        rangeInitialized = true;
        const minSlider = dom.input("slider-loop-min"), maxSlider = dom.input("slider-loop-max"), minInput = dom.input("val-loop-min"), maxInput = dom.input("val-loop-max");
        dom.onInput(minSlider, "input", (node) => syncLooper("slider", node.id));
        dom.onInput(maxSlider, "input", (node) => syncLooper("slider", node.id));
        dom.onInput(minInput, "input", (node) => syncLooperInputIfReady(node.id));
        dom.onInput(maxInput, "input", (node) => syncLooperInputIfReady(node.id));
        for (const event of ["change", "blur"]) for (const node of [minInput, maxInput]) dom.onInput(node, event, (input) => syncLooper("input", input.id));
        const steppers = [["btn-loop-min-decrease", "min", -1], ["btn-loop-min-increase", "min", 1], ["btn-loop-max-decrease", "max", -1], ["btn-loop-max-increase", "max", 1]];
        for (const [id, target, delta] of steppers) dom.on(dom.optionalButton(id), "click", () => stepLooperValue(target, delta));
        for (const [id, target, delta] of steppers) wireLooperHold(dom.optionalButton(id), target, delta);
        dom.on(document2, "pointerup", clearLooperHold);
        dom.on(document2, "pointercancel", clearLooperHold);
        dom.on(window2, "blur", clearLooperHold);
      }
      function init() {
        initOptions();
        syncLooperDependentUi();
        initRange();
      }
      function dispose() {
        if (!active) return;
        active = false;
        generation++;
        optionsInitialized = false;
        rangeInitialized = false;
        clearLooperHold();
        dom.dispose();
      }
      return { init, initOptions, initRange, dispose, syncLooperDependentUi, resetRangeForScore, syncLooper, syncLooperInputIfReady, stepLooperValue, clearLooperHold, beginLooperHold };
    }
    PianoTrainerLoopControls2.create = create;
  })(PianoTrainerLoopControls || (PianoTrainerLoopControls = {}));

  // src/ui/midi-controls.ts
  var PianoTrainerMidiControls;
  ((PianoTrainerMidiControls2) => {
    function create(ports) {
      const { document: document2, storage: localStorage2, normalizeMidiChannel, normalizeMidiInputChannel, setStoredBool } = ports;
      const {
        MIDI_IN_CHANNEL_STORAGE_KEY: MIDI_IN_CHANNEL_STORAGE_KEY2,
        MIDI_IN_ID_STORAGE_KEY: MIDI_IN_ID_STORAGE_KEY2,
        MIDI_IN_NAME_STORAGE_KEY: MIDI_IN_NAME_STORAGE_KEY2,
        MIDI_LED_LOW_VELOCITY_STORAGE_KEY: MIDI_LED_LOW_VELOCITY_STORAGE_KEY2,
        MIDI_LIGHTS_CHANNEL_STORAGE_KEY: MIDI_LIGHTS_CHANNEL_STORAGE_KEY2,
        MIDI_LIGHTS_ID_STORAGE_KEY: MIDI_LIGHTS_ID_STORAGE_KEY2,
        MIDI_LIGHTS_NAME_STORAGE_KEY: MIDI_LIGHTS_NAME_STORAGE_KEY2,
        MIDI_OUT_CHANNEL_STORAGE_KEY: MIDI_OUT_CHANNEL_STORAGE_KEY2,
        MIDI_OUT_ID_STORAGE_KEY: MIDI_OUT_ID_STORAGE_KEY2,
        MIDI_OUT_NAME_STORAGE_KEY: MIDI_OUT_NAME_STORAGE_KEY2
      } = ports.keys;
      const state = ports.state;
      const bindings = [];
      let initialized = false;
      function getSelect(id) {
        const element = document2.getElementById(id);
        return element instanceof HTMLSelectElement ? element : null;
      }
      function bindSelect(id, handler) {
        const select = getSelect(id);
        if (!select)
          return;
        const listener = (event) => {
          if (event.target instanceof HTMLSelectElement) handler(event.target);
        };
        select.addEventListener("change", listener);
        bindings.push(() => select.removeEventListener("change", listener));
      }
      function populateMidiChannelSelect(selectId, selectedValue = 1, { includeAny = false } = {}) {
        const select = getSelect(selectId);
        if (!select)
          return;
        const safeValue = includeAny ? normalizeMidiInputChannel(selectedValue, 0) : normalizeMidiChannel(selectedValue, 1);
        select.innerHTML = "";
        if (includeAny) {
          const anyOption = document2.createElement("option");
          anyOption.value = "0";
          anyOption.textContent = "Any";
          if (safeValue === 0)
            anyOption.selected = true;
          select.appendChild(anyOption);
        }
        for (let channel = 1; channel <= 16; channel++) {
          const option = document2.createElement("option");
          option.value = String(channel);
          option.textContent = String(channel);
          if (channel === safeValue)
            option.selected = true;
          select.appendChild(option);
        }
      }
      function syncMidiInputConfigVisibility() {
        const midiInSelect = getSelect("midi-in");
        const midiInConfig = document2.getElementById("midi-in-config");
        const midiInChannelRow = document2.getElementById("midi-in-channel-row");
        const midiInKeysRow = document2.getElementById("midi-in-keys-row");
        const playerRangeLabel = document2.getElementById("player-piano-range-label");
        if (!midiInSelect || !midiInConfig)
          return;
        const hasMidiIn = midiInSelect.value && midiInSelect.value !== "none";
        midiInConfig.classList.toggle("hidden", !hasMidiIn);
        if (midiInChannelRow)
          midiInChannelRow.classList.toggle("hidden", !hasMidiIn);
        if (midiInKeysRow)
          midiInKeysRow.classList.toggle("hidden", !hasMidiIn);
        if (playerRangeLabel)
          playerRangeLabel.classList.add("hidden");
      }
      function syncMidiOutChannelVisibility() {
        const midiOutSelect = getSelect("midi-out");
        const channelRow = document2.getElementById("midi-out-channel-row");
        if (!channelRow || !midiOutSelect)
          return;
        const hasMidiOut = midiOutSelect.value && midiOutSelect.value !== "none";
        channelRow.classList.toggle("hidden", !hasMidiOut);
      }
      function getSelectedMidiOutChannel() {
        return normalizeMidiChannel(getSelect("midi-out-channel")?.value, state.midiOutChannel || 1);
      }
      function getSelectedMidiLightsChannel() {
        return normalizeMidiChannel(getSelect("midi-lights-channel")?.value, state.midiLightsChannel || 1);
      }
      function getSelectedMidiInChannel() {
        return normalizeMidiInputChannel(getSelect("midi-in-channel")?.value, state.midiInChannel || 0);
      }
      function populateMIDIDevices() {
        const midiInSelect = getSelect("midi-in");
        const midiOutSelect = getSelect("midi-out");
        const midiLightsSelect = getSelect("midi-lights");
        if (!midiInSelect || !midiOutSelect)
          return;
        const savedIn = localStorage2.getItem(MIDI_IN_ID_STORAGE_KEY2);
        const savedOut = localStorage2.getItem(MIDI_OUT_ID_STORAGE_KEY2);
        const savedLights = localStorage2.getItem(MIDI_LIGHTS_ID_STORAGE_KEY2);
        populateMidiChannelSelect("midi-in-channel", state.midiInChannel || 0, { includeAny: true });
        populateMidiChannelSelect("midi-out-channel", state.midiOutChannel || 1);
        populateMidiChannelSelect("midi-lights-channel", state.midiLightsChannel || 1);
        midiInSelect.innerHTML = '<option value="none">None</option>';
        midiOutSelect.innerHTML = '<option value="none">None</option>';
        if (midiLightsSelect)
          midiLightsSelect.innerHTML = '<option value="none">None</option>';
        if (!ports.service.isReady()) {
          ports.updateConnections();
          syncMidiInputConfigVisibility();
          syncMidiOutChannelVisibility();
          return;
        }
        ports.clearPermissionHelp();
        for (let input of ports.service.listInputs()) {
          const option = document2.createElement("option");
          option.value = input.id;
          option.setAttribute("data-i18n-skip", "");
          option.text = String(input.name);
          midiInSelect.appendChild(option);
        }
        for (let output of ports.service.listOutputs()) {
          const optOut = document2.createElement("option");
          optOut.value = output.id;
          optOut.setAttribute("data-i18n-skip", "");
          optOut.text = String(output.name);
          midiOutSelect.appendChild(optOut);
          const optLights = document2.createElement("option");
          optLights.value = output.id;
          optLights.setAttribute("data-i18n-skip", "");
          optLights.text = String(output.name);
          midiLightsSelect?.appendChild(optLights);
        }
        if (savedIn && [...midiInSelect.options].some((o) => o.value === savedIn)) {
          midiInSelect.value = savedIn;
          if (!ports.service.isInputBound(savedIn)) {
            midiInSelect.dispatchEvent(new Event("change"));
          }
        }
        if (savedOut && [...midiOutSelect.options].some((o) => o.value === savedOut)) {
          midiOutSelect.value = savedOut;
        }
        if (midiLightsSelect && savedLights && [...midiLightsSelect.options].some((o) => o.value === savedLights)) {
          midiLightsSelect.value = savedLights;
        }
        ports.updateConnections();
        syncMidiInputConfigVisibility();
        syncMidiOutChannelVisibility();
        ports.syncRouting();
        if (ports.optionalLedEnabled && ports.ledTest()) {
          ports.ledTest()?.syncControls();
        }
      }
      function init() {
        if (initialized)
          return;
        initialized = true;
        bindSelect("midi-in", (target) => {
          localStorage2.setItem(MIDI_IN_ID_STORAGE_KEY2, target.value);
          if (target.value !== "none") {
            const selectedName = target.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, "") || "MIDI In";
            localStorage2.setItem(MIDI_IN_NAME_STORAGE_KEY2, selectedName);
          } else {
            localStorage2.removeItem(MIDI_IN_NAME_STORAGE_KEY2);
          }
          ports.service.selectInput(target.value);
          syncMidiInputConfigVisibility();
          ports.updateConnections();
        });
        bindSelect("midi-in-channel", (target) => {
          const nextChannel = normalizeMidiInputChannel(target.value, 0);
          target.value = String(nextChannel);
          state.midiInChannel = nextChannel;
          localStorage2.setItem(MIDI_IN_CHANNEL_STORAGE_KEY2, String(nextChannel));
        });
        bindSelect("midi-out", (target) => {
          localStorage2.setItem(MIDI_OUT_ID_STORAGE_KEY2, target.value);
          if (target.value !== "none") {
            const selectedName = target.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, "") || "MIDI Out";
            localStorage2.setItem(MIDI_OUT_NAME_STORAGE_KEY2, selectedName);
          } else {
            localStorage2.removeItem(MIDI_OUT_NAME_STORAGE_KEY2);
          }
          ports.updateConnections();
          syncMidiOutChannelVisibility();
          ports.syncRouting();
          ports.sendExpression();
        });
        bindSelect("midi-out-channel", (target) => {
          const nextChannel = normalizeMidiChannel(target.value, 1);
          target.value = String(nextChannel);
          state.midiOutChannel = nextChannel;
          localStorage2.setItem(MIDI_OUT_CHANNEL_STORAGE_KEY2, String(nextChannel));
          ports.syncRouting();
          ports.sendExpression();
        });
        if (ports.optionalLedEnabled)
          bindSelect("midi-lights-channel", (target) => {
            const nextChannel = normalizeMidiChannel(target.value, 1);
            target.value = String(nextChannel);
            state.midiLightsChannel = nextChannel;
            localStorage2.setItem(MIDI_LIGHTS_CHANNEL_STORAGE_KEY2, String(nextChannel));
            ports.wipeLed();
            ports.ledTest()?.stop({ statusText: getSelect("midi-lights")?.value === "none" ? "Select an LED MIDI device first." : "MIDI LED idle." });
            ports.renderKeyboard();
          });
        if (ports.optionalLedEnabled)
          bindSelect("midi-lights", (target) => {
            localStorage2.setItem(MIDI_LIGHTS_ID_STORAGE_KEY2, target.value);
            if (target.value !== "none") {
              const selectedName = target.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, "") || "LED MIDI";
              localStorage2.setItem(MIDI_LIGHTS_NAME_STORAGE_KEY2, selectedName);
            } else {
              localStorage2.removeItem(MIDI_LIGHTS_NAME_STORAGE_KEY2);
            }
            ports.wipeLed();
            ports.ledTest()?.stop({ statusText: target.value === "none" ? "Select an LED MIDI device first." : "MIDI LED idle." });
            ports.updateConnections();
            ports.renderKeyboard();
            ports.ledTest()?.syncControls();
          });
        const checkbox = document2.getElementById("check-midi-led-low-velocity");
        if (ports.optionalLedEnabled && checkbox instanceof HTMLInputElement) {
          checkbox.checked = !!state.midiLedLowVelocity;
          const listener = (event) => {
            if (!(event.target instanceof HTMLInputElement))
              return;
            state.midiLedLowVelocity = !!event.target.checked;
            setStoredBool(MIDI_LED_LOW_VELOCITY_STORAGE_KEY2, state.midiLedLowVelocity);
            if (state.ledOutputMode === "midi") {
              ports.wipeLed();
              ports.renderKeyboard();
            }
          };
          checkbox.addEventListener("change", listener);
          bindings.push(() => checkbox.removeEventListener("change", listener));
        }
      }
      function dispose() {
        for (const unbind of bindings.splice(0)) unbind();
        initialized = false;
      }
      function onReady() {
        ports.clearPermissionHelp();
        populateMidiChannelSelect("midi-in-channel", state.midiInChannel || 0, { includeAny: true });
        populateMidiChannelSelect("midi-out-channel", state.midiOutChannel || 1);
        populateMidiChannelSelect("midi-lights-channel", state.midiLightsChannel || 1);
        populateMIDIDevices();
        ports.refreshConnections();
        syncMidiInputConfigVisibility();
        syncMidiOutChannelVisibility();
      }
      function onDevicesChanged() {
        populateMIDIDevices();
        ports.refreshConnections();
        syncMidiInputConfigVisibility();
        syncMidiOutChannelVisibility();
        ports.syncRouting();
      }
      const getSelectedOutputId = () => getSelect("midi-out")?.value || "none";
      return {
        init,
        dispose,
        onReady,
        onDevicesChanged,
        populateMIDIDevices,
        populateMidiChannelSelect,
        syncMidiInputConfigVisibility,
        syncMidiOutChannelVisibility,
        getSelectedMidiInChannel,
        getSelectedMidiOutChannel,
        getSelectedMidiLightsChannel,
        getSelectedOutputId
      };
    }
    PianoTrainerMidiControls2.create = create;
  })(PianoTrainerMidiControls || (PianoTrainerMidiControls = {}));

  // src/ui/permission-help.ts
  function getUnknownErrorMessage(error) {
    return typeof error === "object" && error !== null && "message" in error ? error.message : void 0;
  }
  function isLikelyBrowserAccessIssue(err) {
    const message = String(getUnknownErrorMessage(err) || err || "").toLowerCase();
    return message.includes("failed to fetch") || message.includes("networkerror") || message.includes("load failed") || message.includes("blocked") || message.includes("mixed content") || message.includes("connection refused") || message.includes("cors");
  }
  function getMidiPermissionHelpText() {
    return "MIDI access appears blocked or unavailable. Allow MIDI/device access in your browser, then refresh. MIDI only works on the device running this browser.";
  }
  function getWledPermissionHelpText(kind = "wled") {
    if (kind === "helper") {
      return "DDP helper access failed. Allow local device access in your browser, then refresh. If access is already allowed, start the helper on this same device.";
    }
    return "Browser access to local devices may be blocked. Allow local network or local device access for this site, then refresh and try WLED again.";
  }
  function createPermissionHelp(document2) {
    function setPermissionNote(elementId, message) {
      const el = document2.getElementById(elementId);
      if (!el) return;
      const text = String(message || "").trim();
      el.textContent = text;
      el.classList.toggle("hidden", !text);
    }
    function showMidiPermissionHelp(message) {
      setPermissionNote("midi-permission-help", message || "");
    }
    function clearMidiPermissionHelp() {
      setPermissionNote("midi-permission-help", "");
    }
    function showWledPermissionHelp(message) {
      setPermissionNote("wled-permission-help", message || "");
    }
    function clearWledPermissionHelp() {
      setPermissionNote("wled-permission-help", "");
    }
    return { showMidiPermissionHelp, clearMidiPermissionHelp, showWledPermissionHelp, clearWledPermissionHelp };
  }

  // src/ui/playback-controls.ts
  var PianoTrainerPlaybackControls;
  ((PianoTrainerPlaybackControls2) => {
    function create(ports) {
      function input(id) {
        const element = ports.getElement(id);
        if (!(element instanceof HTMLInputElement)) throw new Error(`Missing required playback input: ${id}`);
        return element;
      }
      return {
        isLoopEnabled: () => input("check-looper").checked,
        isLoopEnabledAtEnd: () => {
          const element = ports.getElement("check-looper");
          return element instanceof HTMLInputElement && element.checked;
        },
        readLoopMin: () => parseInt(input("val-loop-min").value),
        readLoopMax: () => parseInt(input("val-loop-max").value),
        isMetronomeEnabled: () => {
          const element = ports.getElement("check-metronome");
          return element instanceof HTMLInputElement && element.checked;
        }
      };
    }
    PianoTrainerPlaybackControls2.create = create;
  })(PianoTrainerPlaybackControls || (PianoTrainerPlaybackControls = {}));

  // src/ui/player-range-controls.ts
  var PianoTrainerPlayerRangeControls;
  ((PianoTrainerPlayerRangeControls2) => {
    function create(ports) {
      const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
      let generation = 0, ownedSelect = null;
      function syncPlayerPianoTypeControl() {
        const select = getPlayerPianoTypeSelect();
        if (select) {
          select.value = String(state.playerPianoType);
        }
        const label = ports.document.getElementById("player-piano-range-label");
        if (label) {
          const range = ports.getRange();
          label.textContent = `Playable Range: MIDI ${range.minMidi}\u2013${range.maxMidi}`;
        }
      }
      function refreshPlayerRangeDependentState() {
        state.expectedNotes = state.expectedNotes.filter((note) => ports.inRange(note.midi));
        state.visualNotesToStart = state.visualNotesToStart.filter((note) => ports.inRange(note.midi));
        state.sustainedVisuals = state.sustainedVisuals.filter((note) => ports.inRange(note.midi));
        state.outOfRangeCurrentNotes = state.outOfRangeCurrentNotes.filter((note) => !ports.inRange(note.midi));
        state.heldCorrectNotes.forEach((staffId, midi) => {
          if (!ports.inRange(midi)) {
            state.heldCorrectNotes.delete(midi);
          }
        });
        ports.led.refreshMapping();
        ports.led.invalidate();
        ports.led.renderOutputs();
      }
      function setPlayerPianoType(value, { save = true, rerender = true } = {}) {
        state.playerPianoType = ports.normalize(value);
        state.playerRange = ports.derive(state.playerPianoType);
        if (save) {
          ports.save(String(state.playerPianoType));
        }
        syncPlayerPianoTypeControl();
        refreshPlayerRangeDependentState();
        state.ledPreviewTimelineDirty = true;
        state.lastLedPreviewEvents = [];
        state.ledPreviewTraversalIndex = -1;
        if (rerender) {
          ports.renderKeyboard();
        }
      }
      function initPlayerPianoTypeControl() {
        const saved = ports.readSaved();
        setPlayerPianoType(saved ?? 88, { save: false, rerender: false });
        const select = getPlayerPianoTypeSelect();
        if (select && !select.dataset.boundPlayerRange) {
          select.dataset.boundPlayerRange = "true";
          select.value = String(state.playerPianoType);
          const token = generation;
          ownedSelect = select;
          dom.on(select, "change", (e) => {
            if (token === generation && e.target instanceof HTMLSelectElement)
              setPlayerPianoType(e.target.value);
          });
        }
        syncPlayerPianoTypeControl();
      }
      function getPlayerPianoTypeSelect() {
        const select = ports.document.getElementById("select-player-piano-type");
        return select instanceof HTMLSelectElement ? select : null;
      }
      function dispose() {
        generation++;
        dom.dispose();
        if (ownedSelect?.dataset.boundPlayerRange === "true")
          delete ownedSelect.dataset.boundPlayerRange;
        ownedSelect = null;
      }
      return { init: initPlayerPianoTypeControl, dispose, setPlayerPianoType, syncPlayerPianoTypeControl, refreshPlayerRangeDependentState };
    }
    PianoTrainerPlayerRangeControls2.create = create;
  })(PianoTrainerPlayerRangeControls || (PianoTrainerPlayerRangeControls = {}));

  // src/ui/practice-controls.ts
  var PianoTrainerPracticeControls;
  ((PianoTrainerPracticeControls2) => {
    function create(ports) {
      const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
      let futureInitialized = false, modeInitialized = false, routingInitialized = false, generation = 0;
      let ownedHighlight = null;
      function onInput(target, handler) {
        const token = generation;
        dom.onInput(target, "change", (input) => {
          if (token === generation) handler(input);
        });
      }
      function syncTrainerRoutingUiState() {
        const hasMidiOut = !!ports.getSelectedMidiOutOutput();
        const summary = dom.element("trainer-midi-out-summary");
        const midiOutCard = dom.element("trainer-midiout-card");
        const summaryHint = dom.element("trainer-midi-out-summary-hint");
        if (summary) {
          if (hasMidiOut) {
            const outName = dom.optionalSelect("midi-out")?.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, "") || "MIDI Out";
            summary.textContent = `Send playback and input to ${outName}.`;
            summary.classList.remove("is-disabled");
            summaryHint?.classList.add("hidden");
          } else {
            summary.textContent = "No MIDI device selected.";
            summary.classList.add("is-disabled");
            summaryHint?.classList.remove("hidden");
          }
        }
        midiOutCard?.classList.toggle("is-disabled", !hasMidiOut);
        const midiOutVolumeSlider = dom.optionalInput("slider-midiout-vol");
        const midiOutVolumeInput = dom.optionalInput("val-midiout-vol");
        if (midiOutVolumeSlider) midiOutVolumeSlider.disabled = !hasMidiOut;
        if (midiOutVolumeInput) midiOutVolumeInput.disabled = !hasMidiOut;
        ["enable-midiout-hand-staves", "enable-midiout-other", "enable-midiout-instrument", "enable-midiout-virtual-keyboard"].forEach((id) => {
          const input = dom.optionalInput(id);
          if (!input) return;
          const shouldDisable = !hasMidiOut;
          input.disabled = shouldDisable;
          input.closest("label")?.classList.toggle("is-disabled", shouldDisable);
        });
        ports.syncTempoMetronomeDependentUi();
      }
      function applyModeSettings() {
        ports.applyToneLatencyProfileForMode();
        const isWait = state.mode === "wait";
        const isFollow = state.mode === "follow";
        ports.routing.syncActiveHandStateFromMode();
        const practiceLeftToggle = dom.optionalInput("practice-lh");
        const practiceRightToggle = dom.optionalInput("practice-rh");
        const playbackLeftToggle = dom.optionalInput("enable-staff-lh");
        const playbackRightToggle = dom.optionalInput("enable-staff-rh");
        const audioHandsToggle = dom.optionalInput("enable-hand-staves");
        const otherAudioToggle = dom.optionalInput("enable-other");
        const midiOutHandsToggle = dom.optionalInput("enable-midiout-hand-staves");
        const midiOutOtherToggle = dom.optionalInput("enable-midiout-other");
        const playbackRow = ports.document.querySelector(".practice-playback-row");
        const waitNoteRow = dom.element("practice-wait-note-row");
        const waitNote = dom.element("practice-wait-note");
        const lowLatencyPlaybackCheckbox = dom.optionalInput("check-low-latency-playback");
        if (practiceLeftToggle) practiceLeftToggle.checked = state.practice.left;
        if (practiceRightToggle) practiceRightToggle.checked = state.practice.right;
        if (playbackLeftToggle) playbackLeftToggle.checked = state.playback.left;
        if (playbackRightToggle) playbackRightToggle.checked = state.playback.right;
        if (lowLatencyPlaybackCheckbox) lowLatencyPlaybackCheckbox.checked = !!state.lowLatencyPlaybackEnabled;
        if (practiceLeftToggle) {
          practiceLeftToggle.disabled = false;
          practiceLeftToggle.closest("label")?.classList.toggle("is-disabled", false);
        }
        if (practiceRightToggle) {
          practiceRightToggle.disabled = false;
          practiceRightToggle.closest("label")?.classList.toggle("is-disabled", false);
        }
        const playbackDisabled = isWait || isFollow;
        if (playbackLeftToggle) {
          playbackLeftToggle.disabled = playbackDisabled;
          playbackLeftToggle.closest("label")?.classList.toggle("is-disabled", playbackDisabled);
        }
        if (playbackRightToggle) {
          playbackRightToggle.disabled = playbackDisabled;
          playbackRightToggle.closest("label")?.classList.toggle("is-disabled", playbackDisabled);
        }
        playbackRow?.classList.toggle("is-disabled", playbackDisabled);
        if (audioHandsToggle) {
          audioHandsToggle.disabled = false;
          audioHandsToggle.closest("label")?.classList.toggle("is-disabled", false);
        }
        if (otherAudioToggle) otherAudioToggle.disabled = isWait;
        if (midiOutHandsToggle) {
          const disableMidiOutHands = !ports.getSelectedMidiOutOutput();
          midiOutHandsToggle.disabled = disableMidiOutHands;
          midiOutHandsToggle.closest("label")?.classList.toggle("is-disabled", disableMidiOutHands);
        }
        if (midiOutOtherToggle) midiOutOtherToggle.disabled = isWait || !ports.getSelectedMidiOutOutput();
        let modeNote = "";
        if (isWait) modeNote = "Audio playback is unavailable in Wait mode.";
        else if (isFollow) modeNote = "Playback is automatically set to the opposite hand in Follow Me.";
        waitNoteRow?.classList.toggle("is-hidden", !modeNote);
        waitNoteRow?.classList.toggle("is-disabled-context", playbackDisabled && !!modeNote);
        if (waitNote) {
          waitNote.textContent = modeNote;
          waitNote.classList.toggle("is-disabled", !modeNote);
        }
        syncTrainerRoutingUiState();
      }
      function syncLowLatencyPlaybackPreferenceUi() {
        const checkbox = dom.optionalInput("check-low-latency-playback");
        if (checkbox) checkbox.checked = !!state.lowLatencyPlaybackEnabled;
      }
      function initFuturePreview() {
        if (futureInitialized) return;
        const checkbox = dom.optionalInput("check-future-preview");
        if (!checkbox) return;
        futureInitialized = true;
        const select = dom.optionalSelect("select-future-depth");
        if (select?.parentNode) select.parentNode.removeChild(select);
        state.futurePreviewDepth = 1;
        checkbox.checked = state.futurePreviewEnabled;
        onInput(checkbox, (input) => {
          state.futurePreviewEnabled = input.checked;
          state.futurePreviewDepth = 1;
          ports.saveBool("futurePreview", state.futurePreviewEnabled);
          state.lastLedPreviewEvents = [];
          ports.renderKeyboard();
        });
        const highlight = dom.optionalInput("check-correct-highlight");
        if (highlight) {
          highlight.checked = state.correctHighlightEnabled;
          if (!highlight.dataset.boundCorrectHighlight) {
            highlight.dataset.boundCorrectHighlight = "true";
            ownedHighlight = highlight;
            onInput(highlight, (input) => {
              state.correctHighlightEnabled = input.checked;
              ports.saveBool("correctHighlight", state.correctHighlightEnabled);
              ports.renderKeyboard();
            });
          }
        }
      }
      function initModeAndFeedback() {
        if (modeInitialized) return;
        modeInitialized = true;
        onInput(dom.input("check-keyboard"), (input) => {
          const container = dom.element("virtual-keyboard-container");
          if (!container) throw Error("Missing required trainer control: virtual-keyboard-container");
          ports.saveBool("keyboard", input.checked);
          if (input.checked) {
            container.classList.remove("hidden");
            ports.renderKeyboard();
          } else container.classList.add("hidden");
          ports.positionCalibrationPanel();
          ports.dispatchResize();
        });
        onInput(dom.input("check-feedback"), (input) => {
          state.feedbackEnabled = input.checked;
          ports.saveBool("feedback", state.feedbackEnabled);
          if (!input.checked) ports.clearSvgFeedback();
          else ports.renderFeedbackOverlay();
          ports.syncSettingsDebugVisibility();
        });
        for (const radio of ports.document.querySelectorAll('input[name="practice-mode"]')) {
          if (!(radio instanceof HTMLInputElement)) throw Error("Invalid trainer control: practice-mode");
          onInput(radio, (input) => {
            if (!input.checked) return;
            const nextMode = input.value;
            if (state.isPlaying || state.countInActive) ports.pause();
            state.mode = nextMode;
            ports.saveMode(state.mode);
            ports.clearScheduledMetronomeEvents();
            ports.stopWaitModeMetronome();
            ports.silencePlaybackOutputsImmediately();
            ports.clearTransientPlaybackState({ clearVisualState: true });
            applyModeSettings();
            ports.applyToneLatencyProfileForMode();
            ports.updatePianoVolume(ports.readPianoVolume());
            ports.updateMetroVolume(ports.readMetroVolume());
          });
        }
      }
      function initRouting() {
        if (routingInitialized) return;
        routingInitialized = true;
        onInput(dom.optionalInput("check-autoscroll"), (input) => ports.saveBool("autoScroll", input.checked));
        onInput(dom.optionalInput("check-fullscreen-on-play"), (input) => {
          state.fullscreenOnPlay = input.checked;
          ports.saveBool("fullscreenOnPlay", state.fullscreenOnPlay);
        });
        const latency = dom.optionalInput("check-low-latency-playback");
        if (latency) {
          syncLowLatencyPlaybackPreferenceUi();
          onInput(latency, (input) => {
            state.lowLatencyPlaybackEnabled = input.checked;
            ports.saveBool("lowLatencyPlayback", state.lowLatencyPlaybackEnabled);
            if (!state.lowLatencyPlaybackEnabled) ports.releaseLowLatencyPlayback();
          });
        }
        for (const side of ["left", "right"]) {
          onInput(dom.input(side === "left" ? "practice-lh" : "practice-rh"), (input) => {
            if (state.mode === "follow") {
              if (!input.checked) {
                input.checked = true;
                return;
              }
              ports.routing.setFollowPracticeHand(side);
              applyModeSettings();
              return;
            }
            const settings = ports.routing.getCurrentModeSettings();
            settings.practice[side] = input.checked;
            ports.routing.syncActiveHandStateFromMode();
          });
        }
        for (const side of ["left", "right"]) {
          onInput(dom.optionalInput(side === "left" ? "enable-staff-lh" : "enable-staff-rh"), (input) => {
            if (state.mode === "follow" || state.mode === "wait") {
              input.checked = state.playback[side];
              return;
            }
            const settings = ports.routing.getCurrentModeSettings();
            settings.playback[side] = input.checked;
            ports.routing.syncActiveHandStateFromMode();
          });
        }
        const audioControls = [
          ["enable-hand-staves", "hands", "audioHands"],
          ["enable-other", "other", "audioOther"],
          ["enable-instrument", "instrument", "audioInstrument"],
          ["enable-virtual-keyboard", "virtual", "audioVirtual"]
        ];
        for (const [id, field, key] of audioControls) onInput(dom.optionalInput(id), (input) => {
          state.audioEnabled[field] = input.checked;
          ports.saveBool(key, state.audioEnabled[field]);
          if (field === "instrument") ports.syncMidiInBoostUi();
        });
        const midiControls = [
          ["enable-midiout-hand-staves", "hands", "midiOutHands"],
          ["enable-midiout-other", "other", "midiOutOther"],
          ["enable-midiout-instrument", "instrument", "midiOutInstrument"],
          ["enable-midiout-virtual-keyboard", "virtual", "midiOutVirtual"]
        ];
        for (const [id, field, key] of midiControls) onInput(dom.optionalInput(id), (input) => {
          state.midiOutEnabled[field] = input.checked;
          ports.saveBool(key, state.midiOutEnabled[field]);
        });
      }
      function init() {
        initFuturePreview();
        initModeAndFeedback();
        initRouting();
      }
      function dispose() {
        generation++;
        dom.dispose();
        futureInitialized = false;
        modeInitialized = false;
        routingInitialized = false;
        if (ownedHighlight?.dataset.boundCorrectHighlight === "true") delete ownedHighlight.dataset.boundCorrectHighlight;
        ownedHighlight = null;
      }
      return {
        init,
        initFuturePreview,
        initModeAndFeedback,
        initRouting,
        dispose,
        applyModeSettings,
        syncTrainerRoutingUiState,
        syncLowLatencyPlaybackPreferenceUi
      };
    }
    PianoTrainerPracticeControls2.create = create;
  })(PianoTrainerPracticeControls || (PianoTrainerPracticeControls = {}));

  // src/ui/preference-controls.ts
  var PianoTrainerPreferenceControls;
  ((PianoTrainerPreferenceControls2) => {
    function create(ports) {
      const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
      function applyPersistedTrainerAndSettingsPreferences() {
        state.mode = ports.storage.getItem(ports.keys.TRAINER_MODE_STORAGE_KEY) || "realtime";
        state.feedbackEnabled = ports.getStoredBool(ports.keys.TRAINER_FEEDBACK_STORAGE_KEY, true);
        state.futurePreviewEnabled = ports.getStoredBool(ports.keys.TRAINER_FUTURE_PREVIEW_STORAGE_KEY, true);
        state.futurePreviewDepth = 1;
        state.correctHighlightEnabled = ports.getStoredBool(ports.keys.TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY, true);
        ports.syncActiveHandStateFromMode();
        state.audioEnabled.hands = ports.getStoredBool(ports.keys.TRAINER_AUDIO_HANDS_STORAGE_KEY, true);
        state.audioEnabled.other = ports.getStoredBool(ports.keys.TRAINER_AUDIO_OTHER_STORAGE_KEY, false);
        state.audioEnabled.instrument = ports.getStoredBool(ports.keys.TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY, false);
        state.audioEnabled.virtual = ports.getStoredBool(ports.keys.TRAINER_AUDIO_VIRTUAL_STORAGE_KEY, true);
        state.midiOutEnabled.hands = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_HANDS_STORAGE_KEY, false);
        state.midiOutEnabled.other = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_OTHER_STORAGE_KEY, false);
        state.midiOutEnabled.instrument = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY, false);
        state.midiOutEnabled.virtual = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY, false);
        state.midiOutVolume = ports.getClampedNumber(ports.keys.TRAINER_MIDIOUT_VOL_STORAGE_KEY, 0, 100, 65);
        state.midiInBoost = ports.getClampedNumber(ports.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100);
        state.inputVelocityEnabled = true;
        state.liveLowLatencyMonitoringEnabled = true;
        ports.setStoredBool(ports.keys.TRAINER_INPUT_VELOCITY_STORAGE_KEY, true);
        ports.setStoredBool(ports.keys.TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY, true);
        state.visualPulseEnabled = ports.getStoredBool(ports.keys.VISUAL_PULSE_STORAGE_KEY, true);
        state.accentedDownbeatEnabled = ports.getStoredBool(ports.keys.ACCENTED_DOWNBEAT_STORAGE_KEY, true);
        state.loopCountInEnabled = ports.getStoredBool(ports.keys.LOOP_COUNT_IN_STORAGE_KEY, true);
        state.metronomeMidiOutEnabled = ports.getStoredBool(ports.keys.METRONOME_MIDIOUT_STORAGE_KEY, false);
        const realtimeRadio = dom.optionalInput("mode-realtime");
        const waitRadio = dom.optionalInput("mode-wait");
        const followRadio = dom.optionalInput("mode-follow");
        if (state.mode === "wait") {
          if (waitRadio) waitRadio.checked = true;
        } else if (state.mode === "follow") {
          if (followRadio) followRadio.checked = true;
        } else {
          if (realtimeRadio) realtimeRadio.checked = true;
        }
        const feedbackCheckbox = dom.optionalInput("check-feedback");
        if (feedbackCheckbox) feedbackCheckbox.checked = state.feedbackEnabled;
        const futurePreviewCheckbox = dom.optionalInput("check-future-preview");
        if (futurePreviewCheckbox) futurePreviewCheckbox.checked = state.futurePreviewEnabled;
        const correctHighlightCheckbox = dom.optionalInput("check-correct-highlight");
        if (correctHighlightCheckbox) correctHighlightCheckbox.checked = state.correctHighlightEnabled;
        const practiceLeftCheckbox = dom.optionalInput("practice-lh");
        if (practiceLeftCheckbox) practiceLeftCheckbox.checked = state.practice.left;
        const practiceRightCheckbox = dom.optionalInput("practice-rh");
        if (practiceRightCheckbox) practiceRightCheckbox.checked = state.practice.right;
        const playbackLeftCheckbox = dom.optionalInput("enable-staff-lh");
        if (playbackLeftCheckbox) playbackLeftCheckbox.checked = state.playback.left;
        const playbackRightCheckbox = dom.optionalInput("enable-staff-rh");
        if (playbackRightCheckbox) playbackRightCheckbox.checked = state.playback.right;
        const audioHandsCheckbox = dom.optionalInput("enable-hand-staves");
        if (audioHandsCheckbox) audioHandsCheckbox.checked = state.audioEnabled.hands;
        const audioOtherCheckbox = dom.optionalInput("enable-other");
        if (audioOtherCheckbox) audioOtherCheckbox.checked = state.audioEnabled.other;
        const audioInstrumentCheckbox = dom.optionalInput("enable-instrument");
        if (audioInstrumentCheckbox) audioInstrumentCheckbox.checked = state.audioEnabled.instrument;
        ports.syncMidiInBoostUi();
        const audioVirtualCheckbox = dom.optionalInput("enable-virtual-keyboard");
        if (audioVirtualCheckbox) audioVirtualCheckbox.checked = state.audioEnabled.virtual;
        const midiOutHandsCheckbox = dom.optionalInput("enable-midiout-hand-staves");
        if (midiOutHandsCheckbox) midiOutHandsCheckbox.checked = state.midiOutEnabled.hands;
        const midiOutOtherCheckbox = dom.optionalInput("enable-midiout-other");
        if (midiOutOtherCheckbox) midiOutOtherCheckbox.checked = state.midiOutEnabled.other;
        const midiOutInstrumentCheckbox = dom.optionalInput("enable-midiout-instrument");
        if (midiOutInstrumentCheckbox) midiOutInstrumentCheckbox.checked = state.midiOutEnabled.instrument;
        const midiOutVirtualCheckbox = dom.optionalInput("enable-midiout-virtual-keyboard");
        if (midiOutVirtualCheckbox) midiOutVirtualCheckbox.checked = state.midiOutEnabled.virtual;
        const pianoVolume = ports.getClampedNumber(ports.keys.TRAINER_PIANO_VOL_STORAGE_KEY, 0, 100, 80);
        ports.updatePianoVolume(pianoVolume);
        const midiOutVolume = ports.getClampedNumber(ports.keys.TRAINER_MIDIOUT_VOL_STORAGE_KEY, 0, 100, 65);
        ports.updateMidiOutVolume(midiOutVolume, { save: false });
        const midiInBoost = ports.getClampedNumber(ports.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100);
        ports.updateMidiInBoost(midiInBoost, { save: false });
        const zoomPercent = ports.getClampedNumber(ports.keys.TRAINER_ZOOM_STORAGE_KEY, 50, 150, 100);
        if (ports.storage.getItem(ports.keys.TRAINER_ZOOM_STORAGE_KEY) === null || ports.storage.getItem(ports.keys.TRAINER_ZOOM_STORAGE_KEY) === "") {
          ports.storage.setItem(ports.keys.TRAINER_ZOOM_STORAGE_KEY, String(zoomPercent));
        }
        ports.syncZoomControls(zoomPercent);
        ports.applyZoom(zoomPercent, { save: false });
        const autoScrollCheckbox = dom.optionalInput("check-autoscroll");
        if (autoScrollCheckbox) autoScrollCheckbox.checked = ports.getStoredBool(ports.keys.TRAINER_AUTOSCROLL_STORAGE_KEY, true);
        const keyboardCheckbox = dom.optionalInput("check-keyboard");
        const keyboardVisible = ports.getStoredBool(ports.keys.TRAINER_KEYBOARD_STORAGE_KEY, true);
        if (keyboardCheckbox) keyboardCheckbox.checked = keyboardVisible;
        const keyboardContainer = dom.element("virtual-keyboard-container");
        if (keyboardContainer) keyboardContainer.classList.toggle("hidden", !keyboardVisible);
        state.fullscreenOnPlay = ports.getStoredBool(ports.keys.TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY, false);
        const fullscreenOnPlayCheckbox = dom.optionalInput("check-fullscreen-on-play");
        if (fullscreenOnPlayCheckbox) fullscreenOnPlayCheckbox.checked = state.fullscreenOnPlay;
        ports.syncFullscreenUi();
        const debugEnabled = ports.getStoredBool(ports.keys.SETTINGS_DEBUG_STORAGE_KEY, false);
        ports.setDebugEnabled(debugEnabled, { clearHistory: !debugEnabled, logChange: false, reason: "startup-persisted" });
        const visualPulseCheckbox = dom.optionalInput("check-visual-pulse");
        if (visualPulseCheckbox) visualPulseCheckbox.checked = state.visualPulseEnabled;
        const accentedDownbeatCheckbox = dom.optionalInput("check-accented-downbeat");
        if (accentedDownbeatCheckbox) accentedDownbeatCheckbox.checked = state.accentedDownbeatEnabled;
        const loopCountInCheckbox = dom.optionalInput("check-loop-countin");
        if (loopCountInCheckbox) loopCountInCheckbox.checked = state.loopCountInEnabled;
        const metronomeMidiOutCheckbox = dom.optionalInput("check-metronome-midiout");
        if (metronomeMidiOutCheckbox) metronomeMidiOutCheckbox.checked = state.metronomeMidiOutEnabled;
        const metronomeVolume = ports.getClampedNumber(ports.keys.METRONOME_VOL_STORAGE_KEY, 0, 100, 25);
        ports.updateMetroVolume(metronomeVolume, { save: false });
      }
      function restoreDefaultPreferences({ reloadDevices = true } = {}) {
        ports.clearSavedPreferences();
        state.mode = "realtime";
        const realtimeRadio = dom.optionalInput("mode-realtime");
        const waitRadio = dom.optionalInput("mode-wait");
        if (realtimeRadio) realtimeRadio.checked = true;
        if (waitRadio) waitRadio.checked = false;
        state.feedbackEnabled = true;
        const feedbackCheckbox = dom.optionalInput("check-feedback");
        if (feedbackCheckbox) feedbackCheckbox.checked = true;
        state.futurePreviewEnabled = true;
        const futurePreviewCheckbox = dom.optionalInput("check-future-preview");
        if (futurePreviewCheckbox) futurePreviewCheckbox.checked = true;
        state.correctHighlightEnabled = true;
        const correctHighlightCheckbox = dom.optionalInput("check-correct-highlight");
        if (correctHighlightCheckbox) correctHighlightCheckbox.checked = true;
        state.futurePreviewDepth = 1;
        state.modeSettings.realtime = { practice: { left: true, right: true }, playback: { left: true, right: true } };
        state.modeSettings.wait = { practice: { left: true, right: true }, playback: { left: false, right: false } };
        state.modeSettings.follow = { practice: { left: false, right: true }, playback: { left: true, right: false } };
        ports.syncActiveHandStateFromMode();
        const practiceLeftCheckbox = dom.optionalInput("practice-lh");
        if (practiceLeftCheckbox) practiceLeftCheckbox.checked = true;
        const practiceRightCheckbox = dom.optionalInput("practice-rh");
        if (practiceRightCheckbox) practiceRightCheckbox.checked = true;
        state.audioEnabled.hands = true;
        state.audioEnabled.other = false;
        state.audioEnabled.instrument = false;
        state.audioEnabled.virtual = true;
        const playbackLeftCheckbox = dom.optionalInput("enable-staff-lh");
        if (playbackLeftCheckbox) playbackLeftCheckbox.checked = state.playback.left;
        const playbackRightCheckbox = dom.optionalInput("enable-staff-rh");
        if (playbackRightCheckbox) playbackRightCheckbox.checked = state.playback.right;
        const audioHandsCheckbox = dom.optionalInput("enable-hand-staves");
        if (audioHandsCheckbox) audioHandsCheckbox.checked = true;
        const audioOtherCheckbox = dom.optionalInput("enable-other");
        if (audioOtherCheckbox) audioOtherCheckbox.checked = false;
        const audioInstrumentCheckbox = dom.optionalInput("enable-instrument");
        if (audioInstrumentCheckbox) audioInstrumentCheckbox.checked = false;
        const audioVirtualCheckbox = dom.optionalInput("enable-virtual-keyboard");
        if (audioVirtualCheckbox) audioVirtualCheckbox.checked = true;
        ports.updateMidiInBoost(ports.getClampedNumber(ports.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100));
        ports.syncMidiInBoostUi();
        state.midiOutEnabled.hands = false;
        state.midiOutEnabled.other = false;
        state.midiOutEnabled.instrument = false;
        state.midiOutEnabled.virtual = false;
        const midiOutHandsCheckbox = dom.optionalInput("enable-midiout-hand-staves");
        if (midiOutHandsCheckbox) midiOutHandsCheckbox.checked = false;
        const midiOutOtherCheckbox = dom.optionalInput("enable-midiout-other");
        if (midiOutOtherCheckbox) midiOutOtherCheckbox.checked = false;
        const midiOutInstrumentCheckbox = dom.optionalInput("enable-midiout-instrument");
        if (midiOutInstrumentCheckbox) midiOutInstrumentCheckbox.checked = false;
        const midiOutVirtualCheckbox = dom.optionalInput("enable-midiout-virtual-keyboard");
        if (midiOutVirtualCheckbox) midiOutVirtualCheckbox.checked = false;
        ports.updatePianoVolume(80);
        ports.setScoreLayout("traditional");
        ports.applyZoom(100);
        const autoScrollCheckbox = dom.optionalInput("check-autoscroll");
        if (autoScrollCheckbox) autoScrollCheckbox.checked = true;
        const keyboardCheckbox = dom.optionalInput("check-keyboard");
        if (keyboardCheckbox) keyboardCheckbox.checked = true;
        const keyboardContainer = dom.element("virtual-keyboard-container");
        if (keyboardContainer) keyboardContainer.classList.remove("hidden");
        state.visualPulseEnabled = true;
        const visualPulseCheckbox = dom.optionalInput("check-visual-pulse");
        if (visualPulseCheckbox) visualPulseCheckbox.checked = true;
        state.accentedDownbeatEnabled = true;
        const accentedDownbeatCheckbox = dom.optionalInput("check-accented-downbeat");
        if (accentedDownbeatCheckbox) accentedDownbeatCheckbox.checked = true;
        state.loopCountInEnabled = true;
        const loopCountInCheckbox = dom.optionalInput("check-loop-countin");
        if (loopCountInCheckbox) loopCountInCheckbox.checked = true;
        state.metronomeMidiOutEnabled = false;
        const metronomeMidiOutCheckbox = dom.optionalInput("check-metronome-midiout");
        if (metronomeMidiOutCheckbox) metronomeMidiOutCheckbox.checked = false;
        ports.updateMetroVolume(25, { save: true });
        ports.syncTempoMetronomeDependentUi();
        ports.setDebugEnabled(false, { clearHistory: true, logChange: false, reason: "reset-defaults" });
        ports.setPlayerPianoType(88);
        ports.resetLedPreferences();
        const midiInSelect = dom.optionalSelect("midi-in");
        if (midiInSelect) {
          midiInSelect.value = "none";
          midiInSelect.dispatchEvent(new Event("change"));
        }
        const midiOutSelect = dom.optionalSelect("midi-out");
        if (midiOutSelect) {
          midiOutSelect.value = "none";
          midiOutSelect.dispatchEvent(new Event("change"));
        }
        const midiOutChannelSelect = dom.optionalSelect("midi-out-channel");
        if (midiOutChannelSelect) {
          midiOutChannelSelect.value = "1";
          midiOutChannelSelect.dispatchEvent(new Event("change"));
        }
        const midiLightsSelect = dom.optionalSelect("midi-lights");
        if (midiLightsSelect) {
          midiLightsSelect.value = "none";
          midiLightsSelect.dispatchEvent(new Event("change"));
        }
        const midiLightsChannelSelect = dom.optionalSelect("midi-lights-channel");
        if (midiLightsChannelSelect) {
          midiLightsChannelSelect.value = "1";
          midiLightsChannelSelect.dispatchEvent(new Event("change"));
        }
        const defaults = ports.getDefaultStaffAssignment();
        const assignLeft = dom.optionalSelect("assign-lh");
        if (assignLeft) assignLeft.value = PianoTrainerHandRouting.formatAssignment(defaults.left);
        const assignRight = dom.optionalSelect("assign-rh");
        if (assignRight) assignRight.value = PianoTrainerHandRouting.formatAssignment(defaults.right);
        ports.syncHandAssignmentFromControls();
        ports.applyModeSettings();
        ports.syncLedPreferenceControls();
        ports.renderLooper();
        ports.renderVirtualKeyboard();
        ports.positionCalibrationPanel();
        if (reloadDevices) {
          ports.populateMIDIDevices();
        }
      }
      return { applyPersistedTrainerAndSettingsPreferences, restoreDefaultPreferences };
    }
    PianoTrainerPreferenceControls2.create = create;
  })(PianoTrainerPreferenceControls || (PianoTrainerPreferenceControls = {}));

  // src/ui/score-file-controls.ts
  var PianoTrainerScoreFileControls;
  ((PianoTrainerScoreFileControls2) => {
    function create(ports) {
      let initialized = false;
      function openScoreFilePicker() {
        ports.resumeAudio();
        ports.input.click();
      }
      async function handleDirectScoreFileSelection(file) {
        if (!file) return;
        const converter = ports.getConverter();
        if (converter && typeof converter.isConverterImportFileName === "function" && converter.isConverterImportFileName(file.name || "")) {
          const converted = await converter.convertFileToScore(file);
          await ports.load(converted.rawData, converted);
          ports.closeDrawer();
          return;
        }
        const scoreFile = await ports.readFile(file);
        await ports.load(scoreFile.rawData, scoreFile);
        ports.closeDrawer();
      }
      async function onChange(event) {
        if (!(event.target instanceof HTMLInputElement)) return;
        const input = event.target;
        const file = input.files?.[0];
        try {
          await handleDirectScoreFileSelection(file);
        } finally {
          input.value = "";
        }
      }
      function init() {
        if (!initialized) {
          initialized = true;
          ports.input.addEventListener("change", onChange);
        }
      }
      function dispose() {
        if (initialized) {
          initialized = false;
          ports.input.removeEventListener("change", onChange);
        }
      }
      return { init, dispose, openScoreFilePicker, handleDirectScoreFileSelection };
    }
    PianoTrainerScoreFileControls2.create = create;
  })(PianoTrainerScoreFileControls || (PianoTrainerScoreFileControls = {}));

  // src/ui/score-file-reader.ts
  var PianoTrainerScoreFileReader;
  ((PianoTrainerScoreFileReader2) => {
    function create(ports) {
      const pending = /* @__PURE__ */ new Set();
      function readFile(file, binary, failureMessage, build) {
        return new Promise((resolve, reject) => {
          const reader = ports.createReader();
          pending.add(reader);
          reader.onerror = () => {
            pending.delete(reader);
            reject(reader.error || new Error(failureMessage));
          };
          reader.onabort = () => {
            pending.delete(reader);
            reject(new DOMException("Score file read aborted.", "AbortError"));
          };
          reader.onload = () => {
            pending.delete(reader);
            resolve(build(reader.result));
          };
          if (binary) reader.readAsArrayBuffer(file);
          else reader.readAsText(file);
        });
      }
      function readScoreFile(file) {
        return readFile(file, !!(file.name || "").match(/\.(mxl)$/i), "Could not read score file.", (rawData) => ({
          rawData,
          fileName: file.name || "Untitled Score",
          fileType: ports.format.getScoreFileTypeFromName(file.name || ""),
          title: ports.format.getScoreDisplayTitle(file.name || "")
        }));
      }
      function readArrayBuffer(file) {
        return readFile(file, true, "Could not read that file.", (result) => result);
      }
      function dispose() {
        for (const reader of pending) reader.abort();
        pending.clear();
      }
      return { readScoreFile, readArrayBuffer, dispose };
    }
    PianoTrainerScoreFileReader2.create = create;
  })(PianoTrainerScoreFileReader || (PianoTrainerScoreFileReader = {}));

  // src/ui/score-seek-controls.ts
  var PianoTrainerScoreSeekControls;
  ((PianoTrainerScoreSeekControls2) => {
    function create(ports) {
      const dom = PianoTrainerControlDom.create(ports.document);
      let initialized = false, generation = 0;
      function init() {
        if (initialized) return;
        const node = dom.element("canvas-wrapper");
        if (!node) throw Error("Missing required trainer control: canvas-wrapper");
        initialized = true;
        const token = generation;
        dom.on(node, "click", (event) => {
          if (token === generation && event instanceof MouseEvent) ports.seek(event.clientX, event.clientY);
        });
      }
      function dispose() {
        generation++;
        initialized = false;
        dom.dispose();
      }
      return { init, dispose };
    }
    PianoTrainerScoreSeekControls2.create = create;
  })(PianoTrainerScoreSeekControls || (PianoTrainerScoreSeekControls = {}));

  // src/ui/score-status.ts
  var PianoTrainerScoreStatus;
  ((PianoTrainerScoreStatus2) => {
    function create(document2, getScore) {
      const dom = PianoTrainerControlDom.create(document2);
      function update() {
        const score = getScore();
        const total = score.correct + score.wrong;
        let percentage = 100;
        if (total > 0) percentage = Math.round(score.correct / total * 100);
        const node = dom.element("live-score");
        if (!node) throw Error("Missing required trainer control: live-score");
        node.innerText = `${percentage}%`;
      }
      return { update };
    }
    PianoTrainerScoreStatus2.create = create;
  })(PianoTrainerScoreStatus || (PianoTrainerScoreStatus = {}));

  // src/ui/scores-drawer.ts
  var PianoTrainerScoresDrawer;
  ((PianoTrainerScoresDrawer2) => {
    function create(ports) {
      const document2 = ports.document;
      const state = ports.state;
      const { createFoldersLibraryToolbar, createFolderListRow, createScoresLibraryToolbar, createScoreRow } = ports.rows;
      const { getFilteredLibraryScores } = PianoTrainerLibraryView;
      const { isScoreLibraryManageMode } = ports.selection;
      const { getScoreLibraryFolderLabel } = ports;
      function appendEmptyMessage(empty, folderId, folders) {
        if (folderId === "__all__") {
          empty.textContent = "No saved scores yet. Add files to the library or save the current score.";
          return;
        }
        const name = document2.createElement("span");
        name.textContent = getScoreLibraryFolderLabel(folderId, folders);
        if (folderId && folderId !== "__all__" && folderId !== "__unfiled__") name.setAttribute("data-i18n-skip", "");
        empty.append("No scores in ", name, " yet.");
      }
      function optional(id, type) {
        const node = document2.getElementById(id);
        if (node && !(node instanceof type))
          throw Error("Invalid score control: " + id);
        return node;
      }
      const frames = /* @__PURE__ */ new Set();
      function requestOwnedFrame(callback) {
        const token = ports.lifetime.capture();
        if (!ports.lifetime.current(token))
          return 0;
        let id = 0;
        id = ports.window.requestAnimationFrame((time) => {
          frames.delete(id);
          if (ports.lifetime.current(token))
            callback(time);
        });
        frames.add(id);
        return id;
      }
      function closeScoresDrawer() {
        if (!ports.lifetime.current(ports.lifetime.capture()))
          return;
        const panel = document2.getElementById("scores-panel");
        if (!panel)
          return;
        if (ports.getToolbar() && typeof ports.getToolbar().closeToolbarPanel === "function") {
          ports.getToolbar().closeToolbarPanel(panel);
          return;
        }
        panel.classList.remove("is-open", "is-closing");
        panel.classList.add("hidden");
      }
      function openScoresImportPicker() {
        if (!ports.lifetime.current(ports.lifetime.capture()))
          return;
        const input = optional("score-import-input", HTMLInputElement);
        if (!input)
          return;
        input.value = "";
        input.click();
      }
      function ensureScoresDrawerOpen() {
        if (!ports.lifetime.current(ports.lifetime.capture()))
          return;
        const panel = document2.getElementById("scores-panel");
        if (!panel)
          return;
        if (ports.getToolbar() && typeof ports.getToolbar().showToolbarPanel === "function") {
          ports.getToolbar().showToolbarPanel(panel);
          return;
        }
        panel.classList.remove("hidden", "is-closing");
        requestOwnedFrame(() => {
          panel.classList.add("is-open");
        });
      }
      function updateScoresActionButtonsState() {
        if (!ports.lifetime.current(ports.lifetime.capture()))
          return;
        const btnSaveCurrent = optional("btn-scores-save-current", HTMLButtonElement);
        if (!btnSaveCurrent)
          return;
        btnSaveCurrent.disabled = state.currentScoreData == null;
        btnSaveCurrent.title = state.currentScoreData == null ? "Open a score first, then save it into the library." : "Save the currently loaded score into your library.";
      }
      async function refreshScoresDrawer() {
        const uiGeneration = ports.lifetime.capture();
        if (!ports.lifetime.current(uiGeneration))
          return;
        const libraryList = document2.getElementById("scores-library-list");
        updateScoresActionButtonsState();
        if (!libraryList)
          return;
        try {
          await ports.library.init();
          if (!ports.lifetime.current(uiGeneration))
            return;
          try {
            await ports.library.importStarterLibraryOnce();
            if (!ports.lifetime.current(uiGeneration))
              return;
          } catch (err) {
            if (!ports.lifetime.current(uiGeneration))
              return;
            ports.reportWarning("Could not import starter library", err);
          }
          const [folders, scores] = await Promise.all([
            ports.library.getAllFolders(),
            ports.library.getAllScores()
          ]);
          if (!ports.lifetime.current(uiGeneration))
            return;
          const validFolderIds = /* @__PURE__ */ new Set(["__all__", "__unfiled__", ...folders.map((folder) => folder.id)]);
          if (!validFolderIds.has(state.scoreLibrarySelectedFolderId)) {
            state.scoreLibrarySelectedFolderId = "__all__";
          }
          if (!["folders", "scores"].includes(state.scoreLibraryView)) {
            state.scoreLibraryView = "folders";
          }
          ports.rows.dispose();
          libraryList.innerHTML = "";
          const isSplitView = ports.window.innerWidth >= 900;
          const filterOptions = [
            { value: "__all__", label: "All Scores" },
            { value: "__unfiled__", label: "Unfiled" },
            ...folders.map((folder) => ({ value: folder.id, label: folder.name || "New Folder" }))
          ];
          const activeFolderId = state.scoreLibrarySelectedFolderId;
          const getFilteredScores = () => getFilteredLibraryScores(scores, activeFolderId);
          if (isSplitView) {
            const shell = document2.createElement("div");
            shell.className = "scores-split-shell";
            libraryList.appendChild(shell);
            const foldersPane = document2.createElement("div");
            foldersPane.className = "scores-split-pane scores-split-folders";
            shell.appendChild(foldersPane);
            const foldersHeader = document2.createElement("div");
            foldersHeader.className = "scores-split-pane-header scores-split-pane-header-row";
            foldersHeader.appendChild(createFoldersLibraryToolbar({ folders, activeFolderId }));
            foldersPane.appendChild(foldersHeader);
            const foldersList = document2.createElement("div");
            foldersList.className = "scores-split-list";
            foldersPane.appendChild(foldersList);
            filterOptions.forEach((option) => {
              foldersList.appendChild(createFolderListRow(option, {
                activeFolderId,
                folders,
                showQuickAction: true
              }));
            });
            const scoresPane = document2.createElement("div");
            scoresPane.className = "scores-split-pane scores-split-scores";
            shell.appendChild(scoresPane);
            const filteredScores2 = getFilteredScores();
            const scoresHeader = document2.createElement("div");
            scoresHeader.className = "scores-split-pane-header scores-split-pane-header-summary";
            const summaryFolder = document2.createElement("span");
            summaryFolder.textContent = getScoreLibraryFolderLabel(activeFolderId, folders);
            if (activeFolderId && activeFolderId !== "__all__" && activeFolderId !== "__unfiled__") summaryFolder.setAttribute("data-i18n-skip", "");
            scoresHeader.append(`${filteredScores2.length} score${filteredScores2.length === 1 ? "" : "s"} \u2022 `, summaryFolder);
            scoresPane.appendChild(scoresHeader);
            const scoresList2 = document2.createElement("div");
            scoresList2.className = "scores-split-list";
            scoresPane.appendChild(scoresList2);
            scoresList2.appendChild(createScoresLibraryToolbar({
              filteredScores: filteredScores2,
              folders,
              activeFolderId
            }));
            if (!filteredScores2.length) {
              const empty = document2.createElement("div");
              empty.className = "scores-folder-empty";
              appendEmptyMessage(empty, activeFolderId, folders);
              scoresList2.appendChild(empty);
            } else {
              filteredScores2.forEach((score) => scoresList2.appendChild(createScoreRow(score, { manageMode: isScoreLibraryManageMode() })));
            }
            return;
          }
          const browserShell = document2.createElement("div");
          browserShell.className = "scores-browser-shell";
          libraryList.appendChild(browserShell);
          const browserHeader = document2.createElement("div");
          browserHeader.className = "scores-browser-header";
          browserShell.appendChild(browserHeader);
          const browserBody = document2.createElement("div");
          browserBody.className = "scores-browser-body";
          browserShell.appendChild(browserBody);
          if (state.scoreLibraryView === "folders") {
            const title2 = document2.createElement("div");
            title2.className = "scores-browser-title";
            title2.textContent = "Folders";
            browserHeader.appendChild(title2);
            browserBody.appendChild(createFoldersLibraryToolbar({
              folders,
              activeFolderId
            }));
            const folderList = document2.createElement("div");
            folderList.className = "scores-browser-list";
            browserBody.appendChild(folderList);
            filterOptions.forEach((option) => {
              folderList.appendChild(createFolderListRow(option, {
                activeFolderId,
                folders,
                showQuickAction: true
              }));
            });
            return;
          }
          const backButton = document2.createElement("button");
          backButton.type = "button";
          backButton.className = "scores-browser-back";
          backButton.textContent = "\u2190 Back";
          backButton.addEventListener("click", async () => {
            const uiGeneration2 = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration2))
              return;
            state.scoreLibraryView = "folders";
            await refreshScoresDrawer();
            if (!ports.lifetime.current(uiGeneration2))
              return;
          });
          browserHeader.appendChild(backButton);
          const title = document2.createElement("div");
          title.className = "scores-browser-title";
          title.textContent = getScoreLibraryFolderLabel(activeFolderId, folders);
          if (activeFolderId && activeFolderId !== "__all__" && activeFolderId !== "__unfiled__") title.setAttribute("data-i18n-skip", "");
          browserHeader.appendChild(title);
          const filteredScores = getFilteredScores();
          browserBody.appendChild(createScoresLibraryToolbar({
            filteredScores,
            folders,
            activeFolderId
          }));
          const scoresList = document2.createElement("div");
          scoresList.className = "scores-browser-list";
          browserBody.appendChild(scoresList);
          if (!filteredScores.length) {
            const empty = document2.createElement("div");
            empty.className = "scores-folder-empty";
            appendEmptyMessage(empty, activeFolderId, folders);
            scoresList.appendChild(empty);
          } else {
            filteredScores.forEach((score) => scoresList.appendChild(createScoreRow(score, { manageMode: isScoreLibraryManageMode() })));
          }
        } catch (err) {
          if (!ports.lifetime.current(uiGeneration))
            return;
          ports.reportError("Could not refresh scores drawer", err);
          ports.rows.dispose();
          libraryList.innerHTML = '<div class="scores-empty-state">Could not load the library.</div>';
        }
      }
      let initialized = false, resizeFrame = null;
      const bindings = [];
      function bind(node, event, marker, handler) {
        if (!node || node.dataset[marker])
          return;
        node.dataset[marker] = "true";
        node.addEventListener(event, handler);
        bindings.push({ target: node, event, handler, marker });
      }
      const onPositionResize = () => {
        if (ports.lifetime.current(ports.lifetime.capture()))
          ports.positionScoresPanel();
      };
      const onLayoutResize = () => {
        if (!ports.lifetime.current(ports.lifetime.capture()))
          return;
        if (resizeFrame) {
          ports.window.cancelAnimationFrame(resizeFrame);
          frames.delete(resizeFrame);
        }
        resizeFrame = requestOwnedFrame(() => {
          resizeFrame = null;
          void refreshScoresDrawer();
        });
      };
      function init() {
        if (initialized)
          return;
        initialized = true;
        const btnOpen = optional("btn-scores-open-file", HTMLButtonElement), btnImport = optional("btn-scores-import-files", HTMLButtonElement), btnSave = optional("btn-scores-save-current", HTMLButtonElement), btnExport = optional("btn-scores-export-library", HTMLButtonElement), btnBackup = optional("btn-scores-import-library", HTMLButtonElement), input = optional("score-import-input", HTMLInputElement), backup = optional("library-backup-input", HTMLInputElement);
        bind(btnOpen, "click", "boundScoresOpen", () => {
          ports.openScoreFilePicker();
        });
        if (input)
          bind(btnImport, "click", "boundScoresImport", openScoresImportPicker);
        bind(input, "change", "boundScoresImportInput", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const token = ports.lifetime.capture();
          try {
            await ports.actions.importFilesToLibrary(input.files);
            if (!ports.lifetime.current(uiGeneration))
              return;
          } finally {
            if (ports.lifetime.current(token))
              input.value = "";
          }
        });
        bind(btnSave, "click", "boundScoresSaveCurrent", ports.actions.saveCurrentScoreToLibrary);
        bind(btnExport, "click", "boundScoresExportLibrary", ports.actions.exportScoreLibraryBackup);
        if (backup)
          bind(btnBackup, "click", "boundScoresImportLibrary", () => {
            backup.value = "";
            backup.click();
          });
        bind(backup, "change", "boundScoresBackupInput", async () => {
          const uiGeneration = ports.lifetime.capture();
          if (!ports.lifetime.current(uiGeneration))
            return;
          const token = ports.lifetime.capture();
          try {
            const [file] = backup.files || [];
            await ports.actions.importScoreLibraryBackupFile(file);
            if (!ports.lifetime.current(uiGeneration))
              return;
          } finally {
            if (ports.lifetime.current(token))
              backup.value = "";
          }
        });
        ports.positionScoresPanel();
        ports.window.addEventListener("resize", onPositionResize);
        bindings.push({ target: ports.window, event: "resize", handler: onPositionResize });
        void refreshScoresDrawer();
        ports.window.addEventListener("resize", onLayoutResize);
        bindings.push({ target: ports.window, event: "resize", handler: onLayoutResize });
      }
      function dispose() {
        if (initialized) {
          initialized = false;
          for (const { target, event, handler, marker } of bindings) {
            target.removeEventListener(event, handler);
            if (marker && target instanceof HTMLElement && target.dataset[marker] === "true")
              delete target.dataset[marker];
          }
          bindings.length = 0;
        }
        for (const id of frames)
          ports.window.cancelAnimationFrame(id);
        frames.clear();
        resizeFrame = null;
      }
      return { closeScoresDrawer, openScoresImportPicker, ensureScoresDrawerOpen, updateScoresActionButtonsState, refreshScoresDrawer, init, dispose };
    }
    PianoTrainerScoresDrawer2.create = create;
  })(PianoTrainerScoresDrawer || (PianoTrainerScoresDrawer = {}));

  // src/ui/settings-actions.ts
  var PianoTrainerSettingsActions;
  ((PianoTrainerSettingsActions2) => {
    function create(ports) {
      const dom = PianoTrainerControlDom.create(ports.document);
      let initialized = false, generation = 0;
      function init() {
        if (initialized) return;
        initialized = true;
        const token = generation;
        dom.on(dom.optionalButton("btn-backup-settings"), "click", () => {
          if (token === generation) ports.downloadSettingsBackup();
        });
        const button = dom.optionalButton("btn-import-settings"), input = dom.optionalInput("input-settings-import");
        if (button && input) {
          dom.on(button, "click", () => {
            if (token === generation) {
              input.value = "";
              input.click();
            }
          });
          dom.onInput(input, "change", (node) => {
            if (token !== generation) return;
            const file = node.files && node.files[0];
            ports.handleSettingsBackupImportFile(file);
            input.value = "";
          });
        }
        dom.on(dom.optionalButton("btn-reset-preferences"), "click", () => {
          if (token !== generation) return;
          const confirmed = ports.confirm("Reset ALL saved Settings and Trainer preferences? This will erase all saved settings and restore defaults.");
          if (confirmed) ports.restoreDefaultPreferences();
        });
      }
      function dispose() {
        generation++;
        initialized = false;
        dom.dispose();
      }
      return { init, dispose };
    }
    PianoTrainerSettingsActions2.create = create;
  })(PianoTrainerSettingsActions || (PianoTrainerSettingsActions = {}));

  // src/ui/settings-controls.ts
  var PianoTrainerSettingsFiles;
  ((PianoTrainerSettingsFiles2) => {
    function create(ports) {
      const readers = /* @__PURE__ */ new Set(), links = /* @__PURE__ */ new Set(), urls = /* @__PURE__ */ new Set();
      let initialized = false, generation = 0;
      function init() {
        initialized = true;
      }
      function downloadSettingsBackup() {
        if (!initialized) return;
        try {
          const payload = ports.buildPayload();
          const blob = ports.createBlob([JSON.stringify(payload, null, 2)], { type: "application/json" });
          const url = ports.createObjectURL(blob);
          urls.add(url);
          const link = ports.document.createElement("a");
          links.add(link);
          const safeDate = ports.now().toISOString().slice(0, 10);
          link.href = url;
          link.download = `Piano-Trainer-Settings-Backup-${safeDate}.json`;
          ports.document.body.appendChild(link);
          link.click();
          link.remove();
          links.delete(link);
          ports.revokeObjectURL(url);
          urls.delete(url);
        } catch (err) {
          ports.warn("Settings backup export failed", err);
          ports.alert("Could not export settings backup.");
        }
      }
      function handleSettingsBackupImportFile(file) {
        if (!initialized || !file) return;
        const reader = ports.createReader(), token = generation;
        readers.add(reader);
        reader.onload = () => {
          if (token !== generation || !readers.has(reader)) return;
          readers.delete(reader);
          try {
            const payload = JSON.parse(String(reader.result || "{}"));
            ports.importPayload(payload);
            ports.alert("Settings imported. The app will now reload to apply them.");
            ports.reload();
          } catch (err) {
            ports.warn("Settings backup import failed", err);
            ports.alert("Invalid settings backup file.");
          }
        };
        reader.onloadend = () => {
          readers.delete(reader);
        };
        try {
          reader.readAsText(file);
        } catch (error) {
          readers.delete(reader);
          throw error;
        }
      }
      function dispose() {
        generation++;
        initialized = false;
        for (const reader of readers) {
          reader.onload = null;
          reader.onloadend = null;
          reader.abort();
        }
        readers.clear();
        for (const link of links) link.remove();
        links.clear();
        for (const url of urls) ports.revokeObjectURL(url);
        urls.clear();
      }
      return { init, dispose, downloadSettingsBackup, handleSettingsBackupImportFile };
    }
    PianoTrainerSettingsFiles2.create = create;
  })(PianoTrainerSettingsFiles || (PianoTrainerSettingsFiles = {}));

  // src/ui/tempo-controls.ts
  var PianoTrainerTempoControls;
  ((PianoTrainerTempoControls2) => {
    function create(ports) {
      const dom = PianoTrainerControlDom.create(ports.document), state = ports.state;
      let active = true, editingInitialized = false, preferencesInitialized = false, metronomeInitialized = false;
      function syncTempoMetronomeDependentUi() {
        if (!active) return;
        const enabled = !!dom.optionalInput("check-metronome")?.checked, hasMidi = ports.hasMidiOutput(), midiMode = !!dom.optionalInput("check-metronome-midiout")?.checked;
        const label = dom.element("tempo-metro-volume-label"), hint = dom.element("tempo-midiout-metronome-hint");
        const controls = ["slider-metro-vol", "val-metro-vol", "check-accented-downbeat", "check-visual-pulse", "check-metronome-midiout"].map((id) => dom.optionalInput(id));
        if (label) {
          label.textContent = midiMode ? "Level" : "Volume";
          label.setAttribute("aria-disabled", enabled ? "false" : "true");
        }
        for (const control of controls) {
          if (!control) continue;
          control.disabled = !enabled;
          control.closest("label")?.classList.toggle("is-disabled", !enabled);
        }
        if (hint) {
          hint.textContent = hasMidi ? "Uses GM percussion on the selected MIDI Out device." : "Select a MIDI Out device to hear metronome clicks on Channel 10. Some keyboards require a drum (Ch 10) or multi-timbral mode to avoid piano sounds.";
          hint.classList.toggle("is-disabled", !enabled || !hasMidi);
        }
      }
      function syncTempoPreviewFromPercent(value) {
        if (!active) return;
        const base = state.baseBpm || 120, percent = Math.max(10, Math.min(200, parseInt(String(value), 10) || 100)), bpm = Math.round(base * (percent / 100));
        dom.input("slider-speed").value = String(percent);
        dom.input("val-speed").value = String(percent);
        dom.input("val-bpm").value = String(bpm);
      }
      function updateTempo(source, value) {
        if (!active) return;
        const base = state.baseBpm || 120;
        let percent, bpm;
        if (source === "percent") {
          percent = Math.max(10, Math.min(200, parseInt(String(value)) || 100));
          bpm = Math.round(base * (percent / 100));
        } else {
          bpm = Math.max(1, parseInt(String(value)) || base);
          percent = Math.round(bpm / base * 100);
        }
        dom.input("slider-speed").value = String(percent);
        dom.input("val-speed").value = String(percent);
        dom.input("val-bpm").value = String(bpm);
        state.speedPercent = percent / 100;
        ports.setBpm(bpm);
        if (state.isPlaying && !state.countInActive && state.mode === "wait") ports.rebuildWaitModeMetronome(ports.getCurrentMeasureIndex() ?? ports.getWaitMeasureIndex());
      }
      function initEditing() {
        if (editingInitialized) return;
        active = true;
        editingInitialized = true;
        const slider = dom.input("slider-speed"), input = dom.input("val-speed"), bpm = dom.input("val-bpm");
        dom.onInput(slider, "input", (node) => syncTempoPreviewFromPercent(node.value));
        dom.onInput(slider, "change", (node) => updateTempo("percent", node.value));
        dom.onInput(input, "change", (node) => updateTempo("percent", node.value));
        dom.onInput(bpm, "change", (node) => updateTempo("bpm", node.value));
      }
      function initMetronomePreferences() {
        if (preferencesInitialized) return;
        active = true;
        preferencesInitialized = true;
        dom.onInput(dom.optionalInput("check-accented-downbeat"), "change", (node) => {
          state.accentedDownbeatEnabled = node.checked;
          ports.saveBool("accentedDownbeat", state.accentedDownbeatEnabled);
        });
        dom.onInput(dom.optionalInput("check-visual-pulse"), "change", (node) => {
          state.visualPulseEnabled = node.checked;
          ports.saveBool("visualPulse", state.visualPulseEnabled);
          if (!state.visualPulseEnabled) ports.clearTempoVisualPulse();
        });
        dom.onInput(dom.optionalInput("check-metronome-midiout"), "change", (node) => {
          state.metronomeMidiOutEnabled = node.checked;
          ports.saveBool("metronomeMidiOut", state.metronomeMidiOutEnabled);
          syncTempoMetronomeDependentUi();
        });
      }
      function initMetronomeToggle() {
        if (metronomeInitialized) return;
        active = true;
        metronomeInitialized = true;
        dom.onInput(dom.optionalInput("check-metronome"), "change", (node) => {
          syncTempoMetronomeDependentUi();
          if (!node.checked) {
            ports.clearScheduledMetronomeEvents();
            ports.stopWaitModeMetronome();
            ports.clearTempoVisualPulse();
            return;
          }
          if (state.isPlaying && !state.countInActive && state.mode === "wait") ports.rebuildWaitModeMetronome(ports.getCurrentMeasureIndex() ?? ports.getWaitMeasureIndex());
        });
        syncTempoMetronomeDependentUi();
      }
      function init() {
        initEditing();
        initMetronomePreferences();
        initMetronomeToggle();
      }
      function dispose() {
        active = false;
        editingInitialized = false;
        preferencesInitialized = false;
        metronomeInitialized = false;
        dom.dispose();
      }
      return { init, initEditing, initMetronomePreferences, initMetronomeToggle, dispose, syncTempoMetronomeDependentUi, syncTempoPreviewFromPercent, updateTempo };
    }
    PianoTrainerTempoControls2.create = create;
  })(PianoTrainerTempoControls || (PianoTrainerTempoControls = {}));

  // src/ui/tempo-pulse.ts
  var PianoTrainerTempoPulse;
  ((PianoTrainerTempoPulse2) => {
    function create(getElement) {
      return { getTarget() {
        const element = getElement();
        return element ? {
          restart() {
            element.classList.remove("metronome-pulse");
            void element.offsetWidth;
            element.classList.add("metronome-pulse");
          },
          hide() {
            element.classList.remove("metronome-pulse");
          }
        } : null;
      } };
    }
    PianoTrainerTempoPulse2.create = create;
  })(PianoTrainerTempoPulse || (PianoTrainerTempoPulse = {}));

  // src/ui/toolbar.ts
  var PianoTrainerToolbar;
  ((PianoTrainerToolbar2) => {
    const panelIds = [
      "scores-panel",
      "options-overlay",
      "tempo-popup",
      "practice-popup",
      "looper-popup",
      "more-popup",
      "audio-popup",
      "display-popup",
      "transpose-popup",
      "help-overlay"
    ];
    function create(ports) {
      const { document: document2, window: window2 } = ports;
      const panels = /* @__PURE__ */ new Map();
      const panelButtons = /* @__PURE__ */ new Map();
      const listeners = [];
      const frames = /* @__PURE__ */ new Set(), timers = /* @__PURE__ */ new Set();
      const transitions = /* @__PURE__ */ new Set();
      let initialized = false, active = true, generation = 0, firstRunQuickStartActive = false;
      function element(id, required = false) {
        const node = document2.getElementById(id);
        if (node && !(node instanceof HTMLElement)) throw Error("Invalid toolbar control: " + id);
        if (!node && required) throw Error("Missing required toolbar control: " + id);
        return node;
      }
      function getPanel(id) {
        return panels.get(id) ?? null;
      }
      function bind(target, event, handler) {
        target.addEventListener(event, handler);
        listeners.push({ target, event, handler });
      }
      function syncToolbarButtonStates() {
        if (!active) return;
        panelButtons.forEach((button, panel) => {
          const isOpen = !panel.classList.contains("hidden") && panel.classList.contains("is-open");
          button.classList.toggle("is-open", isOpen);
          button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
      }
      function markFirstRunIntroSeen() {
        if (!active) return;
        try {
          ports.storage.setItem("pt_firstRunIntroSeen", "true");
        } catch (_) {
        }
      }
      function closeToolbarPanel(panel, immediate = false) {
        if (!active || !panel || panel.classList.contains("hidden")) return;
        if (panel === getPanel("help-overlay") && firstRunQuickStartActive) {
          markFirstRunIntroSeen();
          firstRunQuickStartActive = false;
        }
        panel.classList.remove("is-open");
        if (immediate) {
          panel.classList.remove("is-closing");
          panel.classList.add("hidden");
          syncToolbarButtonStates();
          return;
        }
        panel.classList.add("is-closing");
        const token = generation;
        const transition = { panel, handler: finalizeClose };
        function finalizeClose(event) {
          if (!active || token !== generation || event && event.target !== panel) return;
          panel.classList.remove("is-closing");
          panel.classList.add("hidden");
          panel.removeEventListener("transitionend", finalizeClose);
          transitions.delete(transition);
          syncToolbarButtonStates();
        }
        panel.addEventListener("transitionend", finalizeClose);
        transitions.add(transition);
        const id = window2.setTimeout(() => {
          timers.delete(id);
          if (active && token === generation && panel.classList.contains("is-closing")) finalizeClose();
        }, 220);
        timers.add(id);
      }
      function showToolbarPanel(panel) {
        if (!active || !panel) return;
        panels.forEach((other) => {
          if (other !== panel) closeToolbarPanel(other, true);
        });
        if (!panel.classList.contains("hidden") && panel.classList.contains("is-open")) return;
        panel.classList.remove("hidden", "is-closing");
        const token = generation;
        const id = window2.requestAnimationFrame(() => {
          frames.delete(id);
          if (!active || token !== generation) return;
          panel.classList.add("is-open");
          syncToolbarButtonStates();
        });
        frames.add(id);
      }
      function hideToolbarPanels(immediate = false) {
        if (active) panels.forEach((panel) => closeToolbarPanel(panel, immediate));
      }
      function toggleToolbarPanel(panel) {
        if (!active || !panel) return;
        const shouldShow = panel.classList.contains("hidden") || !panel.classList.contains("is-open");
        if (shouldShow) showToolbarPanel(panel);
        else closeToolbarPanel(panel);
      }
      function launchFromMore(targetPanel) {
        closeToolbarPanel(getPanel("more-popup"), true);
        if (targetPanel) showToolbarPanel(targetPanel);
      }
      function isAnyToolbarPanelOpen() {
        return [...panels.values()].some((panel) => panel && !panel.classList.contains("hidden"));
      }
      function positionScoresPanel() {
        if (!active) return;
        const panel = element("scores-panel");
        if (!panel) return;
        const nav = element("static-menu");
        let topPx = 58;
        if (nav) topPx = Math.round(nav.getBoundingClientRect().bottom + 10);
        panel.style.top = `${topPx}px`;
        panel.style.bottom = "12px";
      }
      function showFirstRunIntro() {
        const help = getPanel("help-overlay");
        if (!active || !help) return;
        firstRunQuickStartActive = true;
        hideToolbarPanels(true);
        showToolbarPanel(help);
        const body = help.querySelector(".info-panel-body");
        if (body) body.scrollTop = 0;
      }
      function closeFirstRunIntro() {
        closeToolbarPanel(getPanel("help-overlay"));
      }
      function maybeShowFirstRunIntro() {
        if (!active || !getPanel("help-overlay")) return false;
        try {
          if (ports.storage.getItem("pt_firstRunIntroSeen") === "true") return false;
        } catch (_) {
        }
        showFirstRunIntro();
        return true;
      }
      function init() {
        if (initialized) return;
        active = true;
        for (const id of panelIds) panels.set(id, element(id));
        for (const [panelId, buttonId] of [
          ["scores-panel", "btn-scores"],
          ["options-overlay", "btn-options"],
          ["tempo-popup", "btn-tempo"],
          ["practice-popup", "btn-practice"],
          ["looper-popup", "btn-looper"],
          ["more-popup", "btn-more"]
        ]) {
          const panel = getPanel(panelId), button = element(buttonId);
          if (panel && button) panelButtons.set(panel, button);
        }
        const scores = getPanel("scores-panel"), scoresButton = element("btn-scores");
        if (scores && scoresButton) bind(scoresButton, "click", async (event) => {
          event.stopPropagation();
          const token = generation;
          const shouldShow = scores.classList.contains("hidden") || !scores.classList.contains("is-open");
          if (shouldShow) {
            ports.state.scoreLibraryView = "folders";
            try {
              await ports.refreshScoresDrawer();
            } catch (_) {
            }
          }
          if (active && token === generation) toggleToolbarPanel(scores);
        });
        bind(element("btn-options", true), "click", (event) => {
          event.stopPropagation();
          toggleToolbarPanel(getPanel("options-overlay"));
        });
        for (const id of ["btn-help-close", "btn-help-got-it"]) {
          const button = element(id), help = getPanel("help-overlay");
          if (button && help) bind(button, "click", () => closeToolbarPanel(help));
        }
        for (const [buttonId, panelId] of [
          ["btn-tempo", "tempo-popup"],
          ["btn-practice", "practice-popup"],
          ["btn-looper", "looper-popup"],
          ["btn-more", "more-popup"]
        ]) {
          const button = element(buttonId), panel = getPanel(panelId);
          if (button && panel) bind(button, "click", (event) => {
            event.stopPropagation();
            toggleToolbarPanel(panel);
          });
        }
        for (const [buttonId, panelId] of [
          ["btn-more-tempo", "tempo-popup"],
          ["btn-more-loop", "looper-popup"],
          ["btn-more-audio", "audio-popup"],
          ["btn-more-display", "display-popup"],
          ["btn-more-transpose", "transpose-popup"],
          ["btn-more-help", "help-overlay"]
        ]) {
          const button = element(buttonId), panel = getPanel(panelId);
          if (button && panel) bind(button, "click", (event) => {
            event.stopPropagation();
            launchFromMore(panel);
          });
        }
        bind(document2, "click", (event) => {
          if (!(event.target instanceof Element)) return;
          const target = event.target;
          const exclusions = [
            "#scores-panel",
            "#options-overlay",
            "#tempo-popup",
            "#transpose-popup",
            "#practice-popup",
            "#looper-popup",
            "#more-popup",
            "#audio-popup",
            "#display-popup",
            "#help-overlay",
            "#led-calibration-panel",
            ".scores-action-menu-overlay",
            ".scores-folder-picker-overlay"
          ];
          if (exclusions.some((selector) => target.closest(selector))) return;
          if (isAnyToolbarPanelOpen()) {
            hideToolbarPanels();
            event.stopPropagation();
          }
        });
        initialized = true;
      }
      function dispose() {
        if (!active) return;
        active = false;
        generation++;
        initialized = false;
        for (const { target, event, handler } of listeners) target.removeEventListener(event, handler);
        listeners.length = 0;
        for (const id of frames) window2.cancelAnimationFrame(id);
        frames.clear();
        for (const id of timers) window2.clearTimeout(id);
        timers.clear();
        for (const { panel, handler } of transitions) panel.removeEventListener("transitionend", handler);
        transitions.clear();
        panelButtons.clear();
      }
      return {
        init,
        dispose,
        syncToolbarButtonStates,
        showToolbarPanel,
        closeToolbarPanel,
        hideToolbarPanels,
        toggleToolbarPanel,
        isAnyToolbarPanelOpen,
        positionScoresPanel,
        maybeShowFirstRunIntro,
        showFirstRunIntro,
        closeFirstRunIntro,
        markFirstRunIntroSeen
      };
    }
    PianoTrainerToolbar2.create = create;
  })(PianoTrainerToolbar || (PianoTrainerToolbar = {}));

  // src/ui/transpose-controls.ts
  var PianoTrainerTransposeControls;
  ((PianoTrainerTransposeControls2) => {
    function create(ports) {
      const document2 = ports.document;
      function optional(id, type) {
        const element = document2.getElementById(id);
        if (element && !(element instanceof type)) throw new Error(`Invalid transpose control: ${id}`);
        return element;
      }
      const panel = optional("transpose-popup", HTMLElement), sourceLabel = optional("transpose-current-key", HTMLElement), modeSelect = optional("transpose-mode", HTMLSelectElement), targetKeySelect = optional("transpose-target-key", HTMLSelectElement), semitoneInput = optional("transpose-semitones", HTMLInputElement), semitoneValue = optional("transpose-semitones-value", HTMLElement), updateKeySignatureCheckbox = optional("transpose-update-key-signature", HTMLInputElement), applyButton = optional("btn-transpose-apply", HTMLButtonElement), resetButton = optional("btn-transpose-reset", HTMLButtonElement), statusEl = optional("transpose-status", HTMLElement);
      const modeRows = Array.from(document2.querySelectorAll("[data-transpose-mode-row]"));
      const commands = ports.commands;
      let initialized = false;
      function setStatus(text, isError = false) {
        if (!statusEl) return;
        statusEl.textContent = text || "";
        statusEl.classList.toggle("is-error", !!isError);
      }
      function syncUiFromState() {
        const state = commands.ensureTransposeState();
        if (sourceLabel) sourceLabel.textContent = state.sourceKeyLabel || "Unknown";
        if (modeSelect) modeSelect.value = state.mode || "key";
        if (targetKeySelect && state.targetKey) targetKeySelect.value = state.targetKey;
        if (semitoneInput) semitoneInput.value = String(Number(state.semitones || 0));
        if (semitoneValue) semitoneValue.textContent = String(Number(state.semitones || 0));
        if (updateKeySignatureCheckbox) updateKeySignatureCheckbox.checked = state.updateKeySignature !== false;
        const enabled = !!state.available;
        for (const control of [modeSelect, targetKeySelect, semitoneInput, updateKeySignatureCheckbox, applyButton, resetButton]) if (control) control.disabled = !enabled;
        modeRows.forEach((row) => row.classList.toggle("hidden", row.getAttribute("data-transpose-mode-row") !== state.mode));
        if (!enabled) setStatus(state.disableReason || "Load a MusicXML-based score to enable transpose.");
        else if (state.active) setStatus(`Applied: ${state.activeLabel || "Transposed score"}`);
        else setStatus("Ready. Transpose is applied from the original source score each time. \nTanspose by Key Signature or by Semitones");
      }
      const onMode = () => {
        commands.ensureTransposeState().mode = modeSelect.value === "semitone" ? "semitone" : "key";
        syncUiFromState();
      };
      const onTarget = () => {
        commands.ensureTransposeState().targetKey = targetKeySelect.value;
      };
      const onSemitones = () => {
        const state = commands.ensureTransposeState();
        state.semitones = Number(semitoneInput.value || 0);
        if (semitoneValue) semitoneValue.textContent = String(state.semitones);
      };
      const onSignature = () => {
        commands.ensureTransposeState().updateKeySignature = !!updateKeySignatureCheckbox.checked;
      };
      const onApply = () => commands.applyTranspose(), onReset = () => commands.resetTranspose();
      const bindings = [
        [modeSelect, "change", onMode],
        [targetKeySelect, "change", onTarget],
        [semitoneInput, "input", onSemitones],
        [updateKeySignatureCheckbox, "change", onSignature],
        [applyButton, "click", onApply],
        [resetButton, "click", onReset]
      ];
      function init() {
        if (initialized) return;
        initialized = true;
        for (const [element, event, handler] of bindings) element?.addEventListener(event, handler);
        const engine = ports.getEngine();
        if (targetKeySelect && engine) targetKeySelect.innerHTML = engine.getKeyPresets().map((preset) => `<option value="${preset.value}">${preset.label}</option>`).join("");
        syncUiFromState();
      }
      function dispose() {
        if (initialized) {
          initialized = false;
          for (const [element, event, handler] of bindings) element?.removeEventListener(event, handler);
        }
      }
      return { init, dispose, setStatus, syncUiFromState, getPanel: () => panel };
    }
    PianoTrainerTransposeControls2.create = create;
  })(PianoTrainerTransposeControls || (PianoTrainerTransposeControls = {}));

  // src/ui/update-controls.ts
  var PianoTrainerUpdateControls;
  ((PianoTrainerUpdateControls2) => {
    function create(ports) {
      const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
      let generation = 0, ownedButton = null;
      function getUpdateCheckButton() {
        const button = ports.document.getElementById("btn-check-updates");
        return button instanceof HTMLButtonElement ? button : null;
      }
      function getAppVersionDisplayText() {
        return `Version: ${ports.version || "unknown"}`;
      }
      function buildUpdateStatusText() {
        if (state.updateStatus)
          return state.updateStatus;
        if (!state.updateManifestUrl)
          return "Update checks are not configured yet.";
        return "Update status: not checked yet.";
      }
      function syncUpdateControls() {
        const versionEl = ports.document.getElementById("app-version-display");
        const statusEl = ports.document.getElementById("update-status");
        const button = getUpdateCheckButton();
        if (versionEl)
          versionEl.textContent = getAppVersionDisplayText();
        if (statusEl)
          statusEl.textContent = buildUpdateStatusText();
        if (button) {
          button.disabled = false;
          if (state.updateInfo?.updateAvailable) {
            button.textContent = ports.commands.isLocalAppRuntime() ? "Download Latest" : "Reload to Update";
          } else if (state.updateInfo && state.updateInfo.remoteVersion) {
            button.textContent = "Up to Date";
          } else {
            button.textContent = "Check for Updates";
          }
        }
      }
      function initUpdateControls() {
        ports.commands.init();
        const button = getUpdateCheckButton();
        if (button && !button.dataset.boundCheckUpdates) {
          button.dataset.boundCheckUpdates = "true";
          const token = generation;
          ownedButton = button;
          dom.on(button, "click", async () => {
            if (token !== generation)
              return;
            if (state.updateInfo?.updateAvailable) {
              if (ports.commands.isLocalAppRuntime()) {
                const releaseUrl = ports.commands.getUpdateActionUrl();
                if (releaseUrl)
                  ports.open(releaseUrl, "_blank", "noopener");
                else
                  ports.alert("No release URL is configured yet.");
                return;
              }
              const shouldReload = ports.confirm(`Version ${state.updateInfo.remoteVersion} is available. Reload now?`);
              if (shouldReload)
                ports.commands.forceReloadToVersion(state.updateInfo.remoteVersion);
              return;
            }
            await ports.commands.checkForUpdates({ manual: true });
          });
        }
        syncUpdateControls();
        ports.commands.checkForUpdates({ manual: false }).catch(() => {
        });
      }
      function setChecking() {
        const button = getUpdateCheckButton();
        if (button)
          button.disabled = true;
      }
      function dispose() {
        generation++;
        dom.dispose();
        if (ownedButton?.dataset.boundCheckUpdates === "true")
          delete ownedButton.dataset.boundCheckUpdates;
        ownedButton = null;
      }
      return { init: initUpdateControls, dispose, syncUpdateControls, setChecking };
    }
    PianoTrainerUpdateControls2.create = create;
  })(PianoTrainerUpdateControls || (PianoTrainerUpdateControls = {}));

  // src/ui/virtual-keyboard-controls.ts
  var PianoTrainerVirtualKeyboardControls;
  ((PianoTrainerVirtualKeyboardControls2) => {
    function create(ports) {
      const dom = PianoTrainerControlDom.create(ports.document);
      const keys = /* @__PURE__ */ new Set(), captures = /* @__PURE__ */ new Map();
      let activePointerId = null, activeMidi = null;
      let activationInitialized = false, keyboardInitialized = false, generation = 0, inputEpoch = 0;
      function releaseActiveVirtualPointer(pointerId = null) {
        if (activeMidi == null) return;
        if (pointerId != null && activePointerId != null && pointerId !== activePointerId) return;
        ports.triggerVirtualKey(activeMidi, false, "ui");
        activePointerId = null;
        activeMidi = null;
      }
      function on(target, event, handler, options) {
        const token = generation;
        dom.on(target, event, (event2) => {
          if (token === generation) handler(event2);
        }, options);
      }
      function pointer(target, type, handler) {
        on(target, type, (event) => {
          if (event instanceof PointerEvent) return handler(event);
        });
      }
      function mouse(target, type, handler) {
        on(target, type, (event) => {
          if (event instanceof MouseEvent) return handler(event);
        });
      }
      function touch(target, type, handler, passive) {
        on(target, type, (event) => {
          if (event instanceof TouchEvent) return handler(event);
        }, { passive });
      }
      async function bindStart(key, midi, token, lifetime) {
        if (key.dataset.virtualDown === "1") return;
        key.dataset.virtualDown = "1";
        const pendingEpoch = inputEpoch;
        await ports.ensureLiveAudioReady();
        if (lifetime !== generation || pendingEpoch !== inputEpoch) return;
        if (activeMidi != null && activeMidi !== midi) releaseActiveVirtualPointer();
        activePointerId = token;
        activeMidi = midi;
        ports.triggerVirtualKey(midi, true, "ui");
      }
      function bindEnd(key, midi, token) {
        if (token != null && activePointerId != null && token !== activePointerId) return;
        key.dataset.virtualDown = "0";
        if (ports.pressedKeys.has(midi)) ports.triggerVirtualKey(midi, false, "ui");
        if (activeMidi === midi) {
          activePointerId = null;
          activeMidi = null;
        }
      }
      function createKeyboard() {
        const container = dom.element("virtual-keyboard");
        if (!container) return;
        keyboardInitialized = true;
        container.innerHTML = "";
        const blackIndices = [1, 3, 6, 8, 10], lifetime = generation;
        for (let i = 0; i < 88; i++) {
          const key = ports.document.createElement("div"), midi = i + 21;
          const black = blackIndices.includes((i + 9) % 12);
          key.className = `key ${black ? "black" : "white"}`;
          key.classList.toggle("out-of-range", !ports.isMidiInRange(midi));
          key.dataset.midi = String(midi);
          key.dataset.virtualDown = "0";
          keys.add(key);
          pointer(key, "pointerdown", async (event) => {
            event.preventDefault();
            if (typeof key.setPointerCapture === "function") {
              try {
                key.setPointerCapture(event.pointerId);
                const ids = captures.get(key) || /* @__PURE__ */ new Set();
                ids.add(event.pointerId);
                captures.set(key, ids);
              } catch (_) {
              }
            }
            await bindStart(key, midi, `pointer:${event.pointerId}`, lifetime);
          });
          pointer(key, "pointerup", (event) => {
            event.preventDefault();
            bindEnd(key, midi, `pointer:${event.pointerId}`);
          });
          pointer(key, "pointercancel", (event) => {
            event.preventDefault();
            bindEnd(key, midi, `pointer:${event.pointerId}`);
          });
          pointer(key, "pointerleave", (event) => {
            if (event.pointerType === "mouse") bindEnd(key, midi, `pointer:${event.pointerId}`);
          });
          mouse(key, "mousedown", async (event) => {
            event.preventDefault();
            await bindStart(key, midi, "mouse", lifetime);
          });
          mouse(key, "mouseup", (event) => {
            event.preventDefault();
            bindEnd(key, midi, "mouse");
          });
          on(key, "mouseleave", () => bindEnd(key, midi, "mouse"));
          touch(key, "touchstart", async (event) => {
            event.preventDefault();
            const first = event.changedTouches?.[0];
            await bindStart(key, midi, first ? `touch:${first.identifier}` : "touch", lifetime);
          }, false);
          for (const type of ["touchend", "touchcancel"]) touch(key, type, (event) => {
            event.preventDefault();
            const first = event.changedTouches?.[0];
            bindEnd(key, midi, first ? `touch:${first.identifier}` : "touch");
          }, false);
          container.appendChild(key);
        }
      }
      function initActivation() {
        if (activationInitialized) return;
        activationInitialized = true;
        pointer(ports.window, "pointerup", (event) => releaseActiveVirtualPointer(`pointer:${event.pointerId}`));
        pointer(ports.window, "pointercancel", (event) => releaseActiveVirtualPointer(`pointer:${event.pointerId}`));
        on(ports.window, "mouseup", () => releaseActiveVirtualPointer("mouse"));
        for (const type of ["touchend", "touchcancel"]) touch(ports.window, type, (event) => {
          const first = event.changedTouches?.[0];
          releaseActiveVirtualPointer(first ? `touch:${first.identifier}` : "touch");
        }, true);
        on(ports.window, "blur", () => releaseActiveVirtualPointer());
        on(ports.document, "visibilitychange", () => {
          if (ports.document.hidden) {
            releaseActiveVirtualPointer();
            return;
          }
          void ports.ensureLiveAudioReady();
        });
        on(ports.window, "pageshow", () => {
          void ports.ensureLiveAudioReady();
        });
        on(ports.window, "focus", () => {
          void ports.ensureLiveAudioReady();
        });
        for (const type of ["touchstart", "pointerdown", "mousedown"]) on(ports.document, type, () => {
          void ports.ensureLiveAudioReady();
        }, { passive: true });
      }
      function init() {
        initActivation();
        if (!keyboardInitialized) createKeyboard();
      }
      function suspend() {
        inputEpoch++;
        releaseActiveVirtualPointer();
        for (const [key, ids] of captures) for (const id of ids) {
          try {
            if (key.hasPointerCapture(id)) key.releasePointerCapture(id);
          } catch (_) {
          }
        }
        captures.clear();
        for (const key of keys) key.dataset.virtualDown = "0";
      }
      function dispose() {
        generation++;
        dom.dispose();
        suspend();
        for (const key of keys) {
          key.dataset.virtualDown = "0";
          key.remove();
        }
        keys.clear();
        activationInitialized = false;
        keyboardInitialized = false;
      }
      return { init, initActivation, createKeyboard, releaseActiveVirtualPointer, suspend, dispose };
    }
    PianoTrainerVirtualKeyboardControls2.create = create;
  })(PianoTrainerVirtualKeyboardControls || (PianoTrainerVirtualKeyboardControls = {}));

  // src/app/services.ts
  function createServices(ports = {}) {
    const language = createLanguageController({
      document,
      storage: localStorage,
      createObserver: (callback) => new MutationObserver(callback)
    });
    const permissionHelp = createPermissionHelp(document);
    const { showMidiPermissionHelp, clearMidiPermissionHelp, showWledPermissionHelp, clearWledPermissionHelp } = permissionHelp;
    let osmd;
    let initialized = false, disposed = false, suspended = false, firstRunTimer;
    const appMetadata = PianoTrainerAppState.readMetadata({
      manifest: window.__PT_APP_MANIFEST__,
      assetVersion: window.__PT_ASSET_VERSION__,
      getManifestUrl: () => localStorage.getItem(UPDATE_MANIFEST_URL_STORAGE_KEY)
    });
    const APP_VERSION = appMetadata.version;
    const UPDATE_MANIFEST_URL = appMetadata.manifestUrl;
    const UPDATE_RELEASES_URL = appMetadata.releaseUrl;
    const AppState = PianoTrainerAppState.create();
    const handRouting = PianoTrainerHandRouting.create(AppState);
    const getAssignedHandRoleForStaff = handRouting.getAssignedHandRoleForStaff;
    const isPracticeHandEnabledForStaff = handRouting.isPracticeHandEnabledForStaff;
    const syncActiveHandStateFromMode = handRouting.syncActiveHandStateFromMode;
    const preferences = PianoTrainerPreferences.create({
      state: AppState,
      storage: localStorage,
      session: sessionStorage,
      keys: PREFERENCE_STORAGE_KEYS,
      resettableKeys: RESETTABLE_PREFERENCE_KEYS
    });
    const { consumePendingFirstRunNotice, getStoredBool, getClampedNumber, setStoredBool, clearSavedPreferences } = preferences;
    const {
      normalizeLedCount,
      normalizeLedMasterBrightness,
      normalizeLedFuturePct,
      normalizeMidiChannel,
      normalizeMidiInputChannel
    } = PianoTrainerPreferenceValues;
    const playerRange = PianoTrainerPlayerRange.create(AppState);
    const { getPlayerPlayableRange, isMidiInPlayerRange, getMidiKeyPosition01 } = playerRange;
    const settingsBackup = PianoTrainerSettingsBackup.create({
      storage: localStorage,
      session: sessionStorage,
      keys: PREFERENCE_STORAGE_KEYS,
      resettableKeys: RESETTABLE_PREFERENCE_KEYS,
      appVersion: APP_VERSION,
      now: () => /* @__PURE__ */ new Date(),
      clearSavedPreferences,
      cancelPendingFirstRunNotice: preferences.cancelPendingFirstRunNotice
    });
    const { buildSettingsBackupPayload, importSettingsBackupPayload } = settingsBackup;
    const settingsFiles = PianoTrainerSettingsFiles.create({
      document,
      createReader: () => new FileReader(),
      createBlob: (parts, options) => new Blob(parts, options),
      createObjectURL: (blob) => URL.createObjectURL(blob),
      revokeObjectURL: (url) => URL.revokeObjectURL(url),
      now: () => /* @__PURE__ */ new Date(),
      buildPayload: buildSettingsBackupPayload,
      importPayload: importSettingsBackupPayload,
      alert: (message) => window.alert(language.translate(message)),
      reload: () => window.location.reload(),
      warn: (message, error) => console.warn(message, error)
    });
    const downloadSettingsBackup = settingsFiles.downloadSettingsBackup;
    const handleSettingsBackupImportFile = settingsFiles.handleSettingsBackupImportFile;
    const transposeCommands = PianoTrainerTransposeController.create({
      getApp: () => typeof AppState === "undefined" ? void 0 : AppState,
      getEngine: () => PianoTrainerTransposeEngine,
      getLoader: () => loadScoreIntoApp,
      syncUi: () => transposeControls.syncUiFromState(),
      setStatus: (text, error) => transposeControls.setStatus(text, error),
      reportError: (message, error) => console.error(message, error),
      errorText: (error, fallback) => {
        const message = error && (typeof error === "object" || typeof error === "function") && "message" in error ? error.message : null;
        return message ? String(message) : fallback;
      }
    });
    const transposeControls = PianoTrainerTransposeControls.create({ document, commands: transposeCommands, getEngine: () => PianoTrainerTransposeEngine });
    const TransposeUI = {
      ...transposeCommands,
      syncUiFromState: transposeControls.syncUiFromState,
      getPanel: transposeControls.getPanel,
      init: () => {
        transposeCommands.init();
        transposeControls.init();
      },
      dispose: () => {
        transposeControls.dispose();
        transposeCommands.dispose();
      }
    };
    const toolbarUi = PianoTrainerToolbar.create({
      document,
      window,
      storage: localStorage,
      state: AppState,
      refreshScoresDrawer: () => refreshScoresDrawer()
    });
    const positionScoresPanel = toolbarUi.positionScoresPanel;
    const syncToolbarButtonStates = toolbarUi.syncToolbarButtonStates;
    const hideToolbarPanels = toolbarUi.hideToolbarPanels;
    const closeToolbarPanel = toolbarUi.closeToolbarPanel;
    const isAnyToolbarPanelOpen = toolbarUi.isAnyToolbarPanelOpen;
    const ToolbarUI = {
      syncToolbarButtonStates,
      showToolbarPanel: toolbarUi.showToolbarPanel,
      closeToolbarPanel,
      hideToolbarPanels,
      toggleToolbarPanel: toolbarUi.toggleToolbarPanel,
      isAnyToolbarPanelOpen,
      positionScoresPanel,
      init: toolbarUi.init,
      dispose: toolbarUi.dispose
    };
    const IntroUI = {
      maybeShowFirstRunIntro: toolbarUi.maybeShowFirstRunIntro,
      showFirstRunIntro: toolbarUi.showFirstRunIntro,
      closeFirstRunIntro: toolbarUi.closeFirstRunIntro,
      markFirstRunIntroSeen: toolbarUi.markFirstRunIntroSeen
    };
    const ScoreLibrary = PianoTrainerScoreLibrary.create({
      hasIndexedDB: () => "indexedDB" in window,
      getIndexedDB: () => window.indexedDB,
      makeId: () => {
        if (window.crypto?.randomUUID)
          return window.crypto.randomUUID();
        return `ptlib-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      },
      now: () => Date.now(),
      isoNow: () => (/* @__PURE__ */ new Date()).toISOString(),
      storage: { getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) },
      starterUrl: new URL("assets/Starter_Scores.json", document.baseURI).toString(),
      fetch: (...args) => fetch(...args),
      format: { getScoreFileTypeFromName: (name) => getScoreFileTypeFromName(name), getScoreDisplayTitle: (name) => getScoreDisplayTitle(name) }
    });
    const getScoreLibraryFolderLabel = PianoTrainerScoreLibrary.getScoreLibraryFolderLabel;
    const libraryUiLifetime = PianoTrainerLibraryControlsState.createLifetime();
    const librarySelection = PianoTrainerLibraryControlsState.create(AppState);
    const libraryDialogs = PianoTrainerLibraryDialogs.create({ document, library: ScoreLibrary, lifetime: libraryUiLifetime });
    const libraryUiPorts = {
      document,
      window,
      state: AppState,
      library: ScoreLibrary,
      lifetime: libraryUiLifetime,
      selection: librarySelection,
      format: { getScoreDisplayTitle: (name = "") => getScoreDisplayTitle(name), getScoreFileTypeFromName: (name = "") => getScoreFileTypeFromName(name) },
      prompt: (...args) => args.length === 1 ? window.prompt(language.translate(args[0])) : window.prompt(language.translate(args[0]), args[1]),
      confirm: (message) => window.confirm(language.translate(message)),
      alert: (message) => window.alert(language.translate(message)),
      reportError: (...args) => console.error(...args)
    };
    const libraryActions = PianoTrainerLibraryActions.create({
      ...libraryUiPorts,
      dialogs: libraryDialogs,
      now: () => Date.now(),
      url: URL,
      refreshScoresDrawer: () => scoresDrawer.refreshScoresDrawer(),
      ensureScoresDrawerOpen: () => scoresDrawer.ensureScoresDrawerOpen(),
      getConverter: () => MidiImport,
      readScoreFile: (file) => readScoreFile(file)
    });
    const libraryRows = PianoTrainerLibraryList.create({
      ...libraryUiPorts,
      dialogs: libraryDialogs,
      refreshScoresDrawer: () => scoresDrawer.refreshScoresDrawer(),
      createLibraryFolder: () => libraryActions.createLibraryFolder(),
      openScoresImportPicker: () => scoresDrawer.openScoresImportPicker(),
      closeScoresDrawer: () => scoresDrawer.closeScoresDrawer(),
      getScoreLibraryFolderLabel,
      loadScoreIntoApp: (raw, options) => loadScoreIntoApp(raw, options)
    });
    const scoresDrawer = PianoTrainerScoresDrawer.create({
      ...libraryUiPorts,
      rows: libraryRows,
      actions: libraryActions,
      getToolbar: () => ToolbarUI,
      openScoreFilePicker: () => openScoreFilePicker(),
      getScoreLibraryFolderLabel,
      positionScoresPanel: () => positionScoresPanel(),
      reportWarning: (message, error) => console.warn(message, error)
    });
    const refreshScoresDrawer = () => scoresDrawer.refreshScoresDrawer();
    function initScoresDrawerShell() {
      libraryUiLifetime.init();
      scoresDrawer.init();
    }
    function disposeScoresUi() {
      libraryUiLifetime.dispose();
      libraryDialogs.dispose();
      libraryRows.dispose();
      scoresDrawer.dispose();
    }
    const ScoresUI = {
      ...libraryActions,
      refreshScoresDrawer,
      promptForLibraryFolderChoice: libraryDialogs.promptForLibraryFolderChoice,
      initScoresDrawerShell,
      init: initScoresDrawerShell,
      dispose: disposeScoresUi,
      closeScoresDrawer: scoresDrawer.closeScoresDrawer,
      updateScoresActionButtonsState: scoresDrawer.updateScoresActionButtonsState
    };
    const connectionStatus = PianoTrainerConnectionStatus.create({
      document,
      state: AppState,
      getPort: (direction, id) => getLegacyMidiPort(direction, id),
      syncMidiOutChannelVisibility: () => syncMidiOutChannelVisibility(),
      syncWledStatus: () => syncWledStatus()
    });
    const updateConnectionStatuses = connectionStatus.updateConnectionStatuses;
    const refreshConnectionStatuses = connectionStatus.refreshConnectionStatuses;
    const updateController = PianoTrainerUpdateController.create({
      state: AppState,
      version: APP_VERSION,
      releaseUrl: UPDATE_RELEASES_URL,
      manifestUrl: UPDATE_MANIFEST_URL,
      storage: localStorage,
      keys: { assetOverride: ASSET_VERSION_OVERRIDE_STORAGE_KEY, manifestUrl: UPDATE_MANIFEST_URL_STORAGE_KEY },
      location: window.location,
      replaceHistory: (path) => window.history.replaceState({}, "", path),
      fetch: (url, options) => fetch(url, options),
      createAbortController: () => new AbortController(),
      nowMs: () => Date.now(),
      getErrorMessage: getUnknownErrorMessage,
      setChecking: () => updateControls.setChecking(),
      syncControls: () => updateControls.syncUpdateControls()
    });
    const updateControls = PianoTrainerUpdateControls.create({
      document,
      state: AppState,
      version: APP_VERSION,
      commands: updateController,
      open: (url, target, features) => {
        window.open(url, target, features);
      },
      alert: (message) => window.alert(language.translate(message)),
      confirm: (message) => window.confirm(language.translate(message))
    });
    const initUpdateControls = updateControls.init;
    function createLegacyLedResources() {
      return PianoTrainerLegacyLedResources.create({
        setTimer: (callback, delay) => window.setTimeout(callback, delay),
        clearTimer: (id) => window.clearTimeout(id),
        setInterval: (callback, delay) => window.setInterval(callback, delay),
        clearInterval: (id) => window.clearInterval(id),
        requestFrame: (callback) => window.requestAnimationFrame(callback),
        cancelFrame: (id) => window.cancelAnimationFrame(id),
        createReader: () => new FileReader(),
        createRequest: () => new AbortController(),
        createUrl: (blob) => URL.createObjectURL(blob),
        revokeUrl: (url) => URL.revokeObjectURL(url),
        createLink: () => document.createElement("a")
      });
    }
    const legacyLedResources = createLegacyLedResources();
    const legacyLed = window.PianoTrainerLegacyLed.create({
      state: AppState,
      document,
      storage: localStorage,
      console,
      fetch: (url, options) => fetch(url, options),
      resources: legacyLedResources,
      view: {
        get innerHeight() {
          return window.innerHeight;
        },
        crypto: window.crypto,
        alert: (message) => window.alert(language.translate(message)),
        confirm: (message) => window.confirm(language.translate(message))
      },
      keys: {
        LED_CALIBRATION_STORAGE_KEY,
        LED_COUNT_STORAGE_KEY,
        LED_FUTURE1_PCT_STORAGE_KEY,
        LED_FUTURE2_PCT_STORAGE_KEY,
        LED_MASTER_BRIGHTNESS_STORAGE_KEY,
        LED_OUTPUT_MODE_STORAGE_KEY,
        LED_REVERSE_STORAGE_KEY,
        WLED_DDP_DEBUG_STORAGE_KEY,
        WLED_IP_STORAGE_KEY,
        WLED_TRANSPORT_STORAGE_KEY,
        WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY
      },
      FULL_PIANO_KEY_COUNT,
      FULL_PIANO_MIDI_MIN,
      getMidiTest: () => legacyMidiLedTest.controller,
      clearWledPermissionHelp,
      closeToolbarPanel,
      getClampedNumber,
      getLegacyMidiOutput: (id) => getLegacyMidiOutput(id),
      getMidiKeyPosition01,
      getMidiLightsStatus: (status) => getMidiLightsStatus(status),
      getPlayerPlayableRange,
      getStoredBool,
      getWledPermissionHelpText,
      initUpdateControls,
      isLikelyBrowserAccessIssue,
      normalizeLedCount,
      normalizeLedFuturePct,
      normalizeLedMasterBrightness,
      rememberOutgoingMidiMessage: (status, note, velocity) => rememberOutgoingMidiMessage(status, note, velocity),
      renderVirtualKeyboard: () => renderVirtualKeyboard(),
      setStoredBool,
      showWledPermissionHelp,
      syncToolbarButtonStates,
      updateConnectionStatuses,
      wipeHardwareLEDs: () => wipeHardwareLEDs()
    });
    const {
      LedEngine,
      WLEDController,
      initLedCountControl,
      initLedBrightnessControls,
      initLedCalibrationControls,
      initLedOutputControls,
      updateLedKeyMapping,
      positionLedCalibrationPanel,
      legacyUpdateLEDHardware,
      legacyWipeHardwareLEDs,
      setLedCount,
      setLedMasterBrightness,
      setLedFuture1BrightnessPct,
      setLedFuture2BrightnessPct,
      resetAllLedCalibration,
      setWledIp,
      setLedOutputMode,
      syncLedBrightnessControls,
      syncLedOutputModeControls,
      syncWledStatus,
      selectLedCalibrationMidi,
      buildChromaticTestNotes
    } = legacyLed;
    const syncSettingsDebugVisibility = legacyLed.syncWledTransportControls;
    const optionalLedEnabled = typeof window.__PT_BOOT_OPTIONS__?.ledEnabled === "boolean" ? window.__PT_BOOT_OPTIONS__.ledEnabled : new URLSearchParams(window.location.search).get("led") !== "off";
    const optionalLedOutput = optionalLedEnabled ? PianoTrainerOptionalLed.createLegacy({
      initControls: () => {
        legacyLed.activate();
        initLegacyMidiLedTest();
        initLedCountControl();
        initLedBrightnessControls();
        initLedCalibrationControls();
      },
      initOutput: () => {
        legacyLed.activate();
        LedEngine.init();
        WLEDController.clearLastSignature();
        initLedOutputControls();
      },
      refreshMapping: () => updateLedKeyMapping(),
      invalidate: () => WLEDController.clearLastSignature(),
      positionCalibrationPanel: () => positionLedCalibrationPanel(),
      render: (states, depth) => {
        if (depth !== void 0) LedEngine.config.futurePreview = depth;
        LedEngine.renderFromStates(states);
        LedEngine.renderOutputs();
      },
      renderOutputs: () => LedEngine.renderOutputs(),
      updateHardware: (midi, next, previous) => legacyUpdateLEDHardware(midi, next, previous),
      wipeHardware: () => legacyWipeHardwareLEDs(),
      clearOutputs: async () => {
        await WLEDController.forceClear();
      },
      isCalibrating: () => AppState.ledCalibrationMode,
      renderKeyboard: () => renderVirtualKeyboard(),
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (id) => window.cancelAnimationFrame(id),
      stopHardwareResources: () => {
        legacyMidiLedTest.dispose();
        legacyLed.dispose();
      }
    }) : PianoTrainerOptionalLed.createNoop();
    function wipeHardwareLEDs() {
      optionalLedOutput.wipeHardware();
    }
    const optionalLedPreferences = {
      reset() {
        if (!optionalLedOutput.enabled) return;
        setLedCount(88);
        setLedMasterBrightness(25);
        setLedFuture1BrightnessPct(1);
        setLedFuture2BrightnessPct(1);
        resetAllLedCalibration();
        setWledIp("");
        setLedOutputMode("none");
      },
      syncControls() {
        if (!optionalLedOutput.enabled) return;
        syncLedBrightnessControls();
        syncLedOutputModeControls();
      }
    };
    if (!optionalLedOutput.enabled) {
      const settings = document.getElementById("fs-led-setup");
      if (settings instanceof HTMLFieldSetElement) {
        settings.disabled = true;
        settings.classList.add("hidden");
      }
    }
    const playerRangeControls = PianoTrainerPlayerRangeControls.create({
      document,
      state: AppState,
      normalize: normalizePlayerPianoType,
      derive: derivePlayerRangeFromKeyboardSize,
      getRange: getPlayerPlayableRange,
      inRange: isMidiInPlayerRange,
      readSaved: () => localStorage.getItem(PLAYER_PIANO_STORAGE_KEY),
      save: (value) => localStorage.setItem(PLAYER_PIANO_STORAGE_KEY, value),
      renderKeyboard: () => renderVirtualKeyboard(),
      led: optionalLedOutput
    });
    const initPlayerPianoTypeControl = playerRangeControls.init;
    const setPlayerPianoType = playerRangeControls.setPlayerPianoType;
    const midiEchoFilter = PianoTrainerMidiInput.createEchoFilter(AppState, () => performance.now());
    function dispatchTrainerNoteInput(input) {
      practiceInput.handle(input);
    }
    const midiService = PianoTrainerMidiService.create({
      requestAccess: navigator.requestMIDIAccess ? () => navigator.requestMIDIAccess() : null,
      onReady: () => midiControls.onReady(),
      onDevicesChanged: () => midiControls.onDevicesChanged(),
      onAccessError: (error) => {
        console.warn("MIDI Access Denied", error);
        showMidiPermissionHelp(getMidiPermissionHelpText());
      },
      selectedInputChannel: () => midiControls.getSelectedMidiInChannel(),
      isEcho: (status, note, velocity) => midiEchoFilter.isRecent(status, note, velocity),
      dispatch: (input) => dispatchTrainerNoteInput(input),
      nowMs: () => performance.now()
    });
    const midiOutput = PianoTrainerMidiOutput.create({
      getOutput: () => {
        const id = midiControls.getSelectedOutputId();
        if (id === "none") return null;
        const output = midiService.getOutput(id);
        return output && output.state !== "disconnected" ? output : null;
      },
      getChannel: () => AppState.midiOutChannel,
      getVolume: () => AppState.midiOutVolume,
      normalizeChannel: (value) => normalizeMidiChannel(value, 1),
      normalizeVelocity: (value) => PianoTrainerVelocity.normalizeLiveVelocity(value).midi,
      remember: (status, note, velocity) => midiEchoFilter.remember(status, note, velocity),
      setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
      clearTimer: (id) => window.clearTimeout(id)
    });
    const midiControls = PianoTrainerMidiControls.create({
      document,
      storage: localStorage,
      keys: PREFERENCE_STORAGE_KEYS,
      normalizeMidiChannel,
      normalizeMidiInputChannel,
      setStoredBool,
      state: AppState,
      service: midiService,
      optionalLedEnabled: optionalLedOutput.enabled,
      ledTest: () => legacyMidiLedTest.controller,
      updateConnections: () => updateConnectionStatuses(),
      refreshConnections: () => refreshConnectionStatuses(),
      clearPermissionHelp: () => clearMidiPermissionHelp(),
      syncRouting: () => {
        if (typeof syncTrainerRoutingUiState === "function") syncTrainerRoutingUiState();
      },
      sendExpression: () => midiOutput.expression(),
      wipeLed: () => wipeHardwareLEDs(),
      renderKeyboard: () => renderVirtualKeyboard()
    });
    function setupMIDI() {
      return midiService.init();
    }
    function populateMIDIDevices() {
      midiControls.populateMIDIDevices();
    }
    function syncMidiOutChannelVisibility() {
      midiControls.syncMidiOutChannelVisibility();
    }
    function getSelectedMidiLightsChannel() {
      return midiControls.getSelectedMidiLightsChannel();
    }
    function getLegacyMidiPort(direction, id) {
      return midiService.getPort(direction, id);
    }
    function getLegacyMidiOutput(id) {
      return midiService.getOutput(id);
    }
    function getMidiStatus(baseStatus, channelOneBased) {
      return baseStatus + (normalizeMidiChannel(channelOneBased, 1) - 1);
    }
    function getMidiLightsStatus(baseStatus) {
      return getMidiStatus(baseStatus, AppState.midiLightsChannel || 1);
    }
    function rememberOutgoingMidiMessage(status, note, velocity) {
      midiEchoFilter.remember(status, note, velocity);
    }
    function getSelectedMidiOutOutput() {
      return midiOutput.getOutput();
    }
    function sendMidiOutExpressionLevel(value = AppState.midiOutVolume) {
      return midiOutput.expression(value);
    }
    const legacyMidiLedTestResources = createLegacyLedResources();
    const legacyMidiLedTest = window.PianoTrainerLegacyMidiLedTest.create({
      state: AppState,
      document,
      console,
      resources: legacyMidiLedTestResources,
      LedEngine,
      buildChromaticTestNotes,
      getLegacyMidiOutput: (id) => getLegacyMidiOutput(id),
      getMidiStatus,
      getPlayerPlayableRange,
      getSelectedMidiLightsChannel,
      optionalLedOutput,
      rememberOutgoingMidiMessage,
      renderVirtualKeyboard: () => renderVirtualKeyboard(),
      wipeHardwareLEDs
    });
    const initLegacyMidiLedTest = legacyMidiLedTest.init;
    const webmscoreAdapter = PianoTrainerWebmscoreAdapter.create({ document, getVendor: () => window.WebMscore });
    const conversionFileReader = PianoTrainerScoreFileReader.create({
      createReader: () => new FileReader(),
      format: { getScoreFileTypeFromName: (name) => getScoreFileTypeFromName(name), getScoreDisplayTitle: (name) => getScoreDisplayTitle(name) }
    });
    const scoreConversion = PianoTrainerScoreConversion.create({
      ensureWebMscoreLoaded: () => webmscoreAdapter.ensureWebMscoreLoaded(),
      readArrayBuffer: (file) => conversionFileReader.readArrayBuffer(file),
      getLoader: () => loadScoreIntoApp,
      reportError: (message, error) => console.error(message, error)
    });
    const MidiImport = { ...scoreConversion, dispose: () => {
      scoreConversion.dispose();
      conversionFileReader.dispose();
      webmscoreAdapter.dispose();
    } };
    const geometryEngine = PianoTrainerGeometry.create({
      score: {
        getGraphicalNote: (note, measure, staff) => osmdAdapter.getGraphicalNote(note, measure, staff),
        getMeasureBox: (measure, staff, units) => osmdAdapter.getMeasureBox(measure, staff, units),
        getCursorElement: () => horizontalScore.getCursorElement(),
        getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndex(),
        getStaffTopY: (measure, staff) => horizontalScore.staffTopY(staff) ?? osmdAdapter.getStaffTopY(measure, staff)
      },
      document,
      getSvg: () => horizontalScore.getSvg(),
      getComputedStyle: (node) => window.getComputedStyle(node),
      clearOverlays: () => {
        feedbackOverlay.clear();
        loopOverlay.clear();
        feedbackDebug?.clearSvgDebug();
      },
      fallbackHands: () => AppState.hands,
      describeNote: (note, measure, staff) => describeLogicalNoteForDebug(note, measure, staff),
      describeGraphicalNote: (note) => describeGraphicalNoteForDebug(note),
      debugLog: (name, detail) => debugLogAnchorResolution(name, detail)
    });
    const feedbackOverlay = PianoTrainerFeedbackOverlay.create({
      projectMarker: projectDisplayReference,
      state: AppState,
      document,
      getSvg: () => geometryEngine.getSvg(),
      ensureGroup: (id) => geometryEngine.ensureGroup(id),
      getCurrentContextKey: () => getCurrentFeedbackContext().key
    });
    const loopOverlay = PianoTrainerLoopOverlay.create({
      displayMeasures: () => horizontalScore.measureBoxes(),
      bounds: AppState.looper,
      document,
      getSvg: () => geometryEngine.getSvg(),
      ensureGroup: (id) => geometryEngine.ensureGroup(id),
      enabled: () => {
        const control = document.getElementById("check-looper");
        if (!(control instanceof HTMLInputElement)) throw new Error("Missing required loop control: check-looper");
        return control.checked;
      },
      measureCount: () => osmdAdapter.getMeasureCount(),
      measureBox: (index, staff) => geometryEngine.getMeasureBox(index, staff)
    });
    const GeometryEngine = Object.assign(geometryEngine, {
      getFeedbackGroup: () => feedbackOverlay.getGroup(),
      getLooperGroup: () => loopOverlay.getGroup(),
      clearSvgFeedback: () => feedbackOverlay.clear(),
      clearSvgLooper: () => loopOverlay.clear(),
      drawFeedbackMarker: (anchor, correct) => feedbackOverlay.drawMarker(anchor, correct),
      drawStoredFeedbackMarker: (marker) => feedbackOverlay.drawStoredMarker(marker),
      renderLooper: () => loopOverlay.render()
    });
    function renderFeedbackOverlay() {
      feedbackOverlay.render();
    }
    const feedbackDebug = PianoTrainerFeedbackDebug.create({
      document,
      state: AppState,
      captureDisplay: captureDisplayReference,
      projectNote: projectDisplayReference,
      getSvg: () => GeometryEngine.getSvg(),
      ensureGroup: (id) => GeometryEngine.ensureGroup(id),
      readEnabled: () => getStoredBool(SETTINGS_DEBUG_STORAGE_KEY, false),
      saveEnabled: (enabled) => setStoredBool(SETTINGS_DEBUG_STORAGE_KEY, enabled),
      publishStickyEnabled: () => {
      },
      setInterval: (callback, delay) => window.setInterval(callback, delay),
      clearInterval: (id) => window.clearInterval(id),
      now: () => /* @__PURE__ */ new Date(),
      log: (...args) => console.log(...args),
      warn: (...args) => console.warn(...args),
      error: (...args) => console.error(...args)
    });
    const debugLogEvent = (label, payload = {}) => feedbackDebug.debugLogEvent(label, payload);
    const describeLogicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeLogicalNoteForDebug;
    const describeGraphicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeGraphicalNoteForDebug;
    const debugLogAnchorResolution = (label, payload = {}) => feedbackDebug.debugLogAnchorResolution(label, payload);
    const setDebugEnabled = (enabled, options = {}) => feedbackDebug.setDebugEnabled(enabled, options);
    const clearStickyDebug = () => feedbackDebug.clearStickyDebug();
    const osmdAdapter = PianoTrainerOsmdAdapter.create({
      getRenderer: () => osmd,
      describeNote: (note, measure, staff) => describeLogicalNoteForDebug(note, measure, staff),
      describeGraphicalNote: (note) => describeGraphicalNoteForDebug(note),
      debugLog: (name, detail) => debugLogAnchorResolution(name, detail),
      reportError: (message, error) => console.error(message, error)
    });
    const performancePosition = PianoTrainerPerformancePosition.create({
      getTrace: osmdAdapter.getPerformanceTrace,
      getTraceStepIndex: osmdAdapter.getTraceStepIndex,
      getScoreRevision: osmdAdapter.getScoreRevision,
      changed: () => {
        horizontalScore.paint();
        handleAutoScroll();
      }
    });
    const horizontalScore = PianoTrainerHorizontalScore.create({
      container: requireScoreDisplayElement("osmd-container", HTMLElement),
      area: requireScoreDisplayElement("music-area", HTMLElement),
      source: osmdAdapter,
      currentEvent: performancePosition.current,
      loopSettings: () => ({ enabled: playbackControls.isLoopEnabled(), min: playbackControls.readLoopMin(), max: playbackControls.readLoopMax() }),
      follows: () => requireScoreDisplayElement("check-autoscroll", HTMLInputElement).checked,
      refreshed: (immediate) => {
        GeometryEngine.invalidate();
        for (const expected of AppState.expectedNotes) expected.anchor = getPresentedNoteAnchor(expected.noteRef, expected.mIdx, Number(expected.staffId) - 1);
        renderFeedbackOverlay();
        feedbackDebug.renderStickyDebug();
        renderLooper();
        ScoreDisplay.follow({ immediate });
      },
      reportError: (error) => console.error("Could not prepare horizontal score:", error)
    });
    function getPresentedNoteAnchor(ref, measure, staff) {
      if (horizontalScore.isActive()) return horizontalScore.anchor(ref);
      const note = osmdAdapter.resolveNote(ref);
      return note ? GeometryEngine.getNoteAnchor(note, measure, staff) : null;
    }
    function captureDisplayReference(midi, staff, anchor) {
      const event = performancePosition.current();
      if (!event) return {};
      const effectiveStaff = staff ?? (midi >= 60 ? AppState.hands.right : AppState.hands.left) ?? AppState.hands.right ?? 1;
      const ref = AppState.expectedNotes.find((note) => note.midi === midi && note.staffId === effectiveStaff)?.noteRef || event.notes.find((note) => note.staffIndex === effectiveStaff - 1)?.sourceNoteRef;
      const point = ref ? getPresentedNoteAnchor(ref, event.source.sourceMeasureIndex, effectiveStaff - 1) : null;
      return {
        performance: event,
        ...ref ? { referenceNoteRef: ref } : {},
        ...point ? { displayOffset: { x: anchor.x - point.x, y: anchor.y - point.y } } : {}
      };
    }
    function projectDisplayReference(marker) {
      if (!marker.performance || !marker.referenceNoteRef) return marker.anchor;
      const point = horizontalScore.isActive() ? horizontalScore.anchor(marker.referenceNoteRef, marker.performance) : (() => {
        const note = osmdAdapter.resolveNote(marker.referenceNoteRef);
        const staff = marker.performance.notes.find((entry) => entry.sourceNoteRef.id === marker.referenceNoteRef.id)?.staffIndex ?? Math.max(0, Number(marker.staffId) - 1);
        return note ? GeometryEngine.getNoteAnchor(note, marker.performance.source.sourceMeasureIndex, staff) : null;
      })();
      return point ? { x: point.x + (marker.displayOffset?.x || 0), y: point.y + (marker.displayOffset?.y || 0) } : null;
    }
    const getResolvedStaffAssignmentIdFromNote = osmdAdapter.resolveStaffIdFromNote;
    const getResolvedStaffAssignmentIdFromEntry = osmdAdapter.resolveStaffIdFromEntry;
    function requireScoreDisplayElement(id, type) {
      const element = document.getElementById(id);
      if (!(element instanceof type)) throw new Error(`Missing required score display element: ${id}`);
      return element;
    }
    const ScoreDisplay = PianoTrainerScoreViewport.create({
      traditional: {
        read: () => {
          const painted = osmdAdapter.readPaintedPosition(), cursor = osmdAdapter.getCursorElement();
          if (!painted || !cursor || cursor.style.display === "none") return null;
          const area = requireScoreDisplayElement("music-area", HTMLElement), rect = area.getBoundingClientRect(), cursorRect = cursor.getBoundingClientRect();
          const raw = osmdAdapter.getSystemForMeasure(painted.measureIndex);
          const svg = raw ? requireScoreDisplayElement("source-score", HTMLElement).querySelectorAll("svg")[raw.pageIndex] : null;
          const system = raw && svg ? systemBoundsInContent(raw, svg, area) : null;
          const event = performancePosition.current();
          const matching = event && event.scoreRevision === painted.scoreRevision && event.traceStepIndex === painted.traceStepIndex && event.source.sourceMeasureIndex === painted.measureIndex && event.source.timestampWhole === painted.timestampWhole ? event : null;
          const controls = area.querySelector(".score-overlay-controls")?.getBoundingClientRect();
          return {
            position: {
              ...painted,
              systemId: system?.systemId ?? null,
              occurrenceId: matching?.measureOccurrenceId ?? null,
              eventId: matching?.eventId ?? null,
              runId: matching?.runId ?? null,
              loopIteration: matching?.loopIteration ?? null,
              reason: matching?.reason ?? null
            },
            system,
            cursor: { top: cursorRect.top - rect.top - area.clientTop + area.scrollTop, bottom: cursorRect.bottom - rect.top - area.clientTop + area.scrollTop },
            mode: AppState.mode === "wait" ? "wait" : AppState.mode === "follow" ? "follow" : "realtime",
            topObstruction: controls ? Math.max(0, controls.bottom - rect.top - area.clientTop + 4) : 0
          };
        },
        buildProgress: (system, position) => {
          try {
            return buildSystemProgress({
              trace: osmdAdapter.getPerformanceTrace(),
              traceStepIndex: position.traceStepIndex,
              firstMeasureIndex: system.firstMeasureIndex,
              lastMeasureIndex: system.lastMeasureIndex,
              loopMax: playbackControls.isLoopEnabled() ? playbackControls.readLoopMax() - 1 : null,
              getMeasureTimingInfo: scoreMeasureTiming.getInfo
            });
          } catch (_) {
            return null;
          }
        },
        readPlayback: (position) => {
          const window2 = trainerPlayback.readDisplayWindow();
          if (!AppState.isPlaying || AppState.countInActive || position.eventId === null || !window2 || window2.eventId !== position.eventId || window2.traceStepIndex !== position.traceStepIndex || window2.measureIndex !== position.measureIndex || window2.timestampWhole !== position.timestampWhole || window2.endSec <= window2.startSec) return null;
          const now = playbackClock.nowSeconds();
          return { fraction: Math.max(0, Math.min(1, (now - window2.startSec) / (window2.endSec - window2.startSec))), moving: now < window2.endSec };
        },
        lifecycle: document,
        isPlaying: () => AppState.isPlaying
      },
      elements: {
        area: requireScoreDisplayElement("music-area", HTMLElement),
        wrapper: requireScoreDisplayElement("canvas-wrapper", HTMLElement),
        layout: requireScoreDisplayElement("select-score-layout", HTMLSelectElement),
        autoScroll: requireScoreDisplayElement("check-autoscroll", HTMLInputElement)
      },
      score: {
        ...osmdAdapter,
        getCursorElement: horizontalScore.getCursorElement,
        setLayout: (horizontal, defaults) => {
          osmdAdapter.setLayout(false, defaults);
          horizontalScore.setMode(horizontal);
        }
      },
      refreshPresentation: () => {
        void horizontalScore.refresh();
      },
      state: AppState,
      storage: localStorage,
      storageKey: TRAINER_SCORE_LAYOUT_STORAGE_KEY,
      getSvg: () => horizontalScore.getSvg(),
      getAnchor: (ref, measureIndex, staffIndex) => {
        return getPresentedNoteAnchor(ref, measureIndex, staffIndex);
      },
      clearFeedbackPreserveScoring: () => clearFeedbackVisualStatePreserveScoring(),
      renderScoreAndRefreshGeometry: () => scoreRenderer.renderScoreAndRefreshGeometry(),
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (id) => window.cancelAnimationFrame(id),
      prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
    const scoreRenderer = PianoTrainerScoreRenderer.create({
      beforeRender: ScoreDisplay.beforeRender,
      score: osmdAdapter,
      invalidateGeometry: () => GeometryEngine.invalidate(),
      afterRender: () => ScoreDisplay.afterRender(),
      renderFeedback: () => renderFeedbackOverlay(),
      renderLoop: () => GeometryEngine.renderLooper(),
      renderDebug: () => feedbackDebug?.renderStickyDebug()
    });
    function renderScoreAndRefreshGeometry() {
      scoreRenderer.renderScoreAndRefreshGeometry();
    }
    function handleAutoScroll() {
      ScoreDisplay.autoScroll();
    }
    const sharedScoreTraversal = PianoTrainerScoreTraversal.create({
      state: AppState,
      getCursor: () => osmdAdapter.getTraversalCursor(),
      getIndependentIterator: osmdAdapter.getIndependentIterator,
      resolveStaffId: (note) => getResolvedStaffAssignmentIdFromNote(note),
      isPracticeHandEnabled: (staffId) => isPracticeHandEnabledForStaff(staffId),
      getHandRole: (staffId) => getAssignedHandRoleForStaff(staffId),
      isMidiInRange: (midi) => isMidiInPlayerRange(midi),
      debugLog: (name, detail) => debugLogEvent(name, detail)
    });
    const collectFutureLedPreviewEvents = sharedScoreTraversal.collectFuturePreviewEvents;
    const audioOutput = PianoTrainerAudioOutput.create({
      tone: ports.audioTone ?? Tone,
      state: AppState,
      sampleExtension: () => getPreferredPianoSampleExtension(),
      setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
      clearTimer: (id) => window.clearTimeout(id),
      warn: (message, error) => console.warn(message, error)
    });
    const audioRouting = PianoTrainerAudioRouting.create({
      state: AppState,
      audio: audioOutput,
      midi: midiOutput,
      setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
      clearTimer: (id) => window.clearTimeout(id)
    });
    function applyToneLatencyProfileForMode(mode = AppState.mode) {
      audioOutput.applyToneLatencyProfileForMode(mode);
    }
    function ensurePianoSamplerLoaded() {
      return audioOutput.ensurePianoSamplerLoaded();
    }
    function ensureLiveAudioReady() {
      return audioOutput.ensureLiveAudioReady();
    }
    function getLiveAudioTime() {
      return audioOutput.getLiveAudioTime();
    }
    const scoreMeasureTiming = PianoTrainerMeasureTiming.create({
      getMeasure: (index) => osmdAdapter.getSourceMeasure(index),
      getMeasureCount: () => osmdAdapter.getSourceMeasureCount(),
      getCursor: () => osmdAdapter.getTraversalCursor(),
      getIndependentIterator: osmdAdapter.getIndependentIterator,
      restoreToPosition: (measure, timestamp) => sharedScoreTraversal.restoreToMeasureAndTimestamp(measure, timestamp)
    });
    const metronomeClock = PianoTrainerPlaybackClock.create({
      nowSeconds: () => Tone.now(),
      monotonicMilliseconds: () => performance.now(),
      setTimer: (callback, delay) => window.setTimeout(callback, delay),
      clearTimer: (id) => window.clearTimeout(id),
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (id) => window.cancelAnimationFrame(id)
    });
    const metronomeOutput = PianoTrainerMetronomeOutput.create({ tone: ports.metronomeTone ?? Tone });
    const tempoPulseUi = PianoTrainerTempoPulse.create(() => document.getElementById("btn-tempo"));
    const trainerMetronome = PianoTrainerMetronome.create({
      state: AppState,
      clock: metronomeClock,
      audio: metronomeOutput,
      midi: {
        isAvailable: () => !!midiOutput.getOutput(),
        percussionClick: (note, velocity, duration) => midiOutput.percussionClick(note, velocity, duration)
      },
      timing: scoreMeasureTiming,
      isEnabled: () => {
        const checkbox = document.getElementById("check-metronome");
        return checkbox instanceof HTMLInputElement && checkbox.checked;
      },
      getVolume: () => {
        const slider = document.getElementById("slider-metro-vol");
        return slider instanceof HTMLInputElement ? slider.value : void 0;
      },
      getPulseTarget: tempoPulseUi.getTarget,
      getLiveAudioTime: () => getLiveAudioTime(),
      getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndex(),
      getCountInBeats: (measure) => osmdAdapter.getCountInBeats(measure)
    });
    function getMeasureTimingInfo(index) {
      return scoreMeasureTiming.getInfo(index);
    }
    const rebuildMeasureTimingCache = scoreMeasureTiming.rebuild;
    const clearTempoVisualPulse = trainerMetronome.clearTempoVisualPulse;
    const clearScheduledMetronomeEvents = trainerMetronome.clearScheduledMetronomeEvents;
    const stopWaitModeMetronome = trainerMetronome.stopWaitModeMetronome;
    const rebuildWaitModeMetronome = trainerMetronome.rebuildWaitModeMetronome;
    const practiceFeedback = PianoTrainerFeedbackState.create({
      getPerformanceEvent: performancePosition.current,
      captureDisplay: captureDisplayReference,
      state: AppState,
      getTraversalPosition: () => osmdAdapter.readPositions().traversal,
      resolveAnchor: (midi, staffId, measureIndex, anchor) => GeometryEngine.resolveFeedbackAnchor(midi, staffId, measureIndex, anchor),
      renderOverlay: () => renderFeedbackOverlay(),
      clearOverlay: () => GeometryEngine.clearSvgFeedback(),
      clearDebug: () => {
        if (typeof clearStickyDebug === "function") clearStickyDebug();
      },
      pushDebugFrame: (frame) => feedbackDebug?.pushStickyDebugFrame?.(frame)
    });
    const practiceScoring = PianoTrainerScoring.create({
      state: AppState,
      feedback: practiceFeedback,
      updateDisplay: () => updateScoreDisplay()
    });
    const practiceMatching = PianoTrainerInputMatching.create({
      state: AppState,
      getCursorX: () => GeometryEngine.getCursorSvgX(),
      debugLog: (name, detail) => debugLogEvent(name, detail)
    });
    const practiceEarlyGrace = PianoTrainerEarlyGrace.create({
      state: AppState,
      getHandRole: (staff) => getAssignedHandRoleForStaff(staff),
      isPracticeHandEnabled: (staff) => isPracticeHandEnabledForStaff(staff),
      getTimeline: () => sharedScoreTraversal.ensurePreviewTimelineBuilt(),
      findTimelineIndex: PianoTrainerScoreTraversal.findMatchingTimelineIndex,
      getBeatsToWait: (options) => PianoTrainerTiming.getTraversalBeatsToWait(options),
      getMeasureTimingInfo: (index) => getMeasureTimingInfo(index)
    });
    const practiceExpectedNotes = PianoTrainerExpectedNotes.create({
      state: AppState,
      getHandRole: (staff) => getAssignedHandRoleForStaff(staff),
      isMidiInRange: (midi) => isMidiInPlayerRange(midi),
      getAnchor: (ref, measureIndex, staffIndex) => {
        return getPresentedNoteAnchor(ref, measureIndex, staffIndex);
      },
      describeNote: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? describeLogicalNoteForDebug(note, measureIndex, staffIndex) : {};
      },
      feedback: practiceFeedback,
      scoring: practiceScoring,
      getTraversalTimestamp: () => osmdAdapter.readPositions().traversal?.timestampWhole ?? null,
      pushDebugFrame: (frame) => feedbackDebug?.pushStickyDebugFrame?.(frame),
      debugAnchor: (name, detail) => debugLogAnchorResolution(name, detail),
      debugLog: (name, detail) => debugLogEvent(name, detail)
    });
    const practiceSustains = PianoTrainerSustainState.create({
      state: AppState,
      renderKeyboard: () => renderVirtualKeyboard(),
      setTimer: (callback, delay) => window.setTimeout(callback, delay),
      clearTimer: (id) => window.clearTimeout(id)
    });
    const practiceInput = PianoTrainerInputController.create({
      state: AppState,
      audio: audioRouting,
      matching: practiceMatching,
      early: practiceEarlyGrace,
      feedback: practiceFeedback,
      scoring: practiceScoring,
      selectCalibration: (midi) => selectLedCalibrationMidi(midi),
      renderKeyboard: () => renderVirtualKeyboard(),
      advanceAfterHit: () => checkWaitModeAdvance(),
      debugLog: (name, detail) => debugLogEvent(name, detail)
    });
    function triggerVirtualKey(midi, down, source = "midi", velocity = 100) {
      practiceInput.handle({
        kind: down ? "note-on" : "note-off",
        note: midi,
        velocity,
        source,
        channel: null,
        receivedAtMs: performance.now()
      });
    }
    const getCurrentFeedbackContext = practiceFeedback.getCurrentFeedbackContext;
    function buildExpectedNotesFromEntries(entries, measureIndex, timestamp = null) {
      practiceExpectedNotes.build(osmdAdapter.readPracticeEntries(entries, (entry) => getResolvedStaffAssignmentIdFromEntry(entry)), measureIndex, timestamp);
    }
    const playbackClock = PianoTrainerPlaybackClock.create(ports.playbackClock ?? {
      nowSeconds: () => Tone.now(),
      monotonicMilliseconds: () => performance.now(),
      setTimer: (callback, delay) => window.setTimeout(callback, delay),
      clearTimer: (id) => window.clearTimeout(id),
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (id) => window.cancelAnimationFrame(id)
    });
    const playbackTransport = PianoTrainerToneTransport.create(Tone);
    const playbackControls = PianoTrainerPlaybackControls.create({ getElement: (id) => document.getElementById(id) });
    const playbackState = PianoTrainerPlaybackState.create({
      state: AppState,
      clearFeedbackPreserveScoring: practiceFeedback.clearPreserveScoring,
      clearTimer: (id) => practiceSustains.cancelTimer(id),
      wipeHardware: () => wipeHardwareLEDs(),
      renderKeyboard: () => renderVirtualKeyboard()
    });
    const trainerPlayback = PianoTrainerPlaybackCoordinator.create({
      presentation: {
        prepare: () => horizontalScore.ready(),
        present: () => {
          performancePosition.present();
        },
        navigate: (reason) => {
          performancePosition.navigate(reason);
        },
        loop: performancePosition.loop,
        traceStepIndex: osmdAdapter.getTraceStepIndex,
        eventId: () => performancePosition.current()?.eventId ?? null
      },
      state: AppState,
      clock: playbackClock,
      transport: playbackTransport,
      controls: playbackControls,
      transitions: playbackState,
      metronome: trainerMetronome,
      score: {
        hasCursor: osmdAdapter.hasCursor,
        isEndReached: osmdAdapter.isEndReached,
        readEvent: () => osmdAdapter.readPlaybackEvent((entry) => getResolvedStaffAssignmentIdFromEntry(entry)),
        getTimestamp: osmdAdapter.getCurrentTimestamp,
        getMeasureIndex: osmdAdapter.getCurrentMeasureIndex,
        getTempo: osmdAdapter.getPlaybackTempo,
        advance: osmdAdapter.advance,
        reset: osmdAdapter.reset,
        update: osmdAdapter.updateCursor,
        show: osmdAdapter.showCursor
      },
      audio: {
        schedule: audioRouting.schedulePlaybackForDestinations,
        silence: audioOutput.silence,
        ensureReady: ports.ensurePlaybackReady ?? audioOutput.ensureLiveAudioReady,
        applyLatencyProfile: () => audioOutput.applyToneLatencyProfileForMode()
      },
      midi: midiOutput,
      practice: {
        buildExpected: practiceExpectedNotes.build,
        getHandRole: (staff) => getAssignedHandRoleForStaff(staff),
        startSustains: practiceSustains.startVisualSustains,
        processMisses: practiceScoring.processMissedNotes
      },
      timing: {
        getTraversalBeatsToWait: (options) => PianoTrainerTiming.getTraversalBeatsToWait(options),
        getMeasureTimingInfo: scoreMeasureTiming.getInfo
      },
      ensureTimeline: () => {
        sharedScoreTraversal.ensurePreviewTimelineBuilt();
      },
      led: { wipeHardware: () => wipeHardwareLEDs(), clearOutputs: () => optionalLedOutput.clearOutputs() },
      ui: {
        scroll: () => handleAutoScroll(),
        cancelViewport: ScoreDisplay.cancel,
        clearSvgFeedback: GeometryEngine.clearSvgFeedback,
        updatePlayPause: () => updatePlayPauseButton(),
        hidePanels: () => hideToolbarPanels(),
        isFullscreenActive: () => isFullscreenActive(),
        requestFullscreen: () => requestAppFullscreen(),
        preserveScroll: (callback) => {
          preserveMusicAreaScroll(callback);
        },
        renderFeedback: () => renderFeedbackOverlay(),
        renderEventKeyboard: (event, measure, timestamp) => renderVirtualKeyboard(osmdAdapter.legacyEntriesForPlayback(event), measure, timestamp),
        updateScore: () => updateScoreDisplay(),
        updateTempoPercent: (value) => updateTempo("percent", value)
      }
    });
    const checkWaitModeAdvance = trainerPlayback.checkWaitModeAdvance;
    const startPlaybackFromToolbar = trainerPlayback.startPlaybackFromToolbar;
    const pausePlaybackFromToolbar = trainerPlayback.pausePlaybackFromToolbar;
    const resetPlaybackForLoadedScore = trainerPlayback.resetPlaybackForLoadedScore;
    const resetPlaybackFromToolbar = trainerPlayback.resetPlaybackFromToolbar;
    const silencePlaybackOutputsImmediately = trainerPlayback.silencePlaybackOutputsImmediately;
    const clearTransientPlaybackState = playbackState.clearTransient;
    const clearVisuals = playbackState.clearVisuals;
    const enforceLooperBounds = trainerPlayback.enforceLooperBounds;
    const renderLooper = GeometryEngine.renderLooper;
    const scoreFormat = PianoTrainerMusicXmlIO.create({
      getNormalizer: () => MidiImport && typeof MidiImport.normalizeScoreToMusicXml === "function" ? (rawData, options) => MidiImport.normalizeScoreToMusicXml(rawData, options) : null,
      warn: (message, error) => console.warn(message, error)
    });
    const scoreFileReader = PianoTrainerScoreFileReader.create({ createReader: () => new FileReader(), format: scoreFormat });
    const scoreLoader = PianoTrainerScoreLoader.create({
      beginLoad: horizontalScore.beginLoad,
      state: AppState,
      format: scoreFormat,
      score: osmdAdapter,
      prepareDisplay: async (raw, options, isActive) => {
        const currentXml = await scoreFormat.getCanonicalMusicXmlForTranspose(raw, options);
        if (!isActive()) throw new DOMException("Expired horizontal score load.", "AbortError");
        if (!currentXml) throw new Error("Could not obtain current MusicXML for horizontal presentation.");
        performancePosition.navigate("load");
        await horizontalScore.loaded(currentXml);
      },
      resetPlayback: () => resetPlaybackForLoadedScore(),
      resetTempo: () => {
        if (typeof updateTempo === "function") updateTempo("percent", 100);
      },
      render: () => renderScoreAndRefreshGeometry(),
      initSongUI: () => initSongUI(),
      scroll: () => handleAutoScroll(),
      getLibrary: () => ScoreLibrary,
      refreshLibrary: () => refreshScoresDrawer(),
      notifyTranspose: (skipReset) => {
        const transpose = TransposeUI;
        if (transpose && typeof transpose.handleScoreLoaded === "function") {
          if (!skipReset) transpose.handleScoreLoaded();
          else {
            transpose.refreshAvailabilityFromCurrentScore();
            transpose.syncUiFromState();
          }
        }
      },
      success: () => {
        console.error("File loaded successfully.");
        if (AppState.debugEventFlow || AppState.debugMatchLogs || AppState.debugAnchorResolution || AppState.debugPersistentAnchors) {
          console.error("[PianoTrainer debug LOAD] console logging active", {
            debugAnchors: AppState.debugPersistentAnchors,
            debugEventFlow: AppState.debugEventFlow,
            debugMatchLogs: AppState.debugMatchLogs,
            debugStickyFrames: AppState.debugStickyFrameLimit,
            expectedNotes: AppState.expectedNotes ? AppState.expectedNotes.length : null,
            ts: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      },
      reportError: (error) => {
        console.error("OSMD Load Error:", error);
        const message = error && (typeof error === "object" || typeof error === "function") && "message" in error ? error.message : null;
        window.alert(language.translate(message ? String(message) : "Error loading score file."));
      }
    });
    const scoreFileInput = document.getElementById("file-input");
    if (!(scoreFileInput instanceof HTMLInputElement)) throw new Error("Missing required score file input: file-input");
    const scoreFileControls = PianoTrainerScoreFileControls.create({
      input: scoreFileInput,
      resumeAudio: () => audioOutput.resumeWithoutWaiting(),
      readFile: (file) => scoreFileReader.readScoreFile(file),
      load: (rawData, options) => scoreLoader.loadScoreIntoApp(rawData, options),
      getConverter: () => MidiImport,
      closeDrawer: () => {
        if (ScoresUI && typeof ScoresUI.closeScoresDrawer === "function") ScoresUI.closeScoresDrawer();
      }
    });
    const getScoreFileTypeFromName = scoreFormat.getScoreFileTypeFromName;
    const getScoreDisplayTitle = scoreFormat.getScoreDisplayTitle;
    const readScoreFile = scoreFileReader.readScoreFile;
    const loadScoreIntoApp = scoreLoader.loadScoreIntoApp;
    const openScoreFilePicker = scoreFileControls.openScoreFilePicker;
    const displayControls = PianoTrainerDisplayControls.create({
      document,
      window,
      state: AppState,
      saveZoom: (value) => localStorage.setItem(TRAINER_ZOOM_STORAGE_KEY, value),
      hideToolbarPanels,
      reportWarning: (message, error) => console.warn(message, error),
      pause: () => pausePlaybackFromToolbar(),
      play: () => startPlaybackFromToolbar(),
      reset: () => resetPlaybackFromToolbar(),
      isReadyToRender: () => osmdAdapter.isReady(),
      setZoom: (value) => osmdAdapter.setZoom(value),
      clearFeedbackVisualStatePreserveScoring: () => {
      },
      renderScoreAndRefreshGeometry: () => renderScoreAndRefreshGeometry(),
      positionCalibrationPanel: () => optionalLedOutput.positionCalibrationPanel()
    });
    const tempoControls = PianoTrainerTempoControls.create({
      document,
      state: AppState,
      hasMidiOutput: () => !!getSelectedMidiOutOutput(),
      setBpm: (value) => playbackTransport.setBpm(value),
      getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndexIfAvailable(),
      getWaitMeasureIndex: () => trainerMetronome.getWaitMeasureIndex(),
      rebuildWaitModeMetronome: (index) => rebuildWaitModeMetronome(index),
      saveBool: (key, value) => setStoredBool({
        accentedDownbeat: ACCENTED_DOWNBEAT_STORAGE_KEY,
        visualPulse: VISUAL_PULSE_STORAGE_KEY,
        metronomeMidiOut: METRONOME_MIDIOUT_STORAGE_KEY
      }[key], value),
      clearTempoVisualPulse: () => clearTempoVisualPulse(),
      clearScheduledMetronomeEvents: () => clearScheduledMetronomeEvents(),
      stopWaitModeMetronome: () => stopWaitModeMetronome()
    });
    const audioLevelControls = PianoTrainerAudioLevelControls.create({
      document,
      state: AppState,
      save: (key, value) => localStorage.setItem({
        pianoVolume: TRAINER_PIANO_VOL_STORAGE_KEY,
        midiOutVolume: TRAINER_MIDIOUT_VOL_STORAGE_KEY,
        midiInBoost: TRAINER_MIDIIN_BOOST_STORAGE_KEY,
        metroVolume: METRONOME_VOL_STORAGE_KEY
      }[key], value),
      setPianoVolume: (value) => audioOutput.setPianoVolume(value),
      sendMidiOutExpressionLevel: (value) => sendMidiOutExpressionLevel(value),
      setMetronomeVolumeDecibels: (value) => metronomeOutput.setVolumeDecibels(value)
    });
    const loopControls = PianoTrainerLoopControls.create({
      document,
      window,
      state: AppState,
      renderLooper: () => {
        renderLooper();
        void horizontalScore.refresh();
      },
      enforceLooperBounds: () => enforceLooperBounds(),
      saveLoopCountIn: (value) => setStoredBool(LOOP_COUNT_IN_STORAGE_KEY, value)
    });
    const isFullscreenActive = displayControls.isFullscreenActive;
    const syncFullscreenUi = displayControls.syncFullscreenUi;
    const requestAppFullscreen = displayControls.requestAppFullscreen;
    const updatePlayPauseButton = displayControls.updatePlayPauseButton;
    const preserveMusicAreaScroll = displayControls.preserveMusicAreaScroll;
    const syncZoomControls = displayControls.syncZoomControls;
    const applyZoom = displayControls.applyZoom;
    const syncTempoMetronomeDependentUi = tempoControls.syncTempoMetronomeDependentUi;
    const updateTempo = tempoControls.updateTempo;
    const updatePianoVolume = audioLevelControls.updatePianoVolume;
    const updateMidiOutVolume = audioLevelControls.updateMidiOutVolume;
    const updateMidiInBoost = audioLevelControls.updateMidiInBoost;
    const updateMetroVolume = audioLevelControls.updateMetroVolume;
    const syncMidiInBoostUi = audioLevelControls.syncMidiInBoostUi;
    const syncLooperDependentUi = loopControls.syncLooperDependentUi;
    const practiceControls = PianoTrainerPracticeControls.create({
      document,
      state: AppState,
      routing: handRouting,
      getSelectedMidiOutOutput: () => getSelectedMidiOutOutput(),
      syncTempoMetronomeDependentUi: () => syncTempoMetronomeDependentUi(),
      applyToneLatencyProfileForMode: () => applyToneLatencyProfileForMode(),
      saveBool: (key, value) => setStoredBool({
        keyboard: TRAINER_KEYBOARD_STORAGE_KEY,
        feedback: TRAINER_FEEDBACK_STORAGE_KEY,
        futurePreview: TRAINER_FUTURE_PREVIEW_STORAGE_KEY,
        correctHighlight: TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY,
        autoScroll: TRAINER_AUTOSCROLL_STORAGE_KEY,
        fullscreenOnPlay: TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY,
        lowLatencyPlayback: TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY,
        audioHands: TRAINER_AUDIO_HANDS_STORAGE_KEY,
        audioOther: TRAINER_AUDIO_OTHER_STORAGE_KEY,
        audioInstrument: TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY,
        audioVirtual: TRAINER_AUDIO_VIRTUAL_STORAGE_KEY,
        midiOutHands: TRAINER_MIDIOUT_HANDS_STORAGE_KEY,
        midiOutOther: TRAINER_MIDIOUT_OTHER_STORAGE_KEY,
        midiOutInstrument: TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY,
        midiOutVirtual: TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY
      }[key], value),
      saveMode: (value) => localStorage.setItem(TRAINER_MODE_STORAGE_KEY, value),
      pause: () => pausePlaybackFromToolbar(),
      clearScheduledMetronomeEvents: () => clearScheduledMetronomeEvents(),
      stopWaitModeMetronome: () => stopWaitModeMetronome(),
      silencePlaybackOutputsImmediately: () => silencePlaybackOutputsImmediately(),
      clearTransientPlaybackState: (options) => clearTransientPlaybackState(options),
      readPianoVolume: () => audioLevelControls.readPianoVolume(),
      readMetroVolume: () => audioLevelControls.readMetroVolume(),
      updatePianoVolume: (value) => updatePianoVolume(value),
      updateMetroVolume: (value) => updateMetroVolume(value),
      renderKeyboard: () => renderVirtualKeyboard(),
      clearSvgFeedback: () => GeometryEngine.clearSvgFeedback(),
      renderFeedbackOverlay: () => renderFeedbackOverlay(),
      syncSettingsDebugVisibility: () => {
        if (typeof syncSettingsDebugVisibility === "function") syncSettingsDebugVisibility();
      },
      positionCalibrationPanel: () => optionalLedOutput.positionCalibrationPanel(),
      dispatchResize: () => window.dispatchEvent(new Event("resize")),
      releaseLowLatencyPlayback: () => audioOutput.releaseLowLatencyPlayback(),
      syncMidiInBoostUi: () => syncMidiInBoostUi()
    });
    const applyModeSettings = practiceControls.applyModeSettings;
    const syncTrainerRoutingUiState = practiceControls.syncTrainerRoutingUiState;
    function getDefaultStaffAssignment() {
      return PianoTrainerHandRouting.defaultAssignment(osmdAdapter.getDefaultStaffCount());
    }
    const handAssignmentController = PianoTrainerHandAssignment.create({
      state: AppState,
      captureCurrentFrame: () => {
        const frame = osmdAdapter.readHandAssignmentFrame();
        if (!frame) return null;
        const { entries, measureIndex, timestamp } = frame;
        return {
          hasEntries: entries.length > 0,
          measureIndex,
          buildExpected: () => buildExpectedNotesFromEntries(entries, measureIndex, timestamp),
          renderKeyboard: () => renderVirtualKeyboard(entries, measureIndex, timestamp)
        };
      },
      renderKeyboard: () => renderVirtualKeyboard()
    });
    const handAssignmentControls = PianoTrainerHandAssignmentControls.create({ document, commit: handAssignmentController.commit });
    const syncHandAssignmentFromControls = handAssignmentControls.syncHandAssignmentFromControls;
    const preferenceControls = PianoTrainerPreferenceControls.create({
      document,
      state: AppState,
      storage: localStorage,
      keys: PREFERENCE_STORAGE_KEYS,
      getStoredBool,
      getClampedNumber,
      setStoredBool,
      clearSavedPreferences,
      syncActiveHandStateFromMode,
      syncMidiInBoostUi,
      updatePianoVolume,
      updateMidiOutVolume,
      updateMidiInBoost,
      syncZoomControls,
      applyZoom,
      syncFullscreenUi,
      setDebugEnabled: (value, options) => setDebugEnabled(value, options),
      updateMetroVolume,
      syncTempoMetronomeDependentUi,
      setPlayerPianoType,
      getDefaultStaffAssignment,
      syncHandAssignmentFromControls,
      applyModeSettings,
      setScoreLayout: (value) => ScoreDisplay.setMode(value),
      resetLedPreferences: () => optionalLedPreferences.reset(),
      syncLedPreferenceControls: () => optionalLedPreferences.syncControls(),
      positionCalibrationPanel: () => optionalLedOutput.positionCalibrationPanel(),
      renderLooper: () => renderLooper(),
      renderVirtualKeyboard: () => renderVirtualKeyboard(),
      populateMIDIDevices: () => {
        void populateMIDIDevices();
      }
    });
    const applyPersistedTrainerAndSettingsPreferences = preferenceControls.applyPersistedTrainerAndSettingsPreferences;
    const restoreDefaultPreferences = (...args) => {
      preferenceControls.restoreDefaultPreferences(...args);
      language.restoreSavedLanguage();
    };
    const settingsActions = PianoTrainerSettingsActions.create({
      document,
      downloadSettingsBackup,
      handleSettingsBackupImportFile,
      confirm: (message) => window.confirm(language.translate(message)),
      restoreDefaultPreferences
    });
    const virtualKeyboardView = PianoTrainerVirtualKeyboardView.create({ document, isMidiInRange: (midi) => isMidiInPlayerRange(midi) });
    const keyboardController = PianoTrainerKeyboardController.create({
      state: AppState,
      isMidiInRange: (midi) => isMidiInPlayerRange(midi),
      getHandRole: (staff) => getAssignedHandRoleForStaff(staff),
      sustains: practiceSustains,
      led: optionalLedOutput,
      drawKey: virtualKeyboardView.drawKey
    });
    function renderVirtualKeyboard(currentEntries = null, currentMeasureIdx = null, currentTimestamp = null) {
      const frame = currentEntries && currentMeasureIdx !== null && currentTimestamp !== null ? {
        collectPreview: (depth) => collectFutureLedPreviewEvents(currentEntries, currentMeasureIdx, currentTimestamp, depth)
      } : null;
      keyboardController.render(frame, currentTimestamp);
    }
    const virtualKeyboardControls = PianoTrainerVirtualKeyboardControls.create({
      document,
      window,
      pressedKeys: AppState.pressedKeys,
      isMidiInRange: (midi) => isMidiInPlayerRange(midi),
      ensureLiveAudioReady: () => ensureLiveAudioReady(),
      triggerVirtualKey: (midi, down, source) => triggerVirtualKey(midi, down, source)
    });
    const createKeyboard = virtualKeyboardControls.createKeyboard;
    const scoreStatus = PianoTrainerScoreStatus.create(document, () => AppState.score);
    const updateScoreDisplay = scoreStatus.update;
    const clearFeedbackVisualStatePreserveScoring = practiceFeedback.clearPreserveScoring;
    const scoreUiController = PianoTrainerScoreUiController.create({
      state: AppState,
      rebuildStaffIdentity: osmdAdapter.rebuildStaffIdentity,
      rebuildMeasureTimingCache: () => rebuildMeasureTimingCache(),
      getMeasureCount: osmdAdapter.getGraphicalMeasureCount,
      resetLoopRange: (total) => loopControls.resetRangeForScore(total),
      getFirstTempo: osmdAdapter.getFirstScoreTempo,
      updateTempo: (source, value) => updateTempo(source, value),
      getStaffCount: osmdAdapter.getLoadedStaffCount,
      resetHandAssignments: (count) => handAssignmentControls.resetForScore(count, getDefaultStaffAssignment),
      updateScoreDisplay,
      renderLooper: () => renderLooper()
    });
    const initSongUI = scoreUiController.initSongUI;
    const scoreSeekController = PianoTrainerScoreSeek.create({
      state: AppState,
      hasGraphicSheet: osmdAdapter.hasGraphicSheet,
      seekPresentation: (x, y) => {
        if (!horizontalScore.isActive()) return false;
        const hit = horizontalScore.hitTest(x, y);
        if (!hit || playbackControls.isLoopEnabled() && (hit.sourceMeasureIndex < AppState.looper.min - 1 || hit.sourceMeasureIndex > AppState.looper.max - 1)) return true;
        playbackTransport.stop();
        osmdAdapter.seekTraceStep(hit.traceStepIndex);
        osmdAdapter.updateCursor();
        clearVisuals();
        performancePosition.navigate("seek", hit.loopIteration);
        handleAutoScroll();
        return true;
      },
      isAnyToolbarPanelOpen: () => isAnyToolbarPanelOpen(),
      clientPointToSvg: (x, y) => GeometryEngine.clientPointToSvg(x, y),
      getMeasureCount: osmdAdapter.getGraphicalMeasureCount,
      getMeasureBox: (index, staff) => GeometryEngine.getMeasureBox(index, staff),
      isLoopEnabled: () => playbackControls.isLoopEnabled(),
      stopTransport: () => playbackTransport.stop(),
      resetCursor: osmdAdapter.reset,
      isEndReached: osmdAdapter.isEndReached,
      getCurrentMeasureIndex: osmdAdapter.getCurrentMeasureIndex,
      advance: osmdAdapter.advance,
      updateCursor: () => {
        osmdAdapter.updateCursor();
        performancePosition.navigate("seek");
      },
      scroll: () => handleAutoScroll(),
      clearVisuals: () => clearVisuals()
    });
    const scoreSeekControls = PianoTrainerScoreSeekControls.create({ document, seek: scoreSeekController.seek });
    function init() {
      if (initialized || disposed) return;
      initialized = true;
      language.init();
      preferences.init();
      settingsFiles.init();
      TransposeUI.init();
      toolbarUi.init();
      initScoresDrawerShell();
      positionScoresPanel();
      syncToolbarButtonStates();
      midiControls.init();
      feedbackDebug.init();
      osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("source-score", { autoResize: false, drawTitle: true });
      ScoreDisplay.init();
      audioOutput.init();
      metronomeOutput.init();
      scoreFileControls.init();
      practiceControls.initFuturePreview();
      practiceControls.initModeAndFeedback();
      scoreSeekControls.init();
      displayControls.initPlaybackShell();
      displayControls.initZoom();
      tempoControls.initEditing();
      audioLevelControls.init();
      practiceControls.initRouting();
      loopControls.initOptions();
      tempoControls.initMetronomePreferences();
      syncLooperDependentUi();
      tempoControls.initMetronomeToggle();
      loopControls.initRange();
      settingsActions.init();
      initPlayerPianoTypeControl();
      optionalLedOutput.initControls();
      virtualKeyboardControls.initActivation();
      applyToneLatencyProfileForMode();
      ensurePianoSamplerLoaded().catch(() => {
      });
      createKeyboard();
      optionalLedOutput.initOutput();
      initUpdateControls();
      applyPersistedTrainerAndSettingsPreferences();
      if (typeof consumePendingFirstRunNotice === "function" && consumePendingFirstRunNotice()) {
        firstRunTimer = window.setTimeout(() => {
          if (IntroUI?.maybeShowFirstRunIntro) {
            IntroUI.maybeShowFirstRunIntro();
          }
        }, 0);
      }
      setupMIDI();
      optionalLedOutput.refreshMapping();
      optionalLedOutput.renderOutputs();
      optionalLedOutput.positionCalibrationPanel();
      updateConnectionStatuses();
      applyModeSettings();
      optionalLedOutput.start();
    }
    function suspend() {
      if (!initialized || disposed || suspended) return;
      suspended = true;
      trainerPlayback.suspend();
      virtualKeyboardControls.suspend();
      for (const note of [...AppState.pressedKeys]) practiceInput.handle({
        kind: "note-off",
        note,
        velocity: 0,
        source: "midi",
        channel: null,
        receivedAtMs: performance.now()
      });
      audioOutput.suspend();
      audioRouting.dispose();
      midiOutput.dispose();
      midiService.dispose();
      optionalLedOutput.dispose();
      ScoreLibrary.dispose();
    }
    function resume() {
      if (!initialized || disposed || !suspended) return;
      suspended = false;
      optionalLedOutput.initControls();
      optionalLedOutput.initOutput();
      optionalLedOutput.refreshMapping();
      optionalLedOutput.start();
      void setupMIDI();
      updateConnectionStatuses();
    }
    function dispose() {
      if (disposed) return;
      disposed = true;
      language.dispose();
      if (firstRunTimer !== void 0) window.clearTimeout(firstRunTimer);
      scoreLoader.dispose();
      practiceSustains.dispose();
      disposeScoresUi();
      trainerPlayback.dispose();
      ScoreDisplay.dispose();
      virtualKeyboardControls.dispose();
      scoreSeekControls.dispose();
      practiceControls.dispose();
      handAssignmentControls.dispose();
      settingsActions.dispose();
      displayControls.dispose();
      tempoControls.dispose();
      audioLevelControls.dispose();
      loopControls.dispose();
      playerRangeControls.dispose();
      midiControls.dispose();
      midiService.dispose();
      midiOutput.dispose();
      optionalLedOutput.dispose();
      legacyMidiLedTest.dispose();
      legacyLed.dispose();
      updateControls.dispose();
      updateController.dispose();
      feedbackDebug.dispose();
      settingsFiles.dispose();
      transposeControls.dispose();
      transposeCommands.dispose();
      toolbarUi.dispose();
      scoreFileControls.dispose();
      scoreFileReader.dispose();
      scoreConversion.dispose();
      conversionFileReader.dispose();
      webmscoreAdapter.dispose();
      ScoreLibrary.dispose();
      audioRouting.dispose();
      audioOutput.dispose();
      metronomeOutput.dispose();
      osmdAdapter.dispose();
      horizontalScore.dispose();
      preferences.dispose();
    }
    return {
      language,
      init,
      suspend,
      resume,
      dispose,
      appMetadata,
      AppState,
      handRouting,
      preferences,
      playerRange,
      settingsBackup,
      settingsFiles,
      transposeCommands,
      transposeControls,
      toolbarUi,
      ScoreLibrary,
      libraryUiLifetime,
      librarySelection,
      libraryDialogs,
      libraryActions,
      libraryRows,
      scoresDrawer,
      connectionStatus,
      updateController,
      updateControls,
      legacyLedResources,
      legacyLed,
      optionalLedOutput,
      playerRangeControls,
      midiEchoFilter,
      midiService,
      midiOutput,
      midiControls,
      legacyMidiLedTestResources,
      legacyMidiLedTest,
      webmscoreAdapter,
      conversionFileReader,
      scoreConversion,
      geometryEngine,
      feedbackOverlay,
      loopOverlay,
      feedbackDebug,
      osmdAdapter,
      performancePosition,
      horizontalScore,
      ScoreDisplay,
      scoreRenderer,
      sharedScoreTraversal,
      audioOutput,
      audioRouting,
      scoreMeasureTiming,
      metronomeClock,
      metronomeOutput,
      trainerMetronome,
      practiceFeedback,
      practiceScoring,
      practiceMatching,
      practiceEarlyGrace,
      practiceExpectedNotes,
      practiceSustains,
      practiceInput,
      playbackClock,
      playbackTransport,
      playbackState,
      trainerPlayback,
      scoreFormat,
      scoreFileReader,
      scoreLoader,
      scoreFileControls,
      displayControls,
      tempoControls,
      audioLevelControls,
      loopControls,
      practiceControls,
      handAssignmentController,
      handAssignmentControls,
      preferenceControls,
      settingsActions,
      virtualKeyboardView,
      keyboardController,
      virtualKeyboardControls,
      scoreStatus,
      scoreUiController,
      scoreSeekController,
      scoreSeekControls
    };
  }

  // src/app/bootstrap.ts
  function createApplication() {
    const services = createServices();
    return {
      init: services.init,
      suspend: services.suspend,
      resume: services.resume,
      dispose: services.dispose,
      loadScore: services.scoreLoader.loadScoreIntoApp,
      dispatchInput: services.practiceInput.handle
    };
  }

  // src/main.ts
  var app = createApplication();
  app.init();
  function onPageHide(event) {
    if (event.persisted) {
      app.suspend();
      return;
    }
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("pageshow", onPageShow);
    app.dispose();
  }
  function onPageShow(event) {
    if (event.persisted) app.resume();
  }
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);
})();
//# sourceMappingURL=app.js.map
