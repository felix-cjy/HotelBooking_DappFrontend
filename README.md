# Hotel Booking DApp Frontend

A decentralized hotel booking application built with Next.js, TypeScript, and Ethereum.

## Features

- Connect wallet functionality
- View available rooms
- Book rooms using ETH
- Add reviews for rooms
- Manage room availability (admin only)
- Add new rooms (admin only)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- ethers.js
- Web3Modal

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/hotel-booking-frontend.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file and add your environment variables

```
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ENABLE_TESTNETS=true
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```
Hotel_Booking_Frontend
├─ .gitignore
├─ components.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ postcss.config.mjs
├─ public
│  ├─ 2071.jpg
│  ├─ 2149.jpg
│  ├─ 7715.jpg
│  ├─ Morph_mascot.PNG
│  ├─ next.svg
│  ├─ pex.png
│  └─ vercel.svg
├─ README.md
├─ Screenshot01.PNG
├─ Screenshot02.PNG
├─ src
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ HomePage.tsx
│  │  ├─ layout
│  │  │  ├─ Modetoggle.tsx
│  │  │  └─ Nav.tsx
│  │  ├─ modals
│  │  │  ├─ AddReviewModal.tsx
│  │  │  ├─ AddRoomModal.tsx
│  │  │  ├─ BookingModal.tsx
│  │  │  └─ SetAvailabilityModal.tsx
│  │  ├─ room
│  │  │  ├─ RoomCard.tsx
│  │  │  └─ RoomList.tsx
│  │  └─ ui
│  │     ├─ alert-dialog.tsx
│  │     ├─ button.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ select.tsx
│  │     ├─ sonner.tsx
│  │     ├─ star-rating.tsx
│  │     ├─ textarea.tsx
│  │     └─ transaction-waiting.tsx
│  ├─ config
│  │  ├─ site.ts
│  │  └─ web3.ts
│  ├─ constants
│  │  ├─ abis
│  │  │  ├─ bookingAbi.ts
│  │  │  └─ tokenAbi.ts
│  │  ├─ addresses.ts
│  │  └─ index.ts
│  ├─ hooks
│  │  ├─ use-mounted.ts
│  │  └─ web3
│  │     ├─ use-chain-check.ts
│  │     ├─ use-connect.ts
│  │     ├─ use-contract.ts
│  │     └─ use-network.ts
│  ├─ lib
│  │  └─ utils.ts
│  ├─ providers
│  │  ├─ index.tsx
│  │  ├─ theme-provider.tsx
│  │  └─ web3-provider.tsx
│  ├─ styles
│  │  └─ globals.css
│  ├─ types
│  │  ├─ contract.ts
│  │  ├─ room.ts
│  │  └─ web3.ts
│  └─ utils
│     └─ transaction.ts
├─ tailwind.config.ts
└─ tsconfig.json

```
