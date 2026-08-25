// VIDEOJUEGO DE BATALLA POR CONSOLA - POO

// Genera un numero entero aleatorio entre min y max
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Devuelve un elemento aleatorio de un array
function elegirAleatorio(array) {
  return array[getRandom(0, array.length - 1)];
}


// CLASE BASE: PERSONAJE

class Personaje {
  constructor(nombre, vida, dano, defensa, velocidad) {
    this.nombre = nombre;
    this.vidaMax = vida;
    this.vida = vida;
    this.dano = dano;
    this.defensa = defensa;
    this.velocidad = velocidad;
    this.habilidadUsada = false;
  }

  saludar() {
    console.log(`Hola, soy ${this.nombre} y soy un ${this.constructor.name}.`);
  }

  // ataque basico con los punos, disponible para todas las clases
  atacar(objetivo) {
    console.log(`${this.nombre} ataca con sus punos a ${objetivo.nombre}.`);
    this.resolverAtaque(objetivo, this.dano);
  }

  // logica de defensa que usan todos los tipos de ataque
  resolverAtaque(objetivo, danoAtaque, esCritico = false) {
    if (esCritico) {
      console.log(`¡ATAQUE CRITICO! La defensa de ${objetivo.nombre} es ignorada.`);
      objetivo.recibirDano(danoAtaque);
      return;
    }

    const valorDefensa = getRandom(1, objetivo.defensa);

    if (valorDefensa > danoAtaque) {
      console.log(`${objetivo.nombre} se defendio (Defensa: ${valorDefensa} > Dano: ${danoAtaque}). El ataque falla.`);
    } else {
      console.log(`El ataque impacta (Defensa: ${valorDefensa} <= Dano: ${danoAtaque}).`);
      objetivo.recibirDano(danoAtaque);
    }
  }

  recibirDano(cantidad) {
    this.vida -= cantidad;

    if (this.vida <= 0) {
      this.vida = 0;
      console.log(`${this.nombre} ha muerto y no podra atacar mas.`);
    } else {
      console.log(`Vida restante de ${this.nombre}: ${this.vida}/${this.vidaMax}`);
    }
  }

  estaVivo() {
    return this.vida > 0;
  }

  // controla el 1% de probabilidad y que se use una sola vez.
  // el efecto real de cada habilidad lo define cada subclase en
  // "ejecutarHabilidad".
  usarHabilidadEspecial(objetivo) {
    if (this.habilidadUsada || getRandom(1, 100) !== 1) {
      return false;
    }

    this.habilidadUsada = true;
    this.ejecutarHabilidad(objetivo);
    return true;
  }

  // habilidad generica por si alguna clase no define la suya
  ejecutarHabilidad(objetivo) {
    console.log(`${this.nombre} utiliza su HABILIDAD ESPECIAL.`);
    const danoEspecial = this.dano * 2;
    console.log(`Causa ${danoEspecial} de dano ignorando la defensa de ${objetivo.nombre}.`);
    objetivo.recibirDano(danoEspecial);
  }
}


// GUERRERO

class Guerrero extends Personaje {
  constructor(nombre, vida, dano, defensa, velocidad, armas) {
    super(nombre, vida, dano, defensa, velocidad);
    this.array_de_armas = armas;
  }

  atacar_con_arma(objetivo) {
    const arma = elegirAleatorio(this.array_de_armas);
    console.log(`${this.nombre} ataca a ${objetivo.nombre} con su ${arma}.`);
    this.resolverAtaque(objetivo, this.dano);
  }

  // Golpe Devastador: ignora la defensa y hace el triple de dano
  ejecutarHabilidad(objetivo) {
    console.log(`${this.nombre} desata un GOLPE DEVASTADOR sobre ${objetivo.nombre}.`);
    const danoEspecial = this.dano * 3;
    console.log(`El golpe ignora la defensa y causa ${danoEspecial} de dano.`);
    objetivo.recibirDano(danoEspecial);
  }
}


// MAGO

class Mago extends Personaje {
  constructor(nombre, vida, dano, defensa, velocidad, hechizos) {
    super(nombre, vida, dano, defensa, velocidad);
    this.array_de_hechizos = hechizos;
  }

  atacar_con_hechizo(objetivo) {
    const hechizo = elegirAleatorio(this.array_de_hechizos);
    console.log(`${this.nombre} lanza ${hechizo} contra ${objetivo.nombre}.`);
    this.resolverAtaque(objetivo, this.dano);
  }

  // Lluvia de Meteoros: golpea dos veces seguidas
  ejecutarHabilidad(objetivo) {
    console.log(`${this.nombre} invoca una LLUVIA DE METEOROS sobre ${objetivo.nombre}.`);
    objetivo.recibirDano(this.dano);
    if (objetivo.estaVivo()) {
      objetivo.recibirDano(this.dano);
    }
  }
}



