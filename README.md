
To Build:
```
docker build -t rabbit-test .
```

To Test:

```
docker run -it --rm -e QUEUE_URI=amqp://THE_AMQP_URI_I_GAVE_YOU_GOES_HERE rabbit-test
```