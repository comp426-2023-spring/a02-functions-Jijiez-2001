#!/usr/bin / env node
/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2023-05-10 14:29:24
 * @LastEditors: ZJJ
 * @LastEditTime: 2023-05-10 18:36:40
 */

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

let timezone = moment.tz.guess();
if (args.z) {
  timezone = args.z;
}

let latitude, longitude;

if (args.n && args.s) {
  console.log("Only one latitude");
  process.exit(0);
}
else if (args.n) {
  latitude = args.n;
}
else if (args.s) {
  latitude = -args.s;
}
else {
  console.log("Latitude must be in range");
  process.exit(0);
}

if (args.e && args.w) {
  console.log("Only one longitude value");
  process.exit(0);
}
else if (args.e) {
  longitude = args.e;
}
else if (args.w) {
  longitude = -args.w;
}
else {
  console.log("Longitude must be in range");
  process.exit(0);
}

const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=precipitation_hours`;
fetch(url)
  .then(response => response.json())
  .then(data => {
    const days = args.d || 1;
    let string;

    if (data.daily.precipitation_hours[days] == 0) {
      string = "You will not need your galoshes ";
    } else {
      string = "You might need your galoshes ";
    }

    if (days == 0) {
      string += "today.";
    } else if (days > 1) {
      string += `in ${days} days.`;
    } else {
      string += "tomorrow.";
    }

    if (args.j) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(string);
    }
  })
  .catch(error => console.error(error));









