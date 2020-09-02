///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/////////////////////////////////////////////////////////////////////////// https://api.autoaddress.ie/2.0/control/js/jquery.autoaddress.min.js, https://code.jquery.com/jquery-git1.min.js './autoaddress'

define([
  'dojo/_base/declare', 
  'dojo/_base/lang',
  'esri/geometry/Point',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/geometry/Polyline',
  'esri/Color',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/SpatialReference',
  'esri/map',
  'esri/layers/FeatureLayer',
  'esri/InfoTemplate',
  'jimu/BaseWidget',
  'jimu/loaderplugins/jquery-loader!https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js, https://api.autoaddress.ie/2.0/control/js/jquery.autoaddress.min.js'
  ],
  function(declare, 
    lang, 
    Point, 
    SimpleMarkerSymbol, 
    SimpleLineSymbol, 
    Polyline, 
    Color, 
    Graphic, 
    GraphicsLayer,
    SpatialReference,
    Map, 
    FeatureLayer,
    InfoTemplate,
    BaseWidget, 
    $) {
    
    var instance = null;
    var spatialReference = null;
    var locationLayer = new GraphicsLayer({id:"LOCATION"});
    var baseUrl = "https://api.autoaddress.ie/2.0";
    var ecadUrl = "/GetEcadData";
    
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here
      
      baseClass: 'jimu-widget-autoaddresswidget',

      //this property is set by the framework when widget is loaded.
      //name: 'AutoaddressWidget',
      

      //methods to communication with app container:

      postCreate: function() {
        this.inherited(arguments);
        console.log('postCreate');
      },

      startup: function() {

       instance = this;
       spatialReference = this.map.spatialReference;
       instance.map.addLayer(locationLayer);
       console.log('startup');
       lang.hitch(this, $('#Autoaddress').AutoAddress({
        key : this.config.licenceKey,
        geographic : this.config.geographic,
        vanityMode : this.config.vanity,
        addressProfile : this.config.addressProfile,
        country : "ie",
        language : "en",
        searchButtonLabel: "",
        addressFoundLabel: "",
        onAddressFound: lang.hitch(this, this._getEcadData)
      }))
      console.log(this.config.addressProfile);
      },

      _getEcadData: function (data) {
        var url = baseUrl + ecadUrl + "?key=" + instance.config.licenceKey + "&ecadid=" + data.addressId;
        $.get(url, function(res) {
          var long, lat;
          if(spatialReference.wkid){
            switch (spatialReference.wkid) {
              case 2157: // ITM
                long = res.spatialInfo.itm.location.easting;
                lat = res.spatialInfo.itm.location.northing;
                break;
              case 29902: // ING 
                long = res.spatialInfo.ing.location.easting;
                lat = res.spatialInfo.ing.location.northing;
                break;
              default: //etrs89
                long = res.spatialInfo.etrs89.location.longitude;
                lat = res.spatialInfo.etrs89.location.latitude;
                spatialReference = new SpatialReference({wkid: 4326 });
                break;
            }
          }else{
            long = res.spatialInfo.etrs89.location.longitude;
            lat = res.spatialInfo.etrs89.location.latitude;
            spatialReference = new SpatialReference({wkid: 4326 });
          }
          
          var point = new Point(long, lat, spatialReference); 
          console.log(map.id);
          instance.map.infoWindow.hide();
          instance.map.graphics.clear();
          instance.map.infoWindow.setTitle("Address");
          instance.map.infoWindow.setContent(instance._getInfowindowText(data.reformattedAddress, data.postcode));
          instance.map.infoWindow.show(point); 
          instance._addPoint(point);
          instance.map.centerAndZoom(point, 16);
        });
      },

      _getInfowindowText: function(reformattedAddress, postcode){
        var text = "";
        reformattedAddress.forEach(line => {
          if(line){
            text += line + "<br>";
          }
        });
        text += postcode;
        return text;
      },

      _addPoint: function(point){
        instance.map.getLayer('LOCATION').clear();
        var symbol = new SimpleMarkerSymbol().setSize(8).setColor([ 128, 128, 128, 0.8 ]);
        
        var graphic = new Graphic(point, symbol);
        var square = new SimpleMarkerSymbol()
          .setStyle('square')
          .setSize(12)
          .setColor([ 255, 255, 255, 0 ])
          .setOutline(
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 
              new Color([51, 255, 255, 1 ]), 
              2)
           );
        instance.map.infoWindow.markerSymbol = square;
        locationLayer.add(graphic);
      },

      onOpen: function(){
        console.log('onOpen');
      },

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });

    
  });

  