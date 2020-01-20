const router = require("express").Router();
const bodyParser = require("body-parser");
const constants = require("../config/constants");
const { isPermitted } = require("../services/auth-service");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const jsonParser = bodyParser.json();

// For Google Suites API
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

router.post(
  "/",
  jsonParser,
  [
    body("key")
      .exists()
      .isString()
  ],
  async (req, res) => {
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.eventEngagement,
      constants.actions.updateSelf
    );
    //Check for input errors
    const errors = validationResult(req);
    if (!permitted) {
      res.sendStatus(401);
    } else if (!errors.isEmpty() || req.body.key != "rennidkcabemoclew") {
      res.status(422).json({ errors: errors.array() });
    } else {
      // Load client secrets from a local file.
      fs.readFile("../credentials.json", (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        const request = {
          find: req.user.email,
          replacement: "1",
          range: "Sheet1!B2:B395"
        };
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), markAttendance, request);
      });
    }
  }
);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, request) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, request);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1W424ySKEEAziS0Zoy4q_RL55uUq4dw_HFm7j1lAPiuU/edit#gid=0
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function markAttendance(auth, req) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1W424ySKEEAziS0Zoy4q_RL55uUq4dw_HFm7j1lAPiuU";

  const request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: req
    },
    auth: auth
  };

  sheets.spreadsheets.batchUpdate(request, (err, res) => {
    if (err) return console.log("The API returned an error: " + err);
    if (res.valuesChanged === 1) {
      res.sendStatus("200");
    } else {
      console.log("No data found.");
    }
  });
}

module.exports = router;
