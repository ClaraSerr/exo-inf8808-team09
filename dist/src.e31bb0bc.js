// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMapG = generateMapG;
exports.generateMarkerG = generateMarkerG;
exports.setCanvasSize = setCanvasSize;
exports.getClosestStep = getClosestStep;
exports.getSteps = getSteps;
exports.getQuantiles = getQuantiles;
exports.getWeekNumber = getWeekNumber;

/**
 * Generates the SVG element g which will contain the map base.
 *
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 * @returns {*} The d3 Selection for the created g element
 */
function generateMapG(width, height) {
  return d3.select('.graph').select('svg').append('g').attr('id', 'map-g').attr('width', width).attr('height', height);
}
/**
 * Generates the SVG element g which will contain the map markers.
 *
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 * @returns {*} The d3 Selection for the created g element
 */


function generateMarkerG(width, height) {
  return d3.select('.graph').select('svg').append('g').attr('id', 'marker-g').attr('width', width).attr('height', height);
}
/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */


function setCanvasSize(width, height) {
  d3.select('#map').select('svg').attr('width', width).attr('height', height);
}
/**
 * @param {number} nSteps The ideal number of steps
 * @param {*} domain Domain of d3 scale
 * @returns {number} The best step to use
 */


function getClosestStep(nSteps, domain) {
  var BEST_STEPS = [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];
  var step = (domain[1] - domain[0]) / nSteps;
  var stepDiff = [];
  var bestStep = BEST_STEPS[BEST_STEPS.length - 1];

  for (var i = 0; i < BEST_STEPS.length; i++) {
    stepDiff.push(Math.abs(BEST_STEPS[i] - step));

    if (i > 0 && stepDiff[i] > stepDiff[i - 1]) {
      bestStep = BEST_STEPS[i - 1];
      break;
    }
  }

  return bestStep;
}
/**
 * @param {number} nSteps The ideal number of steps
 * @param {*} domain Domain of d3 scale
 * @returns {Array<number>} The best steps
 */


function getSteps(nSteps, domain) {
  var step = getClosestStep(nSteps, domain);
  var steps = [];

  if (domain[0] <= 0 && domain[1] >= 0) {
    steps.push(0);
  } else {
    var firstStep = Math.floor(domain[0]);

    while (firstStep % step !== 0) {
      firstStep += 1;
    }

    steps.push(firstStep);
  }

  while (steps[steps.length - 1] < domain[1] - step) {
    steps.push(steps[steps.length - 1] + step);
  }

  while (steps[0] > domain[0] + step) {
    steps.unshift(steps[0] - step);
  }

  return steps;
}
/**
 * @param {Array<number>} array Array of numeric values
 * @returns {Array<number>} The quantiles
 */


function getQuantiles(array) {
  array = array.sort(d3.ascending);
  var quantiles = [array[0], d3.quantile(array, 0.25), d3.median(array), d3.quantile(array, 0.75), array[array.length - 1]];
  return quantiles;
}
/**
 * @param {Date} d date
 * @returns {number} weekNo
 */


function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7

  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // Get first day of year

  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); // Calculate full weeks to nearest Thursday

  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7); // Return array of year and week number

  return [d.getUTCFullYear(), weekNo];
}
},{}],"scripts/preprocess.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDayType = addDayType;
exports.aggregateData = aggregateData;
exports.aggregateDataForViz3 = aggregateDataForViz3;

// INF8808 - Exo
//
// Adam Prévost - 1947205
// Armelle Jézéquel - 2098157
// Clara Serruau - 2164678
// Jules Lefebvre - 1847158
// Julien Dupuis - 1960997
//

/**
 * Ajout de champs à l'objet
 * jour_semaine {0, 1, 2, 3, 4, 5, 6} où 0 = Dimanche
 * type_jour {semaine, fin de semaine}
 * ferie {true, false}
 *
 * @param {object[]} data L'array d'objets qui contient les lignes du csv
 */
function addDayType(data) {
  for (var i = 0; i < data.length; i++) {
    // jour_semaine
    data[i].jour_semaine = data[i].date.getDay(); // type_jour

    data[i].jour_semaine === (0 || 6) ? data[i].type_jour = 'fin de semaine' : data[i].type_jour = 'semaine'; // ferie

    isNaN(data[i].voyage) ? data[i].ferie = true : data[i].ferie = false;
  }
}
/**
 * aggregateData() remplit l'objet vizData à partir des données du csv (data)
 *
 * @param {*} csvData L'array d'objets qui contient les lignes du csv, modifié par preprocess.addDayType()
 * @param {*} vizData L'array d'objets qui contient les données consolidées requises pour générer les viz
 * @param {*} startDate Date de début
 * @param {*} endDate Date de fin
 * @param {*} typeJour On considère semaine ou weekend
 * @param {*} ferie On considère les fériés si true
 */


