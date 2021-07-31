let fs = require("fs");
let path = require("path");
const { deflate } = require("zlib");


let inputArr = process.argv.slice(2);

// 1  seperate options and filepaths
let options = [];
let filePaths = [];
for(let i = 0; i < inputArr.length; i++) {
    if(inputArr[i] == '-s' || inputArr[i] == '-n' || inputArr[i] == '-b') {
        options.push(inputArr[i]);
    }
    else {
        filePaths.push(inputArr[i]);
    }
}


// 2 check whether all filePaths valid or not
let fileExists = true;
for(let i = 0; i < filePaths.length; i++) {
   if( fs.existsSync(filePaths[i]) == false) {
       fileExists = false;
       break;
   }
}

// 3  content reading from given filePaths
if(fileExists) {
    let concatenatedContent = contentReadFromFilePaths();

    let concatenatedContentArr = concatenatedContent.split("\n");
    concatenatedContentArr = removeSlashn(concatenatedContentArr);
    //  console.log(concatenatedContentArr);
    let concatenatedContentString =  contentModifiedWithOptions(concatenatedContentArr);
    console.log(concatenatedContentString);
}
else {
    console.log("File doesn't Exist ");
}


// read content of files 
function contentReadFromFilePaths() {
    let content = "";
    for(let i = 0; i < filePaths.length; i++) {
        content += fs.readFileSync(filePaths[i] );
        content += "\n"; // next file separated with \n
    }
    return content;
}

function removeSlashn(contentArr) {
    for(let i = 0; i < contentArr.length; i++) {
        if(contentArr[i] == '' && contentArr[i - 1] == '') {
            contentArr.splice(i--, 1);
             // i-- becoz we remove nd move one index forward, which results,  missing one index to be checked 
             // similar to removePrimes Question 
        }
    }
    // console.log(contentArr);
    return contentArr;
}


/**
 * @returns A string of modified content using given options
 * @param  contentArr an array of string
 */
function contentModifiedWithOptions(contentArr) {

    // 1 dealing with '-s' 
    let isPresent = options.includes("-s");

    let opt = options.indexOf("-s");

    if(opt != -1) {
        for(let i = 0; i < contentArr.length - 1; i++) {
            if(contentArr[i] != '' && contentArr[i + 1] != '') {
                contentArr[i]  += '\n';
                // contentArr.splice(i, 0, "\n");
                // i++;
            }
        }
        //    console.log("after -s ", contentArr);
            if(options.length == 1) { // only one option i.e -s
                let contentString = contentArr.join("\n");
                return contentString;
            }
            options.splice(0, 1); // removed -s
        }

    // 2 dealing with -n and -b
    switch(options[0]) {
        case  '-n' : 
           contentArr = lineNumbering(contentArr);
        //    console.log("after -n", contentArr);
                return contentArr.join("\n");

        case '-b' : 
           contentArr = lineNumberingNonEmpty(contentArr);
        //    console.log("after -b", contentArr);
                return contentArr.join("\n");

        default : console.log("Wrong Option: valid options are \n -s \n -n \n -b");

    }
    
}

//  only non-empty lines are numbered
function lineNumberingNonEmpty(contentArr) {
    let lineNo = 1
    for(let i = 0; i < contentArr.length; i++) {
        if(contentArr[i] != '') { // non - empty line  checking  
            contentArr[i] = `${lineNo++} ` + contentArr[i];
        }
    }
    return contentArr;
}

// all lines are numbered
function lineNumbering(contentArr) {
    for(let i = 0, lineNo = 1; i < contentArr.length; i++, lineNo++) {
        contentArr[i] = `${lineNo} ` + contentArr[i];
    }
    // console.log(contentArr);
    return contentArr;
}


