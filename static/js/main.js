/**
 * Returns the current datetime for the message creation.
 */
function getCurrentTimestamp() {
    return new Date();
}

/**
 * Renders a message on the chat screen based on the given arguments.
 * This is called from the `showUserMessage` and `showBotMessage`.
 */
function renderMessageToScreen(args) {
    // local variables
    let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
    let messagesContainer = $('.messages');

    // init element
    let message = $(`
    <li class="message ${args.message_side}">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">${args.text}</div>
            <div class="timestamp">${displayDate}</div>
        </div>
    </li>
    `);

    // add to parent
    messagesContainer.append(message);

    // animations
    setTimeout(function() {
        message.addClass('appeared');
    }, 0);
    messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);
}

/**
 * Displays the user message on the chat screen. This is the right side message.
 */
function showUserMessage(message, datetime) {
    renderMessageToScreen({
        text: message,
        time: datetime,
        message_side: 'right',
    });
}


// Function to handle speech recognition
function listen() {
    const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.start();

    let userSpokenMessage = ''; // Variable to store the user's spoken message

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        userSpokenMessage = transcript; // Store the user's spoken message
    };

    recognition.onend = function(event) {
        if (userSpokenMessage) {
            $('#msg_input').val(userSpokenMessage); // Set the input field value with the spoken message
            $.post('/get_answer', { user_input: userSpokenMessage }, function(data) {
                speak(data.answer); // Speak the chatbot's response
            });
            showUserMessage(userSpokenMessage); // Display the user's spoken message
        }
    };
}

// Function to handle speech synthesis
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);

    // Display the chatbot's spoken response
    if (text) {
        showBotMessage(text);
    }
}

// Bind the click event for Speak button
$('#speak_button').on('click', function(e) {
    const userMessage = $('#msg_input').val();
    if (userMessage) {
        speak(userMessage);
    }
});

// Bind the click event for Listen button
$('#listen_button').on('click', function(e) {
    listen();
});

// ... Your existing code ...

function showBotMessage(message, datetime) {
    if (message) {
        renderMessageToScreen({
            text: message,
            time: datetime,
            message_side: 'left',
        });
    }
}

$(window).on('load', function() {
    // Don't show the initial bot message here
});

/**
 * Get input from user and show it on screen on button click.
 */
$('#send_button').on('click', function(e) {
    // get and show message and reset input
    const userMessage = $('#msg_input').val();
    showUserMessage(userMessage);
    $('#msg_input').val('');

    // show bot message after user submits a question
    $.post('/get_answer', { user_input: userMessage }, function(data) {
        showBotMessage(data.answer);
    });
});

/**
 * Returns a random string. Just to specify bot message to the user.
 */
function randomstring(length = 20) {
    let output = '';

    // magic function
    var randomchar = function() {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n;
        if (n < 36) return String.fromCharCode(n + 55);
        return String.fromCharCode(n + 61);
    };

    while (output.length < length) output += randomchar();
    return output;
}

/**
 * Set initial bot message to the screen for the user.
 */
$(window).on('load', function() {
    showBotMessage('Ask me anything about Olympics...');
});