function aggregateData(csvData, vizData, startDate, endDate, typeJour, ferie) {
  // Boucle sur les lignes de csvData pour remplir la structure vizData
  for (var i = 0; i < csvData.length; i++) {
    if (csvData[i].date >= startDate && csvData[i].date <= endDate && csvData[i].type_jour === typeJour && csvData[i].ferie === ferie) {
      if (vizData.length === 0) {
        vizData.push({
          ligne: csvData[i].ligne,
          girouettes: []
        });
      } // On ajoute la ligne si elle n'existe pas déjà dans vizData


      var posLigne = vizData.findIndex(function (e) {
        return e.ligne === csvData[i].ligne;
      });

      if (posLigne === -1) {
        vizData.push({
          ligne: csvData[i].ligne,
          girouettes: []
        });
        posLigne = vizData.length - 1;
      } // On ajoute la girouette si elle n'existe pas déjà dans vizData


      var posGirouette = vizData[posLigne].girouettes.findIndex(function (e) {
        return e.girouette === csvData[i].Girouette;
      });

      if (posGirouette === -1) {
        vizData[posLigne].girouettes.push({
          girouette: csvData[i].Girouette,
          voyages: []
        });
        posGirouette = vizData[posLigne].girouettes.length - 1;
      } // On ajoute le voyage s'il n'existe pas déjà dans vizData


      var posVoyage = vizData[posLigne].girouettes[posGirouette].voyages.findIndex(function (e) {
        return e.voyage === csvData[i].voyage;
      });

      if (posVoyage === -1) {
        vizData[posLigne].girouettes[posGirouette].voyages.push({
          voyage: csvData[i].voyage,
          arrets: []
        });
        posVoyage = vizData[posLigne].girouettes[posGirouette].voyages.length - 1;
      } // On ajoute l'arrêt s'il n'existe pas déjà dans vizData


      var posArret = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.findIndex(function (e) {
        return e.codeArret === csvData[i].arret_code;
      });

      if (posArret === -1) {
        vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.push({
          codeArret: csvData[i].arret_code,
          nomArret: csvData[i].arret_nom,
          sequenceArret: csvData[i].sequence_arret,
          minutesEcart: new Map(),
          moyMinutesEcart: null,
          nClients: new Map(),
          moyNClients: null,
          ponctualite: new Map(),
          tauxPonctualite: null,
          minutesEcartClient: new Map(),
          moyMinutesEcartClient: null
        });
        posArret = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length - 1;
      }

      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcart.set(csvData[i].date, csvData[i].Minutes_ecart_planifie);
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].nClients.set(csvData[i].date, csvData[i].montants);
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].ponctualite.set(csvData[i].date, csvData[i].Etat_Ponctualite);
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcartClient.set(csvData[i].date, csvData[i].Minutes_ecart_planifie * csvData[i].montants);
    }
  } // Parcours de vizData pour calculer les indicateurs pour chaque ligne.arret


  vizData.forEach(function (ligne) {
    ligne.girouettes.forEach(function (girouette) {
      girouette.voyages.forEach(function (voyage) {
        voyage.arrets.forEach(function (arret) {
          var sumMinutesEcart = 0;
          arret.minutesEcart.forEach(function (v) {
            sumMinutesEcart += v;
          });
          arret.moyMinutesEcart = sumMinutesEcart / arret.minutesEcart.size;
          var sumNClients = 0;
          arret.nClients.forEach(function (v) {
            sumNClients += v;
          });
          arret.moyNClients = sumNClients / arret.nClients.size;
          var sumMinutesEcartClient = 0;
          arret.minutesEcartClient.forEach(function (v) {
            sumMinutesEcartClient += v;
          });
          arret.moyMinutesEcartClient = sumMinutesEcartClient / arret.minutesEcartClient.size;
          var countPonctuel = 0;
          arret.ponctualite.forEach(function (v) {
            if (v === 'Ponctuel') {
              countPonctuel++;
            }
          });
          arret.tauxPonctualite = countPonctuel / arret.ponctualite.size;
        });
      });
    });
  });
}
/**
 * aggregateDataForViz3() remplit l'objet vizData à partir des données du csv (data)
 *
 * @param {*} csvData L'array d'objets qui contient les lignes du csv, modifié par preprocess.addDayType()
 * @param {*} vizData L'array d'objets qui contient les données consolidées requises pour générer les viz
 * @param {*} startDate Date de début
 * @param {*} endDate Date de fin
 * @param {*} typeJour On considère semaine ou weekend
 * @param {*} ferie On considère les fériés si true
 */


