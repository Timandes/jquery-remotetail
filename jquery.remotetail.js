/*!
 * jQuery RemoteTail Plugin
 *
 * https://github.com/Timandes/jquery-remotetail
 * 
 * @author Timandes White <timands@gmail.com>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
(function($) {
    var defaultOptions = {
        'maxLines': 100,
        'output': true
    };

    var optionsKey = 'options.remotetail';

    var retryConnection = function(delay) {
        console.log('jQuery.remotetail: Plan to retry in ' + delay + ' secs');
        setTimeout(function() {
            console.log('jQuery.remotetail: Trying to connect ...');
            connect();
        }, delay * 1000);
    };

    var connect = function() {
        var options = this.data(optionsKey);
        
        var connectionString = 'ws://' + options['host'] + ':' + options['port'];

        var me = this;
        
        ws = new WebSocket(connectionString);
        ws.onopen = function() {
            console.log("jQuery.remotetail: Connected");
            ws.send(path);
        };
        ws.onmessage = function(e) {
            if (!options['output'])
                return;
            
            // get element for new line
            var detachedElementKey = 'detachedElement.remotetail';
            var detachedElement = this.data(detachedElementKey);
            var lineElement = (detachedElement?detachedElement:$('<p>'));
            detachedElement = null;

            // fill
            lineElement.text(e.data);

            // get total lines in container
            var linesInContainerKey = 'linesInContainer.remotetail';
            var linesInContainer = this.data(linesInContainerKey);

            // append to container
            this.append(lineElement);
            ++linesInContainer;

            // detach the rest
            if (linesInContainer > options['maxLines']) {
                detachedElement = this.find('p:first-child').detach();
                --linesInContainer;
            }

            // save detachedElement
            this.data(detachedElementKey, detachedElement);
        };
        ws.onerror = function() {
            $.error("jQuery.remotetail: Error");
        };
        ws.onclose = function() {
            console.log("jQuery.remotetail: Connection closed");
            retryConnection(3);
        };
    };

    var methods = {
        'init': function(options) {
            $.extend(true, options, defaultOptions);

            if (typeof(options['host']) == 'undefined')
                $.error("Parameter 'host' is required by jQuery.remotetail");
            if (typeof(options['port']) == 'undefined')
                $.error("Parameter 'port' is required by jQuery.remotetail");

            this.data(optionsKey, options);

            connect.apply(this);
        },
        'toggle': function() {
            var options = this.data(optionsKey);
            options['output'] = !options['output'];
            this.data(optionsKey, options);
        }
    };

    $.fn.remotetail = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof(method) === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.remotetail');
        }

        return this;
    };
})(jQuery);
