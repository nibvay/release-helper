#!/usr/bin/env npx ts-node --esm
import figlet from "figlet";
import run from "./run";

console.log(figlet.textSync("release-helper"));

run(process.argv);