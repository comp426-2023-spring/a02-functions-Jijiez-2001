#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

//help message
if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`);
  process.exit(0);
}

//timezone
let timezone = moment.tz.guess();
if (args.z) {
  timezone = args.z;
}

//latitude&longitude
let latitude = args.n || -args.s;
let longitude = args.e || -args.w;

//get the data
const url =
  "https://api.open-meteo.com/v1/forecast?latitude=" +
  latitude +
  "&longitude=" +
  longitude +
  "&timezone=" +
  timezone +
  "&daily=precipitation_hours&current_weather=true";
const response = await fetch(url);
const data = await response.json();

//JSON
if (args.j) {
  console.log(data);
  process.exit(0);
}

//days
const days = args.d;
if (days == 0) {
  console.log("today.");
} else if (days > 1) {
  console.log("in " + days + " days.");
} else {
  console.log("tomorrow.");
}
