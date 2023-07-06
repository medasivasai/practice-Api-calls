// Import required packages and modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express application
const app = express();
app.use(express.json());

// Create a connection to the database
const db = new sqlite3.Database('cricketTeam.db');

// API 1: Get all players
app.get('/players', (req, res) => {
  db.all('SELECT * FROM cricket_team', (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const players = rows.map(row => ({
        playerId: row.player_id,
        playerName: row.player_name,
        jerseyNumber: row.jersey_number,
        role: row.role
      }));
      res.json(players);
    }
  });
});

// API 2: Create a new player
app.post('/players', (req, res) => {
  const { playerName, jerseyNumber, role } = req.body;
  db.run('INSERT INTO cricket_team (player_name, jersey_number, role) VALUES (?, ?, ?)', [playerName, jerseyNumber, role], function(err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send('Player Added to Team');
    }
  });
});

// API 3: Get player by ID
app.get('/players/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  db.get('SELECT * FROM cricket_team WHERE player_id = ?', [playerId], (err, row) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (row) {
      const player = {
        playerId: row.player_id,
        playerName: row.player_name,
        jerseyNumber: row.jersey_number,
        role: row.role
      };
      res.json(player);
    } else {
      res.sendStatus(404);
    }
  });
});

// API 4: Update player details
app.put('/players/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const { playerName, jerseyNumber, role } = req.body;
  db.run('UPDATE cricket_team SET player_name = ?, jersey_number = ?, role = ? WHERE player_id = ?', [playerName, jerseyNumber, role, playerId], function(err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (this.changes > 0) {
      res.send('Player Details Updated');
    } else {
      res.sendStatus(404);
    }
  });
});

// API 5: Delete a player
app.delete('/players/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  db.run('DELETE FROM cricket_team WHERE player_id = ?', [playerId], function(err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (this.changes > 0) {
      res.send('Player Removed');
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = app;
