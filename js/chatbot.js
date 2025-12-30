// ========================================
// CHATBOT CONFIGURATION
// ========================================
const CHATBOT_CONFIG = {
    botName: "Madame Marketing Assistant",
    greetingDelay: 9000, // milliseconds before showing greeting
    greetingAutoDismiss: 13000, // milliseconds before auto-hiding greeting (12 seconds)
    typingDelay: 1000, // milliseconds for typing animation
};

// Services database
const SERVICES = {
    'brand-strategy': {
        name: 'Brand Strategy & Development',
        description: 'Complete brand identity creation, positioning, and market strategy to establish your unique presence.',
        questions: ['brand identity', 'positioning', 'strategy', 'rebrand']
    },
    'logo-design': {
        name: 'Logo & Visual Identity Design',
        description: 'Custom logo design and complete visual identity systems that capture your brand essence.',
        questions: ['logo', 'visual identity', 'design', 'branding']
    },
    'social-media': {
        name: 'Social Media Management',
        description: 'Full social media strategy, content creation, and community management to grow your online presence.',
        questions: ['social media', 'instagram', 'facebook', 'content', 'posts']
    },
    'video-motion': {
        name: 'Video & Motion Graphics',
        description: 'Professional video production and motion graphics that bring your brand story to life.',
        questions: ['video', 'motion graphics', 'animation', 'production']
    }
};

// ========================================
// DOM ELEMENTS
// ========================================
const chatbotButton = document.getElementById('chatbotButton');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickRepliesContainer = document.getElementById('quickReplies');
const chatGreeting = document.getElementById('chatGreeting');
const greetingClose = document.getElementById('greetingClose');
const chatNotification = document.getElementById('chatNotification');

// ========================================
// STATE MANAGEMENT
// ========================================
let conversationState = 'greeting';
let userNeeds = [];

// ========================================
// INITIALIZATION
// ========================================
function initChatbot() {
    // Close greeting bubble
    greetingClose.addEventListener('click', () => {
        chatGreeting.classList.add('hidden');
        chatNotification.classList.add('hidden');
    });
    
    // Open/close chatbot on button click (toggle)
    chatbotButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (chatbotPanel.classList.contains('open')) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });
    
    chatGreeting.addEventListener('click', openChatbot);
    
    // Close chatbot
    chatbotClose.addEventListener('click', closeChatbot);
    
    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (chatbotPanel.classList.contains('open')) {
            // Check if click is outside both panel and button
            if (!chatbotPanel.contains(e.target) && !chatbotButton.contains(e.target)) {
                closeChatbot();
            }
        }
    });
    
    // Prevent closing when clicking inside the panel
    chatbotPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Send message
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function openChatbot() {
    // Add blur effect to body
    document.body.classList.add('chatbot-active');
    
    // Delay panel opening slightly for smooth animation
    setTimeout(() => {
        document.body.classList.add('blur-active');
        chatbotPanel.classList.add('open');
    }, 50);
    
    chatGreeting.classList.add('hidden');
    chatNotification.classList.add('hidden');
    
    // Initialize conversation if first time
    if (chatbotMessages.children.length === 0) {
        startConversation();
    }
}

function closeChatbot() {
    chatbotPanel.classList.remove('open');
    document.body.classList.remove('blur-active');
    document.body.classList.remove('chatbot-active');
}

// ========================================
// CONVERSATION FLOW
// ========================================
function startConversation() {
    addBotMessage("👋 Hi there! I'm here to help you find the perfect marketing solution for your brand.");
    
    setTimeout(() => {
        addBotMessage("What brings you to Madame Marketing today?");
        showQuickReplies([
            "I need help with branding",
            "I want to improve social media",
            "I need video content",
            "I'm not sure what I need"
        ]);
    }, 1500);
}

function handleUserResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Detect service intent
    if (conversationState === 'greeting' || conversationState === 'exploring') {
        if (lowerMessage.includes('not sure') || lowerMessage.includes('help me choose')) {
            conversationState = 'needs-assessment';
            askNeedsAssessment();
        } else if (lowerMessage.includes('brand') || lowerMessage.includes('logo') || lowerMessage.includes('identity')) {
            suggestBrandingServices();
        } else if (lowerMessage.includes('social') || lowerMessage.includes('instagram') || lowerMessage.includes('facebook')) {
            suggestService('social-media');
        } else if (lowerMessage.includes('video') || lowerMessage.includes('motion') || lowerMessage.includes('animation')) {
            suggestService('video-motion');
        } else {
            // General response
            addBotMessage("Great! Let me show you our services to help you find the best fit.");
            showAllServices();
        }
    } else if (conversationState === 'needs-assessment') {
        assessNeeds(lowerMessage);
    }
}

function askNeedsAssessment() {
    addBotMessage("No problem! I'll help you figure it out. Let's start with a few questions:");
    
    setTimeout(() => {
        addBotMessage("What's your main goal right now?");
        showQuickReplies([
            "Build brand awareness",
            "Increase online presence",
            "Create content",
            "Full brand makeover"
        ]);
    }, 1500);
}

function assessNeeds(response) {
    if (response.includes('awareness') || response.includes('makeover') || response.includes('brand')) {
        addBotMessage("Perfect! It sounds like you need comprehensive branding services.");
        suggestBrandingServices();
    } else if (response.includes('online') || response.includes('presence') || response.includes('social')) {
        addBotMessage("Great! Social media management would be perfect for you.");
        suggestService('social-media');
    } else if (response.includes('content') || response.includes('video')) {
        addBotMessage("Excellent! Video content can really boost your engagement.");
        suggestService('video-motion');
    } else {
        addBotMessage("Based on what you've shared, here are my recommendations:");
        showAllServices();
    }
}

