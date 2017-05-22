# jQuery.remotetail

## Examples

### Basic Usage (Equals to `tail /var/log/message`)
```
$('#console').remotetail({
        'host': 'localhost',
        'port': 64447,
        'path': '/var/log/message'
    });
```

### Limit lines on server (Equals to `tail -n 50 /var/log/message`)
```
$('#console').remotetail({
        'host': 'localhost',
        'port': 64447,
        'path': '/var/log/message',
        'lines': 50,
    });
```

### Tail and follow (Equals to `tail -f /var/log/message`)
```
$('#console').remotetail({
        'host': 'localhost',
        'port': 64447,
        'path': '/var/log/message',
        'follow': true
    });
```

### Limit Lines on screen
RemoteTail will remove the old lines automatically when new lines arrived.
Default: 100
```
$('#console').remotetail({
        'host': 'localhost',
        'port': 64447,
        'maxLines': 20,
        'follow': true
    });
```

### Toggle Display
Output new lines or not.
```
$('#console').remotetail('toggle');
```

