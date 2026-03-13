// ========================================
// CONVERSATIONAL ASSISTANT (CHATBOT)
// ========================================

const CHATBOT_CONFIG = {
    botName: "Madame Marketing Assistant",
    greetingAutoDismiss: 13000,
    baseTypingDelay: 550,
    maxTypingDelay: 1500,
    showGreetingDelay: 6000
};

const SERVICE_KNOWLEDGE = {
    "brand-development": {
        name: "Brand Development",
        summary: "Positioning, voice, and strategic direction for long-term brand clarity.",
        useCases: ["new brand", "rebrand", "clarity", "positioning"]
    },
    "social-media": {
        name: "Social Media",
        summary: "Strategy, content planning, creation, editing, and publishing end-to-end.",
        useCases: ["instagram", "consistency", "growth", "engagement"]
    },
    "branding": {
        name: "Branding",
        summary: "Visual identity systems with typography, color, and tone consistency.",
        useCases: ["brand look", "identity", "premium feel", "consistency"]
    },
    "logo-design": {
        name: "Logo Design",
        summary: "Distinct logo concepts designed for digital, print, and packaging.",
        useCases: ["logo", "mark", "identity refresh"]
    },
    photography: {
        name: "Photography",
        summary: "Brand-led photography crafted to capture mood, quality, and presence.",
        useCases: ["product shoot", "campaign shoot", "brand visuals"]
    },
    videography: {
        name: "Videography",
        summary: "Story-driven video production from concept to post-production.",
        useCases: ["reels", "ad films", "launch videos"]
    },
    "package-design": {
        name: "Package Design",
        summary: "Packaging that blends visual appeal with practical product experience.",
        useCases: ["packaging", "retail shelf impact", "label design"]
    },
    collateral: {
        name: "Collateral",
        summary: "Pitch decks, brochures, and marketing assets aligned to your brand.",
        useCases: ["deck", "brochure", "sales kit", "presentation"]
    }
};

const QUICK_REPLY_SETS = {
    intro: [
        "I need help choosing services",
        "I want to grow social media",
        "I need a full rebrand",
        "How does pricing work?"
    ],
    discovery: [
        "Lead generation",
        "Better brand identity",
        "More content output",
        "Not sure yet"
    ],
    nextStep: [
        "Show recommended services",
        "What budget should I plan?",
        "Book a consultation",
        "Ask another question"
    ]
};

const CLARIFICATION_REPLY = "I am sorry, I did not fully understand that yet. Could you rephrase it in one line? You can tell me your goal, ask about pricing, or say book a consultation.";

const DOM = {
    chatbotButton: document.getElementById("chatbotButton"),
    chatbotPanel: document.getElementById("chatbotPanel"),
    chatbotClose: document.getElementById("chatbotClose"),
    chatbotMessages: document.getElementById("chatbotMessages"),
    chatbotInput: document.getElementById("chatbotInput"),
    chatbotSend: document.getElementById("chatbotSend"),
    quickRepliesContainer: document.getElementById("quickReplies"),
    chatGreeting: document.getElementById("chatGreeting"),
    greetingClose: document.getElementById("greetingClose"),
    chatNotification: document.getElementById("chatNotification")
};

const conversation = {
    stage: "idle",
    history: [],
    profile: {
        name: "",
        business: "",
        goal: "",
        budget: "",
        timeline: "",
        serviceInterest: ""
    },
    asked: {
        goal: false,
        budget: false,
        timeline: false
    },
    suggestions: []
};

