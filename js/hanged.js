const d = document,
  ls = localStorage;

const $firstPage = d.querySelector(".first-page"),
  $gameIlustraton = d.querySelector(".gameIlustration"),
  $btnPlay = d.querySelector(".NewGame"),
  $btnWord = d.querySelector(".NewWord"),
  $secondPage = d.querySelector(".second-page"),
  $textarea = d.getElementById("valueText"),
  $btnSave = d.querySelector(".Save"),
  $btnCancel = d.querySelector(".Cancel"),
  $thirdPage = d.querySelector(".third-page"),
  $divWord = d.querySelector(".word"),
  $btnRestart = d.querySelector(".Restart"),
  $btnSurrender = d.querySelector(".Surrender"),
  $modal = d.querySelector(".modal"),
  $finishMessage = d.querySelector(".finishMessage"),
  $body = d.querySelectorAll(".body"),
  $focus = d.querySelector(".focus"),
  $flex = d.querySelector(".flex");

$btnPlay.addEventListener("click", (e) => {
  play();
});

$btnWord.addEventListener("click", (e) => {
  word();
});
$btnSave.addEventListener("click", (e) => {
  saveWord();
  playWord();
});
$btnCancel.addEventListener("click", (e) => {
  cancel();
});
$btnRestart.addEventListener("click", (e) => {
  restart();
});
$flex.addEventListener("click", (e) => {
  $focus.focus();
  $focus.click();
});

function play() {
  $firstPage.classList.add("none");
  $gameIlustraton.classList.add("none");
  $thirdPage.classList.remove("none");
  $btnRestart.setAttribute("disabled", true);
  $btnRestart.classList.add("disabled");
  game();
}

function word() {
  $firstPage.classList.add("none");
  $secondPage.classList.remove("none");
}

function restart() {
  $thirdPage.classList.add("none");
  $gameIlustraton.classList.remove("none");
  $firstPage.classList.remove("none");
}

function cancel() {
  $secondPage.classList.add("none");
  $firstPage.classList.remove("none");
}

function saveWord() {
  const $caution = d.createElement("span");
  $caution.textContent = $textarea.title;
  $caution.classList.add("text-error");
  $caution.classList.add("none");
  $textarea.insertAdjacentElement("afterend", $caution);
  let $word = $textarea.value,
    pattern = $textarea.pattern,
    regex = new RegExp(pattern);
  $word.toUpperCase();

  if (regex.test($word)) {
    $caution.classList.add("is-active");
    $caution.classList.remove("none");
    setTimeout(() => {
      $caution.classList.add("none");
    }, 3000);
  } else {
    $caution.classList.remove("is-active");
    $caution.classList.add("none");
    ls.setItem("word", `${$word.toUpperCase()}`);
    $textarea.value = "";
  }
  if (!$word) {
    ls.setItem("word", "PALABRA");
  }
}

function playWord() {
  $secondPage.classList.add("none");
  $thirdPage.classList.remove("none");
  $gameIlustraton.classList.add("none");
  game();
}
d.addEventListener("DOMContentLoaded", (e) => {
  if (ls.getItem("word") === null) ls.setItem("word", "PALABRA");
});

function game() {
  $btnRestart.setAttribute("disabled", true);
  $btnRestart.classList.add("disabled");
  $btnSurrender.removeAttribute("disabled");
  $btnSurrender.classList.remove("disabled");
  const $word = ls.getItem("word");
  let $Arr = Array.from($word);

  const $divOne = d.createElement("div");
  const $divTwo = d.createElement("div");
  $divWord.appendChild($divOne);
  $divWord.appendChild($divTwo);

  $Arr.forEach((el) => {
    $letter = d.createElement("span");
    $letter.textContent = `${el}`;
    $letter.classList.add("letter");
    $divOne.appendChild($letter);
  });

  let $list = $divOne.childNodes;
  let x = $body.length;
  let y = 0;
  let $goodLetters = [];
  let $badLetters = [];
  $focus.focus();
  $focus.click();

  d.addEventListener("keyup", keyboard);

  function detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return true;
    });
  }

  function keyboard(e) {
    let $key;
    if (detectMob() === true) {
      let keyCode = e.keyCode || e.which;
      if (keyCode == 0 || keyCode == 229) {
        keyCode = e.target.value
          .charAt(e.target.selectionStart - 1)
          .charCodeAt();
      }
      $key = String.fromCharCode(keyCode).toUpperCase();
    } else {
      $key = e.key.toUpperCase();
    }
    if ($Arr.includes($key)) {
      if ($goodLetters.includes($key) === false) {
        for (const [key, value] of $list.entries()) {
          value.textContent.toUpperCase();
          if ($key === value.textContent) {
            $list[key].classList.add("letterguessed");
            y++;
          }
          if (y === $list.length) {
            d.removeEventListener("keyup", keyboard);
            y = 0;
            win();
            finish();
          }
          $goodLetters.push($key);
        }
      } else {
        $divOne.classList.add("shake");
        setTimeout(() => {
          $divOne.classList.remove("shake");
        }, 500);
      }
    } else {
      let res = /^[a-zA-Z]+$/;
      if (res.test($key)) {
        if ($badLetters.includes($key) === false) {
          const $badletter = d.createElement("span");
          $badletter.classList.add("letter2");
          $badletter.textContent = `${$key}`;
          $divTwo.appendChild($badletter);
          const bad = Array.from($body);
          bad[x - 1].classList.remove("none");
          $badLetters.push($key);
          x--;
          if (x === 0) {
            d.removeEventListener("keyup", keyboard);
            x = $body.length;
            lose();
            finish();
          }
        } else {
          $divTwo.classList.add("shake");
          setTimeout(() => {
            $divTwo.classList.remove("shake");
          }, 500);
        }
      }
    }
  }

  $btnSurrender.addEventListener("click", (e) => {
    lose();
    finish();
  });

  function win() {
    $modal.classList.add("modal-active");
    $finishMessage.textContent = "GANASTE";
    $btnSurrender.setAttribute("disabled", true);
    $btnSurrender.classList.add("disabled");
  }

  function lose() {
    $list.forEach((element) => {
      element.classList.add("letterguessed");
    });
    $modal.classList.add("modal-active");
    $finishMessage.textContent = "PERDISTE";
    $btnSurrender.setAttribute("disabled", true);
    $btnSurrender.classList.add("disabled");
  }

  async function finish() {
    $focus.value = "";
    await Delay();
    $body.forEach((el) => {
      el.classList.add("none");
    });
    $divWord.removeChild($divOne);
    $divWord.removeChild($divTwo);
    $modal.classList.remove("modal-active");
    $btnRestart.removeAttribute("disabled");
    $btnRestart.classList.remove("disabled");
    d.removeEventListener("keyup", keyboard);
  }

  function Delay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    });
  }
}
