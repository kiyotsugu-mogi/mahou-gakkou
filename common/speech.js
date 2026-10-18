// えいごの よみあげ🔊
// つかいかた: <script src="../../common/speech.js"></script> を入れて、speakEnglish("apple") のように よぶ
// つかえない ブラウザでは false を かえす
(function () {
  // ききとりやすい 女の人の 声（うえから じゅんに さがす）
  const NICE_VOICES = [
    "Ava", "Zoe", "Allison", "Susan", // Mac の きれいな 声（ダウンロードすると つかえる）
    "Samantha",                  // Mac
    "Google US English",         // Chrome
    "Microsoft Aria", "Microsoft Jenny", "Microsoft Zira", // Windows
    "Flo", "Shelley", "Sandy", "Kathy", "Karen",
  ];
  // おなじ 名前なら プレミアム → エンハンス（拡張）→ ふつう の じゅん
  const QUALITY = ["Premium", "プレミアム", "Enhanced", "拡張"];
  const quality = (v) => {
    const i = QUALITY.findIndex((q) => v.name.includes(q));
    return i === -1 ? 0 : QUALITY.length - i;
  };
  // おもしろ声（ききとりにくい）は つかわない
  const FUNNY_VOICES = [
    "Albert", "Bad News", "Bahh", "Bells", "Boing", "Bubbles", "Cellos", "Wobble",
    "Good News", "Jester", "Organ", "Superstar", "Trinoids", "Whisper", "Zarvox",
  ];

  let englishVoice = null;
  function findVoice() {
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.replace("_", "-").startsWith("en"));
    for (const name of NICE_VOICES) {
      const found = voices.filter((v) => v.name.startsWith(name)).sort((a, b) => quality(b) - quality(a));
      if (found.length) { englishVoice = found[0]; return; }
    }
    const normal = voices.filter((v) => !FUNNY_VOICES.some((f) => v.name.startsWith(f)));
    englishVoice = normal.find((v) => v.lang.replace("_", "-") === "en-US") || normal[0] || null;
  }
  const supported = "speechSynthesis" in window;
  if (supported) {
    findVoice();
    speechSynthesis.addEventListener("voiceschanged", findVoice);
  }

  window.speakEnglish = function (text, rate = 0.95) {
    if (!supported) return false;
    if (!englishVoice) findVoice();
    speechSynthesis.cancel();
    // 「.」で ことばの おわりが しぜんな ひびきに なる（もう きごうが あるときは そのまま）
    const u = new SpeechSynthesisUtterance(/[.!?]$/.test(text) ? text : text + ".");
    if (englishVoice) u.voice = englishVoice;
    u.lang = englishVoice ? englishVoice.lang : "en-US";
    u.rate = rate;
    speechSynthesis.speak(u);
    return true;
  };

  window.stopSpeaking = function () {
    if (supported) speechSynthesis.cancel();
  };
})();
