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
exports.appendGraphLabels = appendGraphLabels;
exports.initPanelDiv = initPanelDiv;
exports.getSimulation = getSimulation;
exports.simulate = simulate;
exports.getProjection = getProjection;
exports.getPath = getPath;
exports.getClosestStep = getClosestStep;
exports.getSteps = getSteps;

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
 * Appends the labels for the graph.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */


function appendGraphLabels(g) {
  g.append('text').text('Achalandage et ponctualité des lignes de bus 9 et 22 de la couronne Nord de Montréal').attr('class', 'title').attr('fill', '#000000').attr('font-family', 'myriad-pro').attr('font-size', 28).attr('transform', 'translate(50, 50)');
  g.append('text').text('Sous-titre').attr('class', 'title').attr('fill', '#000000').attr('font-family', 'myriad-pro').attr('font-size', 18).attr('transform', 'translate(50, 85)');
}
/**
 * Initializes the div which will contain the information panel.
 */


function initPanelDiv() {
  d3.select('.graph').append('div').attr('id', 'panel').style('width', '215px').style('border', '1px solid black').style('padding', '10px').style('visibility', 'hidden');
}
/**
 * Initializes the simulation used to place the circles
 *
 * @param {object} data The data to be displayed
 * @returns {*} The generated simulation
 */


function getSimulation(data) {
  return d3.forceSimulation(data.features).alphaDecay(0).velocityDecay(0.75).force('collision', d3.forceCollide(5).strength(1));
}
/**
 * Update the (x, y) position of the circles'
 * centers on each tick of the simulation.
 *
 * @param {*} simulation The simulation used to position the cirles.
 */


function simulate(simulation) {
  simulation.on('tick', function () {
    d3.selectAll('.marker').attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    });
  });
}
/**
 * Sets up the projection to be used.
 *
 * @returns {*} The projection to use to trace the map elements
 */


function getProjection() {
  return d3.geoMercator().center([-73.708879, 45.579611]).scale(70000);
}
/**
 * Sets up the path to be used.
 *
 * @param {*} projection The projection used to trace the map elements
 * @returns {*} The path to use to trace the map elements
 */


function getPath(projection) {
  return d3.geoPath().projection(projection);
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
    steps.push(domain[0]);
  }

  while (steps[steps.length - 1] < domain[1] - step) {
    steps.push(steps[steps.length - 1] + step);
  }

  while (steps[0] > domain[0] + step) {
    steps.unshift(steps[0] - step);
  }

  return steps;
}
},{}],"scripts/heatmap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawHeatmap = drawHeatmap;

// Idée générale pour l'algorithme qui parcours l'objet vizData pour recueillir les valeurs pour chaque carré de la heatmap.

/**
 * @param vizData
 * @param ligne
 * @param girouette
 * @param indicateur
 */
