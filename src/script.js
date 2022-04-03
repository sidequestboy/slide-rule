import "/d3/dist/d3.js"
import "/d3-radial-axis/dist/d3-radial-axis.js"
import "/lodash/lodash.js"

let zoomLevel = 2
let scaleMin = 0.1, scaleMax = 1.0, scaleMid = 0.3
let labeledTickStep = 0.1 / zoomLevel
let innerScaleFactor = 100
let outerScaleFactor = 1

let labeledTicks = _.range(scaleMin, scaleMax + labeledTickStep, labeledTickStep)
let secondaryTicks =
    _.range(scaleMin, scaleMid, labeledTickStep / 25).concat(
    _.range(scaleMid, scaleMax, labeledTickStep / 10)
)
let tertiaryTicks = _.range(scaleMin, scaleMax, labeledTickStep / 5)

const svgWidth = 800
const svgHeight = 600

const svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight)

const g = svg.append("g")
    .attr("transform", `translate(${svgWidth/2},${svgHeight/2})`)

const innerG = g.append("g")
    .classed("inner", true)

const outerG = g.append("g")
    .classed("outer", true)

let innerScale = d3.scaleLog()
    .domain([d3.min(labeledTicks), d3.max(labeledTicks)])
    .range([0, Math.PI * 2])

let outerScale = d3.scaleLog()
    .domain([d3.min(labeledTicks), d3.max(labeledTicks)])
    .range([0, Math.PI * 2])

const radius = 200

let innerAxis = d3.axisRadialInner(innerScale, radius)
    .ticks(labeledTicks.length - 1, ",f")
    .tickValues(labeledTicks.slice(1).map(v => v * innerScaleFactor))
    .tickSize(24)

let innerAxisSecondary = d3.axisRadialInner(innerScale, radius)
    .ticks(secondaryTicks.length - 1, ",f")
    .tickValues(secondaryTicks.map(v => v * innerScaleFactor))
    .tickSize(6)

let innerAxisTertiary = d3.axisRadialInner(innerScale, radius)
    .ticks(tertiaryTicks.length - 1, ",f")
    .tickValues(tertiaryTicks.map(v => v * innerScaleFactor))
    .tickSize(12)

innerG.append('g').classed('labeled-ticks', true)
    .call(innerAxis)

innerG.append('g').classed('secondary-ticks', true)
    .call(innerAxisSecondary)

innerG.append('g').classed('tertiary-ticks', true)
    .call(innerAxisTertiary)

let outerAxis = d3.axisRadialOuter(innerScale, radius)
    .ticks(labeledTicks.length - 1, ",f")
    .tickValues(labeledTicks.slice(1).map(v => v * outerScaleFactor))
    .tickSize(24)

let outerAxisSecondary = d3.axisRadialOuter(innerScale, radius)
    .ticks(secondaryTicks.length - 1, ",f")
    .tickValues(secondaryTicks.map(v => v * outerScaleFactor))
    .tickSize(6)

let outerAxisTertiary = d3.axisRadialOuter(innerScale, radius)
    .ticks(tertiaryTicks.length - 1, ",f")
    .tickValues(tertiaryTicks.map(v => v * outerScaleFactor))
    .tickSize(12)

outerG.append('g').classed('labeled-ticks', true)
    .call(outerAxis)

outerG.append('g').classed('secondary-ticks', true)
    .call(outerAxisSecondary)

outerG.append('g').classed('tertiary-ticks', true)
    .call(outerAxisTertiary)


d3.select("#outer-angle-slider").on("input", function() {
    updateOuterAngle(+this.value)
})

updateOuterAngle(0)

function updateOuterAngle(outerAngle) {
    d3.select("#outer-angle-value").text(outerAngle)
    d3.select("#outer-angle-slider").property("value", outerAngle)
    d3.select(".outer")
        .attr("transform", `rotate(-${outerAngle})`)
}