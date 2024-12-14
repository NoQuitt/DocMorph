import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import axios from 'axios';
import * as mime from 'mime-types';

@Injectable()
export class ProcessService {
  async processWithGrok(
    filePath: string,
    prompt: string,
    systemPrompt: string,
  ): Promise<any> {
    const fileContent = await fs.readFile(filePath, 'utf8');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Contenuto del file:\n${fileContent}` },
      { role: 'user', content: prompt },
    ];

    const response = await axios.post(
      `https://api.x.ai/v1/chat/completions`, 
      {
        model: 'grok-2-1212', 
        messages,
        "stream": false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data; 
  }

  async extractData(filePath: string, prompt: string): Promise<any> {
    const systemPrompt = 'Estrai i dati sensibili dal file seguente in formato json.';
    return await this.processWithGrok(filePath, prompt, systemPrompt);
  }

  async fillData(filePath: string, data: any): Promise<string> {
    const systemPrompt = 'Compila o sostituisci i dati specificati nel file seguente.';
    if (typeof data === 'object') 
      data = JSON.stringify(data);
    const prompt = `Sostituisci i seguenti dati:\n${data}`;

    const aiResponse = await this.processWithGrok(filePath, prompt, systemPrompt);
    const fileExtension = mime.extension(mime.lookup(filePath) || 'txt');
    const updatedFilePath = `results/filled_document_${Date.now()}.${fileExtension}`;
    await fs.writeFile(updatedFilePath, aiResponse.result);
    return updatedFilePath;
  }

  async cleanUp(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  }
}
