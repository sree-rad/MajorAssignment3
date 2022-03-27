function scatter_plot(X,Y,markersize,
                      ColorData,
                      axis_key,
                      title="",
                      xLabel="",
                      yLabel="",
                      margin = 100,
                      inputdata)
{
    function data_axis_pad(data,pad=.05){
        return [data[0]-pad*data[0], data[1]+pad*data[1] ]
    }



    let xScale= d3.scaleLinear().domain(data_axis_pad(d3.extent(X))).range([0+margin,1000-margin])
    let yScale= d3.scaleLinear().domain(data_axis_pad(d3.extent(Y))).range([1000-margin,0 + margin])
    let colorScale= d3.scaleLinear().domain(d3.extent(ColorData)).range(['steelblue','brown'])
    
    let axis = d3.select(`#${axis_key}`)

    const maxFlipperLength = Math.max(...d3.map(inputdata,d=>+d.flipper_length_mm)) + 10;
    let radiusScale= d3.scaleLinear().domain([0, maxFlipperLength]).range([5,10]);

    axis.selectAll('.markers')
        .data(X)
        .enter()
        .append('g')
        .attr('transform', function(d,i) {
            return `translate(${xScale(X[i])}, ${yScale(Y[i])})`})
        .append('circle').attr("r",(d,i)=> radiusScale(inputdata[i].flipper_length_mm))
        .attr("class",(d,i)=> inputdata[i].island)
        .style("fill",function (d,i){return colorScale(ColorData[i])})

    // x and y Axis function
    let x_axis = d3.axisBottom(xScale).ticks(4)
    let y_axis = d3.axisLeft(yScale).ticks(4)
    //X Axis
    axis.append("g").attr("class","axis")
        .attr("transform", `translate(${0},${1000-margin})`)
        .call(x_axis)
    // Y Axis
    axis.append("g").attr("class","axis")
        .attr("transform", `translate(${margin},${0})`)
        .call(y_axis)
    // Labels
    axis.append("g").attr("class","label")
        .attr("transform", `translate(${500},${1000-10})`)
        .append("text")
        .attr("class","label")
        .attr("text-anchor","middle")
        .text(xLabel)

    axis.append("g")
        .attr("transform", `translate(${35},${500}) rotate(270)`)
        .append("text")
        .attr("class","label")
        .attr("text-anchor","middle")
        .text(yLabel)



    // Title
    axis.append('text')
        .attr('x',550)
        .attr('y',60)
        .attr("text-anchor","middle")
        .text(title)
        .attr("class","plotTitle")

    // Add a legend (interactive)
    d3.select("#main")
        .selectAll("myLegend")
        .data(new Set(ColorData))
        .enter()
        .append('g')
        .append("text")
        .attr('x', function (d, i) { return 200 + i * 300 })
        .attr('y', 130)
        .text(d=>codeToIsland(d))
        .style("fill", function (d) { return colorScale(d) })
        .style("font-size", 50)
        .on("click", function (d,i) {
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + codeToIsland(i)).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + codeToIsland(i)).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
        })

    function codeToIsland(code) {
        if (code == 0) return 'Torgersen'; 
        else if (code == 1) return 'Biscoe'; 
        else return 'Dream';
    }

}