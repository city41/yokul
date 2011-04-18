YOKUL.chartCreator = (function() {
	_chartConstructors = {
		bvg: YOKUL.VerticalBarGrouped
	};

	function _getChartType(queryData) {
		var regex = /cht=([^&]+)/;
		var match = regex.exec(queryData);

		if(match && match[1]) {
			return match[1];
		}

		return null;
	}

	function _createChart(queryData) {
		var chartType = _getChartType(queryData);
		
		var constructor = _chartConstructors[chartType];

		if(constructor) {
			return new constructor(queryData);
		} else {
			YOKUL.log.error("This chart type not yet supported: " + chartType);
			return null;
		}
	}

	return {
		create: function(id, queryData) {
			var element = document.getElementById(id);

			if(typeof queryData === 'undefined') {
				queryData = YOKUL.utility.getQueryDataFromElement(element);
			}

			var chart = _createChart(queryData);

			if(chart) {
				element.src = chart.imageData();
			}
		}
	};
})();

