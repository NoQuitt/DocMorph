import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProcessService } from './process.service';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async processFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Res() res: Response,
  ) {
    const { query, enableExtract, enableFill } = body;

    let extractedData = null;
    let filledFilePath = null;

    try {
      // Estrazione dei dati (se abilitata)
      if (enableExtract === 'true' && files[0]) {
        extractedData = await this.processService.extractData(
          files[0].path,
          query,
        );
      }

      // Compilazione del file (se abilitata)
      if (enableFill === 'true' && files[1]) {
        const dataToFill = extractedData || JSON.parse(query);
        filledFilePath = await this.processService.fillData(
          files[1].path,
          dataToFill,
        );
      }

      // Cleanup dei file originali
      files.forEach((file) => this.processService.cleanUp(file.path));

      // Costruzione della risposta
      const response = { extractedData };

      if (filledFilePath) {
        response['downloadLink'] = `/download?file=${filledFilePath}`;
      }

      res.json(response);
    } catch (error) {
      console.error('Errore nel processo:', error);
      res.status(500).json({ error: 'Errore durante il processo.' });
    }
  }
}
