"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlebars = require("handlebars");
var template = "Hallo {{person.name}}";
var compiled = handlebars.compile(template);
var person = { name: "hans" };
console.log(compiled(person));
