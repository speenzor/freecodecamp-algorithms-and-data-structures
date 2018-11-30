const projectName = 'scatter-plot';

//Get the data from the API
const getData = (() => {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
  request.send();
  request.onload = () => {
    requestCallback(JSON.parse(request.responseText));
  };
})();

const width = 800;
const height = 500;
const padding = 60;

const tooltip = d3.select('#chart')
                  .append('div')
                  .attr('id', 'tooltip')

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const requestCallback = (data) => {
  const oldTimeArray = data.map(d => d.Time);

  data.forEach((d) => {
    d.Time = new Date(Date.UTC(2000, 0, 2, 0, d.Time[0] + d.Time[1], d.Time[3] + d.Time[4]));
  })
  
  const timeArray = data.map(d => d.Time);
  const yearArray = data.map(d => d.Year);
  const minTime = d3.min(timeArray);
  const maxTime = d3.max(timeArray);
  const minYear = d3.min(yearArray);
  const maxYear = d3.max(yearArray);
  
  const xScale = d3.scaleLinear()
                   .domain([minYear - 1, maxYear + 1])
                   .range([60, width - 60])
  
  const yScale = d3.scaleLinear()
                   .domain([minTime, maxTime])
                   .range([60, height - 60])
 
  
  //Adds x, y, r attributes to circles plus dot class
  svg.selectAll('circle')
     .data(data)
     .enter()
     .append('circle')
     .attr('class', 'dot')
     .attr('cx', (d) => xScale(d.Year))
     .attr('cy', (d) => yScale(d.Time))
     .attr('r', 6)
     .attr('data-xvalue', (d) => d.Year)
     .attr('data-yvalue', (d) => d.Time)
     .style('fill', (d) => d.Doping === '' ? 'orange':'blue')
     .on('mouseover', (d, i) => {
        tooltip.html(d.Name + ', ' + d.Nationality + '<br>Time: ' + oldTimeArray[i] + (d.Doping?'<br>'+d.Doping:'<br>No doping allegations'))
               .attr('data-year', d.Year)
               .style('left', 600 + 'px')
               .style('top', 100 + 'px')
               .transition()
               .duration(200)
               .style('opacity', 0.9)
               .style('display', 'block')

      })
      .on('mouseout', (d) => {
         tooltip.transition()
                .duration(100)
                .style('opacity', 0)
      })
  
  //Create axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  
  svg.append('rect')
     .attr('id', 'legend')
     .attr('x', 530)
     .attr('y', 150)
     .attr('height', 70)
     .attr('width', 200)
  
  svg.append('text')
     .text('Legend')
     .attr('x', 540)
     .attr('y', 170)
     .style('text-decoration', 'underline')
  
  svg.append('text')
     .text('Doping allegations')
     .attr('x', 540)
     .attr('y', 190)
  
  svg.append('rect')
     .attr('x', 705)
     .attr('y', 177)
     .attr('height', 15)
     .attr('width', 15)
     .style('fill', 'blue')
  
  svg.append('text')
     .text('No doping allegations')
     .attr('x', 540)
     .attr('y', 210)
  
  svg.append('rect')
     .attr('x', 705)
     .attr('y', 198)
     .attr('width', 15)
     .attr('height', 15)
     .style('fill', 'orange')
  
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', 'translate(0, ' + (height - padding) + ')')
     .call(xAxis)
  
  svg.append('g')
     .attr('id', 'y-axis')
     .attr('transform', 'translate(' + padding + ', 0)')
     .call(yAxis)
}