function initChatbot() {
    if (!DOM.chatbotButton || !DOM.chatbotPanel) return;

    DOM.greetingClose.addEventListener("click", () => {
        DOM.chatGreeting.classList.add("hidden");
        DOM.chatNotification.classList.add("hidden");
    });

    DOM.chatbotButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (DOM.chatbotPanel.classList.contains("open")) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });

    DOM.chatGreeting.addEventListener("click", openChatbot);
    DOM.chatbotClose.addEventListener("click", closeChatbot);

    document.addEventListener("click", (event) => {
        if (!DOM.chatbotPanel.classList.contains("open")) return;
        if (!DOM.chatbotPanel.contains(event.target) && !DOM.chatbotButton.contains(event.target)) {
            closeChatbot();
        }
    });

    DOM.chatbotPanel.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    DOM.chatbotSend.addEventListener("click", sendMessage);
    DOM.chatbotInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    DOM.quickRepliesContainer.addEventListener("click", (event) => {
        const replyBtn = event.target.closest(".quick-reply");
        if (!replyBtn) return;
        handleQuickReply(replyBtn.textContent);
    });

    DOM.chatbotMessages.addEventListener("click", (event) => {
        const serviceCard = event.target.closest(".service-card[data-service]");
        if (!serviceCard) return;
        const serviceKey = serviceCard.getAttribute("data-service");
        handleServiceSelection(serviceKey);
    });
}

function openChatbot() {
    document.body.classList.add("chatbot-active");
    setTimeout(() => {
        document.body.classList.add("blur-active");
        DOM.chatbotPanel.classList.add("open");
    }, 50);

    DOM.chatGreeting.classList.add("hidden");
    DOM.chatNotification.classList.add("hidden");

    if (DOM.chatbotMessages.children.length === 0) {
        startConversation();
    }
}

function closeChatbot() {
    DOM.chatbotPanel.classList.remove("open");
    document.body.classList.remove("blur-active");
    document.body.classList.remove("chatbot-active");
}

function startConversation() {
    conversation.stage = "intro";

    addBotMessage("Hi, I am your Madame Marketing assistant. Tell me what you are trying to achieve right now and I will help you map the right next step.");
    addBotMessage("For example: better leads, stronger brand identity, more social content, or a full launch.", { queue: true });
    showQuickReplies(QUICK_REPLY_SETS.intro);
}

function sendMessage() {
    const message = DOM.chatbotInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    DOM.chatbotInput.value = "";
    clearQuickReplies();

    setTimeout(() => {
        processUserMessage(message);
    }, 180);
}

function handleQuickReply(reply) {
    addUserMessage(reply);
    clearQuickReplies();
    setTimeout(() => processUserMessage(reply), 120);
}

function processUserMessage(message) {
    const clean = normalizeText(message);
    const intents = detectIntents(clean);

    captureProfile(clean);
    conversation.history.push({ role: "user", text: message, intents });

    if (intents.includes("booking")) {
        respondWithBooking();
        return;
    }

    if (intents.includes("pricing")) {
        respondWithPricing();
        return;
    }

    if (intents.includes("greeting")) {
        respondWithGreeting();
        return;
    }

    if (intents.includes("plan")) {
        respondWithPlan();
        return;
    }

    if (intents.includes("show-services")) {
        recommendServices([], clean);
        return;
    }

    if (intents.includes("done")) {
        addBotMessage("Great. I am here whenever you want to continue planning your marketing roadmap.");
        showQuickReplies(["Restart recommendations", "Book a consultation", "How does pricing work?"]);
        return;
    }

    if (intents.includes("faq-payment")) {
        addBotMessage("We work with advance payments for projects and retainers. It keeps planning and execution focused and predictable.");
        showQuickReplies(["How long is the retainer?", "Book a consultation", "Show services"]);
        return;
    }

    if (intents.includes("faq-retainer")) {
        addBotMessage("Retainers usually start at a 3-month minimum so strategy, content, and performance can compound.");
        showQuickReplies(["What services fit me?", "How does pricing work?", "Book a consultation"]);
        return;
    }

    if (intents.includes("thanks")) {
        addBotMessage("Happy to help. If you want, I can now suggest a package based on your goal and timeline.");
        showQuickReplies(QUICK_REPLY_SETS.nextStep);
        return;
    }

    if (intents.some((intent) => intent.startsWith("service-")) || intents.includes("service-general")) {
        recommendServices(intents, clean);
        return;
    }

    if (conversation.stage === "intro" || conversation.stage === "discovery") {
        runDiscoveryFollowUp(clean);
        return;
    }

    respondWithClarification();
}

