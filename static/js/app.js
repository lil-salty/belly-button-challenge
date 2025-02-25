// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let objId = metadata.filter(item => item.id === sample);
    let sampleData = objId[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleData).forEach(([key, value]) => {
    panel.append('h6').text(`${key.toUpperCase()}: ${value}`);

    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter(item => item.id === sample);
    let sampleId = filteredSample[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleId.otu_ids;
    let otu_labels = sampleId.otu_labels;
    let sample_values = sampleId.sample_values;
    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Electric"
      }
    };

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    }

    // Render the Bubble Chart
    Plotly.newPlot('bubble', trace1, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately
    let otu_ids_top = otu_ids.slice(0, 10).reverse();
    let otu_labels_top = otu_labels.slice(0, 10).reverse();
    let sample_values_top = sample_values.slice(0, 10).reverse();

    let yticks = otu_ids_top.map(id => `OTU ${id}`);

    // Build a Bar Chart
    let trace2 = {
      x: sample_values_top,
      y: yticks,
      text: otu_labels_top,
      type: "bar",
      orientation: "h",
      marker: {
        color: otu_ids_top,
        colorscale: "Portland"
      }
    };

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      margin: { t: 45, 1: 175 },
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', trace2, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdownMenu = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    dropdownMenu.selectAll('option')
      .data(names)
      .enter()
      .append('option')
      .text(d => d)
      .attr('value', d => d);
    d3.select('#selDataset').on('change', function() {
      let sampleName = d3.select(this).property('value');
      buildCharts(sampleName);
      buildMetadata(sampleName*1);
    });

    // Get the first sample from the list
    let firstSample = dropdownMenu.property('value');

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample*1);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample*1);
}

// Initialize the dashboard
init();
