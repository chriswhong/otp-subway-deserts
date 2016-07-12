# otp-subway-deserts
scripts to process data for v2 of my subway deserts map

`stations.geojson` is the source of point geomeotries for the subway stations.  (this data is hosted on DoiTT's CartoDB account)
`walksheds.js` takes each subway station point and runs it through OTP's isochroneAPI, getting back walksheds for 5, 7.5, and 10 minutes, it outputs `{{iterator}}.geojson` for each station in the `/isochrones` folder.

The api call looks like this:
```
http://{{host}}/otp/routers/default/isochrone?routeId=default&batch=true&fromPlace={{lat}},{{lng}}&date=2017/09/25&time=12:00:00&mode=WALK&cutoffSec=300&cutoffSec=450&cutoffSec=600
```

`combine.js` combines all of the separate geojson files into a single FeatureCollection called `combined.geojson`.

`combined.geojson` was uploaded to cartodb.  This query unions together the 10-minute walksheds:

```
SELECT ST_TRANSFORM(ST_COLLECTIONEXTRACT(ST_UNION(the_geom),3),3857) as the_geom_webmercator FROM combined
```

Final map:
https://t.co/Fyyhv4nMIE
