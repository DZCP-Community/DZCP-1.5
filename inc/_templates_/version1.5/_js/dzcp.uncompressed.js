// GLOBAL VARS
  var doc = document, ie4 = document.all, opera = window.opera;
  var innerLayer, layer, x, y, doWheel = false, offsetX = 15, offsetY = 5;
  var tickerc = 0, mTimer = new Array(), tickerTo = new Array(), tickerSpeed = new Array();
  var shoutInterval = 15000; // refresh interval of the shoutbox in ms
  var teamspeakInterval = 15000; // refresh interval of the teamspeak viewer in ms

// DZCP JAVASCRIPT LIBARY
  var DZCP = {

  //init
    init: function() {
      doc.body.id = 'dzcp-engine-1.5';
      $('body').append('<div id="infoDiv"></div>');

    	layer = $('#infoDiv')[0];
    	doc.body.onmousemove = DZCP.trackMouse;

   // refresh shoutbox
      if($('#navShout')[0]) window.setInterval("$('#navShout').load('../inc/ajax.php?i=shoutbox');", shoutInterval);

	// refresh teamspeak
      if($('#navTeamspeakContent')[0]) window.setInterval("$('#navTeamspeakContent').load('../inc/ajax.php?i=teamspeak');", teamspeakInterval);

  // init lightbox
      DZCP.initLightbox();
    },
    
  // init lightbox
    initLightbox: function() {
      $('a[rel^=lightbox]').lightBox({
          fixedNavigation:      true,
          overlayBgColor:       '#000',
         	overlayOpacity:       0.8,
        	imageLoading:         '../inc/images/lightbox/loading.gif',
         	imageBtnClose:        '../inc/images/lightbox/close.gif',
        	imageBtnPrev:         '../inc/images/lightbox/prevlabel.gif',
         	imageBtnNext:         '../inc/images/lightbox/nextlabel.gif',
        	containerResizeSpeed: 350,
        	txtImage:             (lng == 'de' ? 'Bild' : 'Image'),
         	txtOf:                (lng == 'de' ? 'von' : 'of')
      });
    },

  // handle events
    addEvent : function(obj, evType, fn) {
      if(obj.addEventListener)
      {
        obj.addEventListener(evType, fn, false);
        return true;
      } else if (obj.attachEvent) {
        var r = obj.attachEvent('on' + evType, fn);
        return r;
      } else return false;
    },

  // track mouse
    trackMouse: function(e) {
      innerLayer = $('#infoInnerLayer')[0];
      if(typeof(layer) == 'object')
      {
        var ie4 = doc.all;
        var ns6 = doc.getElementById && !doc.all;
        var mLeft = 5;
        var mTop = -15;

      	x = (ns6) ? e.pageX-mLeft : window.event.clientX+doc.documentElement.scrollLeft - mLeft;
      	y = (ns6) ? e.pageY-mTop  : window.event.clientY+doc.documentElement.scrollTop  - mTop;

        if(innerLayer)
        {
        	var layerW = ((ie4) ? innerLayer.offsetWidth : innerLayer.clientWidth) - 3;
          var layerH = (ie4) ? innerLayer.offsetHeight : innerLayer.clientHeight;

        } else {
        	var layerW = ((ie4) ? layer.clientWidth : layer.offsetWidth) - 3;
          var layerH = (ie4) ? layer.clientHeight : layer.offsetHeight;
        }
        	var winW   = (ns6) ? (window.innerWidth) + window.pageXOffset - 12
                     : doc.documentElement.clientWidth + doc.documentElement.scrollLeft;

        	var winH   = (ns6) ? (window.innerHeight) + window.pageYOffset
                     : doc.documentElement.clientHeight + doc.documentElement.scrollTop;

          layer.style.left = ((x + offsetX + layerW >= winW - offsetX) ? x - (layerW + offsetX) : x + offsetX) + 'px';
          layer.style.top  = (y + offsetY) + 'px';
      }
    	return true;
    },

  // handle popups
    popup: function(url, x, y) {
      url = (url.indexOf('img=') == -1) ? url : '../popup.php?' + url;
      x = parseInt(x); y = parseInt(y) + 50;

      popup = window.open(url, 'Popup', "width=1,height=1,location=0,scrollbars=0,resizable=1,status=0");

      popup.resizeTo(x, y);
      popup.moveTo((screen.width - x) / 2, (screen.height-y) / 2);
      popup.focus();
    },

  // init Gameserver via Ajax
    initGameServer: function(serverID) {
      $(function() { $('#navGameServer_' + serverID).load('../inc/ajax.php?i=server&serverID=' + serverID); });
    },

  // init Teamspeakserver via Ajax
    initTeamspeakServer: function() {
      $(function() { $('#navTeamspeakServer').load('../inc/ajax.php?i=teamspeak'); });
    },

  // submit shoutbox
    shoutSubmit: function() {
      $.post('../shout/index.php?ajax', $('#shoutForm').serialize(),function(req) {
        if(req) alert(req.replace(/  /g, ' '));
        $('#navShout').load('../inc/ajax.php?i=shoutbox');
        if(!req) $('#shouteintrag').attr('value', '');
      });

      return false;
    },

  // switch userlist
    switchuser: function() {
      var url = doc.formChange.changeme.options[doc.formChange.changeme.selectedIndex].value;
      window.location.href = url
    },

  // Templateswitch
    tempswitch: function() {
      var url = doc.form.tempswitch.options[doc.form.tempswitch.selectedIndex].value;
      if(url != 'lazy') DZCP.goTo(url);
    },

  // go to defined url
    goTo: function(url, n) {
      if(n == 1) window.open(url);
      else window.location.href = url
    },

  // limit text lenthn
    maxlength: function(field, countfield, max) {
    	if(field.value.length > max) field.value = field.value.substring(0, max);
    	else                         countfield.value = max - field.value.length;
    },

  // handle info layer
    showInfo: function(info) {
      if(typeof(layer) == 'object')
      {
        layer.innerHTML =
          '<div id="hDiv">' +
          '  <table class="hperc" cellspacing="0" style="height:100%">' +
          '    <tr>' +
          '      <td style="vertical-align:middle">' +
          '        <div id="infoInnerLayer">' +
          '          <table class="hperc" cellspacing="0">'+info+'</table>' +
          '        </div>' +
          '      </td>' +
          '    </tr>' +
          '  </table>' +
          '</div>';

      //IE Fix
        if(ie4 && !opera)
        {
          layer.innerHTML += '<iframe id="ieFix" frameborder="0" width="' + $('#hDiv')[0].offsetWidth + '" height="' + $('#hDiv')[0].offsetHeight + '"></iframe>';
          layer.style.display = 'block';
        } else layer.style.display = 'block';
      }
    },

    hideInfo: function() {
      if(typeof(layer) == 'object')
      {
        layer.innerHTML = '';
        layer.style.display = 'none';
      }
    },

  // toggle object
    toggle: function(id) {
      if(id == 0) return;
      else {
        if($('#more' + id).css('display') == 'none')
        {
        	$('#more' + id).css('display', '');
        	$('#img' + id).attr('src', '../inc/images/collapse.gif');
        } else {
        	$('#more' + id).css('display', 'none');
          $('#img' + id).attr('src', '../inc/images/expand.gif');
        }
      }
    },

  // resize images
    resizeImages: function() {
    	for(var i=0;i<doc.images.length;i++)
      {
        var d = doc.images[i];

        if(d.className == 'content')
        {
      	  var imgW = d.width;
      	  var imgH = d.height;

      	  if(maxW != 0 && imgW > maxW)
          {
       		  d.width = maxW;
      		  d.height = Math.round(imgH * (maxW / imgW));

      		  if(!DZCP.linkedImage(d))
            {
              var textLink = doc.createElement("span");
      			  var popupLink = doc.createElement("a");

              textLink.appendChild(doc.createElement("br"));
              textLink.setAttribute('class', 'resized');
              textLink.appendChild(doc.createTextNode('auto resized to '+d.width+'x'+d.height+' px'));

              popupLink.setAttribute('href', d.src);
              popupLink.setAttribute('rel', 'lightbox');
              popupLink.appendChild(d.cloneNode(true));
              
              d.parentNode.appendChild(textLink);
      			  d.parentNode.replaceChild(popupLink, d);
              
              DZCP.initLightbox();
      		  }
          }
        }
    	}
    },

    linkedImage: function(node) {
    	do {
    		node = node.parentNode;
    		if (node.nodeName == 'A') return true;
    	}
    	while(node.nodeName != 'TD' && node.nodeName != 'BODY');

    	return false;
    },

  // ajax calendar switch
    calSwitch: function(m, y) {
      $('#navKalender').load('../inc/ajax.php?i=kalender&month=' + m + '&year=' + y);
    },

  // ajax team switch
    teamSwitch: function(obj) {
      clearTimeout(mTimer[1]);

     $('#navTeam').load('../inc/ajax.php?i=teams&tID=' + obj, DZCP.initTicker('teams', 'h', 60));
    },

  // ajax vote
    ajaxVote: function(id) {
      DZCP.submitButton('contentSubmitVote');
      $.post('../votes/index.php?action=do&ajax=1&what=vote&id=' + id, $('#navAjaxVote').serialize(), function(req) {
        $('#navVote').html(req);
      });

      return false;
    },

  // ajax forum vote
    ajaxFVote: function(id) {
     DZCP.submitButton('contentSubmitFVote');
      $.post('../votes/index.php?action=do&fajax=1&what=fvote&id=' + id, $('#navAjaxFVote').serialize(), function(req) {
        $('#navFVote').html(req);
      });

  	 return false;
  	},

  // ajax preview
    ajaxPreview: function(form) {
      var tag=doc.getElementsByTagName("textarea");
      for(var i=0;i<tag.length;i++)
      {
        var thisTag = tag[i].className;
        var thisID = tag[i].id;
        if(thisTag == "editorStyle" || thisTag == "editorStyleWord" || thisTag == "editorStyleNewsletter")
        {
          var inst = tinyMCE.getInstanceById(thisID);
          $('#' + thisID).attr('value', inst.getBody().innerHTML);
        }
      }

      $('#previewDIV').html('<div style="width:100%;text-align:center">'
                             + ' <img src="../inc/images/admin/loading.gif" alt="" />'
                             + '</div>');

      var url = prevURL;
      var addpars = (form == 'cwForm') ? '&s1=' + $('#screen1').attr('value') + '&s2=' + $('#screen2').attr('value') + '&s3=' + $('#screen3').attr('value') + '&s4=' + $('#screen4').attr('value') : '';
      $.post(url, $('#' + form).serialize() + addpars, function(req) {
        $('#previewDIV').html(req);
      });
    },

  // confirm delete
    del: function(txt) {
      txt = txt.replace(/\+/g, ' ');
      txt = txt.replace(/oe/g, '�');

      return confirm(txt + '?');
    },

  // forum search
    hideForumFirst: function() {
      $('#allkat').attr('checked', false);
    },

    hideForumAll: function() {
    	for(var i = 0; i < doc.forms['search'].elements.length; i++)
    	{
    		var box = doc.forms['search'].elements[i];

        if(box.id.match(/k_/g))
    		  box.checked = false;
    	}
    },

  // Google Maps API
    googleAPI: function(overlay) {
    // init
      map = new GMap2($("#memberMap")[0]);
      map.addControl(new GLargeMapControl());
      map.addControl(new GMapTypeControl());

    // functions needed
      function initMember(point, userInfo, team)
      {
        var icon = new GIcon();

        if(team == 1) icon.image = '../inc/images/mappin_team.png';
        else icon.image = '../inc/images/mappin.png';

        icon.iconSize = new GSize(20, 34);
        icon.iconAnchor = new GPoint(10, 32);
        icon.infoWindowAnchor = new GPoint(10, 2);

        var marker = new GMarker(point,icon);
        GEvent.addListener(marker, "mouseover", function() { DZCP.showInfo(userInfo); });
        GEvent.addListener(marker, "mouseout", function() { DZCP.hideInfo(); });
        GEvent.addListener(marker, "click", function() { DZCP.hideInfo();map.showMapBlowup(marker.getPoint(),5); });
        map.addOverlay(marker);
      }

      function handle(delta)
      {
       	var s = '';
       	if (delta < 0) s += "down";
       	else           s += "up";
       	if(s == "down") map.zoomOut();
       	if(s == "up")   map.zoomIn();
      }

      var mt = map.getMapTypes();
      for (var i=0; i<mt.length; i++) {
        mt[i].getMinimumResolution = function() {return 4;};
        mt[i].getMaximumResolution = function() {return 17;};
      }

      map.setCenter(new GLatLng(51.200000, 12.50000), 6);
      /*map.setMapType(G_HYBRID_MAP);*/
      new GKeyboardHandler(map);
      map.addControl(new GMapTypeControl());
    // initialize overlays
      eval(overlay);
    },

  // disable submit button
    submitButton: function(id) {
      submitID = (id) ? id : 'contentSubmit';

      $('#' + submitID).attr("disabled", true);
      $('#' + submitID).css('color', '#909090');
      $('#' + submitID).css('cursor', 'default');

      return true;
    },

  // Newticker
    initTicker: function(objID, to, ms) {
     // set settings
      tickerTo[tickerc] = (to == 'h' || to == 'v') ? to : 'v';
      tickerSpeed[tickerc] = (parseInt(ms) <= 10) ? 10 : parseInt(ms);

     // prepare  object
      var orgData = $('#' + objID).html();
      var newData  = '  <div id="scrollDiv' + tickerc +'" class="scrollDiv" style="position:relative;left:0;z-index:1">';
          newData += '    <table id="scrollTable' + tickerc +'" class="scrolltable"  cellpadding="0" cellspacing="0">';
          newData += '      <tr>';
          newData += '        <td onmouseover="clearTimeout(mTimer[' + tickerc +'])" onmouseout="DZCP.startTickerDiv(' + tickerc +')">';
          for(var i=0;i<10;i++) newData += orgData;
          newData += '        </td>';
          newData += '      </tr>';
          newData += '    </table>';
          newData += '  </div>';

      $('#' + objID).html(newData);
     // start ticker
      window.setTimeout("DZCP.startTickerDiv("+tickerc+");",1500);
      tickerc++;
    },

    startTickerDiv: function(subID) {
      tableObj        = $('#scrollTable' + subID)[0];
      obj             = tableObj.parentNode;
      objWidth        = (tickerTo[subID] == 'h') ? tableObj.offsetWidth : tableObj.offsetHeight;
      newWidth        = (Math.floor(objWidth/2)*2)+2;
      obj.style.width = newWidth;

      mTimer[subID] = setInterval("DZCP.moveDiv('"+obj.id+"', " + newWidth + ", " + subID + ");", tickerSpeed[subID]);
    },

    moveDiv: function(obj, width, subID) {
      var thisObj = $('#' + obj)[0];
      if(tickerTo[subID] == 'h') thisObj.style.left = (parseInt(thisObj.style.left) <= (0-(width/2)+2)) ? 0 : parseInt(thisObj.style.left)-1 + 'px';
      else thisObj.style.top = (thisObj.style.top == '' || (parseInt(thisObj.style.top)<(0-(width/2)+6))) ? 0 : parseInt(thisObj.style.top)-1 + 'px';
    },

  // ADD FLASH
    addFlash: function() {
      var ret = new Object(); ret.embedAttrs = new Object(); ret.params = new Object(); ret.objAttrs = new Object();
      var def = new Array('menu|false', 'quality|high', 'wmode|transparent', 'classid|clsid:d27cdb6e-ae6d-11cf-96b8-444553540000', 'type|application/x-shockwave-flash');

      for(var i=0; i<arguments.length; i=i+2)
      {
        ret.objAttrs[arguments[i]]   = arguments[i+1];
        ret.embedAttrs[arguments[i]] = ret.params[arguments[i]] = arguments[i+1];
        ret.params[arguments[i]]     = arguments[i+1];
      }

      for(var i=0; i<def.length; i++)
      {
        var s = def[i].split('|');
        if(!ret.params[s[0]])
        {
          ret.objAttrs[s[0]]   = s[1];
          ret.embedAttrs[s[0]] = s[1];
          ret.params[s[0]]     = s[1];
        }
      }

      var c = '<object ';
      for(var i in ret.objAttrs)   c += i + '="' + ret.objAttrs[i] + '" '; c += '>';
      for(var i in ret.params)     c += '<param name="' + i + '" value="' + ret.params[i] + '" /> ';  c += '<embed ';
      for(var i in ret.embedAttrs) c += i + '="' + ret.embedAttrs[i] + '" '; c += ' ></embed></object>';

      doc.write(c);
    }
  }

// load global events
  $(document).ready(function() {
    DZCP.init();
    DZCP.resizeImages();
  });