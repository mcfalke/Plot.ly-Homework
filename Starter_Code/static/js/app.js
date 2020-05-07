// Fetch JSON data and console log it
    d3.json("./samples.json").then((data) => {

    // Looping through dataset and putting the key values in the dropdown
    data.names.forEach(key => d3.select('#selDataset').append("option").text(key));

    // On dropdown selection change, update data
    d3.selectAll("#selDataset").on("change", updateData);

    // Filter data to match selected value within metadata
    function filterMetadata(metadataObject) {
        return d3.select('#selDataset').property("value") == metadataObject.id;
    }
    
    // Filter the samples
    function filterSamples(sampleObject) {
        return d3.select('#selDataset').property("value") == sampleObject.id;
    }
    
    // Update the content of the "Demographic Info" section
    function updateDemographicInfo(filteredData) {
        var div_sample_metadata = d3.select('#sample-metadata');

        // clear out the demographic info area
        div_sample_metadata.html("");

        // iterate through the filtered object to get each key-value pair
        Object.entries(filteredData).forEach(([key, value]) => {
            var row = div_sample_metadata.append("tr");
            var cell = row.append("td");
            cell.text(`${key}: ${value}`);
        });
    }
    
    // Assign the value of the dropdown menu option to a variable
    function updateData() {
        var filteredMetadata = data.metadata.filter(filterMetadata)[0];
        var filteredSamples = data.samples.filter(filterSamples)[0];
        console.log("filteredMetadata", filteredMetadata);
        console.log("filteredSamples", filteredSamples);
        updateDemographicInfo(filteredMetadata);
        updateHorizontalBarChart(filteredSamples);
        updateBubbleChart(filteredSamples);
    }

// Build charts using the filtered datasets

// Create a horizontal bar chart with a dropdown menu to display the top 10
// OTUs found in that individual.
function updateHorizontalBarChart(filteredSamples) {
        //Grab values from json object for bar plot
    var trace1 = {
        x: filteredSamples.sample_values.slice(0, 10),
        y: filteredSamples.otu_ids.slice(0, 10),
        text: filteredSamples.otu_labels,
        type: "bar",
        orientation: "h"
    };
    var data1 = [trace1];
    var layout1 = {
        title: "Top 10 OTUs",
      };

        // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar", data1, layout1);
}

    // var top10 = filteredSamples.slice(0, 10).reverse();
    // console.log(top10);
   
});

function updateBubbleChart(filteredSamples) {
    var trace2 = {
        x: filteredSamples.otu_ids,
        y: filteredSamples.sample_values,
        // text: filteredSamples.otu_labels,
        mode: 'markers',
        marker: {
            color: filteredSamples.otu_ids,
            size: filteredSamples.sample_values
        }
    };
    var data2 = [trace2];
    var layout2 = {
        title: "OTU ID",
        showlegend: false,
        height: 500,
        width: 900
      };

        // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bubble", data2, layout2);
}


  