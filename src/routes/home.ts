import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
    // Extract the URL path
    const urlPath = req.url === '/' ? '/index.html' : req.url;

    // Determine the content type based on the file extension
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        // Add more content types as needed (e.g., CSS, images)
    }[path.extname(urlPath)];

    // If the content type is not recognized or if it's not an HTML or JS file, return 404
    if (!contentType) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
        return;
    }

    // Construct the absolute path to the file
    const filePath = path.join(__dirname, '../../front-end', urlPath);

    // Read the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Error handling
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            // Send the file content with appropriate content type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

export { router as homeRouter };
