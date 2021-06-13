function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples; 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samplesArray.filter(object => object.id == sample);
    
    // 5. Create a variable that holds the first sample in the array.
    var result = filteredSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      firstSample = data.samples[0];
    
      var otuIds = result.otu_ids;
      var otuLabels = result.otu_labels;
      var sampleValues = result.sample_values;
        
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topOtuIds = otuIds.sort((a, b) => b.otu_ids - a.otu_ids);
    console.log(topOtuIds);
  
    var slicedOtuIds = topOtuIds.slice(0, 10);
    console.log(slicedOtuIds);
    
    // Must map to isolate sliced numbers in order to sort.
    var mapotuids = slicedOtuIds.map(otu_id => `otu ${otu_id}`)

    var reverseOtuIds = mapotuids.reverse();
    console.log(reverseOtuIds);
  
    var yticks = reverseOtuIds;
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
   var trace = {
      
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
    
      name: "Bellybutton",
      type: "bar",
      orientation: "h"
    }
  
    var barData = [trace];
  
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: otuIds,
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
   
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues
    }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: {
          text: "OTU ID",
        }
      }
    };

  //  3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  //});
//}
    var wfreqArray = data.metadata; 
    var filteredWfreq = wfreqArray.filter(sampleObj => sampleObj.id == sample);
    var resultfreq = filteredWfreq[0];
    var wfreq = parseInt(resultfreq.wfreq);

    var gaugeData = [
    {
      domain: { x: [0, 1], y: [0, 1]},
      value: wfreq,
      title: 
        {text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {axis: {range: [null, 10], tickwidth: 2, tickcolor: "black"},
        bar: {color:"black"},
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "darkgreen"}
        ]}
    }
  ];

// 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width:600, 
      height: 500, 
      margin: {t: 0, b: 0},
      font: {color: "black", family: "Arial"}
    };

// 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
});
}