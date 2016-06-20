(function () {
    "use strict";

    angular
       .module('app').filter("formatProcessingNote", function () {

           return function (input) {

               if (!input) return input;

               var notesArray = [];

               _(input.split(",")).forEach(function (i) {
                
                   var temp = _(i.split(":"));
                   var rule = temp.first();
                   var id = temp.last();

                   rule =  rule.replace("LINE_PRICE_BY_", "LINE_");
                   rule =  rule.replace("PROC_PRICE_BY", "PROC_");
                   rule =  rule.replace("POST_PRICE_CALC", "POST_");
                   rule =  rule.replace("PRE_PRICE_CALC", "PRE_");
                   
                   notesArray.push({ "rule": rule, "cmId": id });

               }).value();


               var respStr = "";

               _(notesArray).forEach(function (note) {

                   respStr += note.rule + " [" + note.cmId + "]" ;
               }).value();

               return respStr;
           }

       });



})();