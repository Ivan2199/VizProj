document.addEventListener("DOMContentLoaded", function () {
  var logoDiv = d3.select(".logo");

  logoDiv
    .append("img")
    .attr("src", "./assets/soccerPlayer.png")
    .attr("alt", "Soccer Player Image")
    .style("width", "80px")
    .style("height", "80px")
    .style("margin-left", "50px")
    .style("margin-right", "50px");
});
