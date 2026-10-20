/* Polyfills pour les anciens moteurs web des TV Samsung (Tizen 3–5) + affichage des erreurs à l'écran. */
(function () {
  var g = typeof self !== "undefined" ? self : window;
  if (typeof globalThis === "undefined") g.globalThis = g;
  if (!g.queueMicrotask) g.queueMicrotask = function (cb) { Promise.resolve().then(cb); };
  if (!String.prototype.replaceAll) String.prototype.replaceAll = function (a, b) {
    return typeof a === "string" ? this.split(a).join(typeof b === "function" ? b(a) : b) : this.replace(a, b);
  };
  if (!Array.prototype.flat) Array.prototype.flat = function (d) {
    d = d === undefined ? 1 : d;
    return d > 0 ? this.reduce(function (acc, v) { return acc.concat(Array.isArray(v) ? v.flat(d - 1) : v); }, []) : this.slice();
  };
  if (!Array.prototype.flatMap) Array.prototype.flatMap = function (f, t) { return this.map(f, t).flat(); };
  if (!Array.prototype.at) Array.prototype.at = function (i) { i = Math.trunc(i) || 0; if (i < 0) i += this.length; return this[i]; };
  if (!String.prototype.at) String.prototype.at = Array.prototype.at;
  if (!Object.fromEntries) Object.fromEntries = function (it) { var o = {}; Array.from(it).forEach(function (e) { o[e[0]] = e[1]; }); return o; };
  if (!Object.hasOwn) Object.hasOwn = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  if (!Promise.allSettled) Promise.allSettled = function (ps) {
    return Promise.all(Array.from(ps).map(function (p) {
      return Promise.resolve(p).then(function (v) { return { status: "fulfilled", value: v }; }, function (r) { return { status: "rejected", reason: r }; });
    }));
  };
  if (!g.structuredClone) g.structuredClone = function (v) { return JSON.parse(JSON.stringify(v)); };
  // Affiche toute erreur JavaScript à l'écran (sinon la TV montre seulement un écran vide).
  function show(msg) {
    var d = document.getElementById("tv-err");
    if (!d) { d = document.createElement("pre"); d.id = "tv-err"; d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;margin:0;padding:16px;background:#400;color:#fff;font:18px monospace;white-space:pre-wrap;max-height:40vh;overflow:auto"; (document.body || document.documentElement).appendChild(d); }
    d.textContent += "Erreur : " + msg + "\n";
  }
  g.addEventListener("error", function (e) { show((e.message || "") + " @ " + (e.filename || "") + ":" + (e.lineno || "")); });
  g.addEventListener("unhandledrejection", function (e) { show("Promesse : " + (e.reason && (e.reason.stack || e.reason.message) || e.reason)); });
})();