function aggregateDataForViz3(csvData, vizData, startDate, endDate, typeJour, ferie) {
  // Boucle sur les lignes de csvData pour remplir la structure vizData
  for (var i = 0; i < csvData.length; i++) {
    if (csvData[i].date >= startDate && csvData[i].date <= endDate && csvData[i].type_jour === typeJour && csvData[i].ferie === ferie) {
      if (vizData.length === 0) {
        vizData.push({
          date: csvData[i].date,
          lignes: []
        });
      } // On ajoute la date si elle n'existe pas déjà dans vizData


      var posDate = vizData.findIndex(function (e) {
        return e.date.valueOf() === csvData[i].date.valueOf();
      });

      if (posDate === -1) {
        vizData.push({
          date: csvData[i].date,
          lignes: []
        });
        posDate = vizData.length - 1;
      } // On ajoute la ligne si elle n'existe pas déjà dans vizData


      var posLigne = vizData[posDate].lignes.findIndex(function (e) {
        return e.ligne === csvData[i].ligne;
      });

      if (posLigne === -1) {
        vizData[posDate].lignes.push({
          ligne: csvData[i].ligne,
          girouettes: []
        });
        posLigne = vizData[posDate].lignes.length - 1;
      } // On ajoute la girouette si elle n'existe pas déjà dans vizData


      var posGirouette = vizData[posDate].lignes[posLigne].girouettes.findIndex(function (e) {
        return e.girouette === csvData[i].Girouette;
      });

      if (posGirouette === -1) {
        vizData[posDate].lignes[posLigne].girouettes.push({
          girouette: csvData[i].Girouette,
          voyages: []
        });
        posGirouette = vizData[posDate].lignes[posLigne].girouettes.length - 1;
      } // On ajoute le voyage s'il n'existe pas déjà dans vizData


      var posVoyage = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages.findIndex(function (e) {
        return e.voyage === csvData[i].voyage;
      });

      if (posVoyage === -1) {
        vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages.push({
          voyage: csvData[i].voyage,
          arrets: []
        });
        posVoyage = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages.length - 1;
      } // On ajoute l'arrêt s'il n'existe pas déjà dans vizData


      var posArret = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.findIndex(function (e) {
        return e.codeArret === csvData[i].arret_code;
      });

      if (posArret === -1) {
        vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.push({
          codeArret: csvData[i].arret_code,
          nomArret: csvData[i].arret_nom,
          sequenceArret: csvData[i].sequence_arret,
          minutesEcart: csvData[i].Minutes_ecart_planifie,
          nClients: csvData[i].montants,
          ponctualite: csvData[i].Etat_Ponctualite,
          minutesEcartClient: csvData[i].Minutes_ecart_planifie * csvData[i].montants
        });
        posArret = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length - 1;
      }
    }
  }
}
},{}],"scripts/grouped-quantile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateViz3 = generateViz3;
exports.generateDelayGraph = generateDelayGraph;
exports.generateTrafficGraph = generateTrafficGraph;
exports.setTrafficGraph = setTrafficGraph;
exports.generateGroupedQuantileGraph = generateGroupedQuantileGraph;
exports.getDelayQuantileSets = getDelayQuantileSets;
exports.getTrafficQuantileSets = getTrafficQuantileSets;

