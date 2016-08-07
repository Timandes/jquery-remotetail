/*!
 * jQuery RemoteTail Plugin
 *
 * https://github.com/Timandes/jquery-remotetail
 * 
 * @author Timandes White <timands@gmail.com>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
(function($) {
    $.fn.remotetail = function(host, path) {
        var hostKey = 'host.remotetail';
        this.data(hostKey, host);

        var pathKey = 'path.remotetail';
        this.data(pathKey, path);

        var options = {
            "follow": false,
            "output": true,
            "maxLines": 100
        };
        var optionsKey = 'options.remotetail';
        this.data(optionsKey, options);

        // TODO: Create elements

        checkboxFollow.click(function() {// TODO:
            follow = $(this).is(':checked');
        })
        checkboToggle.click(function() {// TODO:
            output = $(this).is(':checked');
        });

        connect.apply(this);

        return this;
    };

    function connect() {
        var hostKey = 'host.remotetail';
        var host = this.data(hostKey);
        var pathKey = 'path.remotetail';
        var path = this.data(pathKey);
        var connectionString = 'ws://' + host;

        var me = this;
        
        ws = new WebSocket(connectionString);
        ws.onopen = function() {
            console.log("jQuery RemoteTail: Connected");
            ws.send(path);
        };
        ws.onmessage = function(e) {
            var optionsKey = 'options.remotetail';
            var options = this.data(optionsKey);

            if (!options['output'])
                return;
            
            // get element for new line
            var detachedElementKey = 'detachedElement.remotetail';
            var detachedElement = this.data(detachedElementKey);
            var lineElement = (detachedElement?detachedElement:$('<p>'));
            detachedElement = null;


            // fill
            lineElement.text(e.data);

            // get container
            var containerKey = 'container.remotetail';
            var container = this.data(containerKey);

            // get total lines in container
            var linesInContainerKey = 'linesInContainer.remotetail';
            var linesInContainer = this.data(linesInContainerKey);

            // append to container
            container.append(lineElement);
            ++linesInContainer;

            // detach the rest
            if (linesInContainer > options['maxLines']) {
                detachedElement = container.find('p:first-child').detach();
                --linesInContainer;
            }

            // save detachedElement
            this.data(detachedElementKey, detachedElement);

            if (options['follow'])
                $(document).scrollTop($(document).height() - $(window).height());
 
        };
        ws.onerror = function() {
            $.error("jQuery RemoteTail: Error");
        };
        ws.onclose = function() {
            console.log("jQuery RemoteTail: Connection closed");
            retryConnection(3);
        };
    }

    function retryConnection(delay) {
        console.log('jQuery RemoteTail: Plan to retry in ' + delay + ' secs');
        setTimeout(function() {
            console.log('jQuery RemoteTail: Trying to connect ...');
            connect();
        }, delay * 1000);
    };

})(jQuery);
