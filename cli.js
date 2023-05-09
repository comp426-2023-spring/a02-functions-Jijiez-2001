#!/usr/bin/env node
import moment from "moment-timezone"
import minimist from "minimist"
import fetch from "node-fetch"


const help_message = "Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE" + "\n" +
"-h            Show this help message and exit." + "\n" + 
"-n, -s        Latitude: N positive; S negative." + "\n" +
"-e, -w        Longitude: E positive; W negative." + "\n" +
"-z            Time zone: uses tz.guess() from moment-timezone by default." + "\n" +
"-d 0-6        Day to retrieve weather: 0 is today; defaults to 1." + "\n" +
"-j            Echo pretty JSON from open-meteo API and exit." 

const args = minimist(process.argv.slice(2));
var latitude = 99999;
var longitude = 99999;

if (args.n > 0) {
  latitude= args.n;
}
if (args.s) {
  latitude = (-1) * args.s;
}
if (args.e > 0) {
  longitude = args.e;
}
if (args.w) {
  longitude = (-1) * args.w;
}


const timezone = args.z || moment.tz.guess();
const days = args.d

if (args.h) {
  console.log(help_message);
  process.exit(0);
}


// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude+ '&daily=precipitation_hours&timezone=' + timezone);
// Get the data from the request
const data = await response.json();


if (args.j) {
  console.log(data);
  process.exit(0);
}

if (longitude > 90 || latitude > 90) {
  process.exit(1)
}

let galosh = ""

if (data.daily.precipitation_hours != null) {
  if (data.daily.precipitation_hours[days] > 0) {
    galosh = "You might need your galoshes "
  } else {
    galosh = "You will not need your galoshes "
  }
}

if (days == 0) {
    console.log(galosh + "today.")
  } else if (days > 1) {
    console.log(galosh + "in " + days + " days.")
  } else {
    console.log(galosh + "tomorrow.")
  } 
