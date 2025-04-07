let currentScene = 'scene-1'; // Початкова активна сцена

function showScene(sceneIdToShow) {
  // Знаходимо поточну видиму сцену
  const currentElement = document.getElementById(currentScene);
  // Знаходимо сцену, яку треба показати
  const nextElement = document.getElementById(sceneIdToShow);

  if (currentElement && nextElement) {
    // Ховаємо поточну сцену
    currentElement.classList.remove('active');
    // Додаємо 'hidden' для надійності, хоча керування в основному через 'active'
    currentElement.classList.add('hidden');

    // Показуємо нову сцену
    nextElement.classList.remove('hidden');
    // Невелика затримка перед додаванням 'active' може допомогти з рендерингом transition
    // requestAnimationFrame гарантує, що браузер готовий до зміни стилю
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { // Подвійний requestAnimationFrame для більшої надійності
        nextElement.classList.add('active');
      });
    });


    // Оновлюємо ID поточної сцени
    currentScene = sceneIdToShow;
  } else {
    console.error(`Помилка: Не вдалося знайти сцену ${currentScene} або ${sceneIdToShow}`);
  }
}

// Переконуємось, що початкова сцена видима при завантаженні
// і всі інші точно приховані
document.addEventListener('DOMContentLoaded', () => {
  const scenes = document.querySelectorAll('.scene');
  scenes.forEach(scene => {
    if (scene.id === currentScene) {
      scene.classList.add('active');
      scene.classList.remove('hidden');
    } else {
      scene.classList.remove('active');
      scene.classList.add('hidden');
    }
  });
});

// Якщо потрібна функція ляпаса з першого коду:
/*
function playSlap() {
  const slapSound = document.getElementById('slap-sound');
  if (slapSound) {
    slapSound.play().catch(error => console.error("Audio playback failed:", error));
  } else {
    console.error("Slap sound element not found!");
  }
}
*/
