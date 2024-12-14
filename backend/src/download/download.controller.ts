import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('download')
export class DownloadController {
  @Get()
  downloadFile(@Query('file') filePath: string, @Res() res: Response) {
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File non trovato.' });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error('Errore nel download:', err);
      } else {
        fs.unlinkSync(filePath); 
      }
    });
  }
}
