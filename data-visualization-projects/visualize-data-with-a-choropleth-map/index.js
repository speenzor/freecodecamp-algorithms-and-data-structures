const projectName = "choropleth";

const getData = (() => {
  const educationRequest = new XMLHttpRequest();
  educationRequest.open('GET', 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json', true);
  educationRequest.send();
  educationRequest.onload = () => {
    const countiesRequest = new XMLHttpRequest();
    countiesRequest.open('GET', 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json', true);
    countiesRequest.send();
    countiesRequest.onload = () => {
      requestCallback(JSON.parse(educationRequest.responseText), JSON.parse(countiesRequest.responseText));
    };
  };
})();


const height = 500;
const width = 1000;
const topMargin = 60;
const bottomMargin = 60;
const leftMargin = 60;
const rightMargin = 5;

//Tooltip
const tooltip = d3.select('#chart')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)

//SVG container
const svg = d3.select('#chart')
  .append('svg')
  .attr('height', height + topMargin + bottomMargin)
  .attr('width', width + leftMargin + rightMargin)

const requestCallback = (educationData, countyData) => {
  
  const colors = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"];
  const percentageArray = educationData.map(d => d.bachelorsOrHigher);
  const minPercentage = d3.min(percentageArray);
  const maxPercentage = d3.max(percentageArray);

  //Map
  const path = d3.geoPath();
  
  const x = d3.scaleLinear()
    .domain([minPercentage, maxPercentage])
    .rangeRound([600, 860])
  
  const color = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
    .range(colors)
  
  svg.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter().append('path')
    .attr('class', 'county')
    .attr('data-fips', d => d.id)
    .attr('data-education', d => {
      let result = educationData.filter(obj => obj.fips == d.id)
      if (result[0]) {return result[0].bachelorsOrHigher};
      return 0;
    })
    .attr('fill', d => {
      let result = educationData.filter(obj => obj.fips == d.id);
      if (result[0]) {return color(result[0].bachelorsOrHigher)};
      return color(0);
    })
    .attr('d', path)
    .on('mouseover', d => {
      tooltip.style('opacity', 0.9)
      tooltip.attr('data-education', () => {return educationData.filter(obj => obj.fips == d.id)[0].bachelorsOrHigher})
      .html(() => {
        let result = educationData.filter(obj => obj.fips == d.id);
        if (result[0]) {
          return result[0]['area_name'] + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher + '%'};
        return 0;
      })
        .transition()
        .duration(200)
        .style('left', 500 + 'px')
        .style('top', 140 + 'px')
        .style('display', 'block')
     })
     .on('mouseout', d => {
        tooltip.transition()
          .duration(100)
          .style('opacity', 0)
     })

  
  
  //Legend
  const legendThreshold = d3.scaleThreshold()
                          .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
                          .range(colors)
  
  
  const legendScale = d3.scaleLinear()
                        .domain([minPercentage, maxPercentage])
                        .range([0, 240])
  
  const legendAxis = d3.axisBottom(legendScale)
                       .tickSize(13)
                       .tickValues(legendThreshold.domain())
                       .tickFormat(d => Math.round(d) + '%')
  
  const legend = svg.append('g')
               .call(legendAxis)
               .attr('transform', 'translate(600, 40)')
               .attr('id', 'legend')
  
  legend.selectAll('rect')
   .data(legendThreshold.range().map(color => {
    const d = legendThreshold.invertExtent(color);
    if (d[0] == null) d[0] = legendScale.domain()[0];
    if (d[1] == null) d[1] = legendScale.domain()[1];
    return d;
    }))
   .enter().insert('rect', '.tick')
           .attr('height', 8)
           .attr('x', d => legendScale(d[0]))
           .attr('width', d => legendScale(d[1]) - legendScale(d[0]))
           .attr('fill', d => legendThreshold(d[0]))

  //Adds states outline
  svg.append('path')
    .datum(topojson.mesh(countyData, countyData.objects.states, (a, b) => a !==b))
    .attr('class', 'states')
    .attr('d', path);
  
}
