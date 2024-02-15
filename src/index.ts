#! /usr/bin/env node
import figlet from "figlet";
import run from "./run";

console.log(figlet.textSync("release-helper"));

run(process.argv);