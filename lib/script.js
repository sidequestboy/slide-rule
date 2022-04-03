import "/d3/dist/d3.js";
import "/d3-radial-axis/dist/d3-radial-axis.js";
import "/lodash/lodash.js";
let zoomLevel = 1.0;
let scaleMin = 0.1,
    scaleMax = 1.0,
    scaleMid = 0.3;
let labeledTickStep = 0.05 * zoomLevel;

let labeledTicks = _.range(scaleMin, scaleMax + labeledTickStep, labeledTickStep);

let secondaryTicks = _.range(scaleMin, scaleMid, labeledTickStep / 25).concat(_.range(scaleMid, scaleMax, labeledTickStep / 10));

let tertiaryTicks = _.range(scaleMin, scaleMax, labeledTickStep / 5);

const svgWidth = 800;
const svgHeight = 600;
const svg = d3.select('svg').attr("width", svgWidth).attr("height", svgHeight);
let innerScale = d3.scaleLog().domain([d3.min(labeledTicks), d3.max(labeledTicks)]).range([0, Math.PI * 2]);
let outerScale = d3.scaleLog().domain([d3.min(labeledTicks), d3.max(labeledTicks)]).range([0, Math.PI * 2]);
const radius = 200;
const zoom = d3.zoom();
let innerAxis = d3.axisRadialInner(innerScale, radius).ticks(labeledTicks.length - 1, ",f").tickValues(labeledTicks.slice(1)).tickSize(24);
let innerAxisSecondary = d3.axisRadialInner(innerScale, radius).tickValues(secondaryTicks).tickFormat("").tickSize(6);
let innerAxisTertiary = d3.axisRadialInner(innerScale, radius).tickValues(tertiaryTicks).tickFormat("").tickSize(12);
svg.append('g').call(innerAxis).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
svg.append('g').call(innerAxisSecondary).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
svg.append('g').call(innerAxisTertiary).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
let outerAxis = d3.axisRadialOuter(innerScale, radius).ticks(labeledTicks.length - 1, ",f").tickValues(labeledTicks.slice(1)).tickSize(24);
let outerAxisSecondary = d3.axisRadialOuter(innerScale, radius).tickValues(secondaryTicks).tickFormat("").tickSize(6);
let outerAxisTertiary = d3.axisRadialOuter(innerScale, radius).tickValues(tertiaryTicks).tickFormat("").tickSize(12);
svg.append('g').call(outerAxis).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
svg.append('g').call(outerAxisSecondary).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
svg.append('g').call(outerAxisTertiary).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);