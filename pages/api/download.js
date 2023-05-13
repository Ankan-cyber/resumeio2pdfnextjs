import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { sid } = req.query;
    const filePath = path.join(process.cwd(), `./public/pdfs/${sid}.pdf`);

    try {
        fs.accessSync(filePath, fs.constants.R_OK);
    } catch (err) {
        console.error(err);
        return res.status(404).send('File not found');
    }

    res.setHeader('Content-disposition', `attachment; filename=${sid}.pdf`);
    res.setHeader('Content-type', 'application/pdf');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
        console.error(err);
        return res.status(500).send('Error sending the file');
    });
    fileStream.on('close', () => {
        // Delete the file after it has been sent to the user
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`File ${filePath} deleted successfully`);
            }
        });
    });
}