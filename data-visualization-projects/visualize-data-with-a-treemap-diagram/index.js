projectName = "tree-map";

const setData = (toggle) => {
  const datasets = {
    videogames:{
      title: "Video Game Sales",
      description: "Top 100 Most Sold Video Games Grouped by Platform",
      url:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
  },
    movies:{
      title: "Movie Sales",
      description: "Top 100 Highest Grossing Movies Grouped By Genre",
      url:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
  },
    kickstarter:{
      title: "Kickstarter Pledges",
      description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
      url:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
  }};
  
  let dataset;
  
  if (toggle === 'kickstarter') {
    dataset = datasets.kickstarter;
  } else if (toggle === 'movie') {
    dataset = datasets.movies;
  } else if (toggle === 'game') {
    dataset = datasets.videogames;
  } else {
    console.log('Error');
  }
  
  const getData = ((dataset) => {
    const request = new XMLHttpRequest();
    request.open('GET', dataset.url, true);
    request.send();
    request.onload = () => {
      requestCallback(JSON.parse(request.responseText), dataset.title, dataset.description);
    };
  })(dataset);
}

//When window loads it will go to default Kickstarter treemap
window.onload = () => setData('game');

const requestCallback = (data, title, description) => {
  //Restart canvas when a new button is pressed
  document.getElementById('title').innerHTML = '';
  document.getElementById('description').innerHTML = '';
  document.getElementById('chart').innerHTML = '';
  document.getElementById('legend').innerHTML = '';
  
  //Add title
  d3.select('#title')
    .text(title)

  //Add description
  d3.select('#description')
    .text(description)

  const width = 900;
  const height = 600;
  
  const tooltip = d3.select('#chart')
    .append('div')
    .attr('id', 'tooltip')
  
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  
  //Color scale
  const colorScale = d3.scaleOrdinal().range(d3.schemeCategory20);
  
  //Hierarchical data needs to be send through d3.hierarchy object
  const root = d3.hierarchy(data)
    .eachBefore(d => {d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name})
    .sum(d => d.value) //Traverses tree and sets value on each node to sum of its children
    .sort((a, b) => b.value - a.value)
  
  console.log(root.descendants());

  //Sets layout of our hierarchy object to treemap
  const treemapLayout = d3.treemap()
    .size([width, height])
    .paddingInner(1)
  
  //Pass hierarchy object to the layout which adds 4 propertyes x0, x1, y0, y1 to each node which specify the dimensions of each rectangle in the map
  treemapLayout(root);
  
  //Add leaves to svg
  const cell = svg.selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('class', 'leaves')
    .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
  
  const moneyFormat = d3.format(",");
  
  const tile = cell.append('rect')
    .attr('id', d => d.data.id)
    .attr('class', 'tile')
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('fill', d => colorScale(d.data.category))
    .on('mouseover', d => {
      tooltip.style('opacity', .9)
        .style('display', 'block')
        .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: $${title[0] === "V" ? moneyFormat(d.data.value) + 'M' : moneyFormat(d.data.value)}`)
        .attr('data-value', d.data.value)
        .style('top', d.y1 + 'px')
        .style('left', d.x1 + 'px')
      })
    .on('mouseout', d => {
      tooltip.style('opacity', 0)
      })

  cell.append('text')
    .attr('class', 'tile-text')
    .selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 13 + i * 10)
    .text(d => d)

  //Legend
  const legend = d3.select('#legend')
    .append('svg')
    .attr('width', width)
    .attr('height', (data.children.length * 35) + 25)
  
  legend.selectAll('rect')
    .data(colorScale.range().slice(0, data.children.length))
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('height', 20)
    .attr('width', 20)
    .attr('x', 20)
    .attr('y', (d, i) => i * 35)
    .attr('fill', d => d)
  
  const videoGameCategories = root.descendants()[0].children.map(x => x.data.name);
  
  legend.selectAll('text')
    .data(title[0] === 'V' ? videoGameCategories : data.children.map(d => d.name))
    .enter()
    .append('text')
    .text(d => d)
    .attr('x', 45)
    .attr('y', (d, i) => (i * 35) + 15)
    .attr('fill', 'black')
  
}