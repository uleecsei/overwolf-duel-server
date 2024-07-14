setTimeout(() => {
    const login = document.querySelector('.trn-game-bar-auth');
    login.addEventListener('click', e => {
        e.preventDefault();
        location.href = '/login';
    });
}, 500);
