import "/d3/dist/d3.js";
import "/d3-radial-axis/dist/d3-radial-axis.js";
import "/lodash/lodash.js";
let tickStep = 0.1 / 2;

let ticks = _.range(0.1, 1.0 + tickStep, tickStep);

console.log(ticks);

let ticksSecondary = _.range(0.1, 0.3, 0.002).concat(_.range(0.3, 1.005, 0.005));

let ticksTertiary = _.range(0.1, 0.3, 0.01).concat(_.range(0.3, 1.01, 0.01));

const svgWidth = 800;
const svgHeight = 600;
const svg = d3.select('svg').attr("width", svgWidth).attr("height", svgHeight);
let innerScale = d3.scaleLog().domain([d3.min(ticks), d3.max(ticks)]).range([0, Math.PI * 2]);
const radius = 200;
const zoom = d3.zoom();
let innerAxis = d3.axisRadialInner(innerScale, radius).ticks(ticks.length - 1, ",f").tickValues(ticks.slice(1)).tickSize(24);
let innerAxisSecondary = d3.axisRadialInner(innerScale, radius).tickValues(ticksSecondary).tickFormat("").tickSize(6);
let innerAxisTertiary = d3.axisRadialInner(innerScale, radius).tickValues(ticksTertiary).tickFormat("").tickSize(12);
svg.append('g').call(innerAxis).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
svg.append('g').call(innerAxisSecondary).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
svg.append('g').call(innerAxisTertiary).attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`); //svg.append('path')
//    .attr("d", `
//    M ${center}, ${center}
//    m -${radius}, 0
//    a ${radius},${radius} 0 1,0 ${2*radius},0
//    a ${radius},${radius} 0 1,0 -${2*radius},0`)
//    .attr("transform", `translate(${svgWidth/2 - radius},${svgHeight/2 - radius})`)
//    .call(innerAxis);