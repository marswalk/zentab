// Greeting and Time
const greetingMessage = document.getElementById('greeting-message');
const timeElement = document.getElementById('time');

function updateGreetingAndTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const greeting = hours < 12 ? 'Good morning' : (hours < 18 ? 'Good afternoon' : 'Good evening');
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    greetingMessage.textContent = `${greeting}, ${localStorage.getItem('username') || 'Guest'}!`;
    timeElement.textContent = formattedTime;
}

updateGreetingAndTime();
setInterval(updateGreetingAndTime, 1000);

// Todo List
const showCompletedCheckbox = document.getElementById('show-completed');
const todoList = document.getElementById('todo-list');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');

addTaskButton.addEventListener('click', () => {
    const taskText = newTaskInput.value;
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.className = 'todo-item';
        taskItem.innerHTML = `
            <input type="checkbox" class="checkbox">
            <label>${taskText}</label>
        `;
        todoList.appendChild(taskItem);
        newTaskInput.value = '';
        saveTodoList();
    }
});

function attachCheckboxListeners(profileData, selectedProfile) {
    const checkboxes = document.querySelectorAll('.todo-item .checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveTodoList();
            if (!showCompletedCheckbox.checked && checkbox.checked) {
                checkbox.closest('.todo-item').style.display = 'none';
            }
        });
    });
}

showCompletedCheckbox.addEventListener('change', () => {
    const showCompleted = showCompletedCheckbox.checked;

    todoList.querySelectorAll('.todo-item').forEach(item => {
        const checkbox = item.querySelector('.checkbox');
        if (!showCompleted && checkbox.checked) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }
    });
});

function saveTodoList() {
    const todoItems = [];
    todoList.querySelectorAll('.todo-item').forEach(item => {
        const text = item.querySelector('label').textContent;
        const completed = item.querySelector('.checkbox').checked;
        todoItems.push({ text, completed });
    });

    const selectedProfile = profileDropdown.value;
    const profileData = JSON.parse(localStorage.getItem(`profile_${selectedProfile}`));
    profileData.todoList = todoItems;
    localStorage.setItem(`profile_${selectedProfile}`, JSON.stringify(profileData));
}

const backgroundContainer = document.getElementById('background-container');
const locationLink = document.getElementById('location-link');
const locationText = document.getElementById('location-text');
const changeBackgroundButton = document.getElementById('change-background');

async function fetchBackgroundImageList() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/limhenry/earthview/master/earthview.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching background image list:', error);
        return [];
    }
}

let backgroundImageList = [];

async function setRandomBackground() {
    if (backgroundImageList.length === 0) {
        backgroundImageList = await fetchBackgroundImageList();
    }

    const randomIndex = Math.floor(Math.random() * backgroundImageList.length);
    const randomBackground = backgroundImageList[randomIndex];

    backgroundContainer.style.backgroundImage = `url(${randomBackground.image})`;
    locationText.textContent = `${randomBackground.region ? randomBackground.region + ', ' : ''}${randomBackground.country}`;
    locationLink.href = randomBackground.map;
}

changeBackgroundButton.addEventListener('click', () => {
    setRandomBackground();
});

// Initial background setup
setRandomBackground();

// Music
const lofiChannelSelect = document.getElementById('lofi-channel');
const playPauseButton = document.getElementById('play-pause');
const musicPlayerContainer = document.getElementById('music-player-container');

let currentChannelId = '';

function updateLofiChannel(channelId) {
    const embedLink = `https://www.youtube.com/embed/${channelId}?autoplay=1&loop=1&playlist=${channelId}`;
    const iframe = document.createElement('iframe');
    iframe.src = embedLink;
    iframe.width = '100';
    iframe.height = '100';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    musicPlayerContainer.innerHTML = '';
    musicPlayerContainer.appendChild(iframe);
    playPauseButton.textContent = 'Pause';
    currentChannelId = channelId;
}

playPauseButton.addEventListener('click', () => {
    const iframe = musicPlayerContainer.querySelector('iframe');
    if (!iframe) return;

    if (iframe.contentWindow) {
        if (iframe.contentWindow.postMessage) {
            iframe.contentWindow.postMessage('{"event":"command","func":"' + (iframe.paused ? 'playVideo' : 'pauseVideo') + '","args":""}', '*');
        }
    }
});

lofiChannelSelect.addEventListener('change', () => {
    const selectedChannelId = lofiChannelSelect.value;
    updateLofiChannel(selectedChannelId);

    const selectedProfile = profileDropdown.value;
    const profileData = JSON.parse(localStorage.getItem(`profile_${selectedProfile}`));
    profileData.lofiChannel = selectedChannelId;
    localStorage.setItem(`profile_${selectedProfile}`, JSON.stringify(profileData));
});

