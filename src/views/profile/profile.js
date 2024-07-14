const url = 'http://localhost:3000';

const token = localStorage.getItem('token');
const userGreeting = document.getElementById('userGreeting');
const verified = document.getElementById('verified');

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

async function viewChange() {
    try {
        const userData = await getUser();
        const user = userData.user;
        userGreeting.innerText = `Hi, ${user?.username}. Enjoy playing games.`;
        if (user.isVerified) {
            verified.style.display = 'block';
        }

        getFriends(user.friends);
        await getInvitations();
    }
    catch (e) {
        console.log(e);
        window.location.replace('/login');
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await viewChange();
});

function getFriends(friendsData) {
    const tableBody = document.getElementById('tableBody');
    const noFriendsMessage = document.getElementById('noFriendsMessage');
    const inviteButton = document.getElementById('inviteButton');
    const inviteForm = document.getElementById('inviteForm');

    inviteButton.addEventListener('click', function() {
        inviteForm.style.display = 'block';
    });

    function displayFriends(friends) {
        if (friends.length === 0) {
            noFriendsMessage.style.display = 'block';
            tableBody.style.display = 'none';
        } else {
            noFriendsMessage.style.display = 'none';
            tableBody.style.display = 'table-row-group';
            friends.forEach(friend => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${friend.username}</td>
                    <td>${friend.email}</td>
                    <td><button class="reject-button" data-invitation-id="${friend._id}">Remove</button></td>
                `;
                tableBody.appendChild(row);

                const rejectButton = row.querySelector('.reject-button');

                rejectButton.addEventListener('click', () => handleDeleteFriend(friend._id));
            });
        }
    }

    displayFriends(friendsData);
}

async function getInvitations() {
    const tableBody = document.getElementById('invitationsTableBody');
    const noInvitationsMessage = document.getElementById('noInvitationsMessage')

    async function fetchInvitations(invitations) {
        try {
            const response = await fetch(
                url + `/friends/friends-requests/list`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                },
            );

            if (response.ok) {
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

    function displayInvitations(invitations) {
        if (invitations.length === 0) {
            noInvitationsMessage.style.display = 'block';
            tableBody.style.display = 'none';
        } else {
            noInvitationsMessage.style.display = 'none';
            tableBody.style.display = 'table-row-group';
            invitations.forEach(invitation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${invitation?.sender?.username}</td>
                    <td>${invitation?.sender?.email}</td>
                    <td>${new Date(invitation.createdAt).toLocaleDateString()}</td>
                    <td><button class="accept-button" data-invitation-id="${invitation._id}">Accept</button></td>
                    <td><button class="reject-button" data-invitation-id="${invitation._id}">Reject</button></td>
                `;
                tableBody.appendChild(row);

                const acceptButton = row.querySelector('.accept-button');
                const rejectButton = row.querySelector('.reject-button');

                acceptButton.addEventListener('click', () => handleAcceptInvitation(invitation._id));
                rejectButton.addEventListener('click', () => handleRejectInvitation(invitation._id));
            });
        }
    }

    const invitationsData = await fetchInvitations();
    displayInvitations(invitationsData.invitations);
}