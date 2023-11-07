#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

// Parse the command line arguments
const args = minimist(process.argv.slice(2));

// Help flag
if (args.h) {
  console.log(`Usage: galosh.js [options]
Options:
  -h            Show this help message and exit.
  -n, -s        Latitude: N positive; S negative.
  -e, -w        Longitude: E positive; W negative.
  -z            Time zone: uses tz.guess() from moment-timezone by default.
  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
  -j            Echo pretty JSON from open-meteo API and exit.`);
  process.exit(0);
}

// If -j is present, we skip latitude and longitude checks
if (args.j) {
  const timezone = moment.tz.guess();
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&timezone=" +
    timezone;

  // Fetch the weather data
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  process.exit(0);
}

// Time zone
const timezone = args.z ? args.z : moment.tz.guess();

// Latitude
let latitude;
if (args.n) {
  latitude = args.n;
} else if (args.s) {
  latitude = -args.s;
} else {
  console.error("Error: Please enter a valid latitude using -n or -s.");
  process.exit(1);
}

// Longitude
let longitude;
if (args.e) {
  longitude = args.e;
} else if (args.w) {
  longitude = -args.w;
} else {
  console.error("Error: Please enter a valid longitude using -e or -w.");
  process.exit(1);
}

// Build the API URL
const url =
  "https://api.open-meteo.com/v1/forecast?latitude=" +
  latitude +
  "&longitude=" +
  longitude +
  "&timezone=" +
  timezone +
  "&daily=precipitation_hours&current_weather=true";

// Fetch the weather data
const response = await fetch(url);
const data = await response.json();
console.log(data);
