const intro = document.getElementById("intro");
const main = document.getElementById("main");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const enterBtn = document.getElementById("enter-btn");
const bootStart = performance.now();
const targetLoaderTime = 5100;
const minLoaderTime = 5100;
const maxLoaderTime = 5100;

let musicPlaying = false;
let autoplayBlocked = false;
let hasEntered = false;
let introTimeoutId;

function syncMusicIcon() {
  musicToggle.innerHTML = musicPlaying
    ? '<i class="fas fa-volume-up"></i>'
    : '<i class="fas fa-volume-mute"></i>';
}

function tryStartMusic() {
  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicPlaying = true;
        autoplayBlocked = false;
        syncMusicIcon();
      })
      .catch(() => {
        musicPlaying = false;
        autoplayBlocked = true;
        syncMusicIcon();
        console.log("Reproduccion automatica prevenida por el navegador.");
      });
  }
}

function unlockMusicOnFirstInteraction() {
  if (!musicPlaying) {
    tryStartMusic();
  }
}

function enterSite() {
  if (hasEntered) {
    return;
  }
  hasEntered = true;

  if (introTimeoutId) {
    clearTimeout(introTimeoutId);
  }

  intro.classList.add("hidden");
  main.classList.remove("hidden");
}

function startMusicAggressive() {
  music.preload = "auto";
  music.muted = false;
  music.volume = 1;
  tryStartMusic();
}

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
  } else {
    music.play();
    musicPlaying = true;
  }
  syncMusicIcon();
});

enterBtn.addEventListener("click", () => {
  if (!musicPlaying) {
    startMusicAggressive();
  }
  enterSite();
});

window.addEventListener("DOMContentLoaded", startMusicAggressive);

window.addEventListener("load", () => {
  startMusicAggressive();
  syncMusicIcon();

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, unlockMusicOnFirstInteraction, { once: true });
  });

  const elapsed = performance.now() - bootStart;
  const delay = Math.min(maxLoaderTime, Math.max(minLoaderTime, targetLoaderTime - elapsed));

  introTimeoutId = setTimeout(() => {
    enterSite();
  }, delay);
});

window.addEventListener("pageshow", startMusicAggressive);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && (!musicPlaying || autoplayBlocked)) {
    startMusicAggressive();
  }
});