function drawHeatmap(vizData, ligne, girouette, indicateur) {
  var posLigne = vizData.findIndex(function (e) {
    return e.ligne === ligne;
  });
  var posGirouette = vizData[posLigne].girouettes.findIndex(function (e) {
    return e.girouette === girouette;
  });

  for (var v = 0; v < vizData[posLigne].girouettes[posGirouette].voyages.length; v++) {
    for (var a = 0; a < vizData[posLigne].girouettes[posGirouette].voyages[v].arrets.length; a++) {
      var valueSquare = vizData[posLigne].girouettes[posGirouette].voyages[v].arrets[a][indicateur]; //console.log(valueSquare)
    }
  }
}
},{}],"scripts/preprocess.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDayType = addDayType;
exports.aggregateData = aggregateData;

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
          minutesEcart: [],
          moyMinutesEcart: null,
          nClients: [],
          moyNClients: null,
          ponctualite: [],
          tauxPonctualite: null,
          minutesEcartClient: [],
          moyMinutesEcartClient: null
        });
        posArret = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length - 1;
      }

      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcart.push(csvData[i].Minutes_ecart_planifie);
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].nClients.push(csvData[i].montants);
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].ponctualite.push(csvData[i].Etat_Ponctualite);
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcartClient.push(csvData[i].Minutes_ecart_planifie * csvData[i].montants);
    }
  } // Fonctions pour créer les indicateurs


  var average = function average(arr) {
    return +(arr.reduce(function (a, b) {
      return a + b;
    }, 0) / arr.length).toFixed(2);
  }; // https://poopcode.com/calculate-the-average-of-an-array-of-numbers-in-javascript/


  var computeTauxPonctualite = function computeTauxPonctualite(arr) {
    return arr.filter(function (x) {
      return x === 'Ponctuel';
    }).length / arr.length;
  }; // Parcours de vizData pour calculer les indicateurs pour chaque ligne.arret


  vizData.forEach(function (ligne) {
    ligne.girouettes.forEach(function (girouette) {
      girouette.voyages.forEach(function (voyage) {
        voyage.arrets.forEach(function (arret) {
          arret.moyMinutesEcart = average(arret.minutesEcart);
          arret.moyNClients = average(arret.nClients);
          arret.moyMinutesEcartClient = average(arret.minutesEcartClient);
          arret.tauxPonctualite = computeTauxPonctualite(arret.ponctualite);
        });
      });
    });
  });
}
},{}],"scripts/grouped-quantile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateViz3 = generateViz3;
exports.generateDelayGraph = generateDelayGraph;
exports.generateTrafficGraph = generateTrafficGraph;
exports.generateGroupedQuantileGraph = generateGroupedQuantileGraph;

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
  top: 100,
  right: 80,
  bottom: 150,
  left: 150
};
var FONT_SIZE = 16;
var DIRECTIONS_ANGLE = -45;
var QUANTILE_STROKE_COLOR = 'black';
var QUANTILE_FILL_COLOR = 'lightgray';
var QUANTILE_STROKE_WIDTH = 2;
var NUMBER_OF_TICKS = 10;
var GRADIENT_COLORS = ['#ffe4e4', '#e4ffe4', '#ffffe4'];
/**
 *
 */

function generateViz3() {
  // Split container in two
  var container = d3.select('#grouped-quantile-graph-container');
  var delayGraphContainer = container.append('div').style('width', '50%').style('height', '100%').style('float', 'left');
  var trafficGraphContainer = container.append('div').style('width', '50%').style('height', '100%').style('float', 'right'); // TODO: Fetch data

  var data = {};
  data.lines = ['9', '22'];
  data.directions = ['Lafontaine', 'Montmorency', 'Côté', 'George VI']; // Regenerate graphs on resize

  new ResizeObserver(function () {
    generateDelayGraph(delayGraphContainer, data);
  }).observe(delayGraphContainer.node());
  new ResizeObserver(function () {
    generateTrafficGraph(trafficGraphContainer, data);
  }).observe(trafficGraphContainer.node());
}
/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */


function generateDelayGraph(container, data) {
  // TODO: Fetch data
  data.quantileSets = [[10, 20, 30, 40, 50], [-5, 25, 40, 50, 70], [15, 20, 55, 60, 65], [40, 50, 60, 70, 90]]; // Generate common graph

  data.title = 'Retard Moyen';

  var _generateGroupedQuant = generateGroupedQuantileGraph(container, data),
      _generateGroupedQuant2 = _slicedToArray(_generateGroupedQuant, 2),
      svg = _generateGroupedQuant2[0],
      dataScale = _generateGroupedQuant2[1];

  var WIDTH = container.node().getBoundingClientRect().width;
  var HEIGHT = container.node().getBoundingClientRect().height; // Set gradients

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

  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(15) - MARGIN.top).attr('y', MARGIN.top).attr('fill', GRADIENT_COLORS[0]);
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(5) - dataScale(15)).attr('y', dataScale(15)).attr('fill', 'url(#late-grad)');
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', dataScale(-5) - dataScale(5)).attr('y', dataScale(5)).attr('fill', 'url(#early-grad)');
  svg.insert('rect', '#x-axis').attr('width', WIDTH - MARGIN.left - MARGIN.right).attr('x', MARGIN.left).attr('height', HEIGHT - MARGIN.bottom - dataScale(-5)).attr('y', dataScale(-5)).attr('fill', GRADIENT_COLORS[2]); // Set y axis label

  svg.select('#y-axis > .label').text('Minute');
}
/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */


