let currentScene = 'scene-1'; // Початкова активна сцена
const audio = document.getElementById('myAudio');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');

// --- Керування аудіо ---
function playAudio() {
  audio.play().then(() => {
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
  }).catch(error => {
    console.error("Audio playback failed:", error);
    // Можливо, браузер блокує автоплей, потрібна взаємодія користувача
    // Можна показати повідомлення про це
  });
}

function pauseAudio() {
  audio.pause();
  playButton.style.display = 'inline-block';
  pauseButton.style.display = 'none';
}

// --- Керування сценами ---
function showScene(sceneIdToShow) {
  const currentElement = document.getElementById(currentScene);
  const nextElement = document.getElementById(sceneIdToShow);

  if (currentElement && nextElement && currentScene !== sceneIdToShow) {
    // 1. Додаємо клас анімації виходу до поточної сцени
    currentElement.classList.add('exit');
    // Переконуємось, що клас 'active' ще присутній для анімації виходу
    currentElement.classList.add('active');


    // 2. Після завершення анімації виходу (час = тривалість анімації sceneExit)
    setTimeout(() => {
      currentElement.classList.remove('active', 'exit'); // Забираємо класи поточної
      currentElement.classList.add('hidden'); // Ховаємо її надійно

      // Скидаємо анімації на поточній сцені, щоб вони спрацювали знову
      resetSceneAnimations(currentElement);

      // 3. Готуємо наступну сцену
      nextElement.classList.remove('hidden', 'exit'); // Забираємо 'hidden' і 'exit' (про всяк випадок)

      // 4. Робимо наступну сцену активною (це запустить transition та анімації входу)
      // Використовуємо requestAnimationFrame для гарантії рендеру
      requestAnimationFrame(() => {
        nextElement.classList.add('active');
        // Скидаємо анімації на новій сцені перед її показом
        resetSceneAnimations(nextElement);
        // Запускаємо потрібні анімації для нової сцени (якщо вони не спрацьовують автоматично через .active)
        triggerSceneAnimations(nextElement);
      });


      // 5. Оновлюємо ID поточної сцени
      currentScene = sceneIdToShow;

    }, 600); // Таймінг = тривалість анімації sceneExit в CSS (0.6s)

  } else if (!nextElement) {
    console.error(`Помилка: Не вдалося знайти сцену ${sceneIdToShow}`);
  } else {
    // Якщо намагаємося показати ту саму сцену, нічого не робимо або перезапускаємо анімації
    console.log("Та сама сцена, перезапуск анімацій?");
    resetSceneAnimations(currentElement);
    triggerSceneAnimations(currentElement);
  }
}

// Функція для скидання анімацій на елементах сцени
function resetSceneAnimations(sceneElement) {
  const animatedElements = sceneElement.querySelectorAll('.animate__animated, .spin-zoom-gif, .cringe-animation, .shaky-text');
  animatedElements.forEach(el => {
    const animationName = getComputedStyle(el).animationName;
    if (animationName && animationName !== 'none') {
      el.style.animation = 'none'; // Скидаємо анімацію
      // Форсуємо reflow, щоб браузер помітив зміну
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;
    }
    // Скидаємо класи Animate.css, якщо вони використовуються для запуску
    const animateClasses = Array.from(el.classList).filter(cls => cls.startsWith('animate__') && cls !== 'animate__animated');
    el.classList.remove(...animateClasses);
  });
}

// Функція для запуску анімацій (якщо потрібно вручну після скидання)
function triggerSceneAnimations(sceneElement) {
  // Перезапускаємо анімації, додаючи їх назад
  const animatedElements = sceneElement.querySelectorAll('.animate__animated, .spin-zoom-gif, .cringe-animation, .shaky-text');
  animatedElements.forEach(el => {
    // Повертаємо CSS анімації
    el.style.animation = '';

    // Повертаємо класи Animate.css (знаходимо потрібні класи з data-атрибуту або заздалегідь)
    // Простий варіант: якщо клас анімації додається напряму в HTML,
    // то він спрацює автоматично при додаванні класу .active до сцени,
    // якщо ми скинули style.animation='none' вище.
    // Для Animate.css часто потрібно додати клас анімації (напр. 'animate__bounceIn')
    // TODO: Можливо, зберегти потрібні класи animate__ в data-атрибутах і додавати їх тут.
    if (el.dataset.animateClass) {
      el.classList.add(el.dataset.animateClass);
    }
  });

  // Особлива логіка для spin-zoom-gif, бо вона залежить від .active
  const spinGifs = sceneElement.querySelectorAll('.spin-zoom-gif');
  spinGifs.forEach(gif => {
    // Переконаємось, що анімація спрацює
    gif.style.animation = 'none';
    gif.offsetHeight; // reflow
    gif.style.animation = '';
  });
}


// Функція для повного перезапуску (наприклад, кнопкою "Ще раз?")
function resetAnimations() {
  const scenes = document.querySelectorAll('.scene');
  scenes.forEach(scene => {
    resetSceneAnimations(scene);
  });
  // Перезапускаємо анімації на першій сцені, якщо вона стає активною
  setTimeout(() => {
    const firstScene = document.getElementById('scene-1');
    if(firstScene.classList.contains('active')){
      triggerSceneAnimations(firstScene);
    }
  }, 10); // Невелика затримка
}


// --- Ініціалізація при завантаженні ---
document.addEventListener('DOMContentLoaded', () => {
  const scenes = document.querySelectorAll('.scene');
  scenes.forEach(scene => {
    // Очищаємо можливі залишки класів
    scene.classList.remove('active', 'exit');
    scene.classList.add('hidden');

    // Додаємо data-атрибути для класів Animate.css, щоб їх можна було відновити
    scene.querySelectorAll('.animate__animated').forEach(el => {
      const animateClass = Array.from(el.classList).find(cls => cls.startsWith('animate__') && !['animate__animated', 'animate__infinite', 'animate__delay-', 'animate__slower', 'animate__fast', 'animate__faster'].some(prefix => cls.startsWith(prefix)) );
      if (animateClass) {
        el.dataset.animateClass = animateClass;
      }
    });

  });

  // Показуємо стартову сцену
  const startScene = document.getElementById(currentScene);
  if(startScene) {
    startScene.classList.remove('hidden');
    startScene.classList.add('active');
    // Запускаємо анімації для першої сцени
    triggerSceneAnimations(startScene);
  }

  // Налаштування кнопок аудіо
  if (audio.paused) {
    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
  } else {
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
  }
});
