var toolbar, symbol, geomTask;
var GraphicObject;
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
        //basemap: "streets-night-vector",
        basemap:"topo",
        center: [77.96, 10.36],
        zoom: 13,
        smartNavigation: true
    });

    window.mapObject = map;
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
        var GeometryType = "";
        toolbar.deactivate();
        map.showZoomSlider();
        switch (evt.geometry.type) {
            case "point":
                GeometryType = "point";
                symbol = new SimpleMarkerSymbol();
                break;
            case "multipoint":
                GeometryType = "multipoint";
                symbol = new SimpleMarkerSymbol();
                break;
            case "polyline":
                GeometryType = "polyline";
                symbol = new SimpleLineSymbol();
                break;
            default:
                symbol = new SimpleFillSymbol();
                break;
        }
        var graphic = new Graphic(evt.geometry, symbol);
        map.graphics.add(graphic);
        //graphic.geometry.type = GeometryType;
       
    }
    var measurement = new Measurement({ map: map }, "measurement");
    measurement.startup();
    myLocation = new LocateButton({
        map: map
    }, "LocateButton");
    myLocation.startup();
    window.drawGraphics = (function () {
        var GeometryType;
        var graphicElement = null;
        this.drawGraphic = function (graphicsObj) {
            graphicsObj.graphics.shift();
            for (z = 0; z < graphicsObj.graphics.length; z++) {
                GeometryType = graphicsObj.graphics[z].type;
                GraphicObject = GeometryType;
                switch (GraphicObject) {
                    case "point":
                        graphicElement = {
                            geometry: {
                                "x": graphicsObj.graphics[z].x,
                                "y": graphicsObj.graphics[z].y,
                                "spatialReference": { "wkid": 3857 }
                            },
                            "symbol": { "color": [255, 255, 255, 64], "size": 12, "angle": -30, "xoffset": 0, "yoffset": 0, "type": "esriSMS", "style": "esriSMSCircle" }
                        };
                        break;
                    case "multipoint":
                        graphicElement = {
                            geometry: {
                                "points": graphicsObj.graphics[z].points,
                                "spatialReference": { "wkid": 3857 }
                            },
                            "symbol": {
                                "color": [255, 255, 255, 64], "size": 12, "angle": -30, "xoffset": 0, "yoffset": 0, "type": "esriSMS", "style": "esriSMSCircle",
                                "outline": {
                                    "color": [0, 0, 0, 255],
                                    "width": 1,
                                    "type": "esriSLS",
                                    "style": "esriSLSSolid"
                                }
                            }
                        };
                      
                        break;
                    case "polyline":
                        graphicElement = {
                            geometry: {
                                "paths": graphicsObj.graphics[z].paths,
                                "spatialReference": { "wkid": 3857 }
                            },
                            "symbol": { "color": [0, 0, 0, 255], "width": 1, "type": "esriSLS", "style": "esriSLSSolid" }
                        };
                       
                        break;
                    
                    default:
                        graphicElement = {
                            geometry: {
                                "rings": graphicsObj.graphics[z].rings,
                                "spatialReference": { "wkid": 3857 }
                            },
                            "symbol": { "color": [0, 0, 0, 255], "style": "SimpleFillSymbol.STYLE_SOLID" }
                        };
                        break;
                }
                var graphic = new Graphic(graphicElement);
                map.graphics.add(graphic);
            }
         
        }
    });

});
function Pass() {


    var graphicsArray = [];
    for (i = 0; i < window.mapObject.graphics.graphics.length; i++) {
        graphicsArray.push(window.mapObject.graphics.graphics[i].geometry);
    }
    var graphicsObj =
    {
        "graphics": graphicsArray
    };
    var graphicsJsonString = JSON.stringify(graphicsObj);


    Add(graphicsJsonString);
}
function alertOne() {
    console.log("This is my project");
};
function PassObject() {


    var graphicsArray = [];
    for (i = 0; i < window.mapObject.graphics.graphics.length; i++) {
        graphicsArray.push(window.mapObject.graphics.graphics[i].geometry);
    }
    var graphicsObj =
    {
        "graphics": graphicsArray
    };
    var graphicsJsonString = JSON.stringify(graphicsObj);


    Update(graphicsJsonString);
}
function RemoveGraphics() {
    window.mapObject.graphics.clear();
} 
function show(evt, Activity) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(Activity).style.display = "block";
    evt.currentTarget.className += "  active";
}
