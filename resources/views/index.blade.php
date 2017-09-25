<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <title>Husky Trails</title>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />

        <meta property="og:title" content="Husky Trails" />
        <meta property="og:description" content="Visualize University of Connecticut expenditures." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
        <meta property="og:image" content="/img/release-candidate.png" />

        <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.40.0/mapbox-gl.css" rel="stylesheet" />
        <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />

        <!-- Global Site Tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-78635103-4"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)};
          gtag('js', new Date());
          gtag('config', '{{ env('GA_TRACKING_CODE') }}');
        </script>
    </head>
    <body>
        <div id="root">
            <noscript>This website requires JavaScript to render its map.</noscript>
        </div>
        <script src="{{ mix('/js/index.js') }}"></script>
    </body>
</html>
