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
        'lines': 20,
        'output': true
    };

    var optionsKey = 'options.remotetail';

    var retryConnection = function(delay) {
        var me = this;
        console.log('jQuery.remotetail: Plan to retry in ' + delay + ' secs');
        setTimeout(function() {
            console.log('jQuery.remotetail: Trying to connect ...');
            connect.apply(me);
        }, delay * 1000);
    };

    var connect = function() {
        var options = this.data(optionsKey);
        
        var connectionString = 'ws://' + options['host'] + ':' + options['port'];

        var me = this;
        
        ws = new WebSocket(connectionString);
        ws.onopen = function() {
            console.log("jQuery.remotetail: Connected");
            var cmd = {
                'path': options['path'],
            };
            if (typeof(options['follow']) != 'undefined'
                    && options['follow'])
                cmd['follow'] = true;
            if (typeof(options['lines']) != 'undefined')
                cmd['lines'] = options['lines'];
            ws.send(JSON.stringify(cmd));
        };
        ws.onmessage = function(e) {
            if (!options['output'])
                return;
            
            // get element for new line
            var detachedElementKey = 'detachedElement.remotetail';
            var detachedElement = me.data(detachedElementKey);
            var lineElement = (detachedElement?detachedElement:$('<p>'));
            detachedElement = null;

            // fill
            lineElement.text(e.data);

            // get total lines in container
            var linesInContainerKey = 'linesInContainer.remotetail';
            var linesInContainer = me.data(linesInContainerKey);
            if (typeof(linesInContainer) == 'undefined')
                linesInContainer = 0;

            // append to container
            me.append(lineElement);
            ++linesInContainer;

            // detach the rest
            if (linesInContainer > options['maxLines']) {
                detachedElement = me.find('p:first-child').detach();
                --linesInContainer;
            }

            // save detachedElement
            me.data(detachedElementKey, detachedElement);
            // save total lines
            me.data(linesInContainerKey, linesInContainer);

            // Trigger event 'message'
            me.trigger('message');
        };
        ws.onerror = function() {
            $.error("jQuery.remotetail: Error");
        };
        ws.onclose = function() {
            console.log("jQuery.remotetail: Connection closed");
            retryConnection.apply(me, [3]);
        };
    };

    var methods = {
        'init': function(options) {
            options = $.extend(true, {}, defaultOptions, options);

            if (typeof(options['host']) == 'undefined')
                $.error("Parameter 'host' is required by jQuery.remotetail");
            if (typeof(options['port']) == 'undefined')
                $.error("Parameter 'port' is required by jQuery.remotetail");
            if (typeof(options['path']) == 'undefined')
                $.error("Parameter 'path' is required by jQuery.remotetail");

            this.data(optionsKey, options);

            connect.apply(this);

            return this;
        },
        'toggle': function() {
            var options = this.data(optionsKey);
            options['output'] = !options['output'];
            this.data(optionsKey, options);

            return this;
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
