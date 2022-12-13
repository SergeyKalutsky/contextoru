const elem = document.querySelector('.word')
let answers = []

const createGuessElement = async (position, word) => {
    let width
    let color

    if (position < 100) {
        width = (((100 - position) / 100) * 30) + 80
    } else if (position < 1000) {
        width = (((1000 - position) / 1000) * 30) + 50
    } else if (position < 3000) {
        width = (((3000 - position) / 3000) * 20) + 30
    } else if (position < 5000) {
        width = (((5000 - position) / 5000) * 10) + 20
    } else {
        width = 1
    }
    console.log(width)
    if (width < 20) {
        color = '--red'
    } else if (width < 60) {
        color = '--yellow'
    } else {
        color = ' --green'
    }
    const rowWrapper = document.createElement("div");
    rowWrapper.className = 'row-wrapper current'
    const outerBar = document.createElement("div");
    outerBar.className = 'outer-bar'
    const innerBar = document.createElement("div");
    innerBar.className = 'inner-bar'
    innerBar.style = `width: ${width}%; background-color: var(${color});`
    const row = document.createElement('div')
    row.className = 'row'
    const spanWord = document.createElement('span')
    spanWord.textContent = word
    const spanPosition = document.createElement('span')
    spanPosition.textContent = position

    row.appendChild(spanWord).insertAdjacentElement('afterend', spanPosition)
    outerBar.appendChild(innerBar)
    rowWrapper.appendChild(outerBar).insertAdjacentElement('afterend', row)
    return rowWrapper
}

const setRowClass = async (answers, word) => {
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].word == word) {
            answers[i].element.className = 'row-wrapper current'
        } else {
            answers[i].element.className = 'row-wrapper'
        }
    }
    return answers
}

const addRowElement = async (guessElement, answers, word, position) => {
    for (let answer of answers) {
        if (answer.word === word) {
            return answers
        }
    }
    answers.push({ position: position, element: guessElement, word: word })
    answers.sort((a, b) => { return a.position - b.position })
    return answers

}

elem.addEventListener('keypress', async (event) => {
    const word = elem.value.toLowerCase()
    if (event.key === 'Enter') {
        await fetch('http://localhost:8000/check_guess',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: word })
            }
        )
            .then((response) => response.json())
            .then(async (data) => {
                const attemptsCount = document.querySelector('#count')
                attemptsCount.textContent = Number(attemptsCount.textContent) + 1

                const helpText = document.querySelector('.how-to-play')
                if (helpText !== null) {
                    helpText.remove()
                }

                const history = document.querySelector('.guess-history')
                const messageElement = document.querySelector('.message')
                if (data.error === 'ok') {
                    const guessElement = await createGuessElement(data.rating, word)
                    // Change message displayed
                    messageElement.innerHTML = ''
                    messageElement.appendChild(guessElement.cloneNode(true))
                    // Change guess history
                    answers = await addRowElement(guessElement, answers, word, data.rating)
                    answers = await setRowClass(answers, word)
                    history.innerHTML = ''
                    for (let answer of answers) {
                        history.appendChild(answer.element)
                    }
                } else if (data.error === 'word is not found') {
                    const wordNotFoundMessage = document.createElement("div");
                    wordNotFoundMessage.className = 'message-text'
                    wordNotFoundMessage.textContent = 'Извините, к сожалению, я не знаю такое слово'
                    messageElement.innerHTML = ''
                    messageElement.appendChild(wordNotFoundMessage)
                }
                elem.value = ''
            })
    }
})