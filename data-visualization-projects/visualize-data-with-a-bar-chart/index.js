

const gdpData = (() => {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  request.send();
  request.onload = () => {
    requestCallback(JSON.parse(request.responseText));
  };
})();

const padding = 60;
const width = 800;
const height = 400;

const tooltip = d3.select('#chart')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('opacity', 0)

const svg = d3.select('#chart')
              .append('svg')
              .attr('width', width + padding)
              .attr('height', height + padding);

const requestCallback = (data) => {
  const dataset = data.data;
  const barwidth = width/dataset.length;
  
  const tooltipYearsArray = dataset.map((item) => {
    let quarter;
    let temp = item[0].substring(5, 7);
    
    if (temp === '01') {
      quarter = 'Q1';
    } else if (temp === '04') {
      quarter = 'Q2';
    } else if (temp === '07') {
      quarter = 'Q3';
    } else if (temp === '10') {
      quarter = 'Q4';
    }
    
    return item[0].substring(0, 4) + ' ' + quarter;
  })

  const yearsArray = dataset.map((item) => new Date(item[0]));
  const datasetYearsArray = dataset.map((item) => item[0]);
  const gdpArray = dataset.map((item) => item[1]);
  
  const maxYear = d3.max(yearsArray);
  const minYear = d3.min(yearsArray);
  const maxGDP = d3.max(gdpArray);
  
  const linearScale = d3.scaleLinear()
                        .domain([0, maxGDP])
                        .range([0, height]);
  const scaledGDP = gdpArray.map((item) => linearScale(item));
  
  const xScale = d3.scaleTime()
                   .domain([minYear, maxYear])
                   .range([0, width]);

  const yScale = d3.scaleLinear()
                   .domain([0, maxGDP])
                   .range([height, 0]);
  
  const gdpScale = d3.scaleLinear()
                     .domain([0, maxGDP])
                     .range([0, height])

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  svg.append('g')
     .attr('transform', 'translate(' + padding + ', 0)')
     .call(yAxis)
     .attr('id', 'y-axis')
  
  svg.append('g')
     .attr('transform', 'translate(' + padding + ', ' + (height) + ')')
     .call(xAxis)
     .attr('id', 'x-axis');
  
  svg.selectAll('rect')
     .data(scaledGDP)
     .enter()
     .append('rect')
     .attr('x', (d, i) => i*barwidth + padding)
     .attr('y', (d, i) => height - d)
     .attr('width', barwidth)
     .attr('height', (d) => d)
     .attr('class', 'bar')
     .attr('data-date', (d, i) => datasetYearsArray[i])
     .attr('data-gdp', (d, i) => gdpArray[i])
     .on('mouseover', (d, i) => {
            tooltip.html(tooltipYearsArray[i] + '<br>' + '$' + gdpArray[i] + ' Billion')
               .attr('data-date', datasetYearsArray[i])
               .style('left', (i*barwidth) + 160 + 'px')
               .style('top', (height - d + 20) + 'px')
               .style('transform', 'translateX(60px)')
               .transition()
               .duration(200)
               .style('opacity', 0.9)
      })
      .on('mouseout', (d) => {
          tooltip.transition()
                 .duration(200)
                 .style('opacity', 0)
      })
  
  svg.append('text')
     .attr('x', -240)
     .attr('y', 80)
     .attr('transform', 'rotate(-90)')
     .text('Gross Domestic Product ($ billions)');
  
  svg.append('text')
     .attr('x', 500)
     .attr('y', height + 50)
     .text('Data Source: Free Code Camp');
  
};