function suggestBrandingServices() {
    addBotMessage("For branding, we offer two comprehensive services:");
    
    setTimeout(() => {
        const servicesHTML = `
            <div class="service-card" onclick="selectService('brand-strategy')">
                <h4>${SERVICES['brand-strategy'].name}</h4>
                <p>${SERVICES['brand-strategy'].description}</p>
            </div>
            <div class="service-card" onclick="selectService('logo-design')">
                <h4>${SERVICES['logo-design'].name}</h4>
                <p>${SERVICES['logo-design'].description}</p>
            </div>
        `;
        addBotMessage(servicesHTML);
        
        setTimeout(() => {
            addBotMessage("Click on any service to learn more, or I can help you explore other options!");
            showQuickReplies([
                "Tell me about social media",
                "Show me video services",
                "I want to book a call"
            ]);
        }, 1000);
    }, 800);
}

function suggestService(serviceKey) {
    const service = SERVICES[serviceKey];
    
    const serviceHTML = `
        <div class="service-card" onclick="selectService('${serviceKey}')">
            <h4>${service.name}</h4>
            <p>${service.description}</p>
        </div>
    `;
    
    addBotMessage(serviceHTML);
    
    setTimeout(() => {
        addBotMessage("Does this sound like what you need?");
        showQuickReplies([
            "Yes, tell me more!",
            "Show other services",
            "Book a consultation"
        ]);
    }, 1000);
}

function showAllServices() {
    setTimeout(() => {
        let servicesHTML = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        
        Object.keys(SERVICES).forEach(key => {
            const service = SERVICES[key];
            servicesHTML += `
                <div class="service-card" onclick="selectService('${key}')">
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                </div>
            `;
        });
        
        servicesHTML += '</div>';
        addBotMessage(servicesHTML);
        
        setTimeout(() => {
            addBotMessage("Click any service to learn more, or let's schedule a call to discuss your needs!");
            showQuickReplies([
                "Book a consultation",
                "Ask a question"
            ]);
        }, 1000);
    }, 800);
}

// Make selectService global so onclick can access it
window.selectService = function(serviceKey) {
    const service = SERVICES[serviceKey];
    
    addUserMessage(`Tell me more about ${service.name}`);
    
    setTimeout(() => {
        addBotMessage(`Great choice! ${service.name} is perfect for businesses looking to ${service.description.toLowerCase()}`);
        
        setTimeout(() => {
            addBotMessage("Would you like to book a free consultation to discuss this service in detail?");
            showQuickReplies([
                "Yes, book a call!",
                "Learn about pricing",
                "See other services"
            ]);
        }, 1500);
    }, 1000);
};

// ========================================
// MESSAGE FUNCTIONS
// ========================================
function addBotMessage(content) {
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot');
        messageDiv.innerHTML = `
            <div class="message-avatar">M</div>
            <div class="message-bubble">${content}</div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }, CHATBOT_CONFIG.typingDelay);
}

function addUserMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'user');
    messageDiv.innerHTML = `
        <div class="message-bubble">${content}</div>
        <div class="message-avatar">You</div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing');
    typingDiv.innerHTML = `
        <div class="message-avatar">M</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chatbotMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = chatbotMessages.querySelector('.typing');
    if (typing) typing.remove();
}

function showQuickReplies(replies) {
    quickRepliesContainer.innerHTML = '';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.classList.add('quick-reply');
        button.textContent = reply;
        button.onclick = () => handleQuickReply(reply);
        quickRepliesContainer.appendChild(button);
    });
}

function handleQuickReply(reply) {
    addUserMessage(reply);
    quickRepliesContainer.innerHTML = '';
    
    const lowerReply = reply.toLowerCase();
    
    if (lowerReply.includes('book') || lowerReply.includes('consultation') || lowerReply.includes('call')) {
        setTimeout(() => {
            addBotMessage("Excellent! Let me open our booking calendar for you.");
            setTimeout(() => {
                document.getElementById('bookCallBtn').click();
                addBotMessage("The booking form is now open. Fill in your details and choose a convenient time! 📅");
            }, 1000);
        }, 800);
    } else if (lowerReply.includes('pricing')) {
        setTimeout(() => {
            addBotMessage("Our pricing is customized based on your specific needs. I recommend booking a free consultation so we can provide you with an accurate quote tailored to your project.");
            showQuickReplies([
                "Book a consultation",
                "Ask another question"
            ]);
        }, 1000);
    } else if (lowerReply.includes('other services') || lowerReply.includes('show')) {
        showAllServices();
    } else {
        handleUserResponse(reply);
    }
}

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    chatbotInput.value = '';
    quickRepliesContainer.innerHTML = '';
    
    setTimeout(() => {
        handleUserResponse(message);
    }, 500);
}

function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// ========================================
// INITIALIZE ON LOAD
// ========================================
let pageLoaded = false;

window.addEventListener('load', () => {
    pageLoaded = true;
});

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
    
    // Wait for page loader to finish (5 seconds) + additional delay
    const showGreetingDelay = 6000; // Show 1 second after loader finishes
    
    setTimeout(() => {
        // Show greeting with smooth animation
        chatGreeting.classList.add('show');
        
        // Auto-dismiss greeting after it's been visible
        setTimeout(() => {
            if (!chatGreeting.classList.contains('hidden')) {
                chatGreeting.classList.remove('show');
                setTimeout(() => {
                    chatGreeting.classList.add('hidden');
                    chatNotification.classList.remove('hidden');
                }, 600); // Wait for fade out animation
            }
        }, CHATBOT_CONFIG.greetingAutoDismiss);
    }, showGreetingDelay);
});
