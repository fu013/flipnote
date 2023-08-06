import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { ExcelService } from './excel.service';

interface ExcelData {
  기준국: string;
  주소: string;
  모델: string;
  X: number;
  Y: number;
  Z: number;
  안테나: string;
  인덱스: number;
  lat?: number; // Optional
  lng?: number; // Optional
  // Add other properties as needed
}

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheetData: ExcelData[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: undefined });

      const processedData = await Promise.all(sheetData.map(async (data) => {
        const { 기준국, 주소, 모델, X, Y, Z, 안테나, 인덱스, ...rest } = data;

        const [lat, lng, h] = this.excelService.xyz2gd(X, Y, Z);

        const { lat: [latDeg, latMin, latSec], lng: [lngDeg, lngMin, lngSec] } = this.excelService.degree2dms(lat, lng);

        // Convert decimal degrees to degrees, minutes, and seconds format
        const formattedLat = isNaN(latDeg) ? "NaN°NaN'NaN\"N" : `${latDeg}°${latMin}'${latSec}"N`;
        const formattedLng = isNaN(lngDeg) ? "NaN°NaN'NaN\"E" : `${lngDeg}°${lngMin}'${lngSec}"E`;

        return {
          기준국,
          주소,
          모델,
          X,
          Y,
          Z,
          안테나,
          인덱스,
          lat,
          lng,
          LAT: formattedLat,
          LNG: formattedLng,
          높이: `${h}m`,
          ...rest,
        };
      }));

      return processedData;
    } catch (error) {
      throw new Error('엑셀 파일을 읽는 중 오류가 발생했습니다.');
    }
  }
}
