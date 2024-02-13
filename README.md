# Loglow 🌟

Loglow is a flexible logging utility for Node.js, designed to enhance your console output with customizable colors, styles, and timestamps. It's perfect for developers looking for more than just the standard logging capabilities.

## Installation

To install Loglow, run the following command in your Node.js project:

```bash
npm i loglow --save-dev
```

## Usages
### Basic Logging
Loglow enables you to log messages to the console using the `add` method followed by the `print` method.
```javascript
new Loglow().add('Hello, world!').print();
// Output: Hello, world!
```

### Adding Colors and Styles
Loglow allows you to add different [colors and styles](#colors-and-styles) to your log messages. 
```javascript
new Loglow()
    .add(LogColor.Red, 'Error: Something went wrong.')
    .print();
// Output: Error: Something went wrong. <-- (in red)
```
Also, Loglow supports multiple colors and styles for a single message.
```javascript
new Loglow()
    .add(LogColor.Red, LogStyle.Bold, 'Error: Something went wrong.')
    .print();
// Output: Error: Something went wrong. <-- (in bold red)
```

### Adding Timestamps
Loglow can automatically add timestamps to your log messages using the `addTimestamp` method.
```javascript
new Loglow()
    .addTimestamp()
    .add('Hello, world!')
    .print();
// Output: 2021-01-01T12:00:00Z Hello, world!
```
Loglow also allows you tou customize the timestamp color or style.
```javascript
new Loglow()
    .addTimestamp(LogColor.Cyan)
    .print();
// Output: 2021-01-01T12:00:00Z <-- (in cyan)
```

### Adding New Lines
Loglow provides the `addNewLine` method to add new lines to your log messages.
```javascript
new Loglow()
    .add('First line.')
    .addNewLine()
    .add('Second line.')
    .print();
// Output: First line.
//         Second line.
```

### Chaining Methods
Loglow methods can be chained together to create complex log messages.
```javascript
new Loglow()
    .addTimestamp()
    .add(LogColor.Green, 'Success: Operation completed.')
    .addNewLine()
    .add(LogColor.Blue, LogStyle.Reverse, 'Details: ')
    .addNewline()
    .add('- Item 1')
    .addNewLine()
    .add('- Item 2')
    .print();
// Output: 2021-01-01T12:00:00Z Success: Operation completed. <-- (in green)
//         Details: <-- (in reverse blue)
//         - Item 1
//         - Item 2
```

## Colors and Styles
Loglow provides a set of predefined colors and styles that can be used to customize the output. Here's a list of available colors and styles:

### Colors
- `LogColor.Red`
- `LogColor.Green`
- `LogColor.Yellow`
- `LogColor.Blue`
- `LogColor.Magenta`
- `LogColor.Cyan`
- `LogColor.White`

### Styles
- `LogStyle.Reset` - Resets the style to the default
- `LogStyle.Bold` - Makes the text bold
- `LogStyle.Dim` - Makes the text dim
- `LogStyle.Italic` - Makes the text italic
- `LogStyle.Underscore` - Underlines the text
- `LogStyle.Blink` - Makes the text blink
- `LogStyle.Reverse` - Reverses the foreground and background colors

That's it! I hope you find Loglow useful for your Node.js projects!