// ARQUERO

class Arquero extends Personaje {
  constructor(nombre, vida, dano, defensa, velocidad, flechas) {
    super(nombre, vida, dano, defensa, velocidad);
    this.array_de_flechas = flechas;
  }

  disparar(objetivo) {
    const flecha = elegirAleatorio(this.array_de_flechas);
    console.log(`${this.nombre} dispara una ${flecha} contra ${objetivo.nombre}.`);
    this.resolverAtaque(objetivo, this.dano);
  }

  // Disparo Certero: nunca falla y hace el doble de dano
  ejecutarHabilidad(objetivo) {
    console.log(`${this.nombre} realiza un DISPARO CERTERO hacia ${objetivo.nombre}.`);
    const danoEspecial = this.dano * 2;
    console.log(`El disparo impacta de lleno y causa ${danoEspecial} de dano.`);
    objetivo.recibirDano(danoEspecial);
  }
}


// CLERIGO

class Clerigo extends Personaje {
  constructor(nombre, vida, dano, defensa, velocidad, plegarias) {
    super(nombre, vida, dano, defensa, velocidad);
    this.array_de_plegarias = plegarias;
  }

  atacar_con_plegaria(objetivo) {
    const plegaria = elegirAleatorio(this.array_de_plegarias);
    console.log(`${this.nombre} utiliza la plegaria "${plegaria}" contra ${objetivo.nombre}.`);
    this.resolverAtaque(objetivo, this.dano);
  }

  // se cura a si mismo, maximo 25% de su vida maxima. consume el turno.
  curar() {
    const maxCuracion = Math.floor(this.vidaMax * 0.25);
    const curacion = getRandom(1, maxCuracion);
    this.vida = Math.min(this.vidaMax, this.vida + curacion);
    console.log(`${this.nombre} se cura ${curacion} puntos de vida (vida actual: ${this.vida}/${this.vidaMax}).`);
  }

  // Juicio Celestial: dana ignorando la defensa y se cura la mitad de ese dano
  ejecutarHabilidad(objetivo) {
    console.log(`${this.nombre} invoca un JUICIO CELESTIAL sobre ${objetivo.nombre}.`);
    const danoEspecial = this.dano * 2;
    objetivo.recibirDano(danoEspecial);

    const curacion = Math.floor(danoEspecial * 0.5);
    this.vida = Math.min(this.vidaMax, this.vida + curacion);
    console.log(`${this.nombre} recupera ${curacion} puntos de vida (vida actual: ${this.vida}/${this.vidaMax}).`);
  }
}


// PICARO

class Picaro extends Personaje {
  constructor(nombre, vida, dano, defensa, velocidad, dagas) {
    super(nombre, vida, dano, defensa, velocidad);
    this.array_de_dagas = dagas;
  }

  // ataque furtivo: 5% de chance de ser critico, ignora la defensa y siempre acierta
  atacar_con_daga(objetivo) {
    const daga = elegirAleatorio(this.array_de_dagas);
    console.log(`${this.nombre} ataca a ${objetivo.nombre} con su ${daga}.`);

    const esCritico = getRandom(1, 100) <= 5;

    if (esCritico) {
      console.log("¡ATAQUE FURTIVO CRITICO!");
      this.resolverAtaque(objetivo, this.dano, true);
    } else {
      this.resolverAtaque(objetivo, this.dano);
    }
  }

  // Tajos Mortales: tres cortes seguidos con la mitad del dano base cada uno
  ejecutarHabilidad(objetivo) {
    console.log(`${this.nombre} ejecuta TAJOS MORTALES sobre ${objetivo.nombre}.`);

    for (let golpe = 1; golpe <= 3 && objetivo.estaVivo(); golpe++) {
      const danoPorGolpe = Math.floor(this.dano / 2);
      console.log(`Corte ${golpe}: ${danoPorGolpe} de dano.`);
      objetivo.recibirDano(danoPorGolpe);
    }
  }
}


// CONTROLADOR DEL JUEGO

class JuegoBatalla {
  constructor(personajes, maxRondas = 200) {
    this.personajes = personajes;
    this.maxRondas = maxRondas;
  }

  iniciar() {
    console.log("BATALLA POR CONSOLA");
    console.log("\nPresentacion de los personajes:");
    this.personajes.forEach(personaje => personaje.saludar());

    let ronda = 1;

    while (this.obtenerSupervivientes().length > 1 && ronda <= this.maxRondas) {
      console.log(`\nRonda ${ronda}`);
      this.ejecutarRonda();
      ronda++;
    }

    if (ronda > this.maxRondas) {
      console.log(`\nSe alcanzo el limite de ${this.maxRondas} rondas.`);
    }

    this.mostrarResultado();
  }

