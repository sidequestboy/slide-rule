import "/d3/dist/d3.js";
import "/d3-radial-axis/dist/d3-radial-axis.js";
import "/lodash/lodash.js";

function getScale(offset, scaleMin, scaleMax) {
  return d3.scaleLog().domain([scaleMin, scaleMax]).range([offset, offset + Math.PI * 2]);
}

function createAxis(scale, ticks, tickSize = 24, factor = 1, radius, outer) {
  let axis = outer ? d3.axisRadialOuter(scale, radius) : d3.axisRadialInner(scale, radius);
  return axis.ticks(ticks.length - 1, ",f").tickValues(ticks.map(v => v * factor)).tickSize(tickSize);
}

function main() {
  const svgWidth = 800;
  const svgHeight = 600;
  const radius = 200;
  const scaleMin = 1,
        scaleMid = 3,
        scaleMax = 10;
  let zoomLevel = 2;
  let majorTickStep = 1 / zoomLevel;
  let ticks = [{
    values: _.range(scaleMin + majorTickStep, scaleMax + majorTickStep, majorTickStep),
    tickSize: 24
  }, {
    values: _.range(scaleMin, scaleMid, majorTickStep / 25).concat(_.range(scaleMid, scaleMax, majorTickStep / 10)),
    tickSize: 6
  }, {
    values: _.range(scaleMin, scaleMax, majorTickStep / 5),
    tickSize: 12
  }];
  let innerScale = getScale(0, scaleMin, scaleMax);
  let outerScale = getScale(0, scaleMin, scaleMax);
  let innerScaleFactor = 10;
  let outerScaleFactor = 1;
  let innerAxes = ticks.map(t => createAxis(innerScale, t.values, t.tickSize, innerScaleFactor, radius, false));
  let outerAxes = ticks.map(t => createAxis(outerScale, t.values, t.tickSize, outerScaleFactor, radius, true));
  const containerG = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight).append("g").classed("container", true).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
  const innerG = containerG.append("g").classed("inner", true);
  innerG.append("g").classed("inner-axis-0", true).call(innerAxes[0]);
  innerG.append("g").classed("inner-axis-1", true).call(innerAxes[1]);
  innerG.append("g").classed("inner-axis-2", true).call(innerAxes[2]);
  const outerG = containerG.append("g").classed("outer", true);
  outerG.append("g").classed("outer-axis", true).classed("outer-axis-0", true).call(outerAxes[0]);
  outerG.append("g").classed("outer-axis", true).classed("outer-axis-1", true).call(outerAxes[1]);
  outerG.append("g").classed("outer-axis", true).classed("outer-axis-2", true).call(outerAxes[2]);

  function setInnerAxesAngle(angle) {
    // angle in radians pls
    innerScale.range([angle, angle + 2 * Math.PI]);
    innerG.select(".inner-axis-0").call(innerAxes[0]);
    innerG.select(".inner-axis-1").call(innerAxes[1]);
    innerG.select(".inner-axis-2").call(innerAxes[2]);
  }

  function setOuterAxesAngle(angle) {
    // angle in radians pls
    outerScale.range([angle, angle + 2 * Math.PI]);
    outerG.select(".outer-axis-0").call(outerAxes[0]);
    outerG.select(".outer-axis-1").call(outerAxes[1]);
    outerG.select(".outer-axis-2").call(outerAxes[2]);
  }

  d3.selectAll(".inner .tick").on("click", (e, d) => {
    let offset = -(Math.log(d) / Math.log(10)) * 2 * Math.PI;
    setInnerAxesAngle(offset);
  });
  d3.selectAll(".outer .tick").on("click", (e, d) => {
    let offset = -(Math.log(d) / Math.log(10)) * 2 * Math.PI;
    setOuterAxesAngle(offset);
  });
}

main();