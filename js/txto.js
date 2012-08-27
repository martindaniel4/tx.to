	var tab =[],
		mot = ".*",
		margin_left = 25,
		h_graph = 50,
		h_graph_line = 20,
		w = 300,
		r = 5,
		w_graph = 80,
		h_bloc = 120,
		offset_2 = w/2*1.3 ,
		pourcent = d3.format("%"),
		un = "Cyrano",
		deux="Le Bret",
		numero=123;

// Titre

var titre = d3.select("#titre").append("svg:svg")
		.attr("width", w)
		.attr("height", 100)
			.append("g")
		.attr("transform", "translate("+ 0 +"," + 20 + ")")

txto = titre.append("g");

txto.append("text").text("Tx.to")
	.attr("x",margin_left)
	.attr("y",62)
	.attr("class","txto");

titre.append("svg:line")
	.attr("x1",160)
	.attr("x2",160)
	.attr("y1",20)
	.attr("y2",70)
	.attr("stroke","black")
	.attr("stroke-width",3)
	.attr("shape-rendering","CrispEdges")

var nom = titre.append("g")
		.attr("transform", "translate("+ offset_2 +"," + 0 + ")")
		.attr("class","nom");
	
nom.append("text").text(un)
		.attr("y",40)
		.attr("x", 0);

nom.append("svg:circle")
	.attr("cx", -10)
	.attr("cy",32)
	.attr("r",r)
	.attr("fill","black");
	
var titre_2 = nom.append("g")
	 .attr("transform", "translate("+ 0 +"," + 60 + ")")
	
titre_2.append("text").text(deux)
		.attr("x", 0 )
		.attr("y", 10);
		
titre_2.append("svg:circle")
	.attr("cx",-10)
	.attr("cy",3)
	.attr("r",r)
	.attr("stroke","black")
	.attr("stroke-width",2)
	.attr("fill","none");
	
	
// Calculs des metrics & data wrangling
	
