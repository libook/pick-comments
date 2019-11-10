'use strict';

const assert = require('assert');
const pickCommentsWithPath = require('./lib');
const pickComments = pickCommentsWithPath.pickComments;

it('Basic test, right way.', async () => {
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
    assert.strictEqual(
        fileWithContent.commentList[0].lineList[0].content, 'Basic test, right way.',
    );
});

it('Test wrong tag name.', async () => {
    const fileWithContent = pickComments(
        `
/*
@yourTag
Test wrong tag name.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList.length, 0,
    );
});

it('Test no tag name.', async () => {
    const fileWithContent = pickComments(
        `
/*
Test no tag name.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList.length, 0,
    );
});

it('Wrong tag name position 1.', async () => {
    const fileWithContent = pickComments(
        `
/*@myTag
Wrong tag name position 1.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList.length, 0,
    );
});

it('Wrong tag name position 2.', async () => {
    const fileWithContent = pickComments(
        `
/* @myTag
Wrong tag name position 2.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList.length, 0,
    );
});

it('Wrong content position.', async () => {
    const fileWithContent = pickComments(
        `
/*
@myTag Wrong content position.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList.length, 0,
    );
});

it('Content on above of tag name.', async () => {
    const fileWithContent = pickComments(
        `
/*
Content on above of tag name.
@myTag
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList[0].lineList[0].content, 'Content on above of tag name.',
    );
});

it('Indentation test1.', async () => {
    const fileWithContent = pickComments(
        `
/*
  @myTag
  Indentation test1.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList[0].lineList[0].content, '  Indentation test1.',
    );
});

it('Indentation test2.', async () => {
    const fileWithContent = pickComments(
        `
/*
@myTag
  Indentation test2.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList[0].lineList[0].content, '  Indentation test2.',
    );
});

it('Indentation test3.', async () => {
    const fileWithContent = pickComments(
        `
/*
  @myTag
Indentation test3.
 */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList[0].lineList[0].content, 'Indentation test3.',
    );
});

it('Indentation test4.', async () => {
    const fileWithContent = pickComments(
        `
    /*
    @myTag
    Indentation test4.
    */
        `,
        'myTag',
        './test.js',
    );
    assert.strictEqual(
        fileWithContent.commentList[0].lineList[0].content, '    Indentation test4.',
    );
});

it('Test file loader.', async () => {
    const commentWithFileAsyncIterator = await pickCommentsWithPath('./test.js', 'myTag');
    for await(const commentWithFile of commentWithFileAsyncIterator) {
        assert.strictEqual(commentWithFile.commentList.length, 6);
    }
});
