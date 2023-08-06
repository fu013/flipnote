import { Injectable } from '@nestjs/common';
import { inv, re } from 'mathjs';

export interface Location {
  lat: [number, number, string];
  lng: [number, number, string];
}

@Injectable()
export class ExcelService {
  // xyz => llh
  xyz2gd(x: number, y: number, z: number): [number, number, number] {
    try {
      if (typeof x === 'string' || typeof y === 'string' || typeof z === 'string') {
        throw new Error('type error');
      }
      let Phi = 0;
      let h = 0;
      // % WGS84
      const a = 6378137.0;
      const f = 1 / 298.257223563;

      // % Hofman-Wellenhof Book, p.230-232
      const b = a * (1 - f);

      const aSQ = a ** 2;
      const bSQ = b ** 2;
      const eSQ = (aSQ - bSQ) / aSQ;

      let lon = (Math.atan2(y, x) * 180) / Math.PI;

      if (lon > 180) {
        lon = lon - 360;
      } else if (lon < -180) {
        lon = lon + 360;
      }

      const p = Math.sqrt(x ** 2 + y ** 2); //STEP 1
      let q = 0; // Initialize q here

      let Phi0 = Math.atan2(z * inv(1 - eSQ), p); //STEP 2

      while (q !== 1) {
        const N0 = aSQ / Math.sqrt(aSQ * Math.cos(Phi0) ** 2 + bSQ * Math.sin(Phi0) ** 2); //STEP 3
        h = p / Math.cos(Phi0) - N0; //STEP 4
        Phi = Math.atan2(z * inv(1 - eSQ * (N0 / (N0 + h))), p); //STEP 5

        if (Math.abs(Phi - Phi0) <= 1e-13) {
          //STEP 6
          q = 1; // Update q to terminate the loop
          break;
        } else {
          Phi0 = Phi;
        }
      }

      let lat = (Phi * 180) / Math.PI;

      lat = Number(lat.toFixed(4));
      lon = Number(lon.toFixed(4));
      h = Number(h.toFixed(4));

      return [lat, lon, h];
    } catch (error) {
      return [0, 0, 0];
    }
  }

  // LLH => 도분초
  degree2dms(lat: number, lng: number): Location {
    try {
      let latDeg;
      let latDegDeciaml;
      let latMin;
      let latMinDeciaml;
      let latSec;
      if (lat >= 0) {
        latDeg = Math.floor(lat);
        latDegDeciaml = Math.abs(lat - latDeg);

        latMin = Math.floor(latDegDeciaml * 60);
        latMinDeciaml = Math.abs(latDegDeciaml * 60 - latMin);

        latSec = (latMinDeciaml * 60).toFixed(5);
      } else {
        latDeg = Math.ceil(lat);
        latDegDeciaml = Math.abs(lat - latDeg);

        latMin = Math.floor(latDegDeciaml * 60);
        latMinDeciaml = Math.abs(latDegDeciaml * 60 - latMin);

        latSec = (latMinDeciaml * 60).toFixed(5);
      }

      let lngDeg;
      let lngDegDeciaml;
      let lngMin;
      let lngMinDeciaml;
      let lngSec;
      if (lng >= 0) {
        lngDeg = Math.floor(lng);
        lngDegDeciaml = Math.abs(lng - lngDeg);

        lngMin = Math.floor(lngDegDeciaml * 60);
        lngMinDeciaml = Math.abs(lngDegDeciaml * 60 - lngMin);

        lngSec = (lngMinDeciaml * 60).toFixed(5);
      } else {
        lngDeg = Math.ceil(lng);
        lngDegDeciaml = Math.abs(lng - lngDeg);

        lngMin = Math.floor(lngDegDeciaml * 60);
        lngMinDeciaml = Math.abs(lngDegDeciaml * 60 - lngMin);

        lngSec = (lngMinDeciaml * 60).toFixed(5);
      }

      return {
        lat: [latDeg, latMin, latSec],
        lng: [lngDeg, lngMin, lngSec],
      };
    } catch (error) {
      return {
        lat: [0, 0, '0'],
        lng: [0, 0, '0'],
      };
    }
  }
}