var helper = _interopRequireWildcard(require("./helper.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MARGIN = {
  top: 52,
  right: 80,
  bottom: 100,
  left: 80
};
var FONT_SIZE = 14;
var DIRECTIONS_ANGLE = -45;
var QUANTILE_STROKE_COLOR = 'black';
var QUANTILE_FILL_COLOR = 'lightgray';
var QUANTILE_STROKE_WIDTH = 2;
var NUMBER_OF_TICKS = 10;
var GRADIENT_COLORS = ['#ff9999', '#99ff99', '#ffff99'];
var GRADIENT_THRESHOLDS = ['10', '5', '0', '-5'];
var selectValue = '';
/**
 * @param vizData
 */

function generateViz3(vizData) {
  // Split container in two
  var container = d3.select('#grouped-quantile-graph-container');
  var delayGraphContainer = container.append('div').style('width', '50%').style('height', '100%').style('float', 'left');
  var trafficGraphContainer = container.append('div').style('width', '50%').style('height', '100%').style('float', 'right'); // TODO: Fetch data

  var data = {};
  data.lines = ['9', '22'];
  data.directions = ['Lafontaine', 'Montmorency', 'Côté', 'George VI']; // Regenerate graphs on resize

  new ResizeObserver(function () {
    generateDelayGraph(delayGraphContainer, data, vizData);
  }).observe(delayGraphContainer.node());
  new ResizeObserver(function () {
    generateTrafficGraph(trafficGraphContainer, data, vizData);
  }).observe(trafficGraphContainer.node());
}
/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 * @param vizData
 */


function generateDelayGraph(container, data, vizData) {
  // Fetch data
  data.quantileSets = getDelayQuantileSets(vizData); // Generate common graph

  data.title = 'Retard Moyen';

  var _generateGroupedQuant = generateGroupedQuantileGraph(container, data),
      _generateGroupedQuant2 = _slicedToArray(_generateGroupedQuant, 2),
      svg = _generateGroupedQuant2[0],
      dataScale = _generateGroupedQuant2[1];

  var HEIGHT = container.node().getBoundingClientRect().height;
  var WIDTH = Math.min(HEIGHT, container.node().getBoundingClientRect().width); // Set gradients

  svg.append('defs').append('linearGradient').attr('id', 'late-grad').attr('x1', '0%').attr('x2', '0%').attr('y1', '0%').attr('y2', '100%').selectAll('stop').data([GRADIENT_COLORS[0], GRADIENT_COLORS[1]]).enter().append('stop').style('stop-color', function (d) {
    return d;
  }).attr('offset', function (d, i) {
    return 100 * i + '%';
  });
  svg.append('defs').append('linearGradient').attr('id', 'early-grad').attr('x1', '0%').attr('x2', '0%').attr('y1', '0%').attr('y2', '100%').selectAll('stop').data([GRADIENT_COLORS[1], GRADIENT_COLORS[2]]).enter().append('stop').style('stop-color', function (d) {
    return d;
  }).attr('offset', function (d, i) {
    return 100 * i + '%';
  }); // Draw gradients

  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(GRADIENT_THRESHOLDS[0]) - MARGIN.top).attr('y', MARGIN.top).attr('fill', GRADIENT_COLORS[0]);
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(GRADIENT_THRESHOLDS[1]) - dataScale(GRADIENT_THRESHOLDS[0])).attr('y', dataScale(GRADIENT_THRESHOLDS[0])).attr('fill', 'url(#late-grad)');
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(GRADIENT_THRESHOLDS[2]) - dataScale(GRADIENT_THRESHOLDS[1])).attr('y', dataScale(GRADIENT_THRESHOLDS[1])).attr('fill', GRADIENT_COLORS[1]);
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(GRADIENT_THRESHOLDS[3]) - dataScale(GRADIENT_THRESHOLDS[2])).attr('y', dataScale(GRADIENT_THRESHOLDS[2])).attr('fill', 'url(#early-grad)');
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', HEIGHT - MARGIN.bottom - dataScale(GRADIENT_THRESHOLDS[3])).attr('y', dataScale(GRADIENT_THRESHOLDS[3])).attr('fill', GRADIENT_COLORS[2]); // Set y axis label

  svg.select('#y-axis > .label').text('Minute').attr('fill', '#898989'); // Legend

  var legend = svg.insert('g', '#x-axis').style('font-size', '12px');
  var middleY = (HEIGHT - MARGIN.top - MARGIN.bottom) / 2 + MARGIN.top;
  var squareWidth = FONT_SIZE * 2 / 3;
  var paddingX = FONT_SIZE * 2;
  var paddingY = FONT_SIZE * 1.5;
  legend.append('rect').attr('width', squareWidth).attr('x', WIDTH - MARGIN.right + FONT_SIZE).attr('height', squareWidth).attr('y', middleY - paddingY).attr('stroke', QUANTILE_STROKE_COLOR).attr('fill', GRADIENT_COLORS[0]);
  legend.append('text').attr('x', WIDTH - MARGIN.right + paddingX).attr('y', middleY - paddingY + squareWidth).text('Retard');
  legend.append('rect').attr('width', squareWidth).attr('x', WIDTH - MARGIN.right + FONT_SIZE).attr('height', squareWidth).attr('y', middleY).attr('stroke', QUANTILE_STROKE_COLOR).attr('fill', GRADIENT_COLORS[1]);
  legend.append('text').attr('x', WIDTH - MARGIN.right + paddingX).attr('y', middleY + squareWidth).text('Ponctuel');
  legend.append('rect').attr('width', squareWidth).attr('x', WIDTH - MARGIN.right + FONT_SIZE).attr('height', squareWidth).attr('y', middleY + paddingY).attr('stroke', QUANTILE_STROKE_COLOR).attr('fill', GRADIENT_COLORS[2]);
  legend.append('text').attr('x', WIDTH - MARGIN.right + paddingX).attr('y', middleY + paddingY + squareWidth).text('Avance');
}
/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 * @param vizData
 */


