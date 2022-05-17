function readTextFile(file, callback) {
  const rawFile = new XMLHttpRequest()
  rawFile.open('GET', file, false)
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        callback(rawFile.responseText)
      }
    }
  }
  rawFile.send(null)
}

String.prototype.isEnglishWord = function () {
  const englishLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const unknownLetters = this.split('').filter(letter => englishLetters.indexOf(letter) === -1)
  return !unknownLetters.length
}

function setup (queryWordsText, wordsText) {
  const answerArr = queryWordsText.split(',')
  const answer = answerArr[Math.floor(Math.random() * (answerArr.length - 1))]
  console.log(answer)
  const words = []
  const chars = document.getElementsByClassName('char')
  const [alertTag] = document.getElementsByClassName('alert')
  let word = ''
  let char, index

  let lastCell = chars[chars.length - 1]
  
  let gameFinished = false

  function game (key) {
    if (!key.isEnglishWord() || gameFinished) return
    index = words.length * 5 + word.length
    if (key === 'Backspace' && word) {
      chars[index - 1].innerText = ''
      word = word.slice(0, word.length - 1)
    } else if (key === 'Enter' && word.length === 5) {
      if (wordsText.indexOf(word) !== -1) {
        answer.split('').forEach((letter, i) => {
          index = words.length * 5 + i
          char = chars[index]
          let button = document.querySelector(`[value=${word[i]}]`)
          if (letter === word[i]) {
            char.classList.add('found-turn')
            char.addEventListener('animationend', ({ target }) => {
              target.classList.add('found')
              button.classList.add('found')
            })
          } else if (answer.indexOf(word[i]) !== -1) {
            char.classList.add('wrong-place-turn')
            char.addEventListener('animationend', ({ target }) => {
              target.classList.add('wrong-place')
              button.classList.add('wrong-place')
            })
          } else {
            char.classList.add('not-found-turn')
            char.addEventListener('animationend', ({ target }) => {
              target.classList.add('not-found')
              button.classList.add('not-found')
            })
          }
        })
        let match = word === answer
        words.push(word)
        word = ''
        let cell = chars[(words.length - 1) * 5 + 4]
        gameFinished = match
        cell.addEventListener('animationend', () => {
          if (cell === lastCell && !match) {
            // restartButton.classList.add('show')
            alertTag.innerText = answer
            alertTag.classList.add('loose')
          }
          if (match) {
            alertTag.innerText = 'Congratulations!'
            alertTag.classList.add('win')
            gameFinished = true
          }
        })

      } else {
        alertTag.innerText = 'Not valid'
        alertTag.classList.add('not-valid')
        alertTag.addEventListener('animationend', () => { 
          const [animation] = alertTag.getAnimations()
          if (!animation) {
            alertTag.classList.remove('not-valid')
          }
        })
      }
    } else if (word.length !== 5 && key.length === 1) {
      char = chars[index]
      word += key
      char.innerText = key.toUpperCase()
    }
  }

  const keys = document.getElementsByClassName('key')
  Array.from(keys).forEach(key => key.addEventListener('click', () => game(key.getAttribute('value'))))
  document.addEventListener('keydown', ({ key }) => game(key))

  let interval, enter
  enter = document.querySelector('[value=Enter]')
  enter.addEventListener('touchstart', ({ target }) => {
    interval = setTimeout(() => {
      alert(answer)
    } , 2000)
  })
  enter.addEventListener('touchend', () => clearInterval(interval))
}

readTextFile('./words.txt', wordsText => {
  readTextFile('./query-words.txt', queryWordsText => {
    if (!queryWordsText || !wordsText) {
      throw new Error('Word list not fetched')
    }
    setup(queryWordsText, wordsText)
  })
})
