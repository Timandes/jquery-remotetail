# jQuery.remotetail

## Examples

### Basic Usage
```
$('#console').remotetail({
        'host': 'localhost',
        'port': 64447,
    });
```

### Limit Lines
RemoteTail will remove the old lines automatically when new lines arrived.
Default: 100
```
$('#console').remotetail({
        'host': 'localhost',
        'port': 64447,
        'maxLines': 20,
    });
```

### Toggle Display
Output new lines or not.
```
$('#console').remotetail('toggle');
```