function runDiscoveryFollowUp(cleanMessage) {
    if (!conversation.profile.goal) {
        respondWithClarification();
        conversation.asked.goal = true;
        conversation.stage = "discovery";
        return;
    }

    if (!conversation.profile.timeline && !conversation.asked.timeline) {
        addBotMessage("Helpful. What timeline are you working with: immediate, this month, or next quarter?");
        showQuickReplies(["Immediate", "This month", "Next quarter", "Flexible"]);
        conversation.asked.timeline = true;
        conversation.stage = "discovery";
        return;
    }

    recommendServices([], cleanMessage);
}

function recommendServices(intents, message) {
    const recommended = pickServices(intents, message);
    conversation.suggestions = recommended;
    conversation.stage = "recommend";

    const lead = buildPersonalizedLead();
    addBotMessage(lead);

    if (recommended.length === 0) {
        addBotMessage("I suggest we start with a quick discovery call so we can map your exact mix of services.", { queue: true });
        showQuickReplies(["Book a consultation", "How does pricing work?", "Ask another question"]);
        return;
    }

    addBotMessage(buildServiceCards(recommended), { html: true, queue: true });
    addBotMessage("Pick one service card and I will break down what the first 2 weeks would look like.", { queue: true });
    showQuickReplies(QUICK_REPLY_SETS.nextStep);
}

function respondWithPricing() {
    conversation.stage = "discovery";
    addBotMessage("Pricing is scoped to your goals, timeline, and deliverables. We usually define options after a short strategy call so the quote matches your actual needs.");

    if (!conversation.profile.goal) {
        addBotMessage("If you share your primary goal, I can suggest the best entry point before the call.", { queue: true });
        showQuickReplies(QUICK_REPLY_SETS.discovery);
    } else {
        showQuickReplies(["Show recommended services", "Book a consultation", "What is included in a retainer?"]);
    }
}

function respondWithBooking() {
    addBotMessage("Great, I will open the consultation form now.");
    setTimeout(() => {
        openBookingModal();
        addBotMessage("The booking form is open. Share your details and preferred time, and the team will take it from there.");
        showQuickReplies(["Before booking, show services", "How does pricing work?", "Done"]);
    }, 700);
}

function respondWithPlan() {
    const chosen = SERVICE_KNOWLEDGE[conversation.profile.serviceInterest];

    if (!chosen) {
        addBotMessage("I can do that. First, pick one recommended service so I can tailor a month-one roadmap.");
        showQuickReplies(["Show recommended services", "Book a consultation"]);
        return;
    }

    addBotMessage(`Month one for ${chosen.name}: Week 1 discovery and audit, Week 2 strategic direction and concepting, Week 3 production and execution, Week 4 review and optimization.`);
    addBotMessage("If you want, we can lock this into a formal scope during a consultation call.", { queue: true });
    showQuickReplies(["Book a consultation", "Show another service", "How does pricing work?"]);
}

function respondWithGreeting() {
    const name = conversation.profile.name ? ` ${conversation.profile.name}` : "";
    const stageAwarePrompt = conversation.profile.goal
        ? "Want me to continue from where we left off and suggest services for your goal?"
        : "What are you working on right now: brand, social media, content, or a full launch?";

    addBotMessage(`Hi${name}. Great to meet you.`);
    addBotMessage(stageAwarePrompt, { queue: true });

    if (conversation.profile.goal) {
        showQuickReplies(["Show recommended services", "How does pricing work?", "Book a consultation"]);
    } else {
        showQuickReplies(["I need help choosing services", "I want to grow social media", "I need a full rebrand"]);
    }
}

function respondWithClarification() {
    addBotMessage(CLARIFICATION_REPLY);
    showQuickReplies(["I need help choosing services", "How does pricing work?", "Book a consultation"]);
}

function handleServiceSelection(serviceKey) {
    const service = SERVICE_KNOWLEDGE[serviceKey];
    if (!service) return;

    conversation.profile.serviceInterest = serviceKey;
    addUserMessage(`Tell me more about ${service.name}`);

    const detail = `${service.name} is a strong fit for ${conversation.profile.goal || "your current objective"}. We usually start with a discovery sprint, then move into execution with weekly progress touchpoints.`;
    addBotMessage(detail);
    addBotMessage("Would you like a recommended plan for month one, or should I open the booking form?", { queue: true });
    showQuickReplies(["Give me a month-one plan", "Book a consultation", "Show another service"]);
}