d3.csv("data/txto.csv", function(data) {
  
     var  date_format = d3.time.format("Le %d à %Hh%M"),
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
  
 var type = d3.nest().key(function(d) {return d.type;}).entries(tab);
 
 type.forEach(function(d,i) {if ((d.key!=1)&&(d.key!=2)) {type.splice(i,i+1)} }) 
 
 var    jours = ["Mon, 13 Aug 2012 00:00:00 GMT",
"Tue, 14 Aug 2012 00:00:00 GMT",
"Wed, 15 Aug 2012 00:00:00 GMT",
"Thu, 16 Aug 2012 00:00:00 GMT",
"Fri, 17 Aug 2012 00:00:00 GMT",
"Sat, 18 Aug 2012 00:00:00 GMT",
"Sun, 19 Aug 2012 00:00:00 GMT"],

jours_f = [{
	a : "Mon",
	f : "lundi"
}, {
	a : "Tue",
	f : "mardi"
}, {
	a : "Wed",
	f : "mercredi"
}, {
	a : "Thu",
	f : "jeudi"
}, {
	a : "Fri",
	f : "vendredi"
}, {
	a : "Sat",
	f : "samedi"
}, {
	a : "Sun",
	f : "dimanche"
}],
    
    format_days = d3.time.format("%a"),
    format_month = d3.time.format("%b  %Y")
    month = d3.nest().key(function(d) {return format_month(d.date);}).rollup(function(d) {return d.length;}).entries(tab),
    text_month = d3.nest().key(function(d) {return format_month(d.date);}).map(tab),
    day_week = d3.nest().key(function(d) {return format_days(d.date);}).rollup(function(d) {return d.length;}).entries(tab),
	day_hour = d3.nest().key(function(d) {return (d.hour);}).rollup(function(d) {return d.length;}).entries(tab),
	correspondance = d3.nest().key(function(d) {return d.a;}).rollup(function(d) {return d[0].f;}).map(jours_f),
	days = {},
	hours = {},
	metrics_days = [],
    metrics_hours = [],
	metrics = [];
		
type.forEach(function(d, i) {

metrics.push({
	
type:d.key,
nombre:d.values.length,
longueur:parseFloat(d3.mean(d.values,function(z){return z.body.length;}).toFixed(1))
})
	
}
	
)
	

jours.forEach(function(d, i) {

days[format_days(new Date(jours[i]))] = {

value: 0,
day:format_days(new Date(jours[i])),
rang:i

}

})
	
day_week.forEach(
 	
 	function(d) {
 		
 		if (d.key == days[d.key].day) {
 	
 		days[d.key].value = d.values
 				
 		}
 		
 	}
 )
 
 Object.keys(days).forEach(function(d) {
 	 	
 	metrics_days.push({
 	
 	day:days[d].day,
 	rang:days[d].rang,
 	values:days[d].value
 	
 })
})
 
 metrics_days.sort(function(a,b) {return a.rang - b.rang;})
 
 d3.range(0,25).forEach(function(d) {
 	
    hours[d] = {
    	
    hour:d,
    value: 0
    	
    }
 	
 })
 
day_hour.forEach(
 	
 	function(d) {
 		
 		if (d.key == hours[d.key].hour) {
 	
 		hours[d.key].value = d.values
 				
 		}
 		
 	}
 )
 
  Object.keys(hours).forEach(function(d) {
 	 	
 	metrics_hours.push({
 	
 	hour:hours[d].hour,
 	values:hours[d].value
 	
 })
})

  // Nombre de textos envoyés
  
  var max_nombre = d3.max(metrics, function(d) {return d.nombre;}),
      w_nombre = d3.scale.linear().domain([0, max_nombre]).range([0,80]), 
  
      nombre = d3.select("#nombre").append("svg:svg")
  		.attr("width",w)
  		.attr("height",h_bloc);
  		
  nombre.append("text").text(tab.length)
  		.attr("x",margin_left)
  		.attr("y",30)
  		.attr("class","titre")
  		
  var nombre_l = nombre.append("g")
  		.attr("transform", "translate("+margin_left*4+"," + 16 + ")")
  		.attr("class","legende");
  		
  nombre_l.append("text").text("textos")
  
  nombre_l.append("text").text("échangés").attr("y",15)
  
  var nombre_g = nombre.append("g")
  					.attr("transform", "translate("+ 0 +"," + 10 + ")");
  
  nombre_g.selectAll("circle")
  	.data(metrics)
 .enter().append("svg:circle")
 	.attr("r",r)
 	.attr("cy",function(d, i) {return i * 25 + 49; })
 	.attr("cx",55)
 	.attr("class", function(d) {if (d.type == 1) {return "circle_1";} else {return "circle_2";}})

  nombre_g.selectAll("rect")
  	.data(metrics)
 .enter().append("svg:rect")
 	.attr("width",function(d) {return w_nombre(d.nombre);})
 	.attr("height",10)
 	.attr("y",function(d, i) {return i * 25 + 44; })
 	.attr("x",70)
 	
  nombre_g.selectAll("g.text")
  	.data(metrics)
 .enter().append("svg:text")
 	.text(function(d) {return d.nombre;})
 	.attr("y",function(d, i) {return i * 25 + 53; })
 	.attr("x",160)
 

 // Longueur moyenne des textos
  
  var max_longueur = d3.max(metrics, function(d) {return d.longueur;}),
      w_longueur = d3.scale.linear().domain([0, max_longueur]).range([0,80]), 
  
      longueur = d3.select("#longueur").append("svg:svg")
  		.attr("width",w)
  		.attr("height",h_bloc);
  		
  longueur.append("text").text((d3.mean(tab,function(d) {return d.body.length;})).toFixed(1))
  		.attr("x",margin_left)
  		.attr("y",30)
  		.attr("class","titre")
  		
  var longueur_l = longueur.append("g")
  		.attr("transform", "translate("+margin_left*4+"," + 16 + ")")
  		.attr("class","legende");
  		
  longueur_l.append("text").text("longueur")
  
  longueur_l.append("text").text("moyenne").attr("y",15)
  
  var longueur_g = longueur.append("g")
  					.attr("transform", "translate("+ 0 +"," + 10 + ")");
  
  longueur_g.selectAll("circle")
  	.data(metrics)
 .enter().append("svg:circle")
 	.attr("r",r)
 	.attr("cy",function(d, i) {return i * 25 + 49; })
 	.attr("cx",55)
 	.attr("class", function(d) {if (d.type == 1) {return "circle_1";} else {return "circle_2";}})

  longueur_g.selectAll("rect")
  	.data(metrics)
 .enter().append("svg:rect")
 	.attr("width",function(d) {return w_longueur(d.longueur);})
 	.attr("height",10)
 	.attr("y",function(d, i) {return i * 25 + 44; })
 	.attr("x",70)
 	
  longueur_g.selectAll("g.text")
  	.data(metrics)
 .enter().append("svg:text")
 	.text(function(d) {return d.longueur;})
 	.attr("y",function(d, i) {return i * 25 + 53; })
 	.attr("x",160)
 	 
  // Graphe de distribution par jour de la semaine
  
  var max_day = d3.max(metrics_days, function(d) {return d.values;}),
 	  subarray_days = [],
      height_day = d3.scale.linear().domain([0, max_day]).range([10,100]),
	  x_day = d3.scale.linear().domain([0, 6]).range([0 , w_graph ]),
	  y_day = d3.scale.linear().domain([0, max_day]).range([0 , h_graph_line]);
	  
	metrics_days.forEach(function(d, i) {
	  	
	  	subarray_days[i]=d.values
	  	
	  }
	  	
	  	
	  )
	  
var pos_max_day = subarray_days.indexOf(d3.max(subarray_days));

 var line_day = d3.svg.line()
    .x(function(d,i) { return x_day(i); })
    .y(function(d) { return - 1 * y_day(d.values);});
 
 
 var distrib1 = d3.select("#graph1").append("svg:svg")
				.attr("height", h_graph*1.8)
				.attr("width",300)
 
 var graph1 = distrib1
			.append("svg:g");
   
  var g1 = graph1.append("svg:g")
			.attr("transform","translate(0,"+h_graph*0.9+")");
  
  g1.append("svg:path")
	.attr("d", line_day(metrics_days))
	.attr("class","line");


var rules1 = graph1.selectAll("g.rule")
	.data(metrics_days)
  .enter().append("svg:g")
  	.attr("transform","translate(0,"+h_graph*0.9+")")
	.attr("class","rule");

  rules1.append("svg:text")
	.attr("y", 40 )
	.attr("x", function(d,i) {return x_day(i);})
	.text(function(d) {return (d.day).substring(0,1);});

  rules1.append("svg:line")
	.attr("x1", function(d,i) {return x_day(i) + 4;})
	.attr("x2", function(d,i) {return x_day(i) + 4;})
	.attr("y1", 25 )
	.attr("y2", 20 )
	.attr("class","line");

g1.append("svg:circle")
	.attr("cy", - y_day(subarray_days[pos_max_day]))
	.attr("cx", x_day(pos_max_day))
	.attr("r",r)
	
 var graph1_l = distrib1
			.append("svg:g")
			.attr("transform","translate("+w_graph*1.2+","+0+")");
			
graph1_l.append("text")
	.attr("y",h_graph*0.9)
	.text(pourcent(subarray_days[pos_max_day]/d3.sum(subarray_days)))
	.attr("class","titre");

graph1_l.append("text").text("envoyés")
	.attr("y",h_graph*0.6)
	.attr("x",80)
	.attr("class","legende")
	
graph1_l.append("text").text(correspondance[metrics_days[pos_max_day].day])
	.attr("y",h_graph*0.9)
	.attr("x",80)
	.attr("class","legende")

// Graphe de distribution par heure

 var  max_hour = d3.max(day_hour, function(d) {return d.values;}),
  	  subarray_hours = [],
      height_hour = d3.scale.linear().domain([0, max_hour]).range([10,100]),
	  x_hour = d3.scale.linear().domain([0, 23]).range([0 , w_graph]),
	  x_hour_inter = d3.scale.linear().domain([0,23]).ticks(6),
	  y_hour = d3.scale.linear().domain([0, max_hour]).range([0 , h_graph_line]);


day_hour.forEach(function(d, i) {
	  	
	  	subarray_hours[i]=d.values
	  	
	})


var pos_max_hour = subarray_hours.indexOf(d3.max(subarray_hours));

 var line_hour = d3.svg.line()
    .x(function(d,i) { return x_hour(i); })
    .y(function(d) { return - 1 * y_hour(d.values);});
    
    
 var distrib2 = d3.select("#graph2").append("svg:svg")
				.attr("height", h_graph*1.5)
				.attr("width",300),
   
     graph2 = distrib2.append("svg:g")
				.attr("transform","translate("+160+","+0+")");

 var rules2 = graph2.selectAll("g.rule")
	.data(x_hour_inter)
  .enter().append("svg:g")
	.attr("class","rule");
  	
var g2 = graph2.append("svg:g")
		 .attr("transform","translate(0,"+h_graph*0.9+")");
 
 g2.append("svg:path")
	.attr("d", line_hour(metrics_hours))
	.attr("class","line");
	
g2.append("svg:circle")
	.attr("cy", - y_hour(subarray_hours[pos_max_hour]))
	.attr("cx", x_hour(pos_max_hour))
	.attr("r",r)
 
  rules2.append("svg:text")
	.attr("y", h_graph + 20)
	.attr("x", x_hour)
	.text(function(d) {return d;});
	
 rules2.append("svg:line")
	.attr("x1", x_hour)
	.attr("x2", x_hour)
	.attr("y1", 60 )
	.attr("y2", 55 )
	.attr("class","line")
	.attr("transform","translate(3,"+0+")");
	
var graph2_l = distrib2.append("svg:g")
				.attr("transform","translate("+0+","+0+")");

graph2_l.append("svg:text")
	.attr("y",50)
	.text(pourcent(subarray_hours[pos_max_hour]/d3.sum(subarray_hours)))
	.attr("class","titre");
	
graph2_l.append("text").text("envoyés")
	.attr("y",h_graph*0.6)
	.attr("x",75)
	.attr("class","legende")
	
graph2_l.append("text").text("à "+metrics_hours[pos_max_hour].hour+" heures")
	.attr("y",h_graph)
	.attr("x",75)
	.attr("class","legende")
  
 // Insérer les mois
 
 
 var mois = d3.select("#texts").append("div").selectAll("div")
 				.data(month)
 			.enter().append("div")
 			.attr("class","month")
 			.attr("width",w)
 			.attr("transform","translate("+0+","+50+")");
 			
 mois.append("text").text(function(d) {return d.key;})
 
 // Insérer les textos
  
  
  var texts = mois.selectAll(".texts")
	.data(function(d) {return text_month[d.key];});
	
  texts.enter().append("div")
  	.attr("class","dates")
  	.text(function(d) {return date_format(d.date);})
  		.append("div")
	.attr("class", function(d) {  
	
	if ( d.type == 1) {return "lui";}
	
		else 
		
			{ return "moi";}
	})
	
	.text(function(d) {return d.body;});
  
});