
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.button-choose').addEventListener('click', () => {
        const body = document.querySelector('body')
        body.classList.add('dark')
        body.classList.remove('light')
    })
}) 
