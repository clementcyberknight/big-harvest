# Big Harvest 🌾🚜

**Big Harvest** is an addictive, high-frequency MMO farming simulator built for mobile platforms using Expo and React Native. The game emphasizes real-time micro-economies, strict time-management mechanics (FOMO), and dynamic player interactions.

## Key Features

- **High-Frequency Performance:** Driven by heavily optimized WebSockets and Protobuf for blazing-fast payload transmission, minimal battery drain, and instant UI updates.
- **FOMO Mechanics:** Crops wither if ignored. Animals get sad, then sick. A fleeting Black Market Trader forces players to log in regularly.
- **Social & Economic Warfare:** Join Syndicates (Cartels) to manipulate market commodities, send gifts via P2P transfers, or coordinate protests against mega-rich farmers to trigger punishing tax decrees.
- **Global Server Systems:** Watch the dynamic live leaderboard, contribute to massive global server bounties, and experience a progressive wealth tax that balances the economy.
- **Offline Capabilities:** Local-first architecture allows you to manage crops and animals on the go, synchronizing seamlessly with the server when reconnected.

## Game Architecture

Big Harvest employs a **Local-First, Server-Authoritative** architecture to achieve offline playability inside a strict MMO environment.

### 1. The Local-First Frontend

- **Framework:** React Native (Expo)
- **Local Database:** WatermelonDB. The UI only ever reads from and writes to the local database, allowing rapid optimistic updates.
- **Action Queue:** If the player is offline, single-player farming actions (harvesting, feeding) are recorded into a persistent local queue.

### 2. High-Frequency Networking

- **WebSockets:** A persistent bidirectional connection streams live leaderboard updates, market crashes (`DUMP_DETECTED`), and chats.
- **Protobuf (Protocol Buffers):** Binary serialization shrinks data payloads, which is critical for sending tracking info, player activity, and 10-second leaderboard broadcasts over mobile networks.

### 3. Server Resolution & Reconnection

- When the player comes back online, the queued actions are transmitted over WebSockets.
- **Server Truth:** The server's clock is the absolute source of truth. If a player claims they harvested offline, but the server determines the crop withered before the action was made (or the player manipulated their local time), the server rejects the harvest and sends a reconciliation event (`withered: true`). The client's local DB then rolls back and shows the withered sprites.

## 🛠 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the application:
   ```bash
   npx expo start
   ```
