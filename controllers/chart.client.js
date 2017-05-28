var answer_types = window.answer_types;
var answer_counts = window.answer_counts;
var answer_colours = window.answer_colours;


console.log( answer_types);
console.log(answer_colours);
console.log(answer_counts);


var ctx = document.getElementById("myChart").getContext('2d');
ctx.height = 100;
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: answer_types,
        datasets: [{
            data: answer_counts,
            backgroundColor: answer_colours,
            borderColor: "black",
            borderWidth: 1
        }]
    },
    maintainAspectRatio: false,
    options: {
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
});
