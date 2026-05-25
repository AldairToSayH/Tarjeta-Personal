const intro = document.getElementById("intro");
const main = document.getElementById("main");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const enterBtn = document.getElementById("enter-btn");
const bootStart = performance.now();
const targetLoaderTime = 2000;
const minLoaderTime = 1700;
const maxLoaderTime = 2000;

let musicPlaying = false;
let hasEntered = false;

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
        console.log("No se pudo iniciar la musica.");
      });
  }
}

function enterSite() {
  if (hasEntered) {
    return;
  }
  hasEntered = true;
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

enterBtn.addEventListener("click", () => {
  music.muted = false;
  music.volume = 1;
  tryStartMusic();
  enterSite();
});

window.addEventListener("load", () => {
  music.load();
  music.preload = "auto";
  syncMusicIcon();

  const elapsed = performance.now() - bootStart;
  const delay = Math.min(maxLoaderTime, Math.max(minLoaderTime, targetLoaderTime - elapsed));

  setTimeout(() => {
    enterBtn.classList.remove("hidden-enter");
    enterBtn.classList.add("show-enter");
  }, delay);
});
