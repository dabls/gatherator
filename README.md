# gatherator
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

**gatherator** helps you to fetch data from different resources and work with the response, in a fluently generator based way. 

## Installation

```js
npm install gatherator
```

## Getting started

If you ever wanted to fetch unlimited data from any kind of resource and format, the **gatherator** will be the library which makes your life easy. Out of the box we support HTTP and File resources as well as JSON and XML formated data, but you can easily create your own retrievers and parsers. After you successfully fetched your data, we also support you with the possibility to modify each single iterated value. 

> You are interested now? Give it a chance!

### Generator

#### createGenerator
Creates an async generator, which could be used to iterate through the whole response of your retriever. It takes some options to modify the retriever, parse the raw fetched data and transform the result in the way you will need it.

```js
const { createGenerator, retriever: { createHttpRetriever } } = require('../index')
const generator = await createGenerator({
  uri: 'https://mock.server.com/get-data',
  retriever: createHttpRetriever({ json: true })
})

// iterate through the generator and log out the data
for await (const data of generator) {
  console.log(data)
}
```

#### Options

| Option              | Type                | Description |
| ------------------- | ------------------- | ----------- |
| uri                 | `{string|function}` | The uri option for the retriever function. This could be a function, which returns the uri as string. |
| retriever           | `{function}`        | Provides the possibility to fetch data from the uri. |
| getRetrieverOptions | `{function}`        | Will always be executed before fetching data and gives you the possibility modify the retriever options. For example raise an `offset` property. |
| parsers             | `{[functions]}`     | A list of transformers to made the raw fetched data be readable for JavaScript. |
| transformers        | `{[functions]}`     | A list of transformers, which will be executed on each iterated value. |
| ...other            | `{*}`               | All other given options will be used as default retriever options, which can later be modified with the `getRetrieverOptions` option. |

### Retriever
Retriever functions provides the possibility to fetch data from the resource you want, with the technology you prefer.

#### createHttpRetriever
Returns a retriever function, which executes an http request with [request-promise](https://www.npmjs.com/package/request-promise).

```js
const { retriever: { createHttpRetriever } } = require('../index')
const retriever = createHttpRetriever() // takes optional options for the http operation
```

#### createFileRetriever
Returns a retriever function, which executes an file read with [fs-extra](https://www.npmjs.com/package/fs-extra).

```js
const { retriever: { createFileRetriever } } = require('../index')
const retriever = createFileRetriever() // takes optional options for the file operation
```

### Parser
Parser functions are the transformers for the raw retriever response. 
They will be used to transform the response to a valid JSON object.

#### setRootPath
Set the path to the root element we want to gather. Mostly this will be the path to a list ob objects.

```js
const { parser: { setRootPath } } = require('../index')
setRootPath('data.list') // takes the path to the root
```

#### stringToJson
Transforms the raw HTTP response from a JSON string to a valid object.

```js
const { parser: { stringToJson } } = require('../index')
stringToJson()
```

#### xmlToJson
Transforms the raw HTTP response from a XML string to a valid object, with [xml2js](https://www.npmjs.com/package/xml2js).

```js
const { parser: { xmlToJson } } = require('../index')
xmlToJson() // takes optional xml parser options
```

### Transformer
Transformer functions helps you to prepare different modification operation, which will be executed for each element after the parsing process.
The usecase for these function is just to prepare your own transformers to work with a generator.

#### map
Modifies the value by passing them to the given mapper function.

```js
const { transformer: { map } } = require('../index')
const mapRenaming = map(({ name, ...other }) => ({ ...other, name: String(name).toUpperCase() }))
```

#### filter
Filters out values by the result of the given filter function.

```js
const { transformer: { filter } } = require('../index')
const filterOutSmallNames = map(({ name }) => String(name).length >= 6)
```

#### transform
Modifies the value by passing them to the given mapper function and filters them out, if the modified value is `undefined`.

```js
const { transformer: { transform } } = require('../index')
const transformUpperCaseLongWords = map(({ name, ...other }) => {
  if (String(name).length >= 6)) {
    return { ...other, name: String(name).toUpperCase() }
  }
}
```