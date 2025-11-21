# US Stocks & ETFs

This is a GRIT Coding Challenge ReactSPA project that allows users to track symbol pricing in real-time for US Stocks & ETFs.

## Features

- Search Stocks and ETFs by symbol.
- Add/Edit/Remove Stocks and ETFs.
- 30 maximum symbols added.
- Real-time pricing update via [Alpaca Web Socket Stream](https://docs.alpaca.markets/docs/streaming-market-data).

## Setup

_1. Clone the repository_

```
git clone https://github.com/ChawankornT/us-stock-etf.git
cd us-stock-etf
```

_2. Install dependencies_

```
npm install
```

_3. Setup environment_

Copy the example environment file:

```
cp .env.local.example .env.local
```

Update `.env.local` with your Alpaca API credentials.

_4. Run the application_

```
npm run dev
```
