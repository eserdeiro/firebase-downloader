# Firebase Storage Downloader

This project provides a script to download all files from a given Firebase Storage bucket. It organizes the downloaded files into structured directories according to the bucket name.

## Prerequisites

- Node.js and npm installed. You can download it from [Node.js](https://nodejs.org/).
- A valid Firebase Storage URL in the format: 
  ```
  https://firebasestorage.googleapis.com/v0/b/<your-bucket-name>.appspot.com/o
  ```

## Installation

1. Clone this repository or copy the provided script to a new directory.
2. Open a terminal and navigate to the project directory.
3. Install the required dependencies by running:
   ```bash
   npm install axios fs-extra path readline dotenv
   ```

## Configuration

The script allows two ways to provide the Firebase Storage URL:

1. **.env File**: Create a `.env` file in the project root and add the Firebase Storage URL as follows:
   ```
   FIREBASE_STORAGE_URL=https://firebasestorage.googleapis.com/v0/b/<your-bucket-name>.appspot.com/o
   ```
   Make sure to install the `dotenv` package to load environment variables from the `.env` file.

2. **Manual Input**: If the `.env` file is not set or the variable is not defined, the script will prompt you to enter the Firebase Storage URL when it runs.

## Usage

1. Run the script using the following command:
   ```bash
   node index.js
   ```

2. If no URL is predefined via the `.env` file, you will be prompted to enter the Firebase Storage URL.

3. The downloaded files will be saved in the following directory structure:
   ```
   ./firebase-storage-downloader/<bucket-name>/
   ```

## Error Handling

- If an invalid URL is provided, the script will exit with an error message.
- If no URL is provided during the prompt, the script will terminate with:
  ```
  Invalid URL. It must start with "https://firebasestorage.googleapis.com".
  ```

## Example

Given a URL:
```
https://firebasestorage.googleapis.com/v0/b/downloader-test-3c7ac.appspot.com/o
```

The files will be saved in:
```
./firebase-storage-downloader/downloader-test/
```

## Notes

- The script uses pagination to ensure all items are fetched from the Firebase Storage bucket.
- It creates directories as needed to match the structure of the bucket and saves each file accordingly.

## Dependencies

The following dependencies are used in this script:

- **axios**: To make HTTP requests to Firebase Storage.
- **fs-extra**: To handle file system operations, such as ensuring directories exist.
- **path**: To work with file and directory paths.
- **readline**: To handle user input when the URL is not predefined.
- **dotenv**: To load environment variables from a `.env` file.

## Environment Variables

To run the script without manual input, you can set the following environment variable in a `.env` file:
- `FIREBASE_STORAGE_URL`: The URL of your Firebase Storage bucket.

## License

This project is licensed under the MIT License.