// きゅうけいゲーム みんなで つかう 5ふんタイマー⏰
// つかいかた: startBreakTimer({ onTick(のこりびょう), onEnd() })
// - どの きゅうけいゲームを ひらいても、おなじ のこりじかんに なる
// - はじまってから 20ぷん たつと、あたらしい きゅうけいが はじめられる（15ふん べんきょうしたら また あそべる）
(function () {
  const BREAK_SEC = 5 * 60;
  const RESET_SEC = 20 * 60;
  const KEY = "kyuukei-start";

  function getStart() {
    const now = Date.now();
    try {
      const saved = Number(localStorage.getItem(KEY));
      if (!saved || saved > now || now - saved >= RESET_SEC * 1000) {
        localStorage.setItem(KEY, String(now));
        return now;
      }
      return saved;
    } catch (e) {
      return now; // きろく できない ときは ページごとに 5ふん
    }
  }

  window.formatLeft = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  window.startBreakTimer = function ({ onTick, onEnd }) {
    const start = getStart();
    let ended = false;
    let id = null;
    function tick() {
      const left = Math.max(0, BREAK_SEC - Math.floor((Date.now() - start) / 1000));
      if (onTick) onTick(left);
      if (left === 0 && !ended) {
        ended = true;
        clearInterval(id);
        if (onEnd) onEnd();
      }
    }
    id = setInterval(tick, 1000);
    tick();
  };
})();
