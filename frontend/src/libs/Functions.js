/** @format */

import JSZip from "jszip";
import { LogThis, LoggerSettings } from "../libs/Logger";

const srcFileName = "Functions.js";

export const zipFile = async (fileName, file) => {
  const zip = new JSZip();
  zip.file(fileName, file);

  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
};

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const stringToBlob = (text) => {
  const contentType = "text/plain";
  return new Blob([text], { type: contentType });
};

export const unzipFile = async (compressedFileContents, fileName) => {
  const functionName = "unzipFile";
  const log = new LoggerSettings(srcFileName, functionName);
  try {
    let x = 0;
    x = x + 1;

    LogThis(log, `x=${x}`);

    const zip = new JSZip();
    x = x + 1;
    LogThis(log, `x=${x}`);
    //const text = new TextDecoder().decode(compressedFileContents);
    //LogThis(log, `compressedFileContents=${text}`);

    const zipArchive = await zip.loadAsync(compressedFileContents);
    x++;
    LogThis(log, `x=${x}`);
    // Extract the content of the zip file, e.g., a text file
    const unzippedText = await zipArchive.file(fileName).async("text");
    x++;
    LogThis(log, `x=${x}`);
    LogThis(log, `unzippedText=${unzippedText}`);

    return unzippedText;
  } catch (error) {
    LogThis(log, `error=${error.message}`);
    throw error;
  }
};

export const unzipStringBase64 = async (compressedFileContents, fileName) => {
  const functionName = "unzipFile";
  const log = new LoggerSettings(srcFileName, functionName);
  try {
    let x = 0;
    x = x + 1;

    LogThis(log, `x=${x}`);

    const zip = new JSZip();
    x = x + 1;
    LogThis(log, `x=${x}`);
    //const text = new TextDecoder().decode(compressedFileContents);
    //LogThis(log, `compressedFileContents=${text}`);

    const zipArchive = await zip.loadAsync(compressedFileContents, {
      base64: true,
    });
    x++;
    LogThis(log, `x=${x}`);
    // Extract the content of the zip file, e.g., a text file
    const unzippedText = await zipArchive.file(fileName).async("text");
    x++;
    LogThis(log, `x=${x}`);
    LogThis(log, `unzippedText=${unzippedText}`);

    return unzippedText;
  } catch (error) {
    LogThis(log, `error=${error.message}`);
    throw error;
  }
};

/** This function recevies a file in binary BLOB format and downloads it automatically into the calling browser
 * fileToDownload: is the file to be downloaded, is not text format but a BLOB object.
 * fileNameToUse: is the name that the browser will give to the file that is being downloaded.
 */
export const autoDownloadFileOnClientBrowser = (
  fileToDownload,
  fileNameToUse
) => {
  const url = URL.createObjectURL(fileToDownload);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileNameToUse;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const autoDownloadTextAsFileOnClientBrowser = (
  textToDownload,
  fileNameToUse
) => {
  const blob = stringToBlob(textToDownload);

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileNameToUse;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
