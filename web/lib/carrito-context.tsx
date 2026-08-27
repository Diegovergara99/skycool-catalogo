"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  carritoReducer,
  subtotalCarrito,
  type AccionCarrito,
  type ItemCarrito,
} from "./carrito-reducer";

const CLAVE_STORAGE = "skycool-carrito";

interface CarritoContextValor {
  items: ItemCarrito[];
  subtotal: number;
  cantidadTotal: number;
  abierto: boolean;
  /**
   * `true` una vez que el carrito terminó de leer cualquier estado
   * persistido de localStorage al montar. Los consumidores que necesiten
   * confiar en `items`/`cantidadTotal` como autoritativos en el primer
   * render (por ejemplo, antes de mostrar un mensaje de "carrito vacío",
   * vaciar el carrito, o disparar un evento de analytics) deben esperar a
   * que esta bandera sea `true` primero — antes de la hidratación, `items`
   * siempre es `[]` sin importar lo que realmente esté persistido.
   *
   * Motivo: los efectos de un componente hijo se disparan ANTES que los
   * efectos propios de `CarritoProvider` (React ejecuta los efectos de
   * montaje de forma bottom-up), así que cualquier consumidor que actúe
   * sobre el carrito sin esperar esta bandera corre el riesgo de que la
   * hidratación posterior sobreescriba su acción con los datos guardados
   * previamente (por ejemplo, vaciar el carrito y luego verlo repoblarse).
   */
  hidratado: boolean;
  agregarProducto: (item: ItemCarrito) => void;
  quitarProducto: (clave: string) => void;
  actualizarCantidad: (clave: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextValor | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  // El estado inicial siempre es [] (tanto en servidor como en cliente) para
  // evitar un mismatch de hidratación: el servidor nunca tiene acceso a
  // localStorage, así que el primer render del cliente debe coincidir con el
  // del servidor. Los datos guardados se cargan después, en un efecto que
  // solo corre en el cliente tras el montaje.
  const [items, dispatch] = useReducer(
    (state: ItemCarrito[], accion: AccionCarrito) => carritoReducer(state, accion),
    []
  );
  const [abierto, setAbierto] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  // Evita que el efecto de persistencia escriba "[]" en localStorage antes de
  // que el efecto de hidratación (abajo) haya tenido oportunidad de leer los
  // datos guardados. `dispatch` solo agenda una actualización — no cambia
  // `items` de forma síncrona — así que sin esta bandera el efecto de
  // persistencia correría con el `items = []` inicial en el mismo commit del
  // montaje y sobreescribiría momentáneamente el carrito guardado. Por eso
  // este efecto está declarado ANTES que el de hidratación: React ejecuta los
  // efectos en orden de declaración, así que en el primer commit este corre
  // primero (con la bandera aún en `false`, por lo que no hace nada), y el
  // de hidratación corre después y la activa. El `dispatch(CARGAR)` (si hubo
  // datos guardados) dispara un nuevo render, en el que este efecto vuelve a
  // correr — esta vez con la bandera en `true` — y persiste correctamente.
  const haHidratado = useRef(false);

  useEffect(() => {
    if (!haHidratado.current) return;
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_STORAGE);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) {
          dispatch({ type: "CARGAR", items: parsed as ItemCarrito[] });
        }
      }
    } catch {
      // Datos corruptos en localStorage: se ignoran y se mantiene el carrito vacío.
    } finally {
      haHidratado.current = true;
      setHidratado(true);
    }
    // Solo debe ejecutarse una vez al montar, para hidratar desde localStorage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function agregarProducto(item: ItemCarrito) {
    dispatch({ type: "AGREGAR", item });
    setAbierto(true);
  }

  function quitarProducto(clave: string) {
    dispatch({ type: "QUITAR", clave });
  }

  function actualizarCantidad(clave: string, cantidad: number) {
    dispatch({ type: "ACTUALIZAR_CANTIDAD", clave, cantidad });
  }

  function vaciarCarrito() {
    dispatch({ type: "VACIAR" });
  }

  const valor: CarritoContextValor = {
    items,
    subtotal: subtotalCarrito(items),
    cantidadTotal: items.reduce((acc, i) => acc + i.cantidad, 0),
    abierto,
    hidratado,
    agregarProducto,
    quitarProducto,
    actualizarCantidad,
    vaciarCarrito,
    abrirCarrito: () => setAbierto(true),
    cerrarCarrito: () => setAbierto(false),
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContextValor {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return contexto;
}
