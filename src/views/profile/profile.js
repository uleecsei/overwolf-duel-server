const url = 'http://localhost:3000';

const token = localStorage.getItem('token');
const verified = document.getElementById('verified');
const username = document.getElementById('username');
const discordUsername = document.getElementById('discordUsername');
const friends = document.getElementById('friends');
friends.onclick = () => {
    location.href = '/friends';
};

// // Пример заполнения таблиц или показа сообщения "No data"
// const lastGamesTableBody = document.getElementById('lastGamesTableBody');
// const noLastGamesMessage = document.getElementById('noLastGamesMessage');
//
// const tournamentsTableBody = document.getElementById('tournamentsTableBody');
// const noTournamentsMessage = document.getElementById('noTournamentsMessage');
//
// function checkData() {
//     if (lastGamesTableBody.children.length === 0) {
//         noLastGamesMessage.style.display = 'flex';
//     } else {
//         noLastGamesMessage.style.display = 'none';
//     }
//
//     if (tournamentsTableBody.children.length === 0) {
//         noTournamentsMessage.style.display = 'flex';
//     } else {
//         noTournamentsMessage.style.display = 'none';
//     }
// }
//
// checkData(); // Вызывается для проверки наличия данных сразу после загрузки страницы

async function getUser() {
    try {
        const response = await fetch(
            url + `/auth/user`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            },
        );

        if (response.ok) {
            // Parse and return the JSON data
            return response.json();
        } else {
            console.error('Error:', response.statusText);
            if (response.status === 401) {
                window.location.replace('/login');
            }
            // Reject the promise with an error message
            return Promise.reject(new Error(response.statusText));
        }
    } catch (error) {
        console.error('Error:', error.message);
        // Reject the promise with the caught error
        return Promise.reject(error);
    }
}

async function populateLastGamesTable(user) {
    try {
        const lastGamesTableBody = document.getElementById('lastGamesTableBody');
        const noLastGamesMessage = document.getElementById('noLastGamesMessage');

        const gameData = user.gameData;

        lastGamesTableBody.innerHTML = '';

        if (gameData && gameData.length > 0) {
            gameData.forEach((game) => {
                console.log(game);
                const gameName = game.data.fileName || 'Unknown Game';
                const date = new Date(game.createdAt).toLocaleString();
                const result = game.data.events.find(event => event.name === 'goal') || { data: '' };

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gameName}</td>
                    <td>${date}</td>
                    <td>${result.data}</td>
                `;

                lastGamesTableBody.appendChild(row);
            });

            noLastGamesMessage.style.display = 'none';
        } else {
            noLastGamesMessage.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error populating last games table:', error);
    }
}

async function viewChange() {
    try {
        const userData = await getUser();
        const user = userData.user;
        if (user.isVerified) {
            verified.style.display = 'block';
        }
        username.innerHTML = user.username;
        if (user.discordData) {
            discordUsername.innerHTML = user.discordData.username;
        }
        return user;
    }
    catch (e) {
        console.log(e);
        window.location.replace('/login');
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const user = await viewChange();
    await populateLastGamesTable(user);
});
