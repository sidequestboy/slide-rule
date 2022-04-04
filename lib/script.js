import "/d3/dist/d3.js";
import "/d3-radial-axis/dist/d3-radial-axis.js";
import "/lodash/lodash.js";
const radius = 200;
const scaleMin = 1,
      scaleMid = 3,
      scaleMax = 10;
let innerScale = d3.scaleLog().domain([scaleMin, scaleMax]).range([0, Math.PI * 2]);
let outerScale = d3.scaleLog().domain([scaleMin, scaleMax]).range([0, Math.PI * 2]);
let zoomLevel = 2;
let majorTickStep = 1 / zoomLevel;
let ticks = {
  1: _.range(scaleMin + majorTickStep, scaleMax + majorTickStep, majorTickStep),
  2: _.range(scaleMin, scaleMid, majorTickStep / 25).concat(_.range(scaleMid, scaleMax, majorTickStep / 10)),
  3: _.range(scaleMin, scaleMax, majorTickStep / 5)
};
let innerScaleFactor = 10;
let outerScaleFactor = 1;

function createAxis(scale, ticks, tickSize = 24, factor = 1, radius = radius, outer = true) {
  let axis = outer ? d3.axisRadialOuter(scale, radius) : d3.axisRadialInner(scale, radius);
  return axis.ticks(ticks.length - 1, ",f").tickValues(ticks.map(v => v * factor)).tickSize(tickSize);
}

function createInnerAxes() {
  return [createAxis(innerScale, ticks[1], 24, innerScaleFactor, radius, false), createAxis(innerScale, ticks[2], 6, innerScaleFactor, radius, false), createAxis(innerScale, ticks[3], 12, innerScaleFactor, radius, false)];
}

let innerAxes = createInnerAxes();

function createOuterAxes() {
  return [createAxis(outerScale, ticks[1], 24, outerScaleFactor, radius, true), createAxis(outerScale, ticks[2], 6, outerScaleFactor, radius, true), createAxis(outerScale, ticks[3], 12, outerScaleFactor, radius, true)];
}

let outerAxes = createOuterAxes();
const svgWidth = 800;
const svgHeight = 600;
const containerG = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight).append("g").classed("container", true).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
const innerG = containerG.append("g").classed("inner", true);
innerG.append("g").classed("inner-axis-0", true).call(innerAxes[0]);
innerG.append("g").classed("inner-axis-1", true).call(innerAxes[1]);
innerG.append("g").classed("inner-axis-2", true).call(innerAxes[2]);
const outerG = containerG.append("g").classed("outer", true);
outerG.append("g").classed("outer-axis-0", true).call(outerAxes[0]);
outerG.append("g").classed("outer-axis-1", true).call(outerAxes[1]);
outerG.append("g").classed("outer-axis-2", true).call(outerAxes[2]);