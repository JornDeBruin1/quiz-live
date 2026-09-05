# QuizLive

QuizLive is a real-time multiplayer quiz platform inspired by games like Kahoot.

The idea is simple: a host starts a quiz on a computer, the questions are displayed on a large screen, and players join the game from their phones using a game code. Players answer the questions on their own devices while the server manages the game state, answers, timer and scores.

The project is being built as a learning project to explore modern frontend and backend development, real-time communication and full-stack application architecture.

## Features

### Planned

* Create and host quizzes
* Join games using a unique game code
* Mobile-friendly player interface
* Dedicated large-screen interface
* Host control panel
* Real-time questions and game state
* Multiple-choice questions
* Countdown timer
* Answer locking when the timer ends
* Server-side answer validation
* Speed-based scoring
* Live leaderboard
* Quiz editor
* Quiz storage
* Player lobby
* QR code for joining games
* Responsive UI
* Support for multiple simultaneous players

More features will be added as development progresses.

## Architecture

QuizLive consists of three main clients connected to a central backend.

```text
                    ┌──────────────────┐
                    │       HOST       │
                    │   React + Ionic  │
                    └────────┬─────────┘
                             │
                             │
                             ▼
                    ┌──────────────────┐
                    │                  │
                    │   Java Backend   │
                    │   Spring Boot    │
                    │                  │
                    │   Game Engine    │
                    │   REST API       │
                    │   WebSockets     │
                    │                  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  PLAYER  │   │  PLAYER  │   │  SCREEN  │
        │  Mobile  │   │  Mobile  │   │  Display │
        │  React   │   │  React   │   │  React   │
        │  Ionic   │   │  Ionic   │   │  Ionic   │
        └──────────┘   └──────────┘   └──────────┘
```

The backend acts as the authoritative source for the game state.

This means clients do not decide whether an answer is correct or how many points a player receives. They send actions to the backend, and the backend processes them.

## Technology Stack

### Frontend

* React
* Ionic React
* Vite
* JavaScript
* CSS

### Backend

* Java
* Spring Boot
* Maven
* REST API
* WebSockets

### Database

The initial version will not use a database.

Later versions will use:

* PostgreSQL
* Spring Data JPA

### Development

* Visual Studio Code
* Git
* GitHub
* Node.js
* JDK

## Project Structure

The project will eventually follow a structure similar to:

```text
quiz-live/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

The exact structure may change as the project develops.

## How the Game Works

### 1. Host creates a game

The host opens QuizLive and creates a new game.

The server generates a unique game code.

```text
Game Code: 482731
```

### 2. Players join

Players open QuizLive on their phones and enter the game code.

```text
Game Code
[ 482731 ]

Name
[ Jorn ]

[ JOIN GAME ]
```

The server adds each player to the game.

The host and large screen are updated in real time.

### 3. The host starts the quiz

The host starts the game.

The large screen displays the current question.

```text
What is the capital of France?

🔴 Amsterdam
🟡 Paris
🟢 Madrid
🔵 Rome

20 seconds
```

### 4. Players answer

The player's phone displays the answer buttons.

```text
┌─────────────────────┐
│                     │
│        ANSWER       │
│                     │
│    🔴       🟡      │
│                     │
│    🟢       🔵      │
│                     │
└─────────────────────┘
```

The question itself does not need to be displayed on the player's phone.

### 5. The server processes the answer

The player's device sends the selected answer to the backend.

The backend determines:

* Whether the answer is correct
* Whether the answer was submitted in time
* How many points the player receives

### 6. Results

When the question ends, the large screen displays the correct answer and the updated leaderboard.

```text
1. Jorn        4,820
2. Kevin       4,250
3. Lisa        3,910
4. Thomas      3,450
```

The next question can then be started by the host.

## Game State

A game will move through several states:

```text
LOBBY
  ↓
QUESTION
  ↓
ANSWERING
  ↓
QUESTION_ENDED
  ↓
RESULTS
  ↓
LEADERBOARD
  ↓
NEXT QUESTION
  ↓
...
  ↓
