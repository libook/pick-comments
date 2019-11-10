'use strict';

const FS = require('fs').promises;
const glob = require('glob');

/**
 * Read a file.
 * @param {String} path
 * @return {Promise}
 */
const readFile = (path) => FS.readFile(path, 'utf8');

/**
 * @typedef Line
 * @type {Object}
 * @property {String} filePath
 * @property {Number} number
 * @property {String} content
 */

/**
 * @typedef Comment
 * @type {Object}
 * @property {String} filePath
 * @property {Line[]} lineList
 */

/**
 * @typedef FileWithContent
 * @type {Object}
 * @property {String} filePath
 * @property {Comment[]} commentList
 */

/*
{
    "filePath": String,
    "commentList": [
        {
            "filePath": String,
            "lineList": [
                {
                    "filePath": String,
                    "number": Number,
                    "content": String,
                },
            ],
        },
    ],
}
 */

/**
 * @param filePath
 * @returns {Comment}
 */
const initComment = (filePath) => ({
    filePath,
    "lineList": [],
});

/**
 * @param {String} content - Whole content of a file
 * @param {String} tagName - Tag name without '@'
 * @param {String} filePath
 * @returns {FileWithContent} - The key of map of commentList is line number; the value is line content.
 */
const pickComments = (content, tagName, filePath) => {
    const tagRegExp = new RegExp(`^@${tagName}$`);
    const fileWithContentList = {
        filePath,
        "commentList": [],
    };

    const lineList = content.split('\n');

    let isInComment = false;
    let isUri = false;
    let currentComment = initComment(filePath);
    for (const lineIndex in lineList) {
        const lineContent = lineList[lineIndex];
        if (lineContent.trim().length !== 0) {
            if (!isInComment) {
                if (/\/\*/g.test(lineContent)) {
                    /*
                    This is the start of comment line.
                     */
                    isInComment = true;
                }
            } else {
                if (/\*\//g.test(lineContent)) {
                    /*
                    This is the end of comment line.
                     */
                    isInComment = false;
                    if (isUri && currentComment.lineList.length > 0) {
                        fileWithContentList.commentList.push(currentComment);
                    }
                    isUri = false;
                    currentComment = initComment(filePath);
                } else if (tagRegExp.test(lineContent.trim())) {
                    /*
                    This is the line which containing the tag name.
                     */
                    isUri = true;
                } else {
                    /*
                    Line in comment.
                     */
                    currentComment.lineList.push({
                        filePath,
                        "number": (Number(lineIndex) + 1),
                        "content": lineContent,
                    });
                }
            }
        }
    }

    return fileWithContentList;
};

/**
 * @param path
 * @param tagName
 * @returns {Promise<AsyncIterableIterator<Promise<FileWithContent>>>}
 */
module.exports = async function (path, tagName) {
    const filePathList = await new Promise((resolve, reject) => {
        glob(path, (error, filePathList) => {
            if (error) {
                reject(error);
            } else {
                resolve(filePathList);
            }
        });
    });

    const fileWithContentAsyncIterator = (async function* () {
        for (const filePath of filePathList) {
            yield readFile(filePath)
                .then((sourceCode) => pickComments(sourceCode, tagName, filePath));
        }
    })();

    return fileWithContentAsyncIterator;
};

module.exports.pickComments = pickComments;
