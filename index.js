require('dotenv').config();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Get the base URL from .env file or set it to an empty string
let baseUrl = process.env.FIREBASE_STORAGE_URL || '';

// Readline configuration to capture user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


// Prompt the user for the URL if not configured in the environment
function askForUrl() {
    return new Promise((resolve) => {
        rl.question('Enter your Firebase Storage URL: ', (url) => {
            if (!url || !url.startsWith('https://firebasestorage.googleapis.com')) {
                console.error('Invalid URL. It must start with "https://firebasestorage.googleapis.com". Example: https://firebasestorage.googleapis.com/v0/b/test-bucket.appspot.com/o');
                process.exit(1);
            }
            resolve(url.endsWith('/') ? url.slice(0, -1) : url);
            rl.close();
        });
    });
}

// Get the base URL (from the code or user input)
async function getBaseUrl() {
    if (!baseUrl) {
        baseUrl = await askForUrl();
    } else if (!baseUrl.startsWith('https://firebasestorage.googleapis.com')) {
        console.error('Invalid URL. It must start with "https://firebasestorage.googleapis.com". Example: https://firebasestorage.googleapis.com/v0/b/test-bucket.appspot.com/o');
        process.exit(1);
    }
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return baseUrl;
}

// Extract the bucket name from the URL
function extractBucketName(url) {
    const match = url.match(/v0\/b\/([^\/]+)\.appspot\.com\//);
    if (!match || match.length < 2) {
        console.error('Failed to extract the bucket name from the provided URL.');
        process.exit(1);
    }
    return match[1].split('.')[0];
}

// Fetch items with pagination
async function fetchItems(baseUrl, pageToken = '') {
    try {
        const url = `${baseUrl}${pageToken ? `?pageToken=${pageToken}` : ''}`;
        const { data } = await axios.get(url);

        return data.nextPageToken ? [...data.items, ...(await fetchItems(baseUrl, data.nextPageToken))] : data.items;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        process.exit(1);
    }
}

// Format the download URL for each item
function formatDownloadUrl(baseUrl, item) {
    return `${baseUrl}/${encodeURIComponent(item.name)}?alt=media`;
}

// Download an image and save it to the specified path
async function downloadImage(url, outputPath) {
    try {
        const response = await axios({ url, responseType: 'stream' });
        await fs.ensureDir(path.dirname(outputPath));
        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
    }
}

// Main function to handle downloads
async function main() {
    const url = await getBaseUrl();
    const bucketName = extractBucketName(url);

    const downloadDirectory = path.join(__dirname, 'firebase-storage-downloader', bucketName);
    console.log(`Fetching items from: ${url}`);
    console.log(`Downloading to: ${downloadDirectory}`);

    const items = await fetchItems(url);

    for (const item of items) {
        const downloadUrl = formatDownloadUrl(url, item);
        const outputPath = path.join(downloadDirectory, item.name);

        console.log(`Downloading ${downloadUrl} to ${outputPath}...`);
        await downloadImage(downloadUrl, outputPath);
    }

    console.log('All downloads completed.');
}

// Execute main function
main();