# US Stocks & ETFs

This is a GRIT Coding Challenge ReactSPA project that allows users to track symbol pricing in real-time for US Stocks & ETFs.

## Features

- Search Stocks and ETFs by symbol.
- Add/Edit/Remove Stocks and ETFs.
- 30 maximum symbols added.
- Real-time pricing update via [Alpaca Web Socket Stream](https://docs.alpaca.markets/docs/streaming-market-data).

## Setup

**1. Clone the repository**

```
git clone https://github.com/ChawankornT/us-stock-etf.git
cd us-stock-etf
```

**2. Install dependencies**

```
npm install
```

**3. Setup environment**

Copy the example environment file:

```
cp .env.local.example .env.local
```

Update `.env.local` with your Alpaca API credentials.

**4. Run the application**

Run application:

```
npm run dev
```

Or run test:

```
npm run test
```