  mostrarResultado() {
    const supervivientes = this.obtenerSupervivientes();

    console.log("\nFin de la batalla");

    if (supervivientes.length === 1) {
      const ganador = supervivientes[0];
      console.log(`¡EL GANADOR ES ${ganador.nombre}! (${ganador.constructor.name})`);
      console.log(`Vida restante: ${ganador.vida}/${ganador.vidaMax}`);
    } else if (supervivientes.length > 1) {
      console.log("Empate: se alcanzo el limite de rondas con varios personajes con vida.");
    } else {
      console.log("No quedo ningun personaje con vida.");
    }
  }

  obtenerSupervivientes() {
    return this.personajes.filter(personaje => personaje.estaVivo());
  }

  // calcula el orden de ataque de la ronda segun la velocidad de cada personaje
  calcularOrden() {
    const orden = this.obtenerSupervivientes().map(personaje => ({
      personaje: personaje,
      iniciativa: getRandom(1, personaje.velocidad)
    }));

    orden.sort((a, b) => {
      if (a.iniciativa === b.iniciativa) return Math.random() - 0.5;
      return b.iniciativa - a.iniciativa;
    });

    return orden;
  }

  // decide y ejecuta el ataque de clase segun el tipo de personaje
  ejecutarAtaqueDeClase(atacante, objetivo) {
    if (atacante instanceof Guerrero) atacante.atacar_con_arma(objetivo);
    else if (atacante instanceof Mago) atacante.atacar_con_hechizo(objetivo);
    else if (atacante instanceof Arquero) atacante.disparar(objetivo);
    else if (atacante instanceof Clerigo) atacante.atacar_con_plegaria(objetivo);
    else if (atacante instanceof Picaro) atacante.atacar_con_daga(objetivo);
  }

  ejecutarRonda() {
    const orden = this.calcularOrden();

    console.log("Orden de ataque:");
    orden.forEach((elemento, index) => {
      console.log(`${index + 1}. ${elemento.personaje.nombre} (Velocidad: ${elemento.personaje.velocidad}, Tirada: ${elemento.iniciativa})`);
    });

    for (const elemento of orden) {
      const atacante = elemento.personaje;

      if (!atacante.estaVivo()) continue;

      // 1 de cada 10 se tropieza y pierde el turno
      if (getRandom(1, 10) === 1) {
        console.log(`${atacante.nombre} se tropieza y pierde su turno.`);
        continue;
      }

      const objetivos = this.obtenerSupervivientes().filter(p => p !== atacante);
      if (objetivos.length === 0) break;

      const objetivo = elegirAleatorio(objetivos);
      console.log(`\nTurno de ${atacante.nombre}, objetivo: ${objetivo.nombre}`);

      // habilidad especial: 1% de chance, una unica vez por partida
      if (atacante.usarHabilidadEspecial(objetivo)) continue;

      // el clerigo puede curarse en vez de atacar si tiene poca vida
      if (atacante instanceof Clerigo && atacante.vida / atacante.vidaMax < 0.4 && Math.random() < 0.4) {
        atacante.curar();
        continue;
      }

      // 1/3 de probabilidad de punos, 2/3 de ataque de clase
      if (getRandom(1, 3) === 1) {
        atacante.atacar(objetivo);
      } else {
        this.ejecutarAtaqueDeClase(atacante, objetivo);
      }

      if (this.obtenerSupervivientes().length <= 1) break;
    }
  }
}


// CREACION DE LOS PERSONAJES Y ARRANQUE DEL JUEGO 7 personajes: 2 Guerreros, 2 Magos, 1 Arquero, 1 Clerigo, 1 Picaro

const listaPersonajes = [
  new Guerrero("Zlatan", 100, 15, 12, 8, ["Espada Larga", "Hacha de Guerra", "Martillo Pesado"]),
  new Guerrero("Cristiano", 110, 14, 14, 6, ["Mandoble", "Maza de Clavos", "Lanza de Hierro"]),
  new Mago("Messi", 75, 18, 8, 10, ["Bola de Fuego", "Rayo de Hielo", "Descarga Electrica"]),
  new Mago("Ronaldinho", 70, 20, 6, 9, ["Meteorito", "Proyectil Magico", "Onda de Choque"]),
  new Arquero("Xavi", 85, 16, 9, 14, ["Flecha Envenenada", "Flecha Perforante", "Flecha de Fuego"]),
  new Clerigo("Robben", 90, 12, 11, 7, ["Luz Sagrada", "Castigo Divino", "Juicio Celestial"]),
  new Picaro("Neymar", 80, 17, 7, 15, ["Daga Envenenada", "Doble Daga", "Cuchillo de Sombra"])
];

const juego = new JuegoBatalla(listaPersonajes);
juego.iniciar();