// Profile Switcher
const profileDropdown = document.getElementById('profile-dropdown');
const addProfileButton = document.getElementById('add-profile');
const profileFormPopup = document.getElementById('profile-form-popup');
const closePopupButton = document.getElementById('close-popup');
const createBlankProfileButton = document.getElementById('create-blank-profile');
const createCurrentProfileButton = document.getElementById('create-current-profile');
const newProfileNameInput = document.getElementById('new-profile-name');
const deleteProfileButton = document.getElementById('delete-profile');

function populateProfileDropdown() {
    profileDropdown.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('profile_')) {
            const profileName = key.replace('profile_', '');
            const option = document.createElement('option');
            option.value = profileName;
            option.textContent = profileName;
            profileDropdown.appendChild(option);
        }
    }
}

populateProfileDropdown();

addProfileButton.addEventListener('click', () => {
    profileFormPopup.style.display = 'block';
});

closePopupButton.addEventListener('click', () => {
    profileFormPopup.style.display = 'none';
    newProfileNameInput.value = '';
});

createBlankProfileButton.addEventListener('click', () => {
    const newProfileName = newProfileNameInput.value;

    if (newProfileName) {
        localStorage.setItem(`profile_${newProfileName}`, JSON.stringify({
            username: newProfileName,
            favoriteAirport: '',
            lofiChannel: 'PfgS405CdXk', // Default channel
            todoList: [],
        }));

        populateProfileDropdown();
        profileFormPopup.style.display = 'none';
        newProfileNameInput.value = '';

        // Automatically switch to the newly created profile
        profileDropdown.value = newProfileName;
        profileDropdown.dispatchEvent(new Event('change'));
    }
});

createCurrentProfileButton.addEventListener('click', () => {
    const newProfileName = newProfileNameInput.value;

    if (newProfileName) {
        const todoItems = [];
        todoList.querySelectorAll('.todo-item').forEach(item => {
            const text = item.querySelector('label').textContent;
            const completed = item.querySelector('.checkbox').checked;
            todoItems.push({ text, completed });
        });

        const selectedChannelId = lofiChannelSelect.value;

        localStorage.setItem(`profile_${newProfileName}`, JSON.stringify({
            username: localStorage.getItem('username') || 'Guest',
            favoriteAirport: '',
            lofiChannel: selectedChannelId,
            todoList: todoItems,
        }));

        populateProfileDropdown();
        profileFormPopup.style.display = 'none';
        newProfileNameInput.value = '';

        // Automatically switch to the newly created profile
        profileDropdown.value = newProfileName;
        profileDropdown.dispatchEvent(new Event('change'));
    }
});


profileDropdown.addEventListener('change', () => {
    const selectedProfile = profileDropdown.value;
    const profileData = JSON.parse(localStorage.getItem(`profile_${selectedProfile}`));

    localStorage.setItem('username', profileData.username);

    // Update greeting
    updateGreetingAndTime();

    // Update todo list
    todoList.innerHTML = '';
    profileData.todoList.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'todo-item';
        taskItem.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <label>${task.text}</label>
        `;
        todoList.appendChild(taskItem);
    });

    // Update music channel
    if (profileData.lofiChannel !== currentChannelId) {
        updateLofiChannel(profileData.lofiChannel);
    }

    // Update lofi channel select
    lofiChannelSelect.value = profileData.lofiChannel;

    // Attach event listeners to the checkboxes for auto-saving
    attachCheckboxListeners(profileData, selectedProfile);
});

deleteProfileButton.addEventListener('click', () => {
    const selectedProfile = profileDropdown.value;
    if (selectedProfile) {
        localStorage.removeItem(`profile_${selectedProfile}`);
        populateProfileDropdown();
        clearProfileData();
    }
});

function clearProfileData() {
    profileDropdown.value = '';
    updateGreetingAndTime();
    todoList.innerHTML = '';
    musicPlayerContainer.innerHTML = '';
    lofiChannelSelect.value = '';
    playPauseButton.textContent = 'Play';
    currentChannelId = '';
}

// Initial profile load
if (localStorage.getItem('username')) {
    const selectedProfile = profileDropdown.value;
    if (selectedProfile) {
        profileDropdown.value = selectedProfile; // Make sure the dropdown reflects the initial profile
        // Trigger the change event to update the greeting, todo list, and music channel
        const changeEvent = new Event('change');
        profileDropdown.dispatchEvent(changeEvent);
    } else {
        clearProfileData();
    }
}