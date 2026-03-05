const { ethers } = require("ethers");
const { Pool } = require("pg");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Setup Express
const app = express();
app.use(cors());
app.use(express.json());

// Ethers setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;

const contractABI = [
    "event EpochStarted(uint256 indexed epochId, uint256 startTimestamp, int256 bettingPrice)",
    "event TicketsBought(uint256 indexed epochId, address indexed user, uint256 amount, bool isHigh)",
    "event EpochResolved(uint256 indexed epochId, int256 finalPrice, bool highWon)",
    "event PointsAwarded(address indexed user, uint256 points)"
];

const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function initDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS epochs (
      epoch_id INT PRIMARY KEY,
      start_timestamp INT,
      betting_price VARCHAR(50),
      final_price VARCHAR(50),
      high_won BOOLEAN,
      resolved BOOLEAN DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS bets (
      id SERIAL PRIMARY KEY,
      epoch_id INT,
      user_address VARCHAR(42),
      amount VARCHAR(50),
      is_high BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS points (
      user_address VARCHAR(42) PRIMARY KEY,
      total_points VARCHAR(50) DEFAULT '0'
    );
  `);
    console.log("Database initialized");
}

async function startIndexer() {
    await initDB();

    console.log("Starting indexer for ArbiPredict...");

    contract.on("EpochStarted", async (epochId, startTimestamp, bettingPrice) => {
        console.log(`EpochStarted: ${epochId}`);
        try {
            await pool.query(
                "INSERT INTO epochs (epoch_id, start_timestamp, betting_price) VALUES ($1, $2, $3) ON CONFLICT (epoch_id) DO NOTHING",
                [Number(epochId), Number(startTimestamp), bettingPrice.toString()]
            );
        } catch (e) { console.error(e); }
    });

    contract.on("TicketsBought", async (epochId, user, amount, isHigh) => {
        console.log(`TicketsBought: epoch ${epochId}, user ${user}, amount ${amount}`);
        try {
            await pool.query(
                "INSERT INTO bets (epoch_id, user_address, amount, is_high) VALUES ($1, $2, $3, $4)",
                [Number(epochId), user, amount.toString(), isHigh]
            );
        } catch (e) { console.error(e); }
    });

    contract.on("EpochResolved", async (epochId, finalPrice, highWon) => {
        console.log(`EpochResolved: ${epochId}`);
        try {
            await pool.query(
                "UPDATE epochs SET final_price = $1, high_won = $2, resolved = true WHERE epoch_id = $3",
                [finalPrice.toString(), highWon, Number(epochId)]
            );
        } catch (e) { console.error(e); }
    });

    contract.on("PointsAwarded", async (user, awardedPoints) => {
        console.log(`PointsAwarded: ${user} received ${awardedPoints}`);
        try {
            // Upsert points as bigint strings
            await pool.query(`
        INSERT INTO points (user_address, total_points) 
        VALUES ($1, $2)
        ON CONFLICT (user_address) DO UPDATE 
        SET total_points = (CAST(points.total_points AS DECIMAL) + CAST($2 AS DECIMAL))::TEXT
      `, [user, awardedPoints.toString()]);
        } catch (e) { console.error(e); }
    });
}

// API Routes
app.get("/api/leaderboard", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT user_address, total_points FROM points ORDER BY CAST(total_points AS DECIMAL) DESC LIMIT 50");
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/api/history", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM epochs ORDER BY epoch_id DESC LIMIT 10");
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  startIndexer().catch(console.error);
});