function generateTrafficGraph(container, data, vizData) {
  // Fetch data
  var _getTrafficQuantileSe = getTrafficQuantileSets(vizData),
      _getTrafficQuantileSe2 = _slicedToArray(_getTrafficQuantileSe, 3),
      quantileTripSets = _getTrafficQuantileSe2[0],
      quantileDaySets = _getTrafficQuantileSe2[1],
      quantileWeekSets = _getTrafficQuantileSe2[2];

  if (selectValue === '') {
    data.quantileSets = quantileTripSets;
  } else {
    if (selectValue === 'week') {
      data.quantileSets = quantileWeekSets;
    } else if (selectValue === 'day') {
      data.quantileSets = quantileDaySets;
    } else if (selectValue === 'trip') {
      data.quantileSets = quantileTripSets;
    }
  } // Create select


  var weekOption = document.createElement('option');
  weekOption.value = 'week';
  weekOption.innerHTML = 'semaine';
  var dayOption = document.createElement('option');
  dayOption.value = 'day';
  dayOption.innerHTML = 'jour';
  var tripOption = document.createElement('option');
  tripOption.value = 'trip';
  tripOption.innerHTML = 'trajet';
  var select = document.createElement('select');
  select.appendChild(tripOption);
  select.appendChild(dayOption);
  select.appendChild(weekOption);

  if (selectValue !== '') {
    select.value = selectValue;
  }

  select.addEventListener('change', function () {
    if (this.value === 'week') {
      data.quantileSets = quantileWeekSets;
    } else if (this.value === 'day') {
      data.quantileSets = quantileDaySets;
    } else if (this.value === 'trip') {
      data.quantileSets = quantileTripSets;
    }

    selectValue = this.value;
    setTrafficGraph(container, data, select);
  }); // generate traffic graph

  setTrafficGraph(container, data, select);
}
/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 * @param {object} select select
 */


function setTrafficGraph(container, data, select) {
  // Generate common graph
  data.title = 'Achalandage Moyen';

  var _generateGroupedQuant3 = generateGroupedQuantileGraph(container, data),
      _generateGroupedQuant4 = _slicedToArray(_generateGroupedQuant3, 1),
      svg = _generateGroupedQuant4[0]; // Position select


  var top = svg.node().getBoundingClientRect().top + 30;
  var left = svg.node().getBoundingClientRect().left + MARGIN.left - 70;
  select.setAttribute('style', "position: absolute; top: ".concat(top, "px; left: ").concat(left, "px; font-size: 12px"));
  container.node().appendChild(select); // Label

  svg.select('#y-axis > .label').text('');
  svg.select('#y-axis > .label').append('tspan').attr('x', (MARGIN.left - 1).toString()).attr('y', '13').text('Nombre de');
  svg.select('#y-axis > .label').append('tspan').attr('x', (MARGIN.left + 9).toString()).attr('y', '25').text('personnes par');
}
/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to display
 * @returns {Selection} The generated graph as svg
 */


