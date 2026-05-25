const intro = document.getElementById("intro");
const main = document.getElementById("main");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const bootStart = performance.now();
const targetLoaderTime = 5100;
const minLoaderTime = 5100;
const maxLoaderTime = 5100;

let musicPlaying = false;

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
        syncMusicIcon();
      })
      .catch(() => {
        musicPlaying = false;
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
  intro.classList.add("hidden");
  main.classList.remove("hidden");
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

window.addEventListener("load", () => {
  music.load();

  music.muted = false;
  tryStartMusic();
  syncMusicIcon();

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, unlockMusicOnFirstInteraction, { once: true });
  });

  const elapsed = performance.now() - bootStart;
  const delay = Math.min(maxLoaderTime, Math.max(minLoaderTime, targetLoaderTime - elapsed));

  setTimeout(() => {
    enterSite();
  }, delay);
});
