# Pick comments from source code

## Install

```bash
npm i pick-comments
```

## Usage

Write comments in `./test.js`:
```javascript
/*
@myTag
Basic test, right way.
 */
console.log('This is JS program.')

```

Get comments:

```javascript
const pickComments = require('pick-comments');
const commentWithFileAsyncIterator = await pickComments('./test.js', 'myTag');
    for await(const commentWithFile of commentWithFileAsyncIterator) {
        /*
        commentWithFile:
        {
          "filePath": "./test.js",
          "commentList": [
            {
              "filePath": "./test.js",
              "lineList": [
                {
                  "filePath": "./test.js",
                  "number": 3,
                  "content": "Basic test, right way."
                }
              ]
            }
          ]
        }
         */
    }
```

Or just use core function:

```javascript
const pickComments = require('pick-comments').pickComments;
const fileWithContent = pickComments(
        `
/*
@myTag
Basic test, right way.
 */
        `,
        'myTag',
        './test.js',
    );
/*
fileWithContent:
{
  "filePath": "./test.js",
  "commentList": [
    {
      "filePath": "./test.js",
      "lineList": [
        {
          "filePath": "./test.js",
          "number": 4,
          "content": "Basic test, right way."
        }
      ]
    }
  ]
}
 */
```
