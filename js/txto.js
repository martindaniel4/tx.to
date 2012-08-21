	var tab =[],
		mot = ".*";

	
d3.csv("data/txto.csv", function(data) {
  
     var  date_format = d3.time.format("%d %b %Y"),
	  date_day_format = d3.time.format("%d");
  

data.forEach(function(d) {

	{

	tab.push({

	body : d.body,
	date: new Date(parseFloat(d.date)),
	hour: d.hour,
	month: new Date(parseFloat(d.date)).getMonth(),
	day: new Date(parseFloat(d.date)).getDate(),
	day_week: new Date(parseFloat(d.date)).getDay(),
	year: new Date(parseFloat(d.date)).getYear(),
	length: d.body.length,
	type:d.type
	
			})
  
	}
	
  });
  
  
 // data wrangling 
 
 var nest = d3.nest().key(function(d) {return d.type;}).map(tab);  
 
 console.log(nest);
 
 var day_week = d3.nest().key(function(d) {return d.day_week;}).rollup(function(d) {return d.length;}).entries(tab);
 
// var scale_time = d3.scale.linear().domain([0,23]).rangeRound([0,10]); // un scale_time pour transformer les heures en 7 sous ensembles
 
 var day_hour = d3.nest().key(function(d) {return (d.hour);}).rollup(function(d) {return d.length;}).entries(tab);
  
 day_week[0].key="Sunday";
day_week[1].key="Monday";
day_week[2].key="Tuesday";
 
 var sunday = day_week.slice(0,1);
 
 day_week.shift();
 
 day_week.push(sunday[0]);
 
  // scales
  
  var margin = 10,
	  h = 50,
	  w = 100,
	  min_day = d3.min(day_week, function(d) {return d.values;}),
	  max_day = d3.max(day_week, function(d) {return d.values;}),
      height_day = d3.scale.linear().domain([min_day, max_day]).range([10,100]),
	  x_day = d3.scale.linear().domain([0, day_week.length]).range([0 , w ]),
	  y_day = d3.scale.linear().domain([0, max_day]).range([0 , h]);
	 
	  
 var min_hour = d3.min(day_hour, function(d) {return d.values;}),
	  max_hour = d3.max(day_hour, function(d) {return d.values;}),
      height_hour = d3.scale.linear().domain([min_hour, max_hour]).range([10,100]),
	  x_hour = d3.scale.linear().domain([0, 24]).range([0 , w]),
	  y_hour = d3.scale.linear().domain([min_hour, max_hour]).range([0 , h ]);
 
 var line_day = d3.svg.line()
    .x(function(d,i) { return x_day(i); })
    .y(function(d) { return - 1 * y_day(d.values);});
 
 var line_hour = d3.svg.line()
    .x(function(d,i) { return x_hour(i); })
    .y(function(d) { return - 1 * y_hour(d.values);});
 
  var texts = d3.select("#texts").selectAll(".texts")
	.data(tab),
	lui = nest[1];
	moi = nest[2];
	
	texts.enter().append("div")
	.attr("class", function(d) {  
	
	if ( d.type == 1) {return "lui";}
	
		else 
		
			{ return "moi";}
	})
	
	.text(function(d) {return d.body + " " +date_format(d.date) ;});
	
  
  d3.select("#nombre").select(".sender").append("text").text(lui.length);
  d3.select("#nombre").select(".receiver").append("text").text(moi.length);
  
  d3.select("#longueur").select(".sender").append("text").text(d3.mean(lui, function(d) { return (d.length);}).toFixed(1));
  d3.select("#longueur").select(".receiver").append("text").text(d3.mean(moi, function(d) { return d.length;}).toFixed(1));
  
  // building graph1
  
    
 var graph1 = d3.select("#graph1").append("svg:svg")
				.attr("height", h*1.5)
				.attr("width",200)
			.append("svg:g");
			
 var graph2 = d3.select("#graph2").append("svg:svg")
				.attr("height", h*1.5)
				.attr("width",200)
				.append("svg:g");
  // axes
  
 var rules = graph1.selectAll("g.rule")
	.data(y_day.ticks(3))
  .enter().append("svg:g")
	.attr("class","rule");
  
  rules.append("svg:line")
	.attr("y1", y_day)
	.attr("y2", y_day)
	.attr("x1", 0)
	.attr("x2", w-1)
  
  // Bars
  
  /*graph1.selectAll("rect")
	.data(day_week)
  .enter().append("svg:rect")
	.attr("y", function(d) {return 100 - y_day(d.values);})
	.attr("width", 10)
	.attr("height", function(d) {console.log(d); return y_day(d.values);})
	.attr("x", function(d, i) {return x_day(i) });
  
  */
  
  // Line
  
  var g1 = graph1.append("svg:g")
			.attr("transform","translate(0,"+h+")");
  
  g1.append("svg:path")
	.attr("d", line_day(day_week))
	.attr("class","line");

  graph1.selectAll("text")
	.data(day_week)
  .enter().append("svg:text")
	.attr("y", h + 20 )
	.attr("x", function(d,i) {return x_day(i);})
	.text(function(d) {return (d.key).substring(0,1);});

 
 // Barchart
 
 /*
  graph2.selectAll("rect")
	.data(day_hour)
  .enter().append("svg:rect")
	.attr("y", function(d) {return 100 - y_hour(d.values);})
	.attr("width", 10)
	.attr("height", function(d) {console.log(d); return y_hour(d.values);})
	.attr("x", function(d, i) {return x_hour(i) });
 */


//Line Graph2

 var rules2 = graph2.selectAll("g.rule")
	.data(y_hour.ticks(5))
  .enter().append("svg:g")
	.attr("class","rule");
  
  rules2.append("svg:line")
	.attr("y1", y_hour)
	.attr("y2", y_hour)
	.attr("x1", 0)
	.attr("x2", w-1)
	
	 var g2 = graph2.append("svg:g")
			.attr("transform","translate(0,"+h+")");
 
 g2.append("svg:path")
	.attr("d", line_hour(day_hour))
	.attr("class","line");
 
  graph2.selectAll("text")
	.data(d3.scale.linear().domain([0,23]).ticks(5))
  .enter().append("svg:text")
	.attr("y", h + 20)
	.attr("x", function(d) {return x_hour(d);})
	.text(function(d) {return d;});
  
/* var nest = d3.nest().key(function(d) {return d.type;}).map(tab);  
  
  var nest_date = d3.nest()
						.key(function(d) {return d.year;})
						.key(function(d) {return d.month;})
						.entries(tab);  
						
  var jeanne = nest[1],
	  martin = nest[2];
   var nest_length= d3.nest().key(function(d) {return d.length;}).map(tab);
  var duree = ((tab[tab.length-1].date-tab[0].date)/(3600*1000))/24;
  
  // nombre de textos par jour
  
  //console.log("jeanne :"+jeanne.length/duree)
  //console.log("martin :"+martin.length/duree)
  
  // heure moyenne d'envoi de textos
  
	//console.log("jeanne :"+d3.mean(jeanne, function(d, i) { return d.hour;}))
	//console.log("jeanne :"+d3.mean(martin, function(d, i) { return d.hour;}))
  
  // nombre moyen, max de taille de caractère txtos envoyés
  
	//console.log("jeanne :"+d3.mean(jeanne, function(d, i) { return d.length;}))
	//console.log("martin :"+d3.mean(martin, function(d) {return d.length;}))
	//console.log(d3.mean(martin, function(d) {return length;})
  
var main = d3.select("#body").append("svg:svg");

 // Min / Max :  

var max = d3.max(tab, function(d) {return d.length;});

var width = d3.scale.linear().domain([10, max]).range([2, 5]),
	year_scale = d3.scale.linear().domain([111, 112]).range([-10, 700]),
	month_format = d3.time.format("%b"),
	date_format = d3.time.format("%d %b %Y");

function time_scale(d,m,y) {
	
	var mois = m,
	 scale = d3.time.scale().domain([new Date("0"+m+"/"+"01"+"/"+y), new Date("0"+m+"/"+"30"+"/"+y)]).range([0,500]);
	 
	return scale(d);
	
	}
	
var year = main.selectAll(".year")
	.data(nest_date)
	.enter().append("svg:g")
	.attr("class", "text")
	.attr("transform", function(d) { return "translate(" + year_scale(d.key) + "," + 30 + ")"; })
	
year.append("text").text(function(d) {return "2" + d.key-100;}).attr("x", 400)
	
var month = year.selectAll(".month")
	.data(function(d) {return d.values;})
	.enter().append("svg:g")
	.attr("class", "month");
	
month.append("svg:text")
	.attr("y", function(d) {return d.key*50 + 30;})
	.attr("x", 30)
	.attr("class", "legend")
	.text(function(d) {return month_format(new Date((parseFloat(d.key)+1).toString()));})

var day = month.selectAll("circle")
	.data(function(d) {return d.values;})
	.enter().append("svg:circle")
	.attr("cx", function(d) {return time_scale(d.date,d.month+1,"2"+d.year-100) + d.year;})
	.attr("cy", function(d) {return d.month * 50 + 30 ;})
	.attr("r", function(d) {return width(d.length);})
	.on("mouseover", function(d) { 
	
	d3.select(this).attr("opacity", 0.6);
	d3.select("#text").append("text").text(d.body + " le :"+date_format(d.date));})
	.on("mouseout", function(d) { 
	
	d3.select(this).attr("opacity", 1);
	d3.select("#text").selectAll("text").remove();})
	.attr("fill", function(d) {  
	
	if ( d.type == 1) {return "red";}
	
		else 
		
			{ return "blue";}
	})*/
  
});