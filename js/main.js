const intro = document.getElementById("intro");
const main = document.getElementById("main");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const bootStart = performance.now();
const targetLoaderTime = 5100;
const minLoaderTime = 5100;
const maxLoaderTime = 5100;

let musicPlaying = false;

function enterSite() {
  intro.classList.add("hidden");
  main.classList.remove("hidden");
}

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    music.play();
    musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
  musicPlaying = !musicPlaying;
});

window.addEventListener("load", () => {
  music.load();

  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicPlaying = true;
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      })
      .catch(() => {
        musicPlaying = false;
        console.log("Reproduccion automatica prevenida por el navegador.");
      });
  }

  const elapsed = performance.now() - bootStart;
  const delay = Math.min(maxLoaderTime, Math.max(minLoaderTime, targetLoaderTime - elapsed));

  setTimeout(() => {
    enterSite();
  }, delay);
});
