import sharp from "sharp";
import path from "path";

const ORIGEN = "/Users/vergara/Downloads";
const DESTINO = path.resolve("./public/imagenes");

const MAPEO = [
  { archivo: "Industrial_ceiling_fan_isolated_2K_202608271345.jpeg", salida: "ventilador-techo.jpg" },
  { archivo: "tempImage4CF5eV.heic_2K_202608271349.jpeg", salida: "enfriador-evaporativo.jpg" },
  { archivo: "Industrial_floor_fan_with_wheels_202608271309.jpeg", salida: "ventilador-giratorio.jpg" },
  { archivo: "tempImageHkzfc8.heic_2K_202608271341.jpeg", salida: "extractor-aire.jpg" },
  { archivo: "Industrial_floor_fan_on_wheels_202608271402.jpeg", salida: "ventilador-piso.jpg" },
];

for (const m of MAPEO) {
  await sharp(path.join(ORIGEN, m.archivo))
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(DESTINO, m.salida));
  console.log(`Actualizado: ${m.salida}`);
}
