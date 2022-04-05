import "/d3/dist/d3.js"
import "/d3-radial-axis/dist/d3-radial-axis.js"
import "/lodash/lodash.js"

function getScale(offset, scaleMin, scaleMax) {
  return d3.scaleLog()
    .domain([scaleMin, scaleMax])
    .range([offset, offset + Math.PI * 2])
}

function createAxis(scale, ticks, tickSize=24, factor=1, radius, outer) {
  let axis = outer ? d3.axisRadialOuter(scale, radius) : d3.axisRadialInner(scale, radius)
  return axis.ticks(ticks.length - 1, ",f")
    .tickValues(ticks.map(v => v * factor))
    .tickSize(tickSize)
}

function main() {
  const svgWidth = 800
  const svgHeight = 600
  const radius = 200
  const scaleMin = 1, scaleMid = 3, scaleMax = 10

  let zoomLevel = 2
  let majorTickStep = 1 / zoomLevel

  let ticks = [
    {
      values: _.range(scaleMin + majorTickStep, scaleMax + majorTickStep, majorTickStep),
      tickSize: 24
    },
    {
      values: _.range(scaleMin, scaleMid, majorTickStep / 25).concat(
             _.range(scaleMid, scaleMax, majorTickStep / 10)
      ),
      tickSize: 6
    },
    {
      values: _.range(scaleMin, scaleMax, majorTickStep / 5),
      tickSize: 12
    }
  ]

  let innerScale = getScale(0, scaleMin, scaleMax)
  let outerScale = getScale(0, scaleMin, scaleMax)

  let innerScaleFactor = 10
  let outerScaleFactor = 1

  let innerAxes = ticks.map(t => createAxis(innerScale, t.values, t.tickSize, innerScaleFactor, radius, false))
  let outerAxes = ticks.map(t => createAxis(outerScale, t.values, t.tickSize, outerScaleFactor, radius, true))

  const containerG = d3.select("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    .append("g")
      .classed("container", true)
      .attr("transform", `translate(${svgWidth/2},${svgHeight/2})`)

  const innerG = containerG.append("g")
      .classed("inner", true)

  innerG.append("g")
      .classed("inner-axis", true)
      .classed("labeled-axis", true)
      .call(innerAxes[0])

  innerG.append("g")
    .classed("inner-axis", true)
    .call(innerAxes[1])

  innerG.append("g")
    .classed("inner-axis", true)
    .call(innerAxes[2])

  const outerG = containerG.append("g")
    .classed("outer", true)

  outerG.append("g")
    .classed("outer-axis", true)
    .classed("labeled-axis", true)
    .call(outerAxes[0])

  outerG.append("g")
    .classed("outer-axis", true)
    .call(outerAxes[1])

  outerG.append("g")
    .classed("outer-axis", true)
    .call(outerAxes[2])

  function setAxesAngle(angle, outer) {
    // angle in radians pls
    let scale, g, axes, className
    if (outer) {
      scale = outerScale
      g = outerG
      axes = outerAxes
      className = "outer-axis"
    } else {
      scale = innerScale
      g = innerG
      axes = innerAxes
      className = "inner-axis"
    }

    let prevAngle = scale.range()[0]
    let animationAngle = 360 * (angle-prevAngle) / (2 * Math.PI)
    let transitionTime = 2000

    scale.range([angle, angle + 2 * Math.PI])
    
    g.selectAll(`.${className}`)
      .transition()
        .duration(transitionTime)
        .attr("transform", `rotate(${animationAngle})`)
      .end()
      .then(() => {
        d3.selectAll(`.${className}`)
          .each((d, i, nodes) => {
            d3.select(nodes[i])
              .attr("transform", null)
              .call(axes[i])
          })
      })
  }

  d3.selectAll(".inner .tick").on("click", (e, d) => {
    let offset = -(Math.log(d) / Math.log(10)) * 2 * Math.PI
    setAxesAngle(offset, false)
  })
  d3.selectAll(".outer .tick").on("click", (e, d) => {
    let offset = -(Math.log(d) / Math.log(10)) * 2 * Math.PI
    setAxesAngle(offset, true)
  })
}

main()