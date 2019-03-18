var toolbar, symbol, geomTask;
require([
    "esri/map",
    "esri/dijit/Search",
    "esri/dijit/Scalebar",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "dojo/parser",
    "dijit/registry",
    "esri/dijit/Measurement",
    "esri/dijit/BasemapGallery",
    "esri/arcgis/utils",
    "esri/dijit/OverviewMap",
    "esri/dijit/Print",
    "esri/SpatialReference",
    "esri/dijit/LocateButton",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/TitlePane",
    "esri/toolbars/navigation",
    "dojo/on",
    "dijit/Toolbar",
    "dijit/form/Button",
    "dijit/WidgetSet",
    "dojo/domReady!"
], function (Map, Search, Scalebar, Draw, Graphic, GraphicsLayer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, parser, registry, Measurement, BasemapGallery, arcgisUtils, OverviewMap, Print,SpatialReference, LocateButton, OpenStreetMapLayer, navigation, on) {
    parser.parse();

    var map = new Map("map", {
        basemap: "topo",
        center: [77.96, 10.35],
        zoom: 13,
        smartNavigation: true
    });
   
   
    var overviewMap = new OverviewMap({
        map: map,
        visible: true
    });
    overviewMap.startup();
    var printer = new Print({
        map: map,
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    }, "printer");
    printer.startup();


    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map
    }, "basemapGallery");
    basemapGallery.startup();

    basemapGallery.on("error", function (msg) {
        console.log("basemap gallery error:  ", msg);
    });
    var search = new Search({
        map: map
    }, "search");
    search.startup();
    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "english",
        attachTo: "bottom-center"
    });

    map.on("load", createToolbar);


    registry.forEach(function (d) {

        if (d.declaredClass === "dijit.form.Button") {
            d.on("click", activateTool);
        }
    });
    function activateTool() {
        var tool = this.label.toUpperCase().replace(/ /g, "_");
        toolbar.activate(Draw[tool]);
        map.hideZoomSlider();
    }

    function createToolbar(themap) {
        toolbar = new Draw(map);
        toolbar.on("draw-end", addToMap);
    }

    function addToMap(evt) {
        var symbol;
        toolbar.deactivate();
        map.showZoomSlider();
        switch (evt.geometry.type) {
            case "point":
            case "multipoint":
                symbol = new SimpleMarkerSymbol();
                break;
            case "polyline":
                symbol = new SimpleLineSymbol();
                break;
            default:
                symbol = new SimpleFillSymbol();
                break;
        }
        var graphic = new Graphic(evt.geometry, symbol);
        map.graphics.add(graphic);
    }
    function Send()
    {
        map.graphics();
    }
   
   

    var measurement = new Measurement({ map: map }, "measurement");
    measurement.startup();
    myLocation = new LocateButton({
        map: map
    }, "LocateButton");
    myLocation.startup();

 
});