function detectIntents(message) {
    const intents = [];

    if (hasAny(message, ["book", "consultation", "call", "schedule", "meeting"])) intents.push("booking");
    if (hasAny(message, ["price", "pricing", "cost", "budget", "fee", "quotation", "quote"])) intents.push("pricing");
    if (isGreetingMessage(message)) intents.push("greeting");
    if (hasAny(message, ["payment", "advance payment", "pay upfront"])) intents.push("faq-payment");
    if (hasAny(message, ["retainer", "minimum period", "how long"])) intents.push("faq-retainer");
    if (hasAny(message, ["thanks", "thank you", "perfect", "great"])) intents.push("thanks");
    if (hasAny(message, ["month-one", "month one", "plan", "roadmap"])) intents.push("plan");
    if (hasAny(message, ["show another service", "show services", "other services"])) intents.push("show-services");
    if (hasAny(message, ["done", "thats all", "that's all", "finished"])) intents.push("done");

    if (hasAny(message, ["social", "instagram", "content", "reels", "tiktok"])) intents.push("service-social");
    if (hasAny(message, ["brand", "rebrand", "positioning", "identity", "branding"])) intents.push("service-brand");
    if (hasAny(message, ["logo", "visual mark"])) intents.push("service-logo");
    if (hasAny(message, ["photo", "photography", "shoot"])) intents.push("service-photo");
    if (hasAny(message, ["video", "videography", "motion", "production"])) intents.push("service-video");
    if (hasAny(message, ["packaging", "package design", "label"])) intents.push("service-package");
    if (hasAny(message, ["brochure", "deck", "collateral", "presentation"])) intents.push("service-collateral");

    if (intents.length === 0 && hasAny(message, ["service", "help", "not sure", "confused", "where to start"])) {
        intents.push("service-general");
    }

    return intents;
}

function pickServices(intents, message) {
    const picks = new Set();

    if (intents.includes("service-social")) picks.add("social-media");
    if (intents.includes("service-brand")) {
        picks.add("brand-development");
        picks.add("branding");
    }
    if (intents.includes("service-logo")) picks.add("logo-design");
    if (intents.includes("service-photo")) picks.add("photography");
    if (intents.includes("service-video")) picks.add("videography");
    if (intents.includes("service-package")) picks.add("package-design");
    if (intents.includes("service-collateral")) picks.add("collateral");

    if (picks.size === 0) {
        if (hasAny(message, ["launch", "new brand", "start from scratch"])) {
            picks.add("brand-development");
            picks.add("branding");
            picks.add("social-media");
        } else if (hasAny(message, ["sales", "leads", "conversion"])) {
            picks.add("social-media");
            picks.add("videography");
            picks.add("collateral");
        }
    }

    return Array.from(picks).slice(0, 3);
}

function buildServiceCards(serviceKeys) {
    return serviceKeys
        .map((key) => {
            const service = SERVICE_KNOWLEDGE[key];
            return `
                <div class="service-card" data-service="${key}">
                    <h4>${service.name}</h4>
                    <p>${service.summary}</p>
                </div>
            `;
        })
        .join("");
}

function buildPersonalizedLead() {
    const nameBit = conversation.profile.name ? `${conversation.profile.name}, ` : "";
    const goalBit = conversation.profile.goal || "what you described";
    return `${nameBit}based on ${goalBit}, here are the services I would shortlist first.`;
}