FINISHED
```

The backend controls these states so that all connected clients remain synchronized.

## Real-Time Communication

QuizLive will use WebSockets for real-time communication.

For example, when the host starts a question:

```text
Host
  │
  │ START_QUESTION
  ▼
Java Server
  │
  ├──────────────► Screen
  │
  ├──────────────► Player 1
  │
  ├──────────────► Player 2
  │
  └──────────────► Player 3
```

Potential WebSocket events include:

```text
GAME_CREATED
PLAYER_JOINED
GAME_STARTED
QUESTION_STARTED
ANSWER_SUBMITTED
QUESTION_ENDED
LEADERBOARD_UPDATED
GAME_FINISHED
```

## Development Roadmap

The project will be developed in phases.

### Phase 0 — Development Environment

Set up:

* Java/JDK
* Maven
* Node.js
* npm
* VS Code
* Git
* Spring Boot

### Phase 1 — React Quiz

Build a basic quiz without a backend.

Learn:

* Components
* Props
* State
* Events
* Conditional rendering
* Lists
* `useState`
* `useEffect`

### Phase 2 — Java Spring Boot Backend

Create the basic game backend.

Initial domain objects:

```text
Game
Player
Question
Answer
```

Create basic REST endpoints.

### Phase 3 — Connect React and Java

Connect the frontend to the backend using HTTP.

Players should be able to enter a game code and join a game.

### Phase 4 — Host, Player and Screen

Create separate interfaces for:

* Host
* Player
* Large screen

### Phase 5 — WebSockets

Introduce real-time communication between the clients and backend.

### Phase 6 — Game Flow

Implement the complete quiz lifecycle:

```text
Lobby
→ Question
→ Answers
→ Results
→ Leaderboard
→ Next Question
```

### Phase 7 — Timer

Add server-controlled question timers.

### Phase 8 — Scoring

Implement:

* Correct answers
* Speed-based scoring
* Leaderboards

### Phase 9 — Quiz Editor

Allow hosts to create and edit quizzes.

### Phase 10 — Database

Introduce PostgreSQL and persist:

* Quizzes
* Questions
* Answers
* Games
* Players
* Scores

### Phase 11 — Authentication

Add accounts for quiz hosts.

Players will continue to join games without requiring an account.

### Phase 12 — UI/UX

Improve the experience with:

* Responsive design
* Animations
* Large-screen layouts
* Mobile-first player controls
* Better timers
* Leaderboard animations

### Phase 13 — Additional Features

Potential additions:

* Image questions
* Music questions
* True/False questions
* Teams
* QR-code joining
* Random questions
* Random answer order
* Categories
* Difficulty levels
* Bonus questions
* Avatars
* Power-ups

### Phase 14 — Testing

Add testing for:

* Backend logic
* REST endpoints
* WebSocket communication
* Game state transitions
* Scoring
* Multiple simultaneous players

### Phase 15 — Security & Error Handling

Handle situations such as:

* Invalid game codes
* Duplicate player names
* Players disconnecting
* Host disconnecting
* Late answers
* Multiple answers
* Invalid requests
* WebSocket disconnects

### Phase 16 — Deployment

Eventually deploy the application so it can be used outside of the local development environment.

This will include:

* Frontend hosting
* Backend hosting
* Database hosting
* Environment variables
* HTTPS
* Production WebSockets
* CORS configuration

## Learning Goals

This project is primarily a learning project.

The main goals are to gain practical experience with:

* React
* Ionic
* Java
* Spring Boot
* REST APIs
* WebSockets
* Object-oriented programming
* State management
* Client-server architecture
* Databases
* SQL
* JPA
* Git
* Testing
* Authentication
* Deployment

The project will be developed incrementally rather than generating the entire application at once.

## Current Status

🚧 **In development**

The project is currently in the initial setup phase.

The first goal is to create a simple React + Ionic quiz before introducing the Java backend and real-time functionality.

## Future Vision

The final goal is to have a QuizLive instance running on a computer or server where an entire group can join using their phones.

The host controls the game, the large screen displays the quiz, and every player's phone acts as their personal controller.

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

The project will start as a simple quiz and gradually evolve into a complete real-time multiplayer platform.
