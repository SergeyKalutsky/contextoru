let elem = document.querySelector('.input-text')

elem.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log(elem.value)
    }
})