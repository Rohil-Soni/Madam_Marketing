# Madame Marketing Website

Marketing agency website for Madame Marketing with a premium one-page layout, animated sections, service highlights, a booking modal with calendar/time slots, and an on-page conversational assistant.

## Overview

This project is a static frontend website built with HTML, CSS, and vanilla JavaScript.

Core experience includes:
- Hero, About, Services, Process, Clients, FAQ, and Contact sections
- Smooth interactions and visual animations
- Consultation booking modal with date/time selection
- In-page chatbot assistant for service discovery
- Responsive layout for desktop and mobile

## Tech Stack

- HTML5
- CSS3 (modular stylesheets)
- Vanilla JavaScript (modular scripts)

## Project Structure

```
Madam_Marketing/
├── index.html
├── README.md
├── assets/
│   ├── font/
│   └── images/
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── animation.css
│   ├── booking-modal.css
│   ├── chatbot.css
│   └── loader.css
├── js/
│   ├── main.js
│   ├── animation.js
│   ├── smooth-scroll.js
│   ├── services-interaction.js
│   ├── faq-accordion.js
│   ├── carousel.js
│   ├── chatbot.js
│   ├── calendar-intergration.js
│   ├── form-validation.js
│   └── loader.js
└── backend/
	├── package.json
	└── server.js
```

## Features

### UI and Experience
- Branded page loader
- Sticky navigation with mobile hamburger menu
- Animated hero and section reveals
- Scroll indicator and back-to-top button
- Service cards with interactive details

### Booking System
- Modal-based consultation booking flow
- Calendar with working-day and notice-window restrictions
- Time slot selection
- Form fields for lead capture
- Google Calendar link generation after submission

### Chat Assistant
- Floating chatbot entry point
- Guided service discovery prompts
- Quick-reply actions
- Service recommendation logic based on user intent

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rohil-Soni/Madam_Marketing.git
cd Madam_Marketing
```

### 2. Run locally

Because this is a static site, you can run it with any local web server.

Option A (Python):

```bash
python3 -m http.server 5500
```

Option B (Node):

```bash
npx serve .
```

Then open:
- http://localhost:5500 (Python)
- The URL shown in terminal (Node serve)

## Configuration

Main booking settings live in:
- js/calendar-intergration.js

Update the BOOKING_CONFIG object for:
- Working days and business hours
- Meeting duration and slot interval
- Booking window and minimum notice
- Notification email
- Timezone

Important:
- The default notification email is a placeholder and should be changed.
- Email notifications are currently a stub and require an external provider (for example, EmailJS) to be fully enabled.

## Backend Status

The backend folder exists but currently contains empty placeholders:
- backend/package.json
- backend/server.js

The website currently runs as a frontend-only project.

## Deployment

You can deploy this site to any static hosting platform, such as:
- GitHub Pages
- Netlify
- Vercel (static deployment)
- Cloudflare Pages

Basic deployment flow:
1. Push code to your repository.
2. Connect the repository to your hosting platform.
3. Set the publish directory to project root.
4. Deploy.

## Notes and Maintenance

- Keep image assets optimized for better load performance.
- If booking notifications are enabled later, move any secret keys to secure environment variables.
- Consider adding form validation logic in js/form-validation.js if required.

## License

No license is currently specified in this repository.