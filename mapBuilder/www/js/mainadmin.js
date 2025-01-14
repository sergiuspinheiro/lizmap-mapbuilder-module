import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature';
import {fromExtent} from 'ol/geom/Polygon.js';
import Draw, {createBox} from 'ol/interaction/Draw.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';

import {transformExtent} from 'ol/proj.js';

var mapBuilderAdmin = {};

$(function() {

  var raster = new TileLayer({
    source: new OSM()
  });

  var source = new VectorSource({wrapX: false});

  var vector = new VectorLayer({
    source: source
  });

  var map = new Map({
    layers: [raster, vector],
    target: 'map',
    view: new View({
      extent: transformExtent([-180,-85.06,180,85.06], 'EPSG:4326', 'EPSG:3857'),
      center: [95022, 5922170],
      zoom: 5
    })
  });

  // Set extent input as readonly
  $('#jforms_mapBuilderAdmin_config_extent').prop('readonly', true);

  // Display original extent on map if set
  var extentString = $('#jforms_mapBuilderAdmin_config_extent').val();
  
  if(extentString !== ""){
    var extent = transformExtent(extentString.split(',').map(parseFloat), 'EPSG:4326', map.getView().getProjection())
    source.addFeature(
      new Feature({
        geometry: fromExtent(extent)
      })
    );
    map.getView().fit(extent);
  }
  
  var draw = new Draw({
    source: source,
    type: 'Circle',
    geometryFunction: createBox()
  });

  draw.on('drawstart', function (e) {
    source.clear();
  });

  draw.on('drawend', function (e) {
    $('#jforms_mapBuilderAdmin_config_extent').val(transformExtent(e.feature.getGeometry().getExtent(), 'EPSG:3857', 'EPSG:4326'));
  });

  map.addInteraction(draw);

  // Filter default baselayer choices based on selected baselayers
  // Init
  $('#jforms_mapBuilderAdmin_config_baseLayerDefault option').hide();

  $('.jforms-ctl-baseLayer input:checked').each(function() {
    $('#jforms_mapBuilderAdmin_config_baseLayerDefault option[value='+$(this).val()+']').show();
  });

  // Toggle on change
  $('.jforms-ctl-baseLayer input').change(function() {
    $('#jforms_mapBuilderAdmin_config_baseLayerDefault option[value='+$(this).val()+']').toggle($(this).is(':checked'));
  });

  // Make OL map object accessible to help debugging 
  if (!PRODUCTION) {
    $("#map").data('map', map);
  }

});