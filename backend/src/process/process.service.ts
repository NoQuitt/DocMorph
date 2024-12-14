import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as mime from 'mime-types';
import axios from 'axios';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import * as csv from 'csv-parser';
import pdfParse from 'pdf-parse';

@Injectable()
export class ProcessService {
  // Estrattore per file DOCX
  private async extractDocxContent(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    const { value: text } = await mammoth.extractRawText({ buffer: fileBuffer });
    return text;
  }

  // Estrattore per file XLSX
  private async extractXlsxContent(filePath: string): Promise<string> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Legge il primo foglio
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_csv(sheet); // Converte in CSV per comodità
  }

  // Estrattore per file CSV
  private async extractCsvContent(filePath: string): Promise<string> {
    const rows = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', () => resolve(JSON.stringify(rows)))
        .on('error', (error) => reject(error));
    });
  }

  // Estrattore per file PDF
  private async extractPdfContent(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  }

  // Estrattore per file TXT
  private async extractTxtContent(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }

  // Processore generico
  async processWithGrok(
    filePath: string,
    prompt: string,
    systemPrompt: string,
  ): Promise<any> {
    const fileExtension = mime.extension(mime.lookup(filePath) || '');
  
    let fileContent = '';
    if (fileExtension === 'docx') {
      fileContent = await this.extractDocxContent(filePath);
    } else if (fileExtension === 'xlsx') {
      fileContent = await this.extractXlsxContent(filePath);
    } else if (fileExtension === 'csv') {
      fileContent = await this.extractCsvContent(filePath);
    } else if (fileExtension === 'pdf') {
      fileContent = await this.extractPdfContent(filePath);
    } else if (fileExtension === 'txt') {
      fileContent = await this.extractTxtContent(filePath);
    } else {
      throw new Error(`Formato file non supportato: ${fileExtension}`);
    }
  
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Contenuto del file:\n${fileContent}` },
      { role: 'user', content: prompt },
    ];
  
    // Chiamata a Grok AI
    const response = await axios.post(
      `https://api.x.ai/v1/chat/completions`,
      {
        model: 'grok-beta',
        messages,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
  
    const rawContent = response.data.choices[0].message.content.trim();
  
    const jsonMatch = rawContent.match(/```json\n([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (error) {
        console.error('Errore durante il parsing del JSON delimitato:', error);
        throw new Error('Il JSON delimitato non è valido.');
      }
    }
  
    try {
      return rawContent;
    } catch (error) {
      console.error('Errore durante il parsing del JSON grezzo:', error);
      console.error('Contenuto ricevuto:', rawContent);
      throw new Error('Risultato non contiene un JSON valido.');
    }
  }
  

  // Estrazione dei dati
  async extractData(filePath: string, prompt: string): Promise<any> {
    const systemPrompt = 'Devi analizzare il file fornito ed estrarre esclusivamente i dati sensibili in formato JSON. Non aggiungere testo aggiuntivo o spiegazioni.';
    return await this.processWithGrok(filePath, prompt, systemPrompt);
  }

  // Compilazione dei dati
  async fillData(filePath: string, data: any): Promise<string> {
    const systemPrompt = 'Devi sostituire i dati specificati nel file seguente. Restituisci il contenuto del file aggiornato senza aggiungere testo aggiuntivo.';
    if (typeof data === 'object') data = JSON.stringify(data);
    const prompt = `Dati da sostituire:\n${data}`;

    const aiResponse = await this.processWithGrok(filePath, prompt, systemPrompt);

    const fileExtension = mime.extension(mime.lookup(filePath) || 'txt');
    const updatedFilePath = `results/filled_document_${Date.now()}.${fileExtension}`;
    await fs.writeFile(updatedFilePath, aiResponse);
    return updatedFilePath;
  }

  // Cleanup file temporanei
  async cleanUp(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  }
}