function generateGroupedQuantileGraph(container, data) {
  // ===================== SETUP =====================
  // Delete existing content
  container.html(''); // Set size

  var HEIGHT = container.node().getBoundingClientRect().height;
  var WIDTH = Math.min(HEIGHT, container.node().getBoundingClientRect().width);
  var BAR_WIDTH = (WIDTH - MARGIN.left - MARGIN.right) / 7; // Create svg

  var svg = container.append('svg').attr('width', WIDTH).attr('height', HEIGHT).attr('style', 'display: block; margin: auto'); // ===================== SCALES =====================
  // Create lines scale

  var linesScale = d3.scaleOrdinal().domain(data.lines).range([MARGIN.left + 2 * BAR_WIDTH, MARGIN.left + 5 * BAR_WIDTH]); // Create directions scale

  var directionsRange = [];

  var _iterator = _createForOfIteratorHelper(data.lines),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      directionsRange.push(linesScale(line) - BAR_WIDTH / 2);
      directionsRange.push(linesScale(line) + BAR_WIDTH / 2);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var directionsScale = d3.scaleOrdinal().domain(_toConsumableArray(data.directions)).range(directionsRange); // Create data scale

  var maxValue = Number.MIN_SAFE_INTEGER;
  var minValue = Number.MAX_SAFE_INTEGER;

  var _iterator2 = _createForOfIteratorHelper(data.quantileSets),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var quantiles = _step2.value;

      var _iterator5 = _createForOfIteratorHelper(quantiles),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _quantile = _step5.value;

          if (maxValue < _quantile) {
            maxValue = _quantile;
          }

          if (minValue > _quantile) {
            minValue = _quantile;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var dataScale = d3.scaleLinear().domain([Math.min(minValue, 0), maxValue]).range([HEIGHT - MARGIN.bottom - FONT_SIZE / 2, MARGIN.top + FONT_SIZE / 2]); // ===================== X AXIS =====================

  var xAxis = svg.append('g').attr('id', 'x-axis'); // Draw axis line

  xAxis.append('path').attr('d', d3.line()([[MARGIN.left, HEIGHT - MARGIN.bottom], [MARGIN.left + 7 * BAR_WIDTH, HEIGHT - MARGIN.bottom]])).attr('stroke', 'black'); // Draw line values

  var lineValuesY = HEIGHT - MARGIN.bottom + FONT_SIZE * 1.5;

  var _iterator3 = _createForOfIteratorHelper(data.lines),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _line = _step3.value;
      xAxis.append('text').attr('x', linesScale(_line)).attr('y', lineValuesY).attr('text-anchor', 'middle').text(_line).attr('fill', '#898989').style('font-size', FONT_SIZE);
    } // Draw direction values

  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var directionValuesY = lineValuesY + FONT_SIZE;

  for (var i = 0; i < data.directions.length; i++) {
    var x = directionsScale(data.directions[i]);
    xAxis.append('text').attr('text-anchor', 'end').attr('transform', "translate(".concat(x, ", ").concat(directionValuesY, ") rotate(").concat(DIRECTIONS_ANGLE, ")")).text(data.directions[i]).style('font-size', '12px').attr('font-family', 'sans-serif').attr('class', "direction".concat(i, " label"));
  } // Draw labels


  xAxis.append('text').attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2).attr('y', lineValuesY).text('Ligne').attr('fill', '#898989').style('font-size', FONT_SIZE);
  xAxis.append('text').attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2).attr('y', directionValuesY + FONT_SIZE).text('Direction').attr('fill', '#898989').style('font-size', FONT_SIZE); // ===================== Y AXIS =====================

  var yAxis = svg.append('g').attr('id', 'y-axis'); // Draw axis line

  yAxis.append('path').attr('d', d3.line()([[MARGIN.left, MARGIN.top], [MARGIN.left, HEIGHT - MARGIN.bottom]])).attr('stroke', 'black'); // Generate steps

  var steps = helper.getSteps(NUMBER_OF_TICKS, dataScale.domain());

  var _iterator4 = _createForOfIteratorHelper(steps),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var step = _step4.value;
      var y = dataScale(step); // Draw data values

      yAxis.append('text').attr('text-anchor', 'end').attr('x', MARGIN.left - FONT_SIZE).attr('y', y + FONT_SIZE / 3).text(step).attr('font-family', 'sans-serif').style('font-size', FONT_SIZE); // Draw ticks

      yAxis.append('path').attr('d', d3.line()([[MARGIN.left - FONT_SIZE / 2, y], [MARGIN.left, y]])).attr('stroke', QUANTILE_STROKE_COLOR).attr('stroke-width', QUANTILE_STROKE_WIDTH);
    } // Draw labels

  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  yAxis.append('text').attr('x', MARGIN.left - FONT_SIZE / 2).attr('y', MARGIN.top - FONT_SIZE / 2).attr('class', 'label').attr('text-anchor', 'end').text('Unité de données').attr('fill', '#898989').style('font-size', FONT_SIZE); // ===================== CANDLES =====================

  var bars = svg.append('g').attr('id', 'candles'); // HISTOGRAMME

  /* for (let i = 0; i < data.quantileSets.length; i++) {
    // Features of the histogram
    var histogram = d3.histogram()
      .domain(dataScale.domain())
      .thresholds(dataScale.ticks(50)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d)
    const bins = histogram(data.quantileSets[i])
    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0
    for (const bin of bins) {
      if (bin.length > maxNum) {
        maxNum = bin.length
      }
    }
    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
      .range([0, BAR_WIDTH])
      .domain([-maxNum, maxNum])
    // Add the shape to this svg!
    const areaGenerator = d3.area()
      .x0((d) => xNum(-d.length))
      .x1((d) => xNum(d.length))
      .y((d) => dataScale(d.x0))
      .curve(d3.curveStep)
    bars.append('path')
      .attr('transform', `translate(${directionsScale(data.directions[i]) - BAR_WIDTH / 2})`)
      .style('fill', '#69b3a2')
      .attr('d', areaGenerator(bins))
  } */

  for (var _i2 = 0; _i2 < data.quantileSets.length; _i2++) {
    var _x = directionsScale(data.directions[_i2]);

    var top = dataScale(data.quantileSets[_i2][4]);
    var q3 = dataScale(data.quantileSets[_i2][3]);
    var q2 = dataScale(data.quantileSets[_i2][2]);
    var q1 = dataScale(data.quantileSets[_i2][1]);
    var bottom = dataScale(data.quantileSets[_i2][0]); // Draw domain line

    bars.append('path').attr('d', d3.line()([[_x, top], [_x, bottom]])).attr('stroke', QUANTILE_STROKE_COLOR).attr('stroke-width', QUANTILE_STROKE_WIDTH).attr('class', "direction".concat(_i2)); // Draw Q1 to Q3 bar

    bars.append('rect').attr('width', BAR_WIDTH).attr('x', _x - BAR_WIDTH / 2).attr('height', q1 - q3).attr('y', q3).attr('fill', QUANTILE_FILL_COLOR).attr('stroke', QUANTILE_STROKE_COLOR).attr('stroke-width', QUANTILE_STROKE_WIDTH).attr('class', "direction".concat(_i2)); // Draw Q2 line

    bars.append('path').attr('d', d3.line()([[_x - BAR_WIDTH / 2, q2], [_x + BAR_WIDTH / 2, q2]])).attr('stroke', QUANTILE_STROKE_COLOR).attr('stroke-width', QUANTILE_STROKE_WIDTH).attr('class', "direction".concat(_i2)); // Draw quantile values

    var yValues = [0, 0, 0, 0, 0];
    var minOffset = 11;
    var centerOffset = 4;
    yValues[2] = dataScale(data.quantileSets[_i2][2]) + centerOffset;
    yValues[3] = Math.min(yValues[2] - minOffset, dataScale(data.quantileSets[_i2][3]) + centerOffset);
    yValues[4] = Math.min(yValues[3] - minOffset, dataScale(data.quantileSets[_i2][4]) + centerOffset);
    yValues[1] = Math.max(yValues[2] + minOffset, dataScale(data.quantileSets[_i2][1]) + centerOffset);
    yValues[0] = Math.max(yValues[1] + minOffset, dataScale(data.quantileSets[_i2][0]) + centerOffset);

    for (var j = 0; j < data.quantileSets[_i2].length; j++) {
      var quantile = bars.append('g').attr('class', "direction".concat(_i2, " quantile")).style('visibility', 'hidden');

      var _x2 = directionsScale(data.directions[_i2]) + (_i2 % 2 === 0 ? -1 : 1) * (BAR_WIDTH / 2 + FONT_SIZE / 2);

      quantile.append('text').attr('x', _x2).attr('y', yValues[j]).attr('text-anchor', _i2 % 2 === 0 ? 'end' : 'start').text(Math.round(data.quantileSets[_i2][j])).style('font-size', FONT_SIZE).attr('id', "quantile-text-".concat(_i2, "-").concat(j));
    }
  } // ===================== HOVER =====================
  // Create triggers


  var _loop = function _loop(_i3) {
    bars.append('rect').attr('width', BAR_WIDTH).attr('x', directionsScale(data.directions[_i3]) - BAR_WIDTH / 2).attr('height', dataScale.range()[0] - dataScale.range()[1] + FONT_SIZE).attr('y', MARGIN.top).attr('fill', 'transparent') // Highlight direction
    .on('mouseover', function () {
      d3.selectAll(".direction".concat(_i3)).attr('stroke-width', QUANTILE_STROKE_WIDTH * 2);
      d3.selectAll(".direction".concat(_i3, ".label")).attr('font-weight', 1000);
      d3.selectAll(".direction".concat(_i3, ".quantile")).style('visibility', 'visible'); // Unhighlight direction
    }).on('mouseout', function () {
      d3.selectAll(".direction".concat(_i3)).attr('stroke-width', QUANTILE_STROKE_WIDTH);
      d3.selectAll(".direction".concat(_i3, ".label")).attr('font-weight', 0);
      d3.selectAll(".direction".concat(_i3, ".quantile")).style('visibility', 'hidden');
    });
  };

  for (var _i3 = 0; _i3 < data.directions.length; _i3++) {
    _loop(_i3);
  } // ===================== OTHER =====================
  // Draw Title


  svg.append('text').attr('x', (WIDTH - MARGIN.right - MARGIN.left) / 2 + MARGIN.left).attr('y', MARGIN.top - FONT_SIZE * 2).attr('text-anchor', 'middle').text(data.title).style('font-size', FONT_SIZE);
  return [svg, dataScale];
}
/**
 * @param {object} vizData Project data
 * @returns {Array<number>} The quantile sets
 */


