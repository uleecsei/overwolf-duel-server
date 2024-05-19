setTimeout(() => {
    const login = document.querySelector('.trn-game-bar-auth');
    login.addEventListener('click', e => {
        location.href = '/login';
    });
}, 1000);
