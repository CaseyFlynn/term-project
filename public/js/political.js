var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
  //init data
  var json = {
      'label': ['Neutral', 'Negative', 'Positive' ],
	  'color' : ['#ffff00', '#ff0000', '#339933'],
      'values': [
      {
        'label': 'Donald Trump',
        'values': [1503929, 871240, 1090868]
      }, 
      {
        'label': 'Ted Cruz',
        'values': [602302, 342692, 384780 ]
      }, 
      {
        'label': 'Hilary Clinton',
        'values': [371685, 204857, 323255 ]
      }, 
      {
        'label': 'Bernie Sanders',
        'values': [263765, 150219, 240150 ]
      }]
      
  };
  //end

    //init BarChart
    var barChart = new $jit.BarChart({
      //id of the visualization container
      injectInto: 'infovis',
      //whether to add animations
      animate: true,
      //horizontal or vertical barcharts
      orientation: 'vertical',
      //bars separation
      barsOffset: 20,
      //visualization offset
      Margin: {
        top:5,
        left: 5,
        right: 5,
        bottom:5
      },
      //labels offset position
      labelOffset: 5,
      //bars style
      type: useGradients? 'stacked:gradient' : 'stacked',
      //whether to show the aggregation of the values
      showAggregates:true,
      //whether to show the labels for the bars
      showLabels:true,
      //labels style
      Label: {
        type: labelType, //Native or HTML
        size: 13,
        family: 'Arial',
        color: 'white'
      },
      //add tooltips
      Tips: {
        enable: true,
        onShow: function(tip, elem) {
			var total = 1;
			if(elem.label == "Donald Trump"){
				total = 3001403;
			}
			else if (elem.label == "Ted Cruz"){
				total = 1329774;
			}
			else if(elem.label == "Hilary Clinton"){
				total = 899797;
			}
			else if (elem.label == "Bernie Sanders"){
				total = 654134;
			}
			var percent = (elem.value/total)*100;
			percent = percent.toFixed(2);
          tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value + "</br><b>Percentage:</b> " + percent + "%";
        }
      }
    });
    //load JSON data.
    barChart.loadJSON(json);
    //end
    var list = $jit.id('id-list'),
        orn = $jit.id('switch-orientation');

    //dynamically add legend to list
    var legend = barChart.getLegend(),
        listItems = [];
    for(var name in legend) {
      listItems.push('<div class=\'query-color\' style=\'background-color:'
          + legend[name] +'\'>&nbsp;</div>' + name);
    }
    list.innerHTML = '<li>' + listItems.join('</li><li>') + '</li>';
}
