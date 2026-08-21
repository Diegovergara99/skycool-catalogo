import sharp from "sharp";
import path from "path";

const ORIGEN = path.resolve("../reference/catalogos-original");
const DESTINO = path.resolve("./public/imagenes");

const RECORTES = [
  { archivo: "producto-extractor-aire.jpeg", salida: "extractor-aire.jpg", left: 110, top: 215, width: 580, height: 510 },
  { archivo: "producto-ventilador-piso.jpeg", salida: "ventilador-piso.jpg", left: 120, top: 170, width: 540, height: 440 },
  { archivo: "producto-ventilador-giratorio.jpeg", salida: "ventilador-giratorio.jpg", left: 100, top: 170, width: 660, height: 550 },
  { archivo: "producto-enfriador-evaporativo.jpeg", salida: "enfriador-evaporativo.jpg", left: 180, top: 165, width: 480, height: 545 },
  { archivo: "producto-ventilador-techo.jpeg", salida: "ventilador-techo.jpg", left: 50, top: 220, width: 800, height: 240 },
];

for (const r of RECORTES) {
  await sharp(path.join(ORIGEN, r.archivo))
    .extract({ left: r.left, top: r.top, width: r.width, height: r.height })
    .toFile(path.join(DESTINO, r.salida));
  console.log(`Recortado: ${r.salida}`);
}
