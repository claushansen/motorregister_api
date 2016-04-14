(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = false;
    po.src = 'https://cdn.rawgit.com/claushansen/iframe-resizer/master/js/iframeResizer.min.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);


iFrameResize({
    log                     : true,                  // Enable console logging
    enablePublicMethods     : true,                  // Enable methods within iframe hosted page
    resizedCallback         : function(messageData){ // Callback fn when resize is received
        $('p#callback').html(
            '<b>Frame ID:</b> '    + messageData.iframe.id +
            ' <b>Height:</b> '     + messageData.height +
            ' <b>Width:</b> '      + messageData.width +
            ' <b>Event type:</b> ' + messageData.type
        );
    },
    messageCallback         : function(messageData){ // Callback fn when message is received
        $('p#callback').html(
            '<b>Frame ID:</b> '    + messageData.iframe.id +
            ' <b>Message:</b> '    + messageData.message
        );
        alert(messageData.message);
    },
    closedCallback         : function(id){ // Callback fn when iFrame is closed
        $('p#callback').html(
            '<b>IFrame (</b>'    + id +
            '<b>) removed from page.</b>'
        );
    }
});

})();