function getDelayQuantileSets(vizData) {
  var quantileSets = [];
  var delaySets = [[], [], [], []];

  var _iterator6 = _createForOfIteratorHelper(vizData),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var day = _step6.value;

      for (var i = 0; i < day.lignes.length; i++) {
        var line = day.lignes[i];

        for (var j = 0; j < line.girouettes.length; j++) {
          var direction = line.girouettes[j];

          var _iterator7 = _createForOfIteratorHelper(direction.voyages),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var trip = _step7.value;

              var _iterator8 = _createForOfIteratorHelper(trip.arrets),
                  _step8;

              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  var stop = _step8.value;
                  delaySets[i * day.lignes.length + j].push(stop.minutesEcart);
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
              }
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }

  for (var _i4 = 0, _delaySets = delaySets; _i4 < _delaySets.length; _i4++) {
    var delaySet = _delaySets[_i4];
    quantileSets.push(helper.getQuantiles(delaySet));
  }

  return quantileSets;
}
/**
 * @param {object} vizData Project data
 * @returns {Array<number>} The quantile sets
 */


function getTrafficQuantileSets(vizData) {
  var tripSets = [[], [], [], []];
  var daySets = [[], [], [], []];
  var weekSets = [[], [], [], []];
  var lastWeek = helper.getWeekNumber(new Date(Date.parse(vizData[0].date)))[1];
  var weekClients = [0, 0, 0, 0];

  var _iterator9 = _createForOfIteratorHelper(vizData),
      _step9;

  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var day = _step9.value;
      var week = helper.getWeekNumber(new Date(Date.parse(day.date)))[1];

      for (var i = 0; i < day.lignes.length; i++) {
        var line = day.lignes[i];

        for (var j = 0; j < line.girouettes.length; j++) {
          var direction = line.girouettes[j];
          var dayClients = 0;

          var _iterator10 = _createForOfIteratorHelper(direction.voyages),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var trip = _step10.value;
              var tripClients = 0;

              var _iterator11 = _createForOfIteratorHelper(trip.arrets),
                  _step11;

              try {
                for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                  var stop = _step11.value;
                  tripClients += stop.nClients;
                }
              } catch (err) {
                _iterator11.e(err);
              } finally {
                _iterator11.f();
              }

              dayClients += tripClients;
              tripSets[i * day.lignes.length + j].push(tripClients);
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }

          daySets[i * day.lignes.length + j].push(dayClients);
          weekClients[i * day.lignes.length + j] += dayClients;
        }
      }

      if (lastWeek !== week) {
        for (var _i8 = 0; _i8 < weekClients.length; _i8++) {
          weekSets[_i8].push(weekClients[_i8]);
        }

        weekClients = [0, 0, 0, 0];
        lastWeek = week;
      }
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }

  var quantileTripSets = [];

  for (var _i5 = 0, _tripSets = tripSets; _i5 < _tripSets.length; _i5++) {
    var tripSet = _tripSets[_i5];
    quantileTripSets.push(helper.getQuantiles(tripSet));
  }

  var quantileDaySets = [];

  for (var _i6 = 0, _daySets = daySets; _i6 < _daySets.length; _i6++) {
    var daySet = _daySets[_i6];
    quantileDaySets.push(helper.getQuantiles(daySet));
  }

  var quantileWeekSets = [];

  for (var _i7 = 0, _weekSets = weekSets; _i7 < _weekSets.length; _i7++) {
    var weekSet = _weekSets[_i7];
    quantileWeekSets.push(helper.getQuantiles(weekSet));
  }

  return [quantileTripSets, quantileDaySets, quantileWeekSets];
}
},{"./helper.js":"scripts/helper.js"}],"index.js":[function(require,module,exports) {
'use strict';

var helper = _interopRequireWildcard(require("./scripts/helper.js"));

var preprocess = _interopRequireWildcard(require("./scripts/preprocess.js"));

var groupedQuantile = _interopRequireWildcard(require("./scripts/grouped-quantile.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @file 
 * @author Adam Prévost, Armelle Jézéquel, Clara Serruau, Jules Lefebvre, Julien Dupuis
 * @version 1.0.0
 * 
 * La structure du projet est inspirée de celle employé pour les TPs de INF8808 créée par Olivia Gélinas.
 */
(function (d3) {
  var svgSize = {
    width: 800,
    height: 625
  };
  helper.setCanvasSize(svgSize.width, svgSize.height);
  helper.generateMapG(svgSize.width, svgSize.height);
  helper.generateMarkerG(svgSize.width, svgSize.height); // Solution temporaire, éventuellement l'utilisateur peut choisir la période qui l'intéresse, s'il veut inclure les week-end et les fériés.

  var startDate = new Date('2021/09/01');
  var endDate = new Date('2021/12/01');
  var typeJour = 'semaine';
  var ferie = false;
  var vizData = [];
  build();
  /**
   *   Cette fonction construit la page web
   */

  function build() {
    d3.csv('./donnees_L9_L22.csv').then(function (csvData) {
      // Change les string pour les types appropriés
      csvData.forEach(function (d) {
        d.date = new Date(d.date + ' 00:00:00');
        d.ligne = +d.ligne;
        d.voyage = +d.voyage;
        d.arret_code = +d.arret_code;
        d.montants = +d.montants;
        d.Minutes_ecart_planifie = +d.Minutes_ecart_planifie;
        d.sequence_arret = +d.sequence_arret;
        d.arret_Latitude = +d.arret_Latitude;
        d.arret_Longitude = +d.arret_Longitude;
      });
      preprocess.addDayType(csvData);
      preprocess.aggregateDataForViz3(csvData, vizData, startDate, endDate, typeJour, ferie);
      groupedQuantile.generateViz3(vizData);
    });
  }
})(d3);
},{"./scripts/helper.js":"scripts/helper.js","./scripts/preprocess.js":"scripts/preprocess.js","./scripts/grouped-quantile.js":"scripts/grouped-quantile.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61029" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map