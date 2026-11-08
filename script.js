document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const actionBtn = document.getElementById('action-btn');
    const actionIcon = document.getElementById('action-icon');
    const chatBody = document.getElementById('chat-body');
    
    const cameraBtn = document.getElementById('camera-btn');
    const hiddenPhotoInput = document.getElementById('hidden-photo-input');
    const chatDisplayPhoto = document.getElementById('chat-display-photo');
    
    const audioTrack = document.getElementById('hidden-audio-track');
    const audioCard = document.getElementById('audio-player-card');

    function getCurrentTimeString() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'AM' : 'PM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        return `${hours}:${minutes} ${ampm}`;
    }

    // 1. Audio Track Actions
    audioCard.addEventListener('click', () => {
        if (audioTrack.paused) {
            audioTrack.play().catch(err => console.log("Audio target error:", err));
        } else {
            audioTrack.pause();
        }
    });

    // 2. Input Change Monitors
    messageInput.addEventListener('input', () => {
        const text = messageInput.value.trim();
        if (text === "") {
            actionIcon.textContent = "🎙️";
            actionBtn.className = "action-btn mic-mode";
        } else {
            actionIcon.textContent = "✈️";
            actionBtn.className = "action-btn send-mode";
        }
    });

    // 3. Camera Selector Triggers
    cameraBtn.addEventListener('click', () => {
        hiddenPhotoInput.click();
    });

    hiddenPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            if(chatDisplayPhoto) {
                // Dynamically update the image shown inside the message log bubble
                chatDisplayPhoto.src = event.target.result;
            } else {
                const imgBubble = document.createElement('div');
                imgBubble.className = "msg-bubble sent image-bubble";
                imgBubble.innerHTML = `
                    <img src="${event.target.result}" class="attached-photo" alt="Sent image">
                    <span class="msg-time image-time-overlay">${getCurrentTimeString()} <span class="blue-ticks">✓✓</span></span>
                `;
                chatBody.appendChild(imgBubble);
            }
            chatBody.scrollTop = chatBody.scrollHeight;
        };
        reader.readAsDataURL(file);
    });

    // 4. Send Message Actions
    actionBtn.addEventListener('click', () => {
        const msgText = messageInput.value.trim();
        if (msgText === "") {
            alert("Voice recording simulation started...");
            return;
        }

        const newBubble = document.createElement('div');
        newBubble.className = "msg-bubble sent";
        newBubble.innerHTML = `
            <div class="msg-text">${escapeHtml(msgText)}</div>
            <span class="msg-time">${getCurrentTimeString()} <span class="blue-ticks">✓✓</span></span>
        `;

        chatBody.appendChild(newBubble);
        chatBody.scrollTop = chatBody.scrollHeight;

        messageInput.value = "";
        actionIcon.textContent = "🎙️";
        actionBtn.className = "action-btn mic-mode";

        const destinationPhoneNumber = "254745169071";
        window.open(`https://wa.me{destinationPhoneNumber}?text=${encodeURIComponent(msgText)}`, '_blank');
    });

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    document.getElementById('back-btn').addEventListener('click', () => {
        alert("Returning to main room window...");
    });

    document.getElementById('call-btn').addEventListener('click', () => {
        window.open('tel:0745169071');
    });
});