function generateTrafficGraph(container, data) {
  // TODO: Fetch data
  data.quantileSets = [[100, 200, 300, 350, 500], [50, 200, 250, 600, 650], [200, 350, 400, 600, 700], [450, 500, 600, 700, 750]]; // Generate common graph

  data.title = 'Achalandage Moyen';

  var _generateGroupedQuant3 = generateGroupedQuantileGraph(container, data),
      _generateGroupedQuant4 = _slicedToArray(_generateGroupedQuant3, 1),
      svg = _generateGroupedQuant4[0]; // Set y axis label


  svg.select('#y-axis > .label').text('Nombre de personnes\npar jour');
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

  var WIDTH = container.node().getBoundingClientRect().width;
  var HEIGHT = container.node().getBoundingClientRect().height;
  var BAR_WIDTH = (WIDTH - MARGIN.left - MARGIN.right) / 7; // Create svg

  var svg = container.append('svg').attr('width', WIDTH).attr('height', HEIGHT); // ===================== SCALES =====================
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

  var dataScale = d3.scaleLinear().domain([minValue, maxValue]).range([HEIGHT - MARGIN.bottom - FONT_SIZE, MARGIN.top]); // ===================== X AXIS =====================

  var xAxis = svg.append('g').attr('id', 'x-axis'); // Draw axis line

  xAxis.append('path').attr('d', d3.line()([[MARGIN.left, HEIGHT - MARGIN.bottom], [MARGIN.left + 7 * BAR_WIDTH, HEIGHT - MARGIN.bottom]])).attr('stroke', 'black'); // Draw line values

  var lineValuesY = HEIGHT - MARGIN.bottom + FONT_SIZE * 1.5;

  var _iterator3 = _createForOfIteratorHelper(data.lines),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _line = _step3.value;
      xAxis.append('text').attr('x', linesScale(_line)).attr('y', lineValuesY).attr('text-anchor', 'middle').text(_line).style('font-size', FONT_SIZE);
    } // Draw direction values

  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var directionValuesY = lineValuesY + FONT_SIZE;

  for (var i = 0; i < data.directions.length; i++) {
    var x = directionsScale(data.directions[i]);
    xAxis.append('text').attr('text-anchor', 'end').attr('transform', "translate(".concat(x, ", ").concat(directionValuesY, ") rotate(").concat(DIRECTIONS_ANGLE, ")")).text(data.directions[i]).style('font-size', FONT_SIZE).attr('class', "direction".concat(i, " label"));
  } // Draw labels


  xAxis.append('text').attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2).attr('y', lineValuesY).text('Ligne').style('font-size', FONT_SIZE);
  xAxis.append('text').attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2).attr('y', directionValuesY + FONT_SIZE).text('Direction').style('font-size', FONT_SIZE); // ===================== Y AXIS =====================

  var yAxis = svg.append('g').attr('id', 'y-axis'); // Draw axis line

  yAxis.append('path').attr('d', d3.line()([[MARGIN.left, MARGIN.top], [MARGIN.left, HEIGHT - MARGIN.bottom]])).attr('stroke', 'black'); // Generate steps

  var steps = helper.getSteps(NUMBER_OF_TICKS, dataScale.domain());

  var _iterator4 = _createForOfIteratorHelper(steps),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var step = _step4.value;
      var y = dataScale(step); // Draw data values

      yAxis.append('text').attr('text-anchor', 'end').attr('x', MARGIN.left - FONT_SIZE).attr('y', y + FONT_SIZE / 2).text(step).style('font-size', FONT_SIZE); // Draw ticks

      yAxis.append('path').attr('d', d3.line()([[MARGIN.left - FONT_SIZE / 2, y], [MARGIN.left, y]])).attr('stroke', QUANTILE_STROKE_COLOR).attr('stroke-width', QUANTILE_STROKE_WIDTH);
    } // Draw labels

  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  yAxis.append('text').attr('x', MARGIN.left - FONT_SIZE / 2).attr('y', MARGIN.top - FONT_SIZE / 2).attr('class', 'label').attr('text-anchor', 'end').text('Unité de données').style('font-size', FONT_SIZE); // ===================== CANDLES =====================

  var bars = svg.append('g').attr('id', 'candles');

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

    for (var j = 0; j < data.quantileSets[_i2].length; j++) {
      var quantile = bars.append('g').attr('class', "direction".concat(_i2, " quantile")).style('visibility', 'hidden');
      quantile.append('text').attr('x', directionsScale(data.directions[_i2]) + (_i2 % 2 === 0 ? -1 : 1) * (BAR_WIDTH / 2 + FONT_SIZE / 2)).attr('y', dataScale(data.quantileSets[_i2][j])).attr('text-anchor', _i2 % 2 === 0 ? 'end' : 'start').text(data.quantileSets[_i2][j]).style('font-size', FONT_SIZE).attr('id', "quantile-text-".concat(_i2, "-").concat(j)); // Text background

      var textBoundingClientRect = quantile.node().getBoundingClientRect();
      quantile.insert('rect', "#quantile-text-".concat(_i2, "-").concat(j)).attr('width', textBoundingClientRect.width).attr('x', textBoundingClientRect.x).attr('height', textBoundingClientRect.height).attr('y', textBoundingClientRect.y).attr('fill', 'white');
    }
  } // ===================== HOVER =====================
  // Create triggers


  var _loop = function _loop(_i3) {
    bars.append('rect').attr('width', BAR_WIDTH).attr('x', directionsScale(data.directions[_i3]) - BAR_WIDTH / 2).attr('height', dataScale.range()[0] - dataScale.range()[1] + FONT_SIZE).attr('y', MARGIN.top).attr('fill', 'transparent') // Highlight direction
    .on('mouseover', function () {
      d3.selectAll(".direction".concat(_i3)).attr('stroke-width', QUANTILE_STROKE_WIDTH * 2);
      d3.selectAll(".direction".concat(_i3, ".label")).style('font-size', FONT_SIZE * 1.5);
      d3.selectAll(".direction".concat(_i3, ".quantile")).style('visibility', 'visible'); // Unhighlight direction
    }).on('mouseout', function () {
      d3.selectAll(".direction".concat(_i3)).attr('stroke-width', QUANTILE_STROKE_WIDTH);
      d3.selectAll(".direction".concat(_i3, ".label")).style('font-size', FONT_SIZE);
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
},{"./helper.js":"scripts/helper.js"}],"index.js":[function(require,module,exports) {
'use strict';

var helper = _interopRequireWildcard(require("./scripts/helper.js"));

var heatmap = _interopRequireWildcard(require("./scripts/heatmap.js"));

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
  helper.generateMarkerG(svgSize.width, svgSize.height);
  helper.appendGraphLabels(d3.select('.main-svg'));
  helper.initPanelDiv(); // Solution temporaire, éventuellement l'utilisateur peut choisir la période qui l'intéresse, s'il veut inclure les week-end et les fériés.

  var startDate = new Date('2021-09-01');
  var endDate = new Date('2021-12-01');
  var typeJour = 'semaine';
  var ferie = false;
  var vizData = [];
  build();
  groupedQuantile.generateViz3();
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
      }); //console.log(csvData)

      preprocess.addDayType(csvData);
      preprocess.aggregateData(csvData, vizData, startDate, endDate, typeJour, ferie);
      console.log(vizData);
      heatmap.drawHeatmap(vizData, 9, 'Lafontaine Via Gare  Saint-Jérôme', 'moyMinutesEcart');
    });
  }
})(d3);
},{"./scripts/helper.js":"scripts/helper.js","./scripts/heatmap.js":"scripts/heatmap.js","./scripts/preprocess.js":"scripts/preprocess.js","./scripts/grouped-quantile.js":"scripts/grouped-quantile.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52756" + '/');

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