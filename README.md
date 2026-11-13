# QuizLive

QuizLive is a real-time multiplayer quiz platform inspired by games like Kahoot.

A host starts a quiz on a computer, the questions are displayed on a large screen, and players join from their phones using a game code. Players answer on their own devices while the server manages the game state, answers, timer and scores.

The project is built as a learning project to explore modern frontend and backend development, real-time communication and full-stack application architecture.

> **Status:** phases 0 to 12 are complete. The app works end to end on a local network, including on real phones. Phases 13 to 16 are still to do. See [Development Roadmap](#development-roadmap).

## Features

### Working

* Host accounts: register, log in (JWT), log out
* Quiz editor: create quizzes with multiple-choice questions
* "My Quizzes" overview, with a quick way to start a game from a quiz
* Quiz storage in PostgreSQL
* Games linked to a quiz, or to built-in demo questions when no quiz is chosen
* Unique game codes and a player lobby
* Join a game with a game code and a name, no account needed
* Mobile-first player interface
* Dedicated large-screen interface (wider layout, large game code and timer)
* Host control panel
* Real-time updates over WebSockets (STOMP)
* Server-side countdown timer (20 seconds per question)
* Answer locking when the timer ends, and one answer per player
* The question ends early as soon as every player has answered
* Server-side answer validation
* Speed-based scoring: up to 1000 points, at least 100 for a correct answer, 0 for a wrong one
* Result screen with the correct answer and a live leaderboard after every question
* Ownership checks: only the owner of a quiz or game can use it as host
* Light and dark theme with a manual switch
* Responsive layout, tested on a phone over the local network

### Planned

* QR code for joining games
* Intermediate standings (top 5 plus the player's own rank) and a final top 3
* A short pause or separate step so players can see their result before the host moves on
* Animations, including leaderboard animations
* Extra question types and game modes (see Phase 13)
* Handling of disconnects and other edge cases (see Phase 15)
* Deployment (see Phase 16)

## Architecture

QuizLive consists of three clients connected to one backend.

```text
                    ┌──────────────────┐
                    │       HOST       │
                    │      React       │
                    │  (logged in, JWT)│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Java Backend   │
                    │   Spring Boot    │
                    │                  │
                    │   Game engine   │
                    │   REST API       │
                    │   WebSockets     │
                    │   Security (JWT) │
                    └───┬──────────┬───┘
                        │          │
                        │          ▼
                        │   ┌────────────┐
                        │   │ PostgreSQL │
                        │   └────────────┘
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │  PLAYER  │   │  PLAYER  │   │  SCREEN  │
   │  Mobile  │   │  Mobile  │   │  Display │
   │  React   │   │  React   │   │  React   │
   └──────────┘   └──────────┘   └──────────┘
```

The backend is the authoritative source for the game state. Clients do not decide whether an answer is correct or how many points a player gets. They send actions to the backend, and the backend processes them.

### Design decisions

* **Server-authoritative game logic.** Question order, timer, validation and scoring all live on the backend.
* **The correct answer stays on the server** until the question has ended. Clients receive a reduced question object without it.
* **Contract-first API.** The REST API is described in an OpenAPI file, and the backend generates its API interfaces and models from it.
* **REST for the starting state, WebSockets for live updates.** The large screen fetches the current game once and then follows events.
* **JWT in an `Authorization` header** instead of cookie sessions, because the frontend and backend will run on different domains.
* **Pessimistic row locking** (`findForUpdate`) on game changes, so simultaneous answers cannot overwrite each other.
* **Guarded state transitions.** The next question can only be started from `LOBBY` or `QUESTION_ENDED`. Anything else is rejected with `409 Conflict`.
* **Frontend split by responsibility.** Pages show things, hooks hold state and logic, an `api/` layer holds the requests, and views are small components.

## Technology Stack

### Frontend

* React with Vite
* JavaScript
* React Router
* Plain CSS with CSS variables (design tokens), mobile-first
* STOMP over WebSockets (`@stomp/stompjs`)

### Backend

* Java 21
* Spring Boot 4.1.1 with Maven
* REST API, generated from an OpenAPI contract
* WebSockets with STOMP
* Spring Security with JWT and BCrypt password hashing
* Spring Data JPA

### Database

* PostgreSQL

### Testing

* JUnit 5, Mockito and AssertJ (unit tests for the game service)

### Development

* Visual Studio Code
* Git and GitHub
* Node.js
* JDK 21

## Project Structure

```text
quiz-live/
│
├── backend/
│   ├── src/
│   │   ├── main/java/com/pubquiz/backend/
│   │   │   ├── controller/   REST controllers
│   │   │   ├── service/      game and quiz logic
│   │   │   ├── model/        JPA entities
│   │   │   ├── repository/   database access
│   │   │   ├── mapper/       entity <-> API model
│   │   │   ├── config/       security, CORS, WebSocket
│   │   │   └── exception/    custom exceptions and their HTTP status
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/          requests to the backend, session, error messages
│   │   ├── components/   small reusable views
│   │   ├── hooks/        state and logic per page
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

The exact structure may still change as the project develops.

## Getting Started

You need JDK 21, Maven, Node.js and PostgreSQL.

1. **Database.** Create a local PostgreSQL database called `pubquiz`. Database credentials are kept in `backend/local.properties`, which is not committed to Git.
2. **Backend.** In `backend/`, run `mvn spring-boot:run`. Run the unit tests with `mvn test`.
3. **Frontend.** In `frontend/`, run `npm install` and then `npm run dev`. The app is served on port 5173.

### Trying it on a phone

The dev server is reachable from other devices on the same network. Open `http://<ip-of-your-computer>:5173` on the phone. The frontend takes the backend address from the address the page was opened with, so the same code works on `localhost` and on a local IP address.

The backend only accepts requests from `localhost` and `192.168.*.*` on port 5173. That is meant for development and must be replaced with the real domain when deploying (Phase 16).

## How the Game Works

### 1. Host creates a game

The host logs in, opens a quiz from "My Quizzes" (or chooses the demo quiz) and starts a new game. The server generates a unique game code.

```text
Game Code: 482731
```

### 2. Players join

Players open QuizLive on their phones and enter the game code and a name. No account is needed.

```text
Game Code
[ 482731 ]

Name
[ Jorn ]

[ JOIN ]
```

The host panel and the large screen update in real time as players join.

### 3. The host starts a question

The large screen shows the question, the answers and a countdown. The player's phone shows the question with large answer buttons.

```text
What is the capital of France?

Amsterdam     Paris
Madrid        Rome

20 seconds
```

### 4. Players answer

A player taps an answer. The phone then shows that the answer was sent while it waits for the others. Each player can answer once per question.

### 5. The server processes the answers

The backend checks that:

* the game and the player exist
* a question is active
* the deadline has not passed
* the player has not answered yet

A correct answer scores more points the faster it arrives. When the deadline passes, or when every player has answered, the server ends the question.

### 6. Results

The large screen shows the correct answer and the leaderboard. Each phone shows whether the player was right and their total score. The host can then start the next question. After the last question, everyone is told that the quiz is finished.

## Game State

```text
LOBBY
  │  host starts a question
  ▼
QUESTION_ACTIVE ◄──────────────┐
  │  timer ends, or all players │  host starts the next question
  │  have answered              │
  ▼                             │
QUESTION_ENDED ─────────────────┘
  │  host asks for a question and none are left
  ▼
GAME_FINISHED (broadcast to all clients)
```

The backend controls these states so that all connected clients stay in sync. Starting a question is only allowed from `LOBBY` or `QUESTION_ENDED`.

## Real-Time Communication

All live updates go to one channel per game, `/topic/game/{gameCode}`. Every message is an event with a type and a payload.

```text
Host starts a question (REST)
  │
  ▼
Java Server
  │
  ├──────────────► Screen
  ├──────────────► Player 1
  └──────────────► Player 2
```

Events in use:

```text
PLAYER_JOINED
QUESTION_STARTED
ANSWER_SUBMITTED
QUESTION_ENDED        (includes the correct answer and the leaderboard)
GAME_FINISHED
```

## Development Roadmap

The project is developed in phases. ✅ means done.

* ✅ **Phase 0, Development environment.** JDK, Maven, Node.js, VS Code, Git, Spring Boot.
* ✅ **Phase 1, React quiz.** A basic quiz without a backend.
* ✅ **Phase 2, Spring Boot backend.** Basic domain objects and REST endpoints.
* ✅ **Phase 3, Connect React and Java.** HTTP and CORS.
* ✅ **Phase 4, Host, Player and Screen.** Routing and separate pages.
* ✅ **Phase 5, WebSockets.** STOMP and a reusable socket hook.
* ✅ **Phase 6, Game flow.** Server-authoritative questions and answers.
* ✅ **Phase 7, Timer.** Server-controlled question timer.
* ✅ **Phase 7.5, Contract-first API and frontend refactor.** OpenAPI contract, an `api/` layer, hooks and small view components.
* ✅ **Phase 8, Scoring.** Speed-based scores and leaderboard.
* ✅ **Phase 9, Quiz editor.** Hosts can create quizzes.
* ✅ **Phase 10, Database.** PostgreSQL with JPA for quizzes, questions, games, players and scores.
* ✅ **Phase 11, Authentication.** Host accounts with JWT, host-only endpoints, "My Quizzes".
* ✅ **Phase 12, UI/UX.**
  * Responsive, mobile-first design with CSS variables
  * Large-screen layout
  * Light and dark theme with a switch
  * Shared header and navigation
  * Clear error messages, guarded game states, a quiz loaded on the host page, and a return to the original page after logging in
  * The question ends early when everyone has answered
  * Tested on a real phone

  Still open from this phase: animations and leaderboard animations.
* ⬜ **Phase 13, Additional features.** Possible additions: image and music questions, true/false questions, teams, QR-code joining, random questions and answer order, categories, difficulty levels, bonus questions, avatars, power-ups.
* ⬜ **Phase 14, Testing.** Backend logic, REST endpoints, WebSocket communication, state transitions, scoring and many simultaneous players, including a real concurrency test.
* ⬜ **Phase 15, Security and error handling.** Duplicate player names, disconnecting players and hosts, late and repeated answers, invalid requests and WebSocket disconnects.
* ⬜ **Phase 16, Deployment.** Frontend, backend and database hosting, environment variables, HTTPS, production WebSockets and a strict CORS configuration.

## Known Issues and Next Steps

* The host can start the next question right after the results appear, before players have had time to read them.
* A player who does not answer in time is shown "Wrong" instead of "No answer".
* Joining with a wrong game code shows a technical error message instead of a friendly one.
* A quiz can be saved without a title or with empty questions.
* The leaderboard on the large screen shows every player, with no top 5 or top 3 view.
* If a login token expires while a page is open, the user is sent to the login page but not back to the page they were on afterwards.

## Learning Goals

This project is primarily a learning project. The main goals are practical experience with:

* React
* Java
* Spring Boot
* REST APIs and API contracts
* WebSockets
* Object-oriented programming
* State management
* Client-server architecture
* Databases, SQL and JPA
* Authentication
* Git
* Testing
* Deployment

The project is developed in small steps, one phase at a time, instead of generating the whole application at once.

## Future Vision

The final goal is a QuizLive instance running on a computer or server where a whole group can join using their phones. The host controls the game, the large screen shows the quiz, and every phone is a personal controller.

```text
             HOST
               │
               ▼
        ┌─────────────┐
        │   QuizLive  │
        │   Server    │
        └──────┬──────┘
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
    SCREEN   PLAYER   PLAYER
             PHONE    PHONE
```