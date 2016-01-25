# hue-shift-test

Shifting image hues using canvas global composite operations

## Conclusion

Apart from fully inverting hues, it's not possible, due to the "lightness" constraints the composite operations put on their input colors - ultimately, you need to isolate and transfer channels, and you can't do that when the composite operation is declaring that certain base colors can't possibly be light enough.

Ultimately, I'm just waiting for the `filter` property on canvases, which would make this kind of composite-operation hackery completely irrelevant.
