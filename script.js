import { phrases } from './phrases.js'

function getRandomElement(arr) {
  let randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

let button = document.querySelector('.button');
let phrase = document.querySelector('.phrase');
let advice = document.querySelector('.advice');

button.addEventListener('click', function () {
  let randomElement = getRandomElement(phrases);
  smoothly(phrase, 'textContent', randomElement);
});

for (let i = 0; i < 3; i++){
  let randomElement = getRandomElement(phrases)
  smoothly(phrase, 'textContent', randomElement);
}
