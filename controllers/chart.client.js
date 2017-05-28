var answer_types = window.answer_types;
var answer_counts = window.answer_counts;
var answer_colours = window.answer_colours;
var chart_type = window.chart_type;


var barChartOptions =  {
    legend:{
        display:false
    },
    scales: {
        yAxes: [{
            labelString: 'Number of votes',
            ticks: {
                min:0,
                max: Math.max(...answer_counts ) + 1,
                beginAtZero:true,
                stepWidth:1

            }
        }]
    }
}

console.log( answer_types);
console.log(answer_colours);
console.log(answer_counts);

var options = Chart.defaults[chart_type];
if (chart_type.match(/(bar|radar|line)/)){
    options = $.extend({}, options, barChartOptions);
}
if (chart_type=="line" | chart_type=="radar"){
    answer_colours = "#06f7c5";
}

var ctx = document.getElementById("myChart").getContext('2d');
ctx.height = 100;
Chart.defaults.global.defaultColor = answer_colours[0];

var myChart = new Chart(ctx, {
    type: chart_type,
    data: {
        labels: answer_types,
        fill: true,
        datasets: [{
            data: answer_counts,
            backgroundColor: answer_colours,
            borderColor: "black",
            borderWidth: 1
        }]
    },
    maintainAspectRatio: false,
    options:options
});
