import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <title>길찾기 결과 지도에 표출하기</title>


    </head>

    <body>
    <div id="map" style="width:100%;height:900px;"></div>

    <script type="text/javascript" src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx9b339cbb1c8140bc8574efedb6ce01bb"></script>
    <script>


      var mapOptions = {
        center: new Tmapv2.LatLng(37.55525165729346, 126.93737555322481),
        zoom: 10
      };

      var map = new Tmapv2.Map('map', mapOptions);


      var sx = 126.93737555322481;
      var sy = 37.55525165729346;
      var ex = 126.88265238619182;
      var ey = 37.481440035175375;

      function searchPubTransPathAJAX() {
        var xhr = new XMLHttpRequest();
        //ODsay apiKey 입력
        var url = "https://api.odsay.com/v1/api/searchPubTransPath?SX="+sx+"&SY="+sy+"&EX="+ex+"&EY="+ey+"&apiKey=p2t%2FY61%2FId6IgYOMMD%2BGOEfcc4tLxzvSZ1ftnb89%2F3k%0A";
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function() { 
          if (xhr.readyState == 4 && xhr.status == 200) {
          console.log( JSON.parse(xhr.responseText) ); // <- xhr.responseText 로 결과를 가져올 수 있음
          //노선그래픽 데이터 호출
          callMapObjApiAJAX((JSON.parse(xhr.responseText))["result"]["path"][0].info.mapObj);
          }
        }
      }

      //길찾기 API 호출
      searchPubTransPathAJAX();

      function callMapObjApiAJAX(mabObj){
        var xhr = new XMLHttpRequest();
        //ODsay apiKey 입력
        var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@"+mabObj+"&apiKey=p2t%2FY61%2FId6IgYOMMD%2BGOEfcc4tLxzvSZ1ftnb89%2F3k%0A";
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);
            drawNaverMarker(sx,sy);					// 출발지 마커 표시
            drawNaverMarker(ex,ey);					// 도착지 마커 표시
            drawNaverPolyLine(resultJsonData);		// 노선그래픽데이터 지도위 표시
            // boundary 데이터가 있을경우, 해당 boundary로 지도이동
            if(resultJsonData.result.boundary){
                var boundary = new Tmapv2.LatLngBounds(
                            new Tmapv2.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                            new Tmapv2.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                            );
                map.panToBounds(boundary);
            }
          }
        }
      }

      // 지도위 마커 표시해주는 함수
      function drawNaverMarker(x,y){
        var marker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(y, x),
            map: map
        });
      }

      // 노선그래픽 데이터를 이용하여 지도위 폴리라인 그려주는 함수
      function drawNaverPolyLine(data){
        var lineArray;

        for(var i = 0 ; i < data.result.lane.length; i++){
          for(var j=0 ; j <data.result.lane[i].section.length; j++){
            lineArray = null;
            lineArray = new Array();
            for(var k=0 ; k < data.result.lane[i].section[j].graphPos.length; k++){
              lineArray.push(new Tmapv2.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
            }

          //지하철결과의 경우 노선에 따른 라인색상 지정하는 부분 (1,2호선의 경우만 예로 들음)
            if(data.result.lane[i].type == 1){
              var polyline = new Tmapv2.Polyline({
                  map: map,
                  path: lineArray,
                  strokeWeight: 3,
                  strokeColor: '#003499'
              });
            }else if(data.result.lane[i].type == 2){
              var polyline = new Tmapv2.Polyline({
                  map: map,
                  path: lineArray,
                  strokeWeight: 3,
                  strokeColor: '#37b42d'
              });
            }else{
              var polyline = new Tmapv2.Polyline({
                  map: map,
                  path: lineArray,
                  strokeWeight: 3
              });
            }
          }
        }
      }
    </script>

    </body>
    </html>
                           
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
