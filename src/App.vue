<template>
  <div>
    <div :id="'map_canvas'+this.idx" class="map_canvas"></div>
  </div>
</template>
<script>
import * as com from '@/_service/com.methods'

export default {
  name: 'NtwMap',
  props: ['lat', 'lng', 'dlrNm', 'area','idx'],
  components: {
  },
  data () {
    return {

    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    if (!com.isNull(this.area) && this.area === 'place') {
      document.getElementById('map_canvas'+this.idx).classList.add('place')
    }
    this.setMap(this.lat, this.lng, this.dlrNm, this.idx)
  },
  updated () {},
  watch: {},
  methods: {
    setMap: function (lat, lng, dealer,idx) {
      var GoogleMapsLoader = require('google-maps')
      GoogleMapsLoader.KEY = 'AIzaSyCCtQz_6ui8_WQR3MKKIPuWrKIa_db5fO4'
      GoogleMapsLoader.VERSION = '3'
      GoogleMapsLoader.load(function (google) {
          var latlng = new google.maps.LatLng(lat, lng)
          var myOptions = {
            zoom: 16,
            center: latlng,
            mapTypeControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          var gmap = new google.maps.Map(document.getElementById('map_canvas'+idx), myOptions);
          var marker = new google.maps.Marker({
            position: latlng,
            map: gmap,
            title: dealer
          })
          if (marker == null) {
          // warning 방지용
          }
      });
    }
  }
}
</script>
