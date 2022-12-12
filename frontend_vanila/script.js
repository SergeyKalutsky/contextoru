const elem = document.querySelector('.word')
const answers = []

const createGuessElement = (position, word) => {
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
    rowWrapper.className = 'row-wrapper'
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

elem.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        await fetch('http://localhost:8000/check_guess',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: elem.value })
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.error === 'ok') {
                    const history = document.querySelector('.guess-history')
                    const guessElement = createGuessElement(data.rating, elem.value)
                    answers.push({ position: data.rating, element: guessElement })
                    answers.sort((a, b) => { return a.position - b.position })
                    history.innerHTML = ''
                    for (let i in answers) {
                        history.appendChild(answers[i].element)
                    }
                }
                elem.value = ''
            })
    }
})