function captureProfile(message) {
    const nameMatch = message.match(/\b(i am|i'm|my name is)\s+([a-z]{2,20})\b/i);
    if (nameMatch && !conversation.profile.name) {
        conversation.profile.name = capitalize(nameMatch[2]);
    }

    const businessMatch = message.match(/\b(i run|we run|my business is|our company is)\s+([a-z0-9\s&-]{3,50})/i);
    if (businessMatch && !conversation.profile.business) {
        conversation.profile.business = businessMatch[2].trim();
    }

    if (!conversation.profile.goal && hasAny(message, ["lead", "awareness", "identity", "sales", "content", "launch", "growth"])) {
        conversation.profile.goal = message;
    }

    const budgetMatch = message.match(/\b(\d{2,6})(k)?\b/i);
    if (budgetMatch && hasAny(message, ["budget", "price", "cost"])) {
        conversation.profile.budget = `${budgetMatch[1]}${budgetMatch[2] ? "k" : ""}`;
    }

    if (!conversation.profile.timeline) {
        if (hasAny(message, ["urgent", "asap", "immediately"])) conversation.profile.timeline = "immediate";
        if (hasAny(message, ["this month", "2 weeks", "3 weeks", "4 weeks"])) conversation.profile.timeline = "this month";
        if (hasAny(message, ["next quarter", "3 months", "q2", "q3", "q4"])) conversation.profile.timeline = "next quarter";
        if (hasAny(message, ["flexible", "no rush"])) conversation.profile.timeline = "flexible";
    }
}

function hasAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
}

function isGreetingMessage(text) {
    return /\b(hi|hello|hey|yo|good morning|good afternoon|good evening|namaste)\b/.test(text);
}

function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function addBotMessage(content, options = {}) {
    const { html = false, queue = false } = options;
    const delay = getTypingDelay(content, queue);

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "bot");

        const avatar = document.createElement("div");
        avatar.classList.add("message-avatar");
        avatar.textContent = "M";

        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");

        if (html) {
            bubble.innerHTML = content;
        } else {
            bubble.textContent = content;
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);

        DOM.chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }, delay);
}

function addUserMessage(content) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user");

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    bubble.textContent = content;

    const avatar = document.createElement("div");
    avatar.classList.add("message-avatar");
    avatar.textContent = "You";

    messageDiv.appendChild(bubble);
    messageDiv.appendChild(avatar);

    DOM.chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

function getTypingDelay(content, queued) {
    const textLength = String(content).replace(/<[^>]*>/g, "").length;
    const variableDelay = CHATBOT_CONFIG.baseTypingDelay + Math.min(textLength * 10, 800);
    const delayed = Math.min(variableDelay, CHATBOT_CONFIG.maxTypingDelay);
    return queued ? delayed + 220 : delayed;
}

function showTypingIndicator() {
    removeTypingIndicator();

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot", "typing");
    typingDiv.innerHTML = `
        <div class="message-avatar">M</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    DOM.chatbotMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = DOM.chatbotMessages.querySelector(".typing");
    if (typing) typing.remove();
}

function showQuickReplies(replies) {
    clearQuickReplies();

    replies.forEach((reply) => {
        const button = document.createElement("button");
        button.classList.add("quick-reply");
        button.type = "button";
        button.textContent = reply;
        DOM.quickRepliesContainer.appendChild(button);
    });
}

function clearQuickReplies() {
    DOM.quickRepliesContainer.innerHTML = "";
}

function openBookingModal() {
    const primaryButton = document.getElementById("bookCallBtn");
    if (primaryButton) {
        primaryButton.click();
        return;
    }

    const modal = document.getElementById("bookingModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function scrollToBottom() {
    DOM.chatbotMessages.scrollTop = DOM.chatbotMessages.scrollHeight;
}

window.addEventListener("load", () => {
    if (!DOM.chatGreeting || !DOM.chatNotification) return;

    const showGreeting = () => {
        DOM.chatGreeting.classList.add("show");

        setTimeout(() => {
            if (DOM.chatGreeting.classList.contains("hidden")) return;
            DOM.chatGreeting.classList.remove("show");
            setTimeout(() => {
                DOM.chatGreeting.classList.add("hidden");
                DOM.chatNotification.classList.remove("hidden");
            }, 600);
        }, CHATBOT_CONFIG.greetingAutoDismiss);
    };

    setTimeout(showGreeting, CHATBOT_CONFIG.showGreetingDelay);
});

document.addEventListener("DOMContentLoaded", initChatbot);
