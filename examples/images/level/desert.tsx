<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.8" tiledversion="1.8.1" name="Desert" tilewidth="32" tileheight="32" spacing="1" margin="1" tilecount="48" columns="8">
 <image source="tmw_desert_spacing.png" width="265" height="199"/>
 <tile id="0">
  <objectgroup draworder="index" id="2">
   <object id="1" x="16" y="16.1818" width="6" height="15.8182"/>
   <object id="2" x="16" y="16" width="16" height="5.90909"/>
  </objectgroup>
 </tile>
 <tile id="1">
  <objectgroup draworder="index" id="2">
   <object id="5" x="0.0909091" y="16.1818" width="31.8182" height="5.63636"/>
  </objectgroup>
 </tile>
 <tile id="8">
  <objectgroup draworder="index" id="2">
   <object id="1" x="15.9689" y="0.127751" width="5.74882" height="31.8101"/>
  </objectgroup>
 </tile>
 <tile id="10">
  <objectgroup draworder="index" id="2">
   <object id="1" x="10.8696" y="0.127877" width="4.73146" height="31.7136"/>
  </objectgroup>
 </tile>
 <tile id="24">
  <objectgroup draworder="index" id="2">
   <object id="1" x="12.9555" y="13.1548" width="6.04588" height="19.1342"/>
   <object id="2" x="13.0219" y="13.1548" width="18.9349" height="6.90958"/>
  </objectgroup>
 </tile>
 <tile id="25">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0.0664383" y="13.2877" width="32.0233" height="6.77671"/>
  </objectgroup>
 </tile>
 <tile id="26">
  <objectgroup draworder="index" id="2">
   <object id="12" x="0.0664383" y="13.0219" width="22.0575" height="8.43766"/>
   <object id="14" x="13.952" y="13.2877" width="8.30479" height="18.8685"/>
  </objectgroup>
 </tile>
 <tile id="30" probability="0.01"/>
 <tile id="31" probability="0.01"/>
 <tile id="32">
  <objectgroup draworder="index" id="2">
   <object id="1" x="12.9555" y="0.0664383" width="8.96917" height="31.9568"/>
  </objectgroup>
 </tile>
 <tile id="34">
  <objectgroup draworder="index" id="2">
   <object id="1" x="12.889" y="0.0664383" width="9.03561" height="31.8239"/>
  </objectgroup>
 </tile>
 <tile id="35">
  <objectgroup draworder="index" id="2">
   <object id="1" x="14.0185" y="14.0185" width="7.77328" height="17.9383"/>
   <object id="2" x="14.0849" y="14.0849" width="17.9383" height="7.97259"/>
  </objectgroup>
 </tile>
 <tile id="36">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0.0664383" y="13.2212" width="21.0609" height="8.5041"/>
   <object id="2" x="13.0219" y="13.0219" width="8.23835" height="18.7356"/>
  </objectgroup>
 </tile>
 <tile id="37" probability="0.01">
  <animation>
   <frame tileid="37" duration="100"/>
  </animation>
 </tile>
 <tile id="38" probability="0.01"/>
 <tile id="39" probability="0.01"/>
 <tile id="40">
  <objectgroup draworder="index" id="2">
   <object id="1" x="13.0219" y="-0.0664383" width="7.97259" height="22.0575"/>
   <object id="2" x="13.0219" y="14.8822" width="18.8685" height="7.1089"/>
  </objectgroup>
 </tile>
 <tile id="41">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="13.952" width="31.9568" height="8.03903"/>
  </objectgroup>
 </tile>
 <tile id="42">
  <objectgroup draworder="index" id="2">
   <object id="1" x="13.8856" y="0.0664383" width="8.03903" height="21.8582"/>
   <object id="2" x="0.0664383" y="13.952" width="21.8582" height="8.03903"/>
  </objectgroup>
 </tile>
 <tile id="43">
  <objectgroup draworder="index" id="2">
   <object id="1" x="13.8856" y="0" width="7.97259" height="21.7253"/>
   <object id="4" x="14.0185" y="12.6897" width="17.9383" height="9.10205"/>
  </objectgroup>
 </tile>
 <tile id="44">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="13.0883" width="19.9979" height="7.90616"/>
   <object id="2" x="13.0219" y="0" width="7.04246" height="20.7287"/>
  </objectgroup>
 </tile>
 <tile id="45" probability="0"/>
 <tile id="46" probability="0.01"/>
 <tile id="47" probability="0.01"/>
 <wangsets>
  <wangset name="Desert" type="corner" tile="5">
   <wangcolor name="Desert" color="#ff0000" tile="29" probability="1"/>
   <wangcolor name="Brick" color="#00ff00" tile="9" probability="1"/>
   <wangcolor name="Cobblestone" color="#0000ff" tile="33" probability="1"/>
   <wangcolor name="Dirt" color="#ff7700" tile="14" probability="1"/>
   <wangtile tileid="0" wangid="0,1,0,2,0,1,0,1"/>
   <wangtile tileid="1" wangid="0,1,0,2,0,2,0,1"/>
   <wangtile tileid="2" wangid="0,1,0,1,0,2,0,1"/>
   <wangtile tileid="3" wangid="0,4,0,1,0,4,0,4"/>
   <wangtile tileid="4" wangid="0,4,0,4,0,1,0,4"/>
   <wangtile tileid="5" wangid="0,1,0,4,0,1,0,1"/>
   <wangtile tileid="6" wangid="0,1,0,4,0,4,0,1"/>
   <wangtile tileid="7" wangid="0,1,0,1,0,4,0,1"/>
   <wangtile tileid="8" wangid="0,2,0,2,0,1,0,1"/>
   <wangtile tileid="9" wangid="0,2,0,2,0,2,0,2"/>
   <wangtile tileid="10" wangid="0,1,0,1,0,2,0,2"/>
   <wangtile tileid="11" wangid="0,1,0,4,0,4,0,4"/>
   <wangtile tileid="12" wangid="0,4,0,4,0,4,0,1"/>
   <wangtile tileid="13" wangid="0,4,0,4,0,1,0,1"/>
   <wangtile tileid="14" wangid="0,4,0,4,0,4,0,4"/>
   <wangtile tileid="15" wangid="0,1,0,1,0,4,0,4"/>
   <wangtile tileid="16" wangid="0,2,0,1,0,1,0,1"/>
   <wangtile tileid="17" wangid="0,2,0,1,0,1,0,2"/>
   <wangtile tileid="18" wangid="0,1,0,1,0,1,0,2"/>
   <wangtile tileid="19" wangid="0,2,0,1,0,2,0,2"/>
   <wangtile tileid="20" wangid="0,2,0,2,0,1,0,2"/>
   <wangtile tileid="21" wangid="0,4,0,1,0,1,0,1"/>
   <wangtile tileid="22" wangid="0,4,0,1,0,1,0,4"/>
   <wangtile tileid="23" wangid="0,1,0,1,0,1,0,4"/>
   <wangtile tileid="24" wangid="0,1,0,3,0,1,0,1"/>
   <wangtile tileid="25" wangid="0,1,0,3,0,3,0,1"/>
   <wangtile tileid="26" wangid="0,1,0,1,0,3,0,1"/>
   <wangtile tileid="27" wangid="0,1,0,2,0,2,0,2"/>
   <wangtile tileid="28" wangid="0,2,0,2,0,2,0,1"/>
   <wangtile tileid="29" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="30" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="31" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="32" wangid="0,3,0,3,0,1,0,1"/>
   <wangtile tileid="33" wangid="0,3,0,3,0,3,0,3"/>
   <wangtile tileid="34" wangid="0,1,0,1,0,3,0,3"/>
   <wangtile tileid="35" wangid="0,3,0,1,0,3,0,3"/>
   <wangtile tileid="36" wangid="0,3,0,3,0,1,0,3"/>
   <wangtile tileid="37" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="38" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="39" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="40" wangid="0,3,0,1,0,1,0,1"/>
   <wangtile tileid="41" wangid="0,3,0,1,0,1,0,3"/>
   <wangtile tileid="42" wangid="0,1,0,1,0,1,0,3"/>
   <wangtile tileid="43" wangid="0,1,0,3,0,3,0,3"/>
   <wangtile tileid="44" wangid="0,3,0,3,0,3,0,1"/>
   <wangtile tileid="45" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="46" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="47" wangid="0,1,0,1,0,1,0,1"/>
  </wangset>
 </wangsets>
</tileset>
