//
// YOKUL chartCreator
//
// This is an object that is responsible for creating a chart.
// It inspects the incoming query data to determine the type of chart 
// requested, and from there creates the proper type of chart object

YOKUL.chartCreator = (function() {
	_chartConstructors = {
		bvg: YOKUL.charts.VerticalBarGrouped,
		bvs: YOKUL.charts.VerticalBarStacked
	};

	// inspect the query data looking for cht, indicating which type of chart is requested
	function _getChartType(queryData) {
		var regex = /cht=([^&]+)/;
		var match = regex.exec(queryData);

		return match && match[1];
	}

	function _createChart(queryData) {
		var chartType = _getChartType(queryData);
		
		var Constructor = _chartConstructors[chartType];

		if(Constructor) {
			return new Constructor(queryData);
		} else {
			YOKUL.log.error("This chart type not yet supported: " + chartType);
			return null;
		}
	}

	return {
		create: function(id, queryData) {
			var element = document.getElementById(id);

			if(!element) {
				YOKUL.log.error("chartCreator.create: no element with id, " + id + ", exists");
				return;
			}

			if(element.nodeName.toUpperCase() !== 'IMG') {
				YOKUL.log.error("chartCreator.create: YOKUL can only create charts for img elements, passed in: " + element.nodeName);
				return;
			}

			if(typeof queryData === 'undefined') {
				queryData = YOKUL.utility.getQueryDataFromElement(element);

				if(!queryData) {
					YOKUL.log.error("chartCreator.create: no query data for this chart was found (" + id + ")");
					return;
				}
			}

			var chart = _createChart(queryData);

			if(chart) {
				element.src = chart.imageData();
			}
		}
	};
})();

