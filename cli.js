#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

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

//timezone: first default, is args.z has value then change
let timezone;
if (args.z) {
  timezone = args.z;
} else {
  timezone = moment.tz.guess();
}

let latitude, longitude;

if (args.n && args.s) {
  console.log("please enter only one latitude");
  process.exit(0);
} else if (args.n) {
  latitude = args.n;
} else if (args.s) {
  latitude = -args.s;
} else {
  console.log("please enter latitude in range to make it valid");
  process.exit(0);
}

if (args.e && args.w) {
  console.log("please enter only one longitude");
  process.exit(0);
} else if (args.e) {
  longitude = args.e;
} else if (args.w) {
  longitude = -args.w;
} else {
  console.log("please enter longitude in range to make it valid");
  process.exit(0);
}

const url =
  "https://api.open-meteo.com/v1/forecast?latitude=" +
  latitude +
  "&longitude=" +
  longitude +
  "&timezone=" +
  timezone +
  "&daily=precipitation_hours";

const response = await fetch(url);
const data = await response.json();
const days = args.d;

if (args.j) {
  console.log(data);
  process.exit(0);
}

if (days == 0) {
  console.log("today.");
} else if (days > 1) {
  console.log("in " + days + " days.");
} else {
  console.log("tomorrow.");
}

process.exit(0);
