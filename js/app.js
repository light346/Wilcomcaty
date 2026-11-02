/* ==========================================================================
   El Rincón Mecatrónico de Wilcon · Edición Mágica (Rosa Azul de Faris)
   Sin dependencias externas · Todo persiste en localStorage
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'wilcon_mecatronica_state_v1';

  const ORIGINAL_FARIS_MESSAGE =
    'Entiende que estes desanimada la vida aveces es dificil, pero la version que mas me gusta ver de ti es esa chica alegre , llena de motacion y desicion';

  const POLISHED_FARIS_MESSAGE =
    'Entiendo que estés desanimada, la vida a veces es difícil, pero la versión que más me gusta ver de ti es esa chica alegre, llena de motivación y decisión.';

  /* ------------------------------------------------------------------------
     16 Dedicatorias tiernas en la Rosa Azul Encantada de Faris
     ------------------------------------------------------------------------ */
  const BLUE_ROSE_NOTES = [
    '«Una rosa azul simboliza lo único, extraordinario e irrepetible: exactamente como tú y tu chispa para lograr todo lo que te propongas. — Con cariño, Faris 💙»',
    '«Las rosas azules representan que ningún sueño es imposible. Cuando un semestre parezca pesado, mira esta flor y recuerda lo capaz que eres. — Faris 🌹💙»',
    '«Entre ecuaciones, circuitos y desvelos, quería dejarte esta rosa azul eterna para recordarte lo mucho que vales y lo bonito que brillas cuando sonríes. — Faris 💜💙»',
    '«Esta rosa azul nunca se marchita, igual que mi admiración por esa chica alegre, llena de motivación y decisión que llevas dentro. — Faris ✨💙»',
    '«Incluso en los días nublados o cansados, sigues siendo una persona increíble. Tómate un respiro, aquí estamos Wilcon y yo para animarte. — Faris 💙🐾»',
    '«Tu sonrisa tiene la magia de iluminar cualquier lugar. Nunca dudes de tu talento ni de todo lo bonito que tienes en el corazón. — Faris 🌹✨»',
    '«Cada pequeño paso que das en tu carrera cuenta muchísimo. Estoy muy orgulloso de tu esfuerzo y de la gran ingeniera en que te estás convirtiendo. — Faris 💙»',
    '«Cuando sientas que algo te rebasa, recuerda que no tienes que poder con todo de golpe; ve poquito a poquito, con calma y confianza. — Faris 💜☕»',
    '«Te regalo esta rosa azul porque las personas tan especiales y auténticas como tú merecen detalles que les recuerden su propio brillo. — Faris 💙🌹»',
    '«No importa cuántas veces haya que volver a intentar un cálculo o un circuito: tu constancia y tu valentía siempre te llevan a lograrlo. — Faris ✨💙»',
    '«Ojalá que cada vez que abras esta página sientas un abrazo cálido y recuerdes que nunca estás sola en tus metas. — Con aprecio, Faris 💜🐾»',
    '«Qué bonito es verte recuperar tu ánimo, tu risa y tus ganas de comerte el mundo. Esa versión tuya es mi favorita por siempre. — Faris 💙»',
    '«Cuidar de ti, descansar tus ojitos y dormir bien también es parte de triunfar. Sé muy tierna y paciente contigo hoy. — Faris ☕💜»',
    '«Como los pétalos de esta rosa azul, cada día tienes una nueva oportunidad de florecer a tu propio ritmo y a tu manera. — Faris 🌹💙»',
    '«Tienes una mente brillante para la ingeniería y un corazón enorme; esa combinación te va a llevar tan lejos como sueñes. — Faris ✨💜»',
    '«Siempre que necesites un empujoncito de ánimo, toca esta rosa azul y recuerda que alguien confía en ti al cien por ciento. — Faris 💙🐾»'
  ];

  /* ------------------------------------------------------------------------
     50 Frases tiernas originales con juegos de palabras gatunos y mecatrónicos
     ------------------------------------------------------------------------ */
  const CAT_PUN_BANK = [
    '¡Eres absolutamente miau-ravillosa! Ni el sensor más preciso alcanza a medir todo tu potencial.',
    'Tu sonrisa tiene más energía positiva que un banco de supercapacitores al 100 % ¡Prrr-fecta!',
    'Cuando las cosas se pongan difíciles, recuerda que tienes un miau-crocontrolador de última generación en la mente.',
    '¡Ánimo, inge! Paso a patita se construyen los robots más increíbles del mundo.',
    'Eres tan brillante que hasta los LEDs de alta potencia te piden consejos de iluminación, ¡miau!',
    'No hay sistema en lazo cerrado más estable y bonito que tu alegría cuando te propones algo.',
    '¡Hoy vas a conquistar tus materias con precisión felina y torque máximo, prrr!',
    'Si el día tiene mucho ruido eléctrico, respira hondo: Wilcon es tu filtro pasa-bajas favorito.',
    'Tienes una actitud tan miaugnífica que ningún obstáculo puede frenar tu transmisión de engranes.',
    'Recuerda tomar agüita y estirarte como gatita al sol entre cada práctica de laboratorio.',
    '¡Cero cortocircuitos de tristeza hoy! Aquí tienes un abrazo con ganancia infinita.',
    'Tu talento para la mecatrónica es de otro miauniverso, ¡confía en todo lo que sabes!',
    'Aunque un cálculo salga mal a la primera, cada intento te acerca al diseño prrr-fecto.',
    '¡Eres la ingeniera más cat-paz, valiente y decidida de toda la facultad!',
    'Cuando sientas la batería baja, activa el modo ronroneo al 100 % de ciclo de trabajo PWM.',
    '¡Miau-chísimas felicidades por seguir adelante incluso en los días pesados! Eso es verdadera fuerza.',
    'Ninguna matriz de transformación homogénea es tan elegante como tu forma de resolver problemas.',
    '¡Prrr-epárate, mundo, que esta futura ingeniera en mecatrónica viene con todo el impulso!',
    'Si hoy te sientes desanimada, Wilcon te presta sus siete vidas de motivación y cariño.',
    'Tu creatividad conecta la mecánica, la electrónica y el corazón en perfecta sincronía felina.',
    '¡Que nada disminuya tus revoluciones por miau-nuto! Sigue brillando a tu propio ritmo.',
    'Cada línea de código y cada diagrama que haces lleva tu sello único e irrepetible, ¡miau!',
    'Un descanso a tiempo no es perder el tiempo: es calibrar tus sensores para llegar más lejos.',
    '¡Eres pura potencia activa y cero pérdidas por fricción cuando sonríes así!',
    'Hasta el robot más complejo empezó con un primer boceto; ten paciencia contigo misma, ¡prrr!',
    'Tienes un corazón de oro (con tolerancia de ±1 %, la más fina de todas las bandas).',
    '¡Miau-tivación al máximo! Faris y Wilcon confían plenamente en tu capacidad y decisión.',
    'Cuando dudes de ti, mira todo lo que ya has superado: tu historial de logros es impecable.',
    'Que tu día tenga alta conductividad de alegría y mucha resistencia ante el estrés.',
    '¡Un ronroneo ultrasónico para despejar cualquier nube gris de tu semana de exámenes!',
    'Eres la combinación ideal entre inteligencia analítica y calidez humana, ¡100 % miau-gica!',
    'No necesitas ser perfecta todo el tiempo; con ser tú misma ya eres extraordinaria, ¡miau!',
    'Tu determinación tiene más par motor que una reductora planetaria de grado industrial.',
    '¡Hoy es un gran día para aprender algo nuevo, reírte mucho y acariciar a Wilcon!',
    'Si una entrega parece gigante, divídela en módulos chiquitos del tamaño de una croqueta.',
    'Siempre recuerda lo que dice Faris: esa chica alegre, llena de motivación y decisión sigue dentro de ti 💜💙.',
    '¡Prrr-ometo acompañarte en cada desvelo con mis ojitos brillantes y mis patitas suaves!',
    'Tu esfuerzo diario vale oro; date una palmadita en el hombro y un chocolatito caliente ☕💜.',
    'Ni mil líneas de código en C tienen tanta lógica y armonía como tu forma de salir adelante.',
    '¡Miau-nifica noticia! Hoy tu nivel de ternura y genialidad superó todos los límites del osciloscopio.',
    'Si una materia se pone rebelde, respira: tú tienes el control PID de tu propio destino.',
    'Aquí tienes un michi-abrazo calentito para que tu corazón descanse y recupere su sonrisa.',
    '¡Qué orgullo ver cómo transformas las dudas en aprendizaje día tras día, prrr!',
    'Tus sueños están bien soldados con estaño de la mejor calidad: ¡nada los va a desconectar!',
    'Tómate cinco minutitos para cerrar los ojos y escuchar el ronroneo imaginario de Wilcon 🐾.',
    'Eres como una rosa azul en medio del laboratorio: única, especial y llena de magia 💙🌹.',
    'Cada vez que sonríes, se encienden todos los indicadores luminosos de felicidad en este rincón.',
    'No te compares con nadie: tu propio camino y tu propio ritmo son preciosos tal como son, ¡miau!',
    '¡Arriba esas patitas y ese ánimo! Lo mejor de tu historia apenas se está construyendo.',
    'Por más difícil que parezca el reto de hoy, recuerda que tienes una mente brillante y un corazón valiente 💜.'
  ];

  /* ------------------------------------------------------------------------
     28 Frases tiernas y alegres del día (Panel «Hoy»)
     ------------------------------------------------------------------------ */
  const DAILY_QUOTES = [
    '«Cada circuito que armas y cada reto que superas demuestra lo brillante y capaz que eres.»',
    '«La ingeniería es el arte de convertir ideas en realidad; tu alegría es la chispa que lo enciende todo.»',
    '«Paso a paso, práctica a práctica: hoy estás más cerca de tus sueños que ayer.»',
    '«Incluso los mejores sistemas necesitan tiempo de estabilización; sé muy tierna y amable contigo hoy.»',
    '«Tu mente curiosa y tu corazón alegre son tu mejor herramienta de mecatrónica.»',
    '«No importa qué tan complejo sea el problema, tienes el ingenio y la decisión para resolverlo.»',
    '«Descansar también es parte del diseño: una mente tranquila encuentra las mejores soluciones.»',
    '«Hoy es un excelente día para confiar en tu talento y sonreírle a nuevos aprendizajes.»',
    '«Mereces sentirte orgullosa de todo lo que has avanzado, incluso en los días en que costó más trabajo levantarse.»',
    '«Tu sonrisa tiene una luz muy bonita que hace que todo a tu alrededor se sienta más cálido.»',
    '«No tienes que resolver todo el semestre hoy; con dar tu mejor esfuerzo en el siguiente pasito basta.»',
    '«Detrás de cada gran ingeniera hay días de dudas que superó con paciencia, cafecito y determinación.»',
    '«Qué bonito es saber que existes y que le pones tanto corazón a lo que amas hacer.»',
    '«Si hoy necesitas ir más despacio, está completamente bien: las flores más bonitas también toman su tiempo.»',
    '«Recuerda que un examen o una nota no definen tu valor; tu esencia, tu nobleza y tu empeño valen muchísimo más.»',
    '«Cada vez que te levantas con ganas de intentarlo otra vez, demuestras una valentía admirable.»',
    '«Ojalá hoy encuentres muchos motivos chiquitos para sonreír: un cafecito rico, una canción bonita y este rincón hecho para ti.»',
    '«Confía en tu intuición y en todo lo que has estudiado: sabes mucho más de lo que los nervios a veces te hacen creer.»',
    '«Eres una combinación preciosa de dulzura, inteligencia y fortaleza. ¡Nunca lo olvides!»',
    '«Cuando te sientas cansada, descansa sin culpa; cuidar tu bienestar es la prioridad número uno.»',
    '«Que hoy te acompañe la tranquilidad de saber que vas por buen camino y que hay personas que te quieren ver feliz.»',
    '«Ningún día difícil dura para siempre, pero tu capacidad de superarlo se queda contigo toda la vida.»',
    '«Tu entusiasmo cuando hablas de lo que te gusta es una de las cosas más bonitas del mundo.»',
    '«Date permiso de celebrar hasta el logro más pequeñito de hoy: cada tarea terminada cuenta.»',
    '«Como la rosa azul que te dejó Faris, tienes algo único y especial que nadie más puede igualar.»',
    '«Respira profundo, suelta la tensión de los hombros y recuerda: tú puedes con esto y mucho más.»',
    '«Qué suerte tienen los robots y circuitos del futuro de contar con una ingeniera con un corazón tan lindo.»',
    '«Hoy Wilcon y Faris te mandan una dosis extra de cariño para que tu día sea ligero, cálido y bonito 💜💙.»'
  ];

  /* ------------------------------------------------------------------------
     Serie E12 y Colores de Resistencias
     ------------------------------------------------------------------------ */
  const E12_BASE = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

  const RESISTOR_DIGIT_COLORS = [
    { value: 0, name: 'Negro (0)', hex: '#1f2937' },
    { value: 1, name: 'Café / Marrón (1)', hex: '#78350f' },
    { value: 2, name: 'Rojo (2)', hex: '#dc2626' },
    { value: 3, name: 'Naranja (3)', hex: '#ea580c' },
    { value: 4, name: 'Amarillo (4)', hex: '#eab308' },
    { value: 5, name: 'Verde (5)', hex: '#16a34a' },
    { value: 6, name: 'Azul (6)', hex: '#2563eb' },
    { value: 7, name: 'Violeta / Morado (7)', hex: '#7c3aed' },
    { value: 8, name: 'Gris (8)', hex: '#6b7280' },
    { value: 9, name: 'Blanco (9)', hex: '#f9fafb' }
  ];

  const RESISTOR_MULT_COLORS = [
    { mult: 0.01, name: 'Plata (×0.01 Ω)', hex: '#cbd5e1' },
    { mult: 0.1, name: 'Oro (×0.1 Ω)', hex: '#d97706' },
    { mult: 1, name: 'Negro (×1 Ω)', hex: '#1f2937' },
    { mult: 10, name: 'Café (×10 Ω)', hex: '#78350f' },
    { mult: 100, name: 'Rojo (×100 Ω)', hex: '#dc2626' },
    { mult: 1000, name: 'Naranja (×1 kΩ)', hex: '#ea580c' },
    { mult: 10000, name: 'Amarillo (×10 kΩ)', hex: '#eab308' },
    { mult: 100000, name: 'Verde (×100 kΩ)', hex: '#16a34a' },
    { mult: 1000000, name: 'Azul (×1 MΩ)', hex: '#2563eb' },
    { mult: 10000000, name: 'Violeta (×10 MΩ)', hex: '#7c3aed' }
  ];

  const RESISTOR_TOL_COLORS = [
    { tol: 1, name: 'Café (±1 %)', hex: '#78350f' },
    { tol: 2, name: 'Rojo (±2 %)', hex: '#dc2626' },
    { tol: 0.5, name: 'Verde (±0.5 %)', hex: '#16a34a' },
    { tol: 0.25, name: 'Azul (±0.25 %)', hex: '#2563eb' },
    { tol: 0.1, name: 'Violeta (±0.1 %)', hex: '#7c3aed' },
    { tol: 5, name: 'Oro (±5 %)', hex: '#d97706' },
    { tol: 10, name: 'Plata (±10 %)', hex: '#cbd5e1' }
  ];

  /* ========================================================================
     MÓDULO DE FÓRMULAS EXACTAS (Testeable en Node.js y Navegador)
     ======================================================================== */
  const Formulas = {
    calcFinalGradeNeeded: function (items, pesoFinal, meta, minPass) {
      const pf = Number(pesoFinal);
      const goal = Number(meta);
      const pass = Number(minPass !== undefined ? minPass : 6.0);
      if (!Number.isFinite(pf) || pf <= 0 || pf > 1) {
        return { error: 'El peso del final debe ser una fracción mayor a 0 y menor o igual a 1.' };
      }
      let sumWeights = 0;
      let weightedSum = 0;
      for (let i = 0; i < items.length; i++) {
        const c = Number(items[i].grade);
        const w = Number(items[i].weight);
        if (!Number.isFinite(c) || !Number.isFinite(w) || w < 0) {
          return { error: 'Revisa que todas las calificaciones y pesos sean números válidos.' };
        }
        sumWeights += w;
        weightedSum += c * w;
      }
      const totalWeights = sumWeights + pf;
      const weightsValid = Math.abs(totalWeights - 1.0) <= 1e-4;
      const neededForGoal = (goal - weightedSum) / pf;
      const neededForPass = (pass - weightedSum) / pf;
      const currentAvg = sumWeights > 0 ? weightedSum / sumWeights : 0;

      return {
        weightedSum: weightedSum,
        currentAvg: currentAvg,
        sumPartialWeights: sumWeights,
        totalWeights: totalWeights,
        weightsValid: weightsValid,
        neededForGoal: neededForGoal,
        neededForPass: neededForPass
      };
    },

    calcOhmAndPower: function (inputs) {
      const hasV = inputs.V !== null && inputs.V !== '' && inputs.V !== undefined && Number.isFinite(Number(inputs.V));
      const hasI = inputs.I !== null && inputs.I !== '' && inputs.I !== undefined && Number.isFinite(Number(inputs.I));
      const hasR = inputs.R !== null && inputs.R !== '' && inputs.R !== undefined && Number.isFinite(Number(inputs.R));
      const hasP = inputs.P !== null && inputs.P !== '' && inputs.P !== undefined && Number.isFinite(Number(inputs.P));

      const count = (hasV ? 1 : 0) + (hasI ? 1 : 0) + (hasR ? 1 : 0) + (hasP ? 1 : 0);
      if (count !== 2) {
        return { error: 'Por favor ingresa exactamente 2 valores conocidos (deja los otros 2 vacíos).' };
      }

      let V = hasV ? Number(inputs.V) : null;
      let I = hasI ? Number(inputs.I) : null;
      let R = hasR ? Number(inputs.R) : null;
      let P = hasP ? Number(inputs.P) : null;

      if (R !== null && R <= 0) {
        return { error: 'La resistencia R debe ser mayor a 0 Ω.' };
      }
      if (P !== null && P < 0) {
        return { error: 'La potencia P no puede ser negativa.' };
      }

      if (hasV && hasI) {
        if (I === 0) return { error: 'Si I = 0 A, no se puede determinar R = V / I.' };
        R = V / I;
        P = V * I;
      } else if (hasV && hasR) {
        I = V / R;
        P = V * I;
      } else if (hasI && hasR) {
        V = I * R;
        P = V * I;
      } else if (hasV && hasP) {
        if (V === 0) return { error: 'Si V = 0 V, no se puede despejar I = P / V.' };
        I = P / V;
        if (I === 0) return { error: 'La corriente resulta 0 A; R tiende a infinito.' };
        R = V / I;
      } else if (hasI && hasP) {
        if (I === 0) return { error: 'Si I = 0 A, no se puede despejar V = P / I.' };
        V = P / I;
        R = V / I;
      } else if (hasR && hasP) {
        V = Math.sqrt(P * R);
        I = V / R;
      }

      return { V: V, I: I, R: R, P: P };
    },

    calcVoltageDivider: function (Vin, R1, R2) {
      const vin = Number(Vin);
      const r1 = Number(R1);
      const r2 = Number(R2);
      if (!Number.isFinite(vin) || !Number.isFinite(r1) || !Number.isFinite(r2)) {
        return { error: 'Ingresa valores numéricos válidos para Vin, R1 y R2.' };
      }
      if (r1 < 0 || r2 < 0 || (r1 + r2) <= 0) {
        return { error: 'Las resistencias deben ser mayores o iguales a 0 y R1 + R2 > 0.' };
      }
      const vout = (vin * r2) / (r1 + r2);
      return { Vout: vout, ratio: r2 / (r1 + r2) };
    },

    findNextE12: function (rExact) {
      if (rExact <= 0) return 1.0;
      const exp = Math.floor(Math.log10(rExact));
      for (let d = exp - 1; d <= exp + 2; d++) {
        const factor = Math.pow(10, d);
        for (let i = 0; i < E12_BASE.length; i++) {
          const candidate = Number((E12_BASE[i] * factor).toPrecision(6));
          if (candidate >= rExact - 1e-9) {
            return candidate;
          }
        }
      }
      return rExact;
    },

    calcLedResistor: function (Vfuente, Vled, IledAmps) {
      const vs = Number(Vfuente);
      const vf = Number(Vled);
      const iAmps = Number(IledAmps);
      if (!Number.isFinite(vs) || !Number.isFinite(vf) || !Number.isFinite(iAmps)) {
        return { error: 'Ingresa valores numéricos válidos.' };
      }
      if (vs <= vf) {
        return { error: 'Vfuente debe ser mayor que el voltaje del LED (Vled).' };
      }
      if (iAmps <= 0) {
        return { error: 'La corriente del LED (Iled) debe ser mayor a 0.' };
      }
      const rExact = (vs - vf) / iAmps;
      const rE12 = Formulas.findNextE12(rExact);
      const actualCurrentA = (vs - vf) / rE12;
      const powerResistorW = (vs - vf) * iAmps;
      return {
        R: rExact,
        E12: rE12,
        actualCurrentA: actualCurrentA,
        powerW: powerResistorW
      };
    },

    calcResistorColorCode: function (bandsMode, b1, b2, b3, mult, tol) {
      const mode = Number(bandsMode);
      const d1 = Number(b1);
      const d2 = Number(b2);
      const d3 = Number(b3 || 0);
      const m = Number(mult);
      const t = Number(tol);

      let baseDigits = 0;
      if (mode === 5) {
        baseDigits = d1 * 100 + d2 * 10 + d3;
      } else {
        baseDigits = d1 * 10 + d2;
      }
      const resistance = baseDigits * m;
      const minR = resistance * (1 - t / 100);
      const maxR = resistance * (1 + t / 100);
      return {
        resistance: resistance,
        tolerance: t,
        minR: minR,
        maxR: maxR
      };
    },

    calcRCTimeConstant: function (R_ohms, C_farads, Vsource) {
      const r = Number(R_ohms);
      const c = Number(C_farads);
      const v = Vsource !== undefined && Vsource !== '' ? Number(Vsource) : 5.0;
      if (!Number.isFinite(r) || !Number.isFinite(c) || r <= 0 || c <= 0) {
        return { error: 'La resistencia R y la capacitancia C deben ser mayores a 0.' };
      }
      const tau = r * c;
      const t1 = tau;
      const t5 = 5 * tau;
      return {
        tau: tau,
        t1Tau: t1,
        t5Tau: t5,
        pct1Tau: 63.2,
        pct5Tau: 99.3,
        v1Tau: v * 0.632,
        v5Tau: v * 0.993
      };
    },

    calcPWM: function (Vcc, D_fraction) {
      const vcc = Number(Vcc);
      const d = Number(D_fraction);
      if (!Number.isFinite(vcc) || !Number.isFinite(d)) {
        return { error: 'Ingresa valores numéricos válidos para Vcc y D.' };
      }
      if (d < 0 || d > 1) {
        return { error: 'El ciclo de trabajo D debe estar entre 0 y 1 (o entre 0 % y 100 %).' };
      }
      return {
        Vprom: vcc * d,
        dutyFraction: d,
        dutyPercent: d * 100
      };
    },

    calcMechanics: function (rpm1, torque1, N1, N2) {
      const rpm = Number(rpm1);
      const tau1 = Number(torque1);
      const n1 = Number(N1);
      const n2 = Number(N2);
      if (!Number.isFinite(rpm) || !Number.isFinite(tau1) || !Number.isFinite(n1) || !Number.isFinite(n2)) {
        return { error: 'Ingresa valores numéricos válidos.' };
      }
      if (n1 <= 0 || n2 <= 0) {
        return { error: 'El número de dientes N1 y N2 debe ser mayor a 0.' };
      }
      const omega1 = (2 * Math.PI * rpm) / 60;
      const power = tau1 * omega1;
      const omega2 = (omega1 * n1) / n2;
      const rpm2 = (rpm * n1) / n2;
      const tau2 = (tau1 * n2) / n1;
      const gearRatio = n2 / n1;

      return {
        omega1: omega1,
        power: power,
        omega2: omega2,
        rpm2: rpm2,
        tau2: tau2,
        gearRatio: gearRatio
      };
    },

    KGF_TO_NEWTON: 9.80665,

    convertBaseFromDec: function (decInt) {
      const n = parseInt(String(decInt).trim(), 10);
      if (isNaN(n) || n < 0) return { error: 'Ingresa un entero decimal >= 0.' };
      return { dec: String(n), bin: n.toString(2), hex: n.toString(16).toUpperCase() };
    },
    convertBaseFromBin: function (binStr) {
      const clean = String(binStr).trim();
      if (!/^[01]+$/.test(clean)) return { error: 'El binario solo debe contener 0 y 1.' };
      const n = parseInt(clean, 2);
      return { dec: String(n), bin: clean, hex: n.toString(16).toUpperCase() };
    },
    convertBaseFromHex: function (hexStr) {
      const clean = String(hexStr).trim().replace(/^0x/i, '');
      if (!/^[0-9a-fA-F]+$/.test(clean)) return { error: 'Ingresa dígitos hexadecimales válidos (0-9, A-F).' };
      const n = parseInt(clean, 16);
      return { dec: String(n), bin: n.toString(2), hex: clean.toUpperCase() };
    },
    rpmToRadS: function (rpm) {
      return (2 * Math.PI * Number(rpm)) / 60;
    },
    radSToRpm: function (rads) {
      return (Number(rads) * 60) / (2 * Math.PI);
    },
    degToRad: function (deg) {
      return (Number(deg) * Math.PI) / 180;
    },
    radToDeg: function (rad) {
      return (Number(rad) * 180) / Math.PI;
    },
    newtonToKgf: function (n) {
      return Number(n) / 9.80665;
    },
    kgfToNewton: function (kgf) {
      return Number(kgf) * 9.80665;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Formulas: Formulas, CAT_PUN_BANK: CAT_PUN_BANK };
  }
  if (typeof window !== 'undefined') {
    window.WilconFormulas = Formulas;
  }

  if (typeof document === 'undefined') {
    return;
  }

  /* ========================================================================
     ESTADO INICIAL Y PERSISTENCIA EN LOCALSTORAGE
     ======================================================================== */
  function createDefaultState() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 3600 * 1000);
    const inFiveDays = new Date(now.getTime() + 5 * 24 * 3600 * 1000);

    function toLocalISO(d) {
      const pad = function (n) { return String(n).padStart(2, '0'); };
      return (
        d.getFullYear() + '-' +
        pad(d.getMonth() + 1) + '-' +
        pad(d.getDate()) + 'T' +
        pad(d.getHours()) + ':' +
        pad(d.getMinutes())
      );
    }

    return {
      herName: 'Inge Favorita',
      letterMessage: POLISHED_FARIS_MESSAGE,
      showOriginalLetter: false,
      letterSeen: false,
      theme: 'light',
      quoteIndex: 0,
      blueRoseNoteIndex: 0,
      blueRoseTouches: 1,
      wilconAccessory: 'bluerose',
      wilconHappiness: 95,
      scheduleFilterDay: 'Todos',
      schedule: [
        { id: 's1', subject: 'Control Automático', day: 'Lunes', start: '08:00', end: '10:00', room: 'Aula M-204' },
        { id: 's2', subject: 'Microcontroladores y Sistemas Embebidos', day: 'Lunes', start: '10:00', end: '12:00', room: 'Lab. Electrónica B-12' },
        { id: 's3', subject: 'Robótica Industrial', day: 'Martes', start: '09:00', end: '11:00', room: 'Lab. Mecatrónica R-01' },
        { id: 's4', subject: 'Diseño Mecánico y CAD', day: 'Miércoles', start: '08:00', end: '10:00', room: 'Sala Cómputo C-03' },
        { id: 's5', subject: 'Electrónica de Potencia', day: 'Jueves', start: '11:00', end: '13:00', room: 'Lab. Potencia P-05' },
        { id: 's6', subject: 'Sensores y Actuadores', day: 'Viernes', start: '09:00', end: '11:00', room: 'Lab. Instrumentación' }
      ],
      tasks: [
        {
          id: 't1',
          title: 'Práctica: Control PID de velocidad para motor DC con PWM',
          course: 'Control Automático',
          due: toLocalISO(tomorrow),
          priority: 'alta',
          status: 'en_progreso'
        },
        {
          id: 't2',
          title: 'Simulación de cinemática directa en brazo de 3 GDL',
          course: 'Robótica Industrial',
          due: toLocalISO(inThreeDays),
          priority: 'media',
          status: 'pendiente'
        },
        {
          id: 't3',
          title: 'Selección de engranes y rodamientos del prototipo',
          course: 'Diseño Mecánico y CAD',
          due: toLocalISO(inFiveDays),
          priority: 'baja',
          status: 'pendiente'
        }
      ],
      pomodoro: {
        focusMins: 25,
        breakMins: 5,
        completedToday: 0,
        currentTask: 'Repaso de Control Automático y Microcontroladores'
      },
      grades: {
        activeCourseId: 'c1',
        courses: [
          {
            id: 'c1',
            name: 'Control Automático',
            minPass: 6.0,
            targetGoal: 9.0,
            finalWeight: 0.30,
            evals: [
              { id: 'e1', name: 'Parcial 1 (Modelado y Laplace)', grade: 9.2, weight: 0.25 },
              { id: 'e2', name: 'Parcial 2 (Respuesta en frecuencia)', grade: 8.8, weight: 0.25 },
              { id: 'e3', name: 'Prácticas de Laboratorio', grade: 9.5, weight: 0.20 }
            ]
          },
          {
            id: 'c2',
            name: 'Microcontroladores',
            minPass: 6.0,
            targetGoal: 8.5,
            finalWeight: 0.40,
            evals: [
              { id: 'e4', name: 'Parcial 1 (Timers y PWM)', grade: 8.5, weight: 0.30 },
              { id: 'e5', name: 'Parcial 2 (ADC e Interrupciones)', grade: 8.0, weight: 0.30 }
            ]
          }
        ]
      },
      mood: {
        streak: 1,
        lastDate: '',
        punIndex: 0,
        history: [
          { date: new Date().toISOString().slice(0, 10), mood: 'motivada', label: 'Motivada 😼' }
        ]
      }
    };
  }

  let state = createDefaultState();

  function ensureSyncMetadataOnState(st) {
    const baseTs = 1700000000000;
    if (Array.isArray(st.schedule)) {
      st.schedule.forEach(function (item, i) {
        if (!item.id) item.id = 's_' + i;
        if (typeof item.updatedAt !== 'number') item.updatedAt = baseTs + i;
        if (typeof item.deleted !== 'boolean') item.deleted = false;
      });
    }
    if (Array.isArray(st.tasks)) {
      st.tasks.forEach(function (item, i) {
        if (!item.id) item.id = 't_' + i;
        if (typeof item.updatedAt !== 'number') item.updatedAt = baseTs + i;
        if (typeof item.deleted !== 'boolean') item.deleted = false;
      });
    }
    if (st.grades && Array.isArray(st.grades.courses)) {
      st.grades.courses.forEach(function (c, i) {
        if (!c.id) c.id = 'c_' + i;
        if (typeof c.updatedAt !== 'number') c.updatedAt = baseTs + i;
        if (typeof c.deleted !== 'boolean') c.deleted = false;
      });
    }
    if (st.mood && Array.isArray(st.mood.history)) {
      st.mood.history.forEach(function (m, i) {
        if (!m.id) m.id = 'm_' + (m.date || i) + '_' + i;
        if (typeof m.updatedAt !== 'number') m.updatedAt = baseTs + i;
        if (typeof m.deleted !== 'boolean') m.deleted = false;
      });
    }
    return st;
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(createDefaultState(), parsed);
        if (parsed.pomodoro) {
          state.pomodoro = Object.assign(createDefaultState().pomodoro, parsed.pomodoro);
        }
        if (parsed.grades && Array.isArray(parsed.grades.courses) && parsed.grades.courses.length > 0) {
          state.grades = parsed.grades;
        }
        if (parsed.mood) {
          state.mood = Object.assign(createDefaultState().mood, parsed.mood);
        }
      }
    } catch (err) {
      // Continuar en memoria si localStorage no está disponible
    }
    ensureSyncMetadataOnState(state);
  }

  let isApplyingRemoteChanges = false;

  function saveState(skipSyncEvent) {
    ensureSyncMetadataOnState(state);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // Fallback silencioso en memoria
    }
    if (!skipSyncEvent && !isApplyingRemoteChanges && typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('wilcon:local-change'));
    }
  }

  /* ========================================================================
     UTILIDADES DE UI Y CONFETI MÁGICO
     ======================================================================== */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3200);
  }

  function launchPawConfetti(customSymbols) {
    const layer = document.getElementById('confetti-layer');
    if (!layer) return;
    const symbols = customSymbols || ['🐾', '💙', '🌹', '💜', '✨', '🐱', '☕'];
    for (let i = 0; i < 24; i++) {
      const piece = document.createElement('span');
      piece.className = 'paw-confetti-piece';
      piece.textContent = symbols[i % symbols.length];
      piece.style.left = Math.random() * 94 + 3 + '%';
      piece.style.setProperty('--dx', (Math.random() * 150 - 75).toFixed(0) + 'px');
      piece.style.setProperty('--rot', (Math.random() * 360 - 180).toFixed(0) + 'deg');
      piece.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
      layer.appendChild(piece);
      setTimeout(function () {
        if (piece.parentNode) piece.parentNode.removeChild(piece);
      }, 2200);
    }
  }

  /* ========================================================================
     MASCOTA WILCON Y LA ROSA AZUL DE FARIS
     ======================================================================== */
  let wilconTempTimer = null;

  const WILCON_ACCESSORIES = ['bluerose', 'bow', 'helmet', 'headphones', 'crown', 'none'];
  const WILCON_ACCESSORY_NAMES = {
    bluerose: '💙 Rosa Azul de Faris',
    bow: '🎀 Moñito ciruela',
    helmet: '👷‍♀️ Casco de Ingeniera',
    headphones: '🎧 Audífonos Lo-Fi',
    crown: '🌸 Corona de flores',
    none: '🐱 Al natural'
  };

  function isNightHours() {
    const hr = new Date().getHours();
    return hr >= 22 || hr < 6;
  }

  function renderWilconAccessoryAndMeter() {
    const card = document.getElementById('mascot-card');
    const bar = document.getElementById('wilcon-happiness-bar');
    const txt = document.getElementById('wilcon-happiness-text');
    if (card) {
      card.setAttribute('data-wilcon-accessory', state.wilconAccessory || 'bluerose');
    }
    const pct = Math.max(20, Math.min(100, Number(state.wilconHappiness || 95)));
    if (bar) {
      bar.style.transform = 'scaleX(' + (pct / 100).toFixed(2) + ')';
    }
    if (txt) {
      txt.textContent = pct + ' % ' + (pct >= 95 ? '¡Mágica! 💙' : 'Feliz');
    }
  }

  function boostWilconHappiness(amount) {
    state.wilconHappiness = Math.min(100, Math.max(50, Number(state.wilconHappiness || 90) + amount));
    saveState();
    renderWilconAccessoryAndMeter();
  }

  function updateWilconBaseState() {
    const card = document.getElementById('mascot-card');
    const pill = document.getElementById('wilcon-status-pill');
    if (!card || !pill) return;

    renderWilconAccessoryAndMeter();

    if (pomoRuntime.running && pomoRuntime.mode === 'focus') {
      card.setAttribute('data-wilcon-state', 'studying');
      pill.textContent = '🤓 Estudiando';
    } else if (pomoRuntime.running && pomoRuntime.mode === 'break') {
      card.setAttribute('data-wilcon-state', 'sleeping');
      pill.textContent = '😴 En descanso';
    } else if (state.theme === 'dark' || isNightHours()) {
      card.setAttribute('data-wilcon-state', 'sleeping');
      pill.textContent = '🌙 Durmiendo';
    } else {
      card.setAttribute('data-wilcon-state', 'awake');
      pill.textContent = '💙 Contigo';
    }
  }

  function setWilconReaction(reactionState, speechText, durationMs) {
    const card = document.getElementById('mascot-card');
    const pill = document.getElementById('wilcon-status-pill');
    const speech = document.getElementById('wilcon-speech');
    if (speech && speechText) {
      speech.textContent = speechText;
    }
    if (!card || !pill) return;

    if (wilconTempTimer) clearTimeout(wilconTempTimer);
    card.setAttribute('data-wilcon-state', reactionState);
    if (reactionState === 'purring') pill.textContent = '😻 Ronroneando';
    if (reactionState === 'celebrating') pill.textContent = '🎉 ¡Celebrando!';
    if (reactionState === 'starry') pill.textContent = '🤩 ¡Maravillada!';
    if (reactionState === 'studying') pill.textContent = '🤓 Estudiando';
    if (reactionState === 'sleeping') pill.textContent = '😴 Durmiendo';
    if (reactionState === 'eating') pill.textContent = '🐟 Ñam ñam';
    if (reactionState === 'playing') pill.textContent = '🧶 Jugando';
    if (reactionState === 'coffee') pill.textContent = '☕ Tomando moca';

    wilconTempTimer = setTimeout(function () {
      updateWilconBaseState();
    }, durationMs || 3200);
  }

  function spawnWilconHearts(customSymbols) {
    const layer = document.getElementById('hearts-layer');
    if (!layer) return;
    const hearts = customSymbols || ['💙', '💜', '🌹', '🐾', '✨'];
    for (let i = 0; i < 6; i++) {
      const span = document.createElement('span');
      span.className = 'floating-heart';
      span.textContent = hearts[i % hearts.length];
      const offsetX = (Math.random() * 90 - 45).toFixed(0) + 'px';
      span.style.setProperty('--hx', offsetX);
      span.style.left = 32 + Math.random() * 36 + '%';
      span.style.animationDelay = (i * 0.08).toFixed(2) + 's';
      layer.appendChild(span);
      setTimeout(function () {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 1150);
    }
  }

  function triggerBlueRoseMagic() {
    state.blueRoseNoteIndex = ((state.blueRoseNoteIndex || 0) + 1) % BLUE_ROSE_NOTES.length;
    state.blueRoseTouches = (state.blueRoseTouches || 1) + 1;
    boostWilconHappiness(7);
    saveState();

    const msgEl = document.getElementById('blue-rose-message');
    if (msgEl) {
      msgEl.textContent = BLUE_ROSE_NOTES[state.blueRoseNoteIndex];
    }

    launchPawConfetti(['🌹', '💙', '✨', '🦋', '💜', '🐾']);
    spawnWilconHearts(['🌹', '💙', '✨', '💎']);
    setWilconReaction(
      'starry',
      '🌹💙 ¡Mira cómo brilla la Rosa Azul de Faris! Cada pétalo guarda un mensajito tierno para ti.',
      3800
    );
    showToast('🌹💙 Nueva dedicatoria tierna en la Rosa Azul de Faris.');
  }

  function setupWilconInteractions() {
    const petBtn = document.getElementById('btn-pet-wilcon');
    if (petBtn) {
      petBtn.addEventListener('click', function () {
        boostWilconHappiness(4);
        spawnWilconHearts(['💙', '💜', '🌹', '🐾', '✨']);
        const purrMessages = [
          '¡Prrrrr! 😻 Qué rico cariñito, ' + state.herName + '. ¡Estoy haciendo panecitos de felicidad!',
          '¡Miau! 💜💙 Mis sensores detectan a la futura ingeniera más genial y tierna.',
          '¡Prrr-fecto! Acariciar a Wilcon recarga +100 V de motivación instantánea ⚡.',
          '¡Miauuu! 🌹💙 Faris me encargó cuidarte y recordarte lo extraordinaria que eres.',
          '¡Prrrr! 🐾 Aquí estoy contigo para que ningún cálculo ni desvelo se sienta solito.'
        ];
        const msg = purrMessages[Math.floor(Math.random() * purrMessages.length)];
        setWilconReaction('purring', msg, 3000);
      });
    }

    const feedBtn = document.getElementById('btn-feed-wilcon');
    if (feedBtn) {
      feedBtn.addEventListener('click', function () {
        boostWilconHappiness(6);
        spawnWilconHearts(['🐟', '😋', '💙', '✨']);
        const feedMsgs = [
          '¡Ñam, ñam, prrrr! 🐟 ¡Esa croqueta de salmón me dio energía para acompañarte toda la tarde!',
          '¡Miau-chísimas gracias por el premio, ' + state.herName + '! 😻 Batería felina al 100 %.',
          '¡Qué rico bocadito! 🐟 Ahora sí, ningún problema de ecuaciones diferenciales nos detendrá.'
        ];
        setWilconReaction('eating', feedMsgs[Math.floor(Math.random() * feedMsgs.length)], 3200);
      });
    }

    const playBtn = document.getElementById('btn-play-wilcon');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        boostWilconHappiness(5);
        spawnWilconHearts(['🧶', '🐾', '💙', '😺']);
        const playMsgs = [
          '¡Miau! 🧶 ¡Mira cómo atrapo este ovillo azul con cinemática felina de alta velocidad!',
          '¡Salto parabólico perfecto! 🐾 Jugar 1 minuto despeja la mente para programar mejor.',
          '¡Prrr! 🧶 Ese estambre no tiene escapatoria contra mis patitas mecatrónicas.'
        ];
        setWilconReaction('playing', playMsgs[Math.floor(Math.random() * playMsgs.length)], 3400);
      });
    }

    const coffeeBtn = document.getElementById('btn-coffee-wilcon');
    if (coffeeBtn) {
      coffeeBtn.addEventListener('click', function () {
        boostWilconHappiness(5);
        spawnWilconHearts(['☕', '🤎', '💙', '✨']);
        const coffeeMsgs = [
          '☕ ¡Salud con un moca calientito, ' + state.herName + '! Respira profundo, vas súper bien.',
          '☕ Un sorbito cálido de café con leche y seguimos diseñando el futuro a tu ritmo 💜💙.',
          '☕ Qué acogedor es estudiar contigo; los tonos cálidos cuidan tus ojitos bonitos.'
        ];
        setWilconReaction('coffee', coffeeMsgs[Math.floor(Math.random() * coffeeMsgs.length)], 3600);
      });
    }

    const accBtn = document.getElementById('btn-accessory-wilcon');
    if (accBtn) {
      accBtn.addEventListener('click', function () {
        const curIdx = WILCON_ACCESSORIES.indexOf(state.wilconAccessory || 'bluerose');
        const nextAcc = WILCON_ACCESSORIES[(curIdx + 1) % WILCON_ACCESSORIES.length];
        state.wilconAccessory = nextAcc;
        saveState();
        renderWilconAccessoryAndMeter();
        spawnWilconHearts(['✨', '💙', '🌹', '💜']);
        const label = WILCON_ACCESSORY_NAMES[nextAcc] || 'Nuevo look';
        setWilconReaction('starry', '✨ ¡Look actualizado a ' + label + '! ¿Cómo me veo, inge?', 2800);
        showToast('Look de Wilcon: ' + label);
      });
    }

    const touchRoseBtn = document.getElementById('btn-touch-blue-rose');
    const magicRoseBtn = document.getElementById('btn-rose-magic');
    const equipRoseBtn = document.getElementById('btn-equip-blue-rose');
    if (touchRoseBtn) touchRoseBtn.addEventListener('click', triggerBlueRoseMagic);
    if (magicRoseBtn) magicRoseBtn.addEventListener('click', triggerBlueRoseMagic);
    if (equipRoseBtn) {
      equipRoseBtn.addEventListener('click', function () {
        state.wilconAccessory = 'bluerose';
        saveState();
        renderWilconAccessoryAndMeter();
        spawnWilconHearts(['🌹', '💙', '✨']);
        setWilconReaction('starry', '🌹💙 ¡Me puse la Rosa Azul de Faris en mi orejita! Me encanta.', 3200);
        showToast('🐱 Wilcon ahora lleva puesta la Rosa Azul de Faris 💙');
      });
    }

    let lastSparkleTime = 0;
    function handlePointerMove(clientX, clientY) {
      const svg = document.getElementById('wilcon-svg');
      const pupilL = document.getElementById('pupil-left');
      const pupilR = document.getElementById('pupil-right');
      if (svg && pupilL && pupilR) {
        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(3.8, Math.hypot(dx, dy) / 42);
        const tx = (Math.cos(angle) * dist).toFixed(2);
        const ty = (Math.sin(angle) * dist).toFixed(2);
        pupilL.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
        pupilR.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
      }

      const px = ((clientX / window.innerWidth - 0.5) * 18).toFixed(1) + 'px';
      const py = ((clientY / window.innerHeight - 0.5) * 18).toFixed(1) + 'px';
      document.documentElement.style.setProperty('--parallax-x', px);
      document.documentElement.style.setProperty('--parallax-y', py);

      const now = Date.now();
      if (now - lastSparkleTime > 140) {
        lastSparkleTime = now;
        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) {
          const dot = document.createElement('span');
          dot.className = 'stardust-dot';
          const icons = ['✨', '💙', '⋆', '🐾'];
          dot.textContent = icons[Math.floor(Math.random() * icons.length)];
          dot.style.left = clientX + 'px';
          dot.style.top = clientY + 'px';
          dot.style.setProperty('--sx', (Math.random() * 24 - 12).toFixed(0) + 'px');
          dot.style.setProperty('--sy', (-14 - Math.random() * 18).toFixed(0) + 'px');
          document.body.appendChild(dot);
          setTimeout(function () {
            if (dot.parentNode) dot.parentNode.removeChild(dot);
          }, 850);
        }
      }
    }

    window.addEventListener('mousemove', function (ev) {
      handlePointerMove(ev.clientX, ev.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', function (ev) {
      if (ev.touches && ev.touches[0]) {
        handlePointerMove(ev.touches[0].clientX, ev.touches[0].clientY);
      }
    }, { passive: true });
  }

  /* ========================================================================
     TEMA CLARO / OSCURO Y NAVEGACIÓN DE PESTAÑAS
     ======================================================================== */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const icon = document.getElementById('theme-toggle-icon');
    const text = document.getElementById('theme-toggle-text');
    if (state.theme === 'dark') {
      if (icon) icon.textContent = '☀️';
      if (text) text.textContent = 'Modo Día Cálido';
    } else {
      if (icon) icon.textContent = '🌙';
      if (text) text.textContent = 'Modo Noche';
    }
    updateWilconBaseState();
  }

  function switchTab(tabName) {
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(function (btn) {
      const isMatch = btn.getAttribute('data-tab') === tabName;
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      const isMatch = panel.id === 'panel-' + tabName;
      if (isMatch) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  /* ========================================================================
     MÓDULO 1: CARTA DE BIENVENIDA DE FARIS
     ======================================================================== */
  function renderLetterAndProfile() {
    const brandName = document.getElementById('brand-her-name');
    const recTitle = document.getElementById('letter-recipient-title');
    const msgText = document.getElementById('letter-message-text');
    const inputName = document.getElementById('input-her-name');
    const inputLetter = document.getElementById('input-custom-letter');
    const toggleBtn = document.getElementById('btn-toggle-original-msg');

    if (brandName) brandName.textContent = state.herName;
    if (recTitle) recTitle.textContent = state.herName;
    if (inputName) inputName.value = state.herName;
    if (inputLetter) inputLetter.value = state.letterMessage;

    if (msgText) {
      const displayMsg = state.showOriginalLetter ? ORIGINAL_FARIS_MESSAGE : state.letterMessage;
      msgText.textContent = '«' + displayMsg + '»';
    }
    if (toggleBtn) {
      toggleBtn.textContent = state.showOriginalLetter
        ? '✨ Ver versión con ortografía corregida'
        : '📝 Ver texto manuscrito original de Faris';
    }
  }

  function openLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (modal) {
      modal.classList.add('open');
      setWilconReaction('starry', '💌🌹 ¡Te traje esta carta y una Rosa Azul de parte de Faris!', 3200);
    }
  }

  function closeLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (modal) {
      modal.classList.remove('open');
      state.letterSeen = true;
      saveState();
    }
  }

  /* ========================================================================
     MÓDULO 2: PANEL «HOY»
     ======================================================================== */
  function renderTodayPanel() {
    const now = new Date();
    const hr = now.getHours();
    let greetPrefix = '¡Buenas noches';
    if (hr >= 5 && hr < 12) greetPrefix = '¡Buenos días';
    else if (hr >= 12 && hr < 19) greetPrefix = '¡Buenas tardes';

    const greetingEl = document.getElementById('today-greeting');
    if (greetingEl) {
      greetingEl.textContent = greetPrefix + ', ' + state.herName + '! 💜💙';
    }

    const dateEl = document.getElementById('today-date-str');
    if (dateEl) {
      const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = now.toLocaleDateString('es-MX', opts);
      dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    const quoteEl = document.getElementById('daily-quote-text');
    if (quoteEl) {
      quoteEl.textContent = DAILY_QUOTES[state.quoteIndex % DAILY_QUOTES.length];
    }

    const roseMsgEl = document.getElementById('blue-rose-message');
    if (roseMsgEl) {
      roseMsgEl.textContent = BLUE_ROSE_NOTES[(state.blueRoseNoteIndex || 0) % BLUE_ROSE_NOTES.length];
    }

    const nextClassBox = document.getElementById('today-next-class-box');
    if (nextClassBox) {
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const todayName = dayNames[now.getDay()];
      const currentHM = String(hr).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      const activeSchedule = state.schedule.filter(function (c) { return !c.deleted; });
      const todaysClasses = activeSchedule
        .filter(function (c) { return c.day === todayName && c.end >= currentHM; })
        .sort(function (a, b) { return a.start.localeCompare(b.start); });

      if (todaysClasses.length > 0) {
        const nextC = todaysClasses[0];
        nextClassBox.innerHTML =
          '<span class="badge badge-blue">Hoy · ' + escapeHtml(nextC.day) + '</span>' +
          '<strong style="font-size:1.05rem;">' + escapeHtml(nextC.subject) + '</strong>' +
          '<span>🕒 ' + escapeHtml(nextC.start) + ' - ' + escapeHtml(nextC.end) + ' · 📍 ' + escapeHtml(nextC.room || 'Por definir') + '</span>';
      } else if (activeSchedule.length > 0) {
        const firstC = activeSchedule[0];
        nextClassBox.innerHTML =
          '<span class="badge badge-warm">Próxima en la semana (' + escapeHtml(firstC.day) + ')</span>' +
          '<strong style="font-size:1.05rem;">' + escapeHtml(firstC.subject) + '</strong>' +
          '<span>🕒 ' + escapeHtml(firstC.start) + ' - ' + escapeHtml(firstC.end) + ' · 📍 ' + escapeHtml(firstC.room || 'Aula') + '</span>';
      } else {
        nextClassBox.innerHTML = '<p>No hay clases registradas aún. ¡Agrega tu horario en la pestaña Horario!</p>';
      }
    }

    const moodSummary = document.getElementById('today-mood-summary');
    if (moodSummary) {
      const lastEntry = state.mood.history[0];
      moodSummary.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center;">' +
        '<span class="badge badge-warm">🔥 Racha: ' + state.mood.streak + ' día(s)</span>' +
        (lastEntry ? '<span class="badge badge-blue">Último: ' + escapeHtml(lastEntry.label) + '</span>' : '') +
        '</div>' +
        '<p style="margin-top:4px; font-weight:600;">' +
        escapeHtml(CAT_PUN_BANK[state.mood.punIndex % CAT_PUN_BANK.length]) +
        '</p>';
    }

    const upcomingBox = document.getElementById('today-upcoming-tasks-box');
    if (upcomingBox) {
      const pending = state.tasks
        .filter(function (t) { return !t.deleted && t.status !== 'completada'; })
        .sort(function (a, b) { return new Date(a.due) - new Date(b.due); })
        .slice(0, 3);

      if (pending.length === 0) {
        upcomingBox.innerHTML =
          '<div class="stat-tile"><p>🎉 ¡Todo al día! No tienes entregas pendientes por ahora. Wilcon está muy orgullosa de ti.</p></div>';
      } else {
        upcomingBox.innerHTML = pending.map(function (t) {
          return (
            '<div class="task-item">' +
              '<div>' +
                '<div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:4px;">' +
                  getPriorityBadge(t.priority) +
                  '<span class="badge badge-blue">' + escapeHtml(t.course || 'Mecatrónica') + '</span>' +
                  '<span class="badge badge-warm">' + formatCountdown(t.due) + '</span>' +
                '</div>' +
                '<strong class="task-title-text">' + escapeHtml(t.title) + '</strong>' +
              '</div>' +
              '<button type="button" class="btn btn-primary" data-complete-task="' + escapeHtml(t.id) + '">' +
                '✅ Completar' +
              '</button>' +
            '</div>'
          );
        }).join('');
      }
    }
  }

  /* ========================================================================
     MÓDULO 3: HORARIO SEMANAL Y LISTA DE ENTREGAS
     ======================================================================== */
  function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatCountdown(dueStr) {
    if (!dueStr) return 'Sin fecha';
    const due = new Date(dueStr);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffHrs = Math.round(diffMs / (1000 * 3600));
    if (diffMs < 0) {
      const pastDays = Math.max(1, Math.floor(Math.abs(diffHrs) / 24));
      return '⚠️ Venció hace ' + pastDays + 'd';
    }
    if (diffHrs < 24) {
      return '⏰ Vence en ' + Math.max(1, diffHrs) + ' h';
    }
    const days = Math.floor(diffHrs / 24);
    const remH = diffHrs % 24;
    return '⏳ En ' + days + 'd ' + remH + 'h';
  }

  function getPriorityBadge(priority) {
    if (priority === 'alta') return '<span class="badge badge-danger">🔥 Prioridad Alta</span>';
    if (priority === 'baja') return '<span class="badge badge-success">🌱 Prioridad Baja</span>';
    return '<span class="badge badge-warning">⭐ Prioridad Media</span>';
  }

  function renderSchedule() {
    const listEl = document.getElementById('schedule-list');
    if (!listEl) return;

    const dayOrder = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6 };
    const filtered = state.schedule
      .filter(function (item) {
        return !item.deleted && (state.scheduleFilterDay === 'Todos' || item.day === state.scheduleFilterDay);
      })
      .sort(function (a, b) {
        const dDiff = (dayOrder[a.day] || 9) - (dayOrder[b.day] || 9);
        if (dDiff !== 0) return dDiff;
        return a.start.localeCompare(b.start);
      });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="stat-tile"><p>No hay clases en este día. Usa el formulario de abajo para agregar una clase.</p></div>';
      return;
    }

    listEl.innerHTML = filtered.map(function (c) {
      return (
        '<div class="schedule-item">' +
          '<div>' +
            '<div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">' +
              '<span class="badge badge-blue">' + escapeHtml(c.day) + '</span>' +
              '<span class="badge badge-warm">🕒 ' + escapeHtml(c.start) + ' - ' + escapeHtml(c.end) + '</span>' +
            '</div>' +
            '<strong style="font-size:1.02rem;">' + escapeHtml(c.subject) + '</strong>' +
            '<p class="card-subtitle">📍 ' + escapeHtml(c.room || 'Salón por asignar') + '</p>' +
          '</div>' +
          '<div class="input-row">' +
            '<button type="button" class="btn btn-secondary" data-edit-sched="' + escapeHtml(c.id) + '">✏️ Editar</button>' +
            '<button type="button" class="btn btn-danger" data-del-sched="' + escapeHtml(c.id) + '" aria-label="Eliminar clase">🗑️</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderTasks() {
    const listEl = document.getElementById('task-list');
    const filterEl = document.getElementById('task-filter-status');
    if (!listEl) return;
    const filterVal = filterEl ? filterEl.value : 'all';

    const items = state.tasks
      .filter(function (t) {
        if (t.deleted) return false;
        if (filterVal === 'pending') return t.status !== 'completada';
        if (filterVal === 'completed') return t.status === 'completada';
        return true;
      })
      .sort(function (a, b) {
        if (a.status === 'completada' && b.status !== 'completada') return 1;
        if (a.status !== 'completada' && b.status === 'completada') return -1;
        return new Date(a.due) - new Date(b.due);
      });

    if (items.length === 0) {
      listEl.innerHTML = '<div class="stat-tile"><p>No hay entregas en esta vista. ¡Agrega una nueva abajo!</p></div>';
      return;
    }

    listEl.innerHTML = items.map(function (t) {
      const isDone = t.status === 'completada';
      const statusLabel = t.status === 'completada' ? '✅ Completada' : (t.status === 'en_progreso' ? '⚙️ En progreso' : '📌 Pendiente');
      return (
        '<div class="task-item ' + (isDone ? 'completed' : '') + '">' +
          '<div>' +
            '<div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:4px;">' +
              getPriorityBadge(t.priority) +
              '<span class="badge badge-blue">' + escapeHtml(t.course || 'General') + '</span>' +
              '<span class="badge badge-warm">' + (isDone ? '🎉 Entregada' : formatCountdown(t.due)) + '</span>' +
              '<span class="badge badge-purple">' + statusLabel + '</span>' +
            '</div>' +
            '<strong class="task-title-text" style="font-size:1.02rem;">' + escapeHtml(t.title) + '</strong>' +
            '<p class="card-subtitle">Fecha límite: ' + escapeHtml(t.due.replace('T', ' ')) + '</p>' +
          '</div>' +
          '<div class="input-row" style="flex-wrap:wrap;">' +
            '<button type="button" class="btn ' + (isDone ? 'btn-secondary' : 'btn-primary') + '" data-complete-task="' + escapeHtml(t.id) + '">' +
              (isDone ? '↩️ Reabrir' : '✅ Completar') +
            '</button>' +
            '<button type="button" class="btn btn-secondary" data-edit-task="' + escapeHtml(t.id) + '">✏️</button>' +
            '<button type="button" class="btn btn-danger" data-del-task="' + escapeHtml(t.id) + '" aria-label="Eliminar entrega">🗑️</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function completeOrToggleTask(taskId) {
    const task = state.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;
    task.updatedAt = Date.now();
    task.deleted = false;
    if (task.status === 'completada') {
      task.status = 'pendiente';
      showToast('Entrega marcada como pendiente nuevamente.');
    } else {
      task.status = 'completada';
      boostWilconHappiness(8);
      launchPawConfetti(['🐾', '💙', '🌹', '💜', '✨', '🎉']);
      setWilconReaction(
        'starry',
        '🎉💙 ¡Miau-ravilloso, ' + state.herName + '! Completaste «' + task.title + '». ¡Lluvia de huellitas y pétalos azules!',
        3500
      );
      showToast('🎉 ¡Tarea completada! Wilcon lanzó huellitas y pétalos azules 🐾💙');
    }
    saveState();
    renderTasks();
    renderTodayPanel();
  }

  /* ========================================================================
     MÓDULO 4: POMODORO CON ANILLO CIRCULAR SVG
     ======================================================================== */
  const pomoRuntime = {
    mode: 'focus',
    secondsLeft: 25 * 60,
    running: false,
    intervalId: null
  };

  function formatMMSS(totalSec) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function renderPomodoro() {
    const timerEl = document.getElementById('pomo-timer-text');
    const badgeEl = document.getElementById('pomo-mode-badge');
    const startBtn = document.getElementById('btn-pomo-start');
    const countEl = document.getElementById('pomo-completed-count');
    const focusInput = document.getElementById('pomo-focus-mins');
    const breakInput = document.getElementById('pomo-break-mins');
    const taskInput = document.getElementById('pomo-task-input');
    const ringEl = document.getElementById('pomo-ring-progress');

    if (timerEl) timerEl.textContent = formatMMSS(pomoRuntime.secondsLeft);

    const totalSecs = (pomoRuntime.mode === 'focus' ? state.pomodoro.focusMins : state.pomodoro.breakMins) * 60;
    if (ringEl && totalSecs > 0) {
      const circumference = 490;
      const fraction = Math.max(0, Math.min(1, pomoRuntime.secondsLeft / totalSecs));
      const offset = circumference * (1 - fraction);
      ringEl.setAttribute('stroke-dashoffset', offset.toFixed(1));
    }

    if (badgeEl) {
      badgeEl.textContent = pomoRuntime.mode === 'focus'
        ? '🤓 Modo Foco (Wilcon estudia contigo)'
        : '😴 Modo Descanso (Wilcon toma una siesta)';
      badgeEl.className = pomoRuntime.mode === 'focus' ? 'badge badge-blue' : 'badge badge-warm';
    }
    if (startBtn) {
      startBtn.textContent = pomoRuntime.running ? '⏸️ Pausar' : '▶️ Iniciar';
    }
    if (countEl) {
      countEl.textContent = '🍅 Pomodoros hoy: ' + state.pomodoro.completedToday;
    }
    if (focusInput && document.activeElement !== focusInput) focusInput.value = state.pomodoro.focusMins;
    if (breakInput && document.activeElement !== breakInput) breakInput.value = state.pomodoro.breakMins;
    if (taskInput && document.activeElement !== taskInput) taskInput.value = state.pomodoro.currentTask || '';
  }

  function stopPomodoroInterval() {
    if (pomoRuntime.intervalId) {
      clearInterval(pomoRuntime.intervalId);
      pomoRuntime.intervalId = null;
    }
    pomoRuntime.running = false;
  }

  function switchPomodoroMode(newMode) {
    stopPomodoroInterval();
    pomoRuntime.mode = newMode;
    pomoRuntime.secondsLeft = (newMode === 'focus' ? state.pomodoro.focusMins : state.pomodoro.breakMins) * 60;
    renderPomodoro();
    if (newMode === 'focus') {
      setWilconReaction('studying', '🤓 ¡Me puse mis lentes azules de ingeniera! Vamos a concentrarnos.', 2500);
    } else {
      setWilconReaction('sleeping', '😴 Hora de descansar tus ojitos y estirar las patitas... Zzz.', 2500);
    }
  }

  function togglePomodoroStart() {
    if (pomoRuntime.running) {
      stopPomodoroInterval();
      updateWilconBaseState();
      renderPomodoro();
      return;
    }
    pomoRuntime.running = true;
    updateWilconBaseState();
    if (pomoRuntime.mode === 'focus') {
      const speech = document.getElementById('wilcon-speech');
      if (speech) speech.textContent = '🤓 Estudiando contigo: «' + (state.pomodoro.currentTask || 'Mecatrónica') + '»';
    }
    renderPomodoro();

    pomoRuntime.intervalId = setInterval(function () {
      if (pomoRuntime.secondsLeft > 0) {
        pomoRuntime.secondsLeft -= 1;
        renderPomodoro();
      } else {
        stopPomodoroInterval();
        if (pomoRuntime.mode === 'focus') {
          state.pomodoro.completedToday += 1;
          boostWilconHappiness(10);
          saveState();
          launchPawConfetti();
          showToast('🍅 ¡Pomodoro completado! Hora de descansar con Wilcon.');
          switchPomodoroMode('break');
        } else {
          showToast('✨ ¡Terminó el descanso! Lista para otro bloque de foco.');
          switchPomodoroMode('focus');
        }
      }
    }, 1000);
  }

  /* ========================================================================
     MÓDULO 5: PROMEDIOS PONDERADOS Y META EN EL FINAL
     ======================================================================== */
  function getActiveGradeCourse() {
    const activeCourses = state.grades.courses.filter(function (c) { return !c.deleted; });
    let course = activeCourses.find(function (c) { return c.id === state.grades.activeCourseId; });
    if (!course && activeCourses.length > 0) {
      course = activeCourses[0];
      state.grades.activeCourseId = course.id;
    }
    return course;
  }

  function renderGradesModule() {
    const selectEl = document.getElementById('grade-course-select');
    const minPassEl = document.getElementById('grade-min-pass');
    const goalEl = document.getElementById('grade-target-goal');
    const finalWEl = document.getElementById('grade-final-weight');
    const listEl = document.getElementById('grade-evals-list');

    if (!selectEl || !listEl) return;

    const activeCourses = state.grades.courses.filter(function (c) { return !c.deleted; });
    selectEl.innerHTML = activeCourses.map(function (c) {
      const sel = c.id === state.grades.activeCourseId ? ' selected' : '';
      return '<option value="' + escapeHtml(c.id) + '"' + sel + '>' + escapeHtml(c.name) + '</option>';
    }).join('');

    const course = getActiveGradeCourse();
    if (!course) return;

    if (minPassEl) minPassEl.value = course.minPass;
    if (goalEl) goalEl.value = course.targetGoal;
    if (finalWEl) finalWEl.value = course.finalWeight;

    listEl.innerHTML = course.evals.map(function (ev, idx) {
      return (
        '<div class="eval-row" data-eval-index="' + idx + '">' +
          '<input type="text" class="form-input eval-name-in" value="' + escapeHtml(ev.name) + '" aria-label="Nombre de evaluación ' + (idx + 1) + '" placeholder="Parcial">' +
          '<input type="number" step="0.1" class="form-input eval-grade-in" value="' + escapeHtml(ev.grade) + '" aria-label="Calificación ' + (idx + 1) + '" placeholder="Calificación">' +
          '<input type="number" step="0.05" min="0" max="1" class="form-input eval-weight-in" value="' + escapeHtml(ev.weight) + '" aria-label="Peso fracción ' + (idx + 1) + '" placeholder="Peso (ej. 0.25)">' +
          '<button type="button" class="btn btn-danger" data-del-eval="' + idx + '" aria-label="Quitar evaluación">✕</button>' +
        '</div>'
      );
    }).join('');

    renderGradesSummaryOnly();
  }

  function syncCourseFromInputs() {
    const course = getActiveGradeCourse();
    if (!course) return;
    const minPassEl = document.getElementById('grade-min-pass');
    const goalEl = document.getElementById('grade-target-goal');
    const finalWEl = document.getElementById('grade-final-weight');
    if (minPassEl) course.minPass = Number(minPassEl.value);
    if (goalEl) course.targetGoal = Number(goalEl.value);
    if (finalWEl) course.finalWeight = Number(finalWEl.value);

    const rows = document.querySelectorAll('#grade-evals-list .eval-row');
    const updatedEvals = [];
    rows.forEach(function (row, idx) {
      const nameIn = row.querySelector('.eval-name-in');
      const gradeIn = row.querySelector('.eval-grade-in');
      const weightIn = row.querySelector('.eval-weight-in');
      updatedEvals.push({
        id: 'ev_' + idx,
        name: nameIn ? nameIn.value : 'Evaluación ' + (idx + 1),
        grade: gradeIn ? Number(gradeIn.value) : 0,
        weight: weightIn ? Number(weightIn.value) : 0
      });
    });
    course.evals = updatedEvals;
    course.updatedAt = Date.now();
    course.deleted = false;
    saveState();
  }

  function calculateAndRenderGrades() {
    syncCourseFromInputs();
    renderGradesSummaryOnly();
  }

  function renderGradesSummaryOnly() {
    const course = getActiveGradeCourse();
    const outBox = document.getElementById('grade-results-box');
    if (!course || !outBox) return;

    const res = Formulas.calcFinalGradeNeeded(
      course.evals,
      course.finalWeight,
      course.targetGoal,
      course.minPass
    );

    if (res.error) {
      outBox.innerHTML = '<p style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</p>';
      return;
    }

    const weightNotice = res.weightsValid
      ? '<span class="badge badge-success">✅ Suma de pesos = ' + res.totalWeights.toFixed(2) + ' (Correcto)</span>'
      : '<span class="badge badge-warning">⚠️ Atención: Σpeso_i (' + res.sumPartialWeights.toFixed(2) + ') + peso_final (' + course.finalWeight.toFixed(2) + ') = ' + res.totalWeights.toFixed(2) + ' (debe sumar 1.00; usa el botón Auto)</span>';

    let goalMessage = '';
    if (res.neededForGoal <= 0) {
      goalMessage = '🎉 ¡Increíble! Ya alcanzaste tu meta de <strong>' + course.targetGoal + '</strong> con los puntos que llevas.';
    } else {
      goalMessage = '🎯 Necesitas sacar <strong>' + res.neededForGoal.toFixed(2) + '</strong> en el final para llegar a tu meta de <strong>' + course.targetGoal + '</strong>.';
    }

    const passMessage = res.neededForPass <= 0
      ? '✅ ¡Ya tienes asegurada la calificación mínima aprobatoria (' + course.minPass + ')!'
      : '📌 Para aprobar con el mínimo (' + course.minPass + '), necesitas <strong>' + res.neededForPass.toFixed(2) + '</strong> en el final.';

    outBox.innerHTML =
      '<div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px;">' +
        weightNotice +
        '<span class="badge badge-blue">Puntos acumulados Σ(calif×peso): ' + res.weightedSum.toFixed(2) + '</span>' +
        '<span class="badge badge-purple">Promedio parcial actual: ' + res.currentAvg.toFixed(2) + '</span>' +
      '</div>' +
      '<p style="font-size:1.05rem; margin-bottom:4px;">' + goalMessage + '</p>' +
      '<p class="card-subtitle">' + passMessage + '</p>';
  }

  /* ========================================================================
     MÓDULO 6: CAJA DE HERRAMIENTAS DE MECATRÓNICA (CON OSCILOSCOPIOS SVG)
     ======================================================================== */
  function formatEngResistor(ohms) {
    if (ohms >= 1e6) return (ohms / 1e6).toFixed(2).replace(/\.00$/, '') + ' MΩ';
    if (ohms >= 1e3) return (ohms / 1e3).toFixed(2).replace(/\.00$/, '') + ' kΩ';
    return ohms.toFixed(2).replace(/\.00$/, '') + ' Ω';
  }

  function initResistorSelects() {
    const b1 = document.getElementById('res-b1');
    const b2 = document.getElementById('res-b2');
    const b3 = document.getElementById('res-b3');
    const mult = document.getElementById('res-mult');
    const tol = document.getElementById('res-tol');
    if (!b1 || !b2 || !b3 || !mult || !tol) return;

    const digitOpts = RESISTOR_DIGIT_COLORS.map(function (c) {
      return '<option value="' + c.value + '" data-hex="' + c.hex + '">' + c.name + '</option>';
    }).join('');
    b1.innerHTML = digitOpts;
    b2.innerHTML = digitOpts;
    b3.innerHTML = digitOpts;

    mult.innerHTML = RESISTOR_MULT_COLORS.map(function (c) {
      return '<option value="' + c.mult + '" data-hex="' + c.hex + '">' + c.name + '</option>';
    }).join('');

    tol.innerHTML = RESISTOR_TOL_COLORS.map(function (c) {
      return '<option value="' + c.tol + '" data-hex="' + c.hex + '">' + c.name + '</option>';
    }).join('');

    b1.value = '4';
    b2.value = '7';
    b3.value = '0';
    mult.value = '100';
    tol.value = '5';
  }

  function runResistorColorCalc() {
    const modeEl = document.getElementById('res-bands-mode');
    const b1El = document.getElementById('res-b1');
    const b2El = document.getElementById('res-b2');
    const b3El = document.getElementById('res-b3');
    const multEl = document.getElementById('res-mult');
    const tolEl = document.getElementById('res-tol');
    const b3Group = document.getElementById('res-b3-group');
    const svgB3 = document.getElementById('res-svg-b3');
    const out = document.getElementById('res-output');

    if (!modeEl || !b1El || !b2El || !b3El || !multEl || !tolEl || !out) return;
    const mode = Number(modeEl.value);
    if (b3Group) b3Group.style.display = mode === 5 ? 'flex' : 'none';
    if (svgB3) svgB3.style.display = mode === 5 ? 'block' : 'none';

    const getHex = function (sel) {
      const opt = sel.options[sel.selectedIndex];
      return opt ? opt.getAttribute('data-hex') : '#1f2937';
    };
    const s1 = document.getElementById('res-svg-b1');
    const s2 = document.getElementById('res-svg-b2');
    const s3 = document.getElementById('res-svg-b3');
    const sm = document.getElementById('res-svg-mult');
    const st = document.getElementById('res-svg-tol');
    if (s1) s1.setAttribute('fill', getHex(b1El));
    if (s2) s2.setAttribute('fill', getHex(b2El));
    if (s3) s3.setAttribute('fill', getHex(b3El));
    if (sm) sm.setAttribute('fill', getHex(multEl));
    if (st) st.setAttribute('fill', getHex(tolEl));

    const res = Formulas.calcResistorColorCode(
      mode,
      b1El.value,
      b2El.value,
      b3El.value,
      multEl.value,
      tolEl.value
    );

    out.innerHTML =
      '<strong>Valor nominal: ' + formatEngResistor(res.resistance) + ' (' + res.resistance.toLocaleString('es-MX') + ' Ω) ±' + res.tolerance + ' %</strong><br>' +
      '<span>Rango real admisible: ' + formatEngResistor(res.minR) + ' a ' + formatEngResistor(res.maxR) + '</span>';
  }

  function runOhmCalc() {
    const vIn = document.getElementById('ohm-v');
    const iIn = document.getElementById('ohm-i');
    const rIn = document.getElementById('ohm-r');
    const pIn = document.getElementById('ohm-p');
    const out = document.getElementById('ohm-output');
    if (!vIn || !iIn || !rIn || !pIn || !out) return;

    const res = Formulas.calcOhmAndPower({
      V: vIn.value,
      I: iIn.value,
      R: rIn.value,
      P: pIn.value
    });

    if (res.error) {
      out.innerHTML = '<span style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</span>';
      return;
    }

    out.innerHTML =
      '<strong>Resultados calculados:</strong><br>' +
      '• Voltaje <strong>V = ' + res.V.toFixed(4) + ' V</strong> &nbsp;|&nbsp; ' +
      'Corriente <strong>I = ' + res.I.toFixed(4) + ' A</strong> (' + (res.I * 1000).toFixed(2) + ' mA)<br>' +
      '• Resistencia <strong>R = ' + res.R.toFixed(4) + ' Ω</strong> &nbsp;|&nbsp; ' +
      'Potencia <strong>P = ' + res.P.toFixed(4) + ' W</strong>';
  }

  function runVoltageDividerCalc() {
    const vin = document.getElementById('vdiv-vin');
    const r1 = document.getElementById('vdiv-r1');
    const r2 = document.getElementById('vdiv-r2');
    const out = document.getElementById('vdiv-output');
    if (!vin || !r1 || !r2 || !out) return;

    const res = Formulas.calcVoltageDivider(vin.value, r1.value, r2.value);
    if (res.error) {
      out.innerHTML = '<span style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</span>';
      return;
    }
    out.innerHTML =
      '<strong>Voltaje de salida Vout = ' + res.Vout.toFixed(4) + ' V</strong><br>' +
      '<span>Factor de división R2/(R1+R2) = ' + (res.ratio * 100).toFixed(2) + ' %</span>';
  }

  function runLedCalc() {
    const vs = document.getElementById('led-vs');
    const vf = document.getElementById('led-vf');
    const iVal = document.getElementById('led-if');
    const iUnit = document.getElementById('led-if-unit');
    const out = document.getElementById('led-output');
    if (!vs || !vf || !iVal || !iUnit || !out) return;

    const rawI = Number(iVal.value);
    const iAmps = iUnit.value === 'mA' ? rawI / 1000 : rawI;
    const res = Formulas.calcLedResistor(vs.value, vf.value, iAmps);
    if (res.error) {
      out.innerHTML = '<span style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</span>';
      return;
    }
    out.innerHTML =
      '• Resistencia exacta: <strong>R = ' + res.R.toFixed(2) + ' Ω</strong><br>' +
      '• Valor comercial E12 inmediato superior: <strong>' + res.E12 + ' Ω</strong> (' + formatEngResistor(res.E12) + ')<br>' +
      '• Corriente con E12: <strong>' + (res.actualCurrentA * 1000).toFixed(2) + ' mA</strong> · Potencia disipada: <strong>' + (res.powerW * 1000).toFixed(1) + ' mW</strong>';
  }

  function runRCCalc() {
    const rVal = document.getElementById('rc-r');
    const rUnit = document.getElementById('rc-r-unit');
    const cVal = document.getElementById('rc-c');
    const cUnit = document.getElementById('rc-c-unit');
    const vVal = document.getElementById('rc-v');
    const out = document.getElementById('rc-output');
    const lbl1 = document.getElementById('rc-svg-label-1tau');
    const lbl5 = document.getElementById('rc-svg-label-5tau');
    if (!rVal || !rUnit || !cVal || !cUnit || !out) return;

    const rOhms = Number(rVal.value) * Number(rUnit.value);
    const cFarads = Number(cVal.value) * Number(cUnit.value);
    const res = Formulas.calcRCTimeConstant(rOhms, cFarads, vVal ? vVal.value : 5);
    if (res.error) {
      out.innerHTML = '<span style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</span>';
      return;
    }
    if (lbl1) lbl1.textContent = '1τ=' + res.t1Tau.toFixed(2) + 's (' + res.v1Tau.toFixed(1) + 'V)';
    if (lbl5) lbl5.textContent = '5τ=' + res.t5Tau.toFixed(2) + 's (' + res.v5Tau.toFixed(1) + 'V)';

    out.innerHTML =
      '• Constante de tiempo: <strong>τ = ' + res.tau.toFixed(6) + ' s</strong> (' + (res.tau * 1000).toFixed(3) + ' ms)<br>' +
      '• En <strong>1τ (' + res.t1Tau.toFixed(4) + ' s)</strong> alcanza el <strong>63.2 %</strong> de carga (≈ ' + res.v1Tau.toFixed(3) + ' V)<br>' +
      '• En <strong>5τ (' + res.t5Tau.toFixed(4) + ' s)</strong> alcanza el <strong>99.3 %</strong> de carga (≈ ' + res.v5Tau.toFixed(3) + ' V, régimen permanente)';
  }

  function runPWMCalc() {
    const vcc = document.getElementById('pwm-vcc');
    const dIn = document.getElementById('pwm-d');
    const dMode = document.getElementById('pwm-d-mode');
    const out = document.getElementById('pwm-output');
    const wavePath = document.getElementById('pwm-svg-wave');
    const avgLine = document.getElementById('pwm-svg-avg-line');
    const avgLbl = document.getElementById('pwm-svg-avg-label');
    if (!vcc || !dIn || !dMode || !out) return;

    const rawD = Number(dIn.value);
    const dFrac = dMode.value === 'percent' ? rawD / 100 : rawD;
    const res = Formulas.calcPWM(vcc.value, dFrac);
    if (res.error) {
      out.innerHTML = '<span style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</span>';
      return;
    }

    if (wavePath && avgLine && avgLbl) {
      const d = Math.max(0.02, Math.min(0.98, res.dutyFraction));
      const period = 120;
      const highW = Math.round(period * d);
      const x0 = 20;
      const x1 = x0 + highW;
      const x2 = x0 + period;
      const x3 = x2 + highW;
      const x4 = x2 + period;
      wavePath.setAttribute(
        'd',
        'M' + x0 + ' 60 L' + x0 + ' 16 L' + x1 + ' 16 L' + x1 + ' 60 L' + x2 + ' 60 L' + x2 + ' 16 L' + x3 + ' 16 L' + x3 + ' 60 L' + x4 + ' 60'
      );
      const avgY = (60 - 44 * res.dutyFraction).toFixed(1);
      avgLine.setAttribute('y1', avgY);
      avgLine.setAttribute('y2', avgY);
      avgLbl.setAttribute('y', String(Math.max(12, Number(avgY) - 4)));
      avgLbl.textContent = 'Vprom = ' + res.Vprom.toFixed(2) + ' V';
    }

    out.innerHTML =
      '• Voltaje promedio: <strong>Vprom = ' + res.Vprom.toFixed(4) + ' V</strong><br>' +
      '• Ciclo de trabajo: <strong>D = ' + res.dutyFraction.toFixed(4) + '</strong> (' + res.dutyPercent.toFixed(2) + ' %)';
  }

  function runMechanicsCalc() {
    const rpm = document.getElementById('mec-rpm');
    const torque = document.getElementById('mec-torque');
    const n1 = document.getElementById('mec-n1');
    const n2 = document.getElementById('mec-n2');
    const out = document.getElementById('mec-output');
    if (!rpm || !torque || !n1 || !n2 || !out) return;

    const res = Formulas.calcMechanics(rpm.value, torque.value, n1.value, n2.value);
    if (res.error) {
      out.innerHTML = '<span style="color:var(--danger); font-weight:700;">⚠️ ' + escapeHtml(res.error) + '</span>';
      return;
    }
    out.innerHTML =
      '• Velocidad angular motriz: <strong>ω1 = ' + res.omega1.toFixed(4) + ' rad/s</strong><br>' +
      '• Potencia mecánica: <strong>P = τ1·ω1 = ' + res.power.toFixed(4) + ' W</strong><br>' +
      '• Salida de engranes ideales (N1=' + n1.value + ', N2=' + n2.value + '): ' +
      '<strong>ω2 = ' + res.omega2.toFixed(4) + ' rad/s</strong> (' + res.rpm2.toFixed(2) + ' rpm) · ' +
      '<strong>τ2 = ' + res.tau2.toFixed(4) + ' N·m</strong>';
  }

  function setupConverters() {
    const decIn = document.getElementById('conv-dec');
    const binIn = document.getElementById('conv-bin');
    const hexIn = document.getElementById('conv-hex');
    const baseOut = document.getElementById('conv-base-out');

    if (decIn && binIn && hexIn && baseOut) {
      decIn.addEventListener('input', function () {
        const r = Formulas.convertBaseFromDec(decIn.value);
        if (r.error) { baseOut.textContent = '⚠️ ' + r.error; return; }
        binIn.value = r.bin;
        hexIn.value = r.hex;
        baseOut.textContent = r.dec + '₁₀ = ' + r.bin + '₂ = 0x' + r.hex + '₁₆';
      });
      binIn.addEventListener('input', function () {
        const r = Formulas.convertBaseFromBin(binIn.value);
        if (r.error) { baseOut.textContent = '⚠️ ' + r.error; return; }
        decIn.value = r.dec;
        hexIn.value = r.hex;
        baseOut.textContent = r.dec + '₁₀ = ' + r.bin + '₂ = 0x' + r.hex + '₁₆';
      });
      hexIn.addEventListener('input', function () {
        const r = Formulas.convertBaseFromHex(hexIn.value);
        if (r.error) { baseOut.textContent = '⚠️ ' + r.error; return; }
        decIn.value = r.dec;
        binIn.value = r.bin;
        baseOut.textContent = r.dec + '₁₀ = ' + r.bin + '₂ = 0x' + r.hex + '₁₆';
      });
    }

    const rpmIn = document.getElementById('conv-rpm');
    const radsIn = document.getElementById('conv-rads');
    const velOut = document.getElementById('conv-vel-out');
    if (rpmIn && radsIn && velOut) {
      rpmIn.addEventListener('input', function () {
        const w = Formulas.rpmToRadS(rpmIn.value);
        radsIn.value = w.toFixed(4);
        velOut.textContent = rpmIn.value + ' rpm = ' + w.toFixed(4) + ' rad/s';
      });
      radsIn.addEventListener('input', function () {
        const rpm = Formulas.radSToRpm(radsIn.value);
        rpmIn.value = rpm.toFixed(4);
        velOut.textContent = radsIn.value + ' rad/s = ' + rpm.toFixed(4) + ' rpm';
      });
    }

    const degIn = document.getElementById('conv-deg');
    const radIn = document.getElementById('conv-rad');
    const angOut = document.getElementById('conv-ang-out');
    if (degIn && radIn && angOut) {
      degIn.addEventListener('input', function () {
        const r = Formulas.degToRad(degIn.value);
        radIn.value = r.toFixed(4);
        angOut.textContent = degIn.value + '° = ' + r.toFixed(4) + ' rad';
      });
      radIn.addEventListener('input', function () {
        const d = Formulas.radToDeg(radIn.value);
        degIn.value = d.toFixed(4);
        angOut.textContent = radIn.value + ' rad = ' + d.toFixed(4) + '°';
      });
    }

    const nIn = document.getElementById('conv-n');
    const kgfIn = document.getElementById('conv-kgf');
    const forceOut = document.getElementById('conv-force-out');
    if (nIn && kgfIn && forceOut) {
      nIn.addEventListener('input', function () {
        const k = Formulas.newtonToKgf(nIn.value);
        kgfIn.value = k.toFixed(5);
        forceOut.textContent = nIn.value + ' N = ' + k.toFixed(5) + ' kgf';
      });
      kgfIn.addEventListener('input', function () {
        const n = Formulas.kgfToNewton(kgfIn.value);
        nIn.value = n.toFixed(5);
        forceOut.textContent = kgfIn.value + ' kgf = ' + n.toFixed(5) + ' N';
      });
    }
  }

  /* ========================================================================
     MÓDULO 7: ÁNIMO DEL DÍA, 50 FRASES GATUNAS TIERNAS Y RACHA
     ======================================================================== */
  const MOOD_META = {
    radiante: { label: 'Radiante 😻', reaction: 'starry' },
    motivada: { label: 'Motivada 😼', reaction: 'purring' },
    tranquila: { label: 'Tranquila 😺', reaction: 'purring' },
    cansada: { label: 'Cansada 😿', reaction: 'sleeping' },
    estresada: { label: 'Estresada 🙀', reaction: 'purring' },
    desanimada: { label: 'Desanimada 🥺', reaction: 'starry' }
  };

  function renderMoodModule() {
    const streakBadge = document.getElementById('mood-streak-badge');
    const punText = document.getElementById('mood-pun-text');
    const punCounter = document.getElementById('mood-pun-counter');
    const histList = document.getElementById('mood-history-list');

    if (streakBadge) {
      streakBadge.textContent = '🔥 Racha: ' + state.mood.streak + ' día(s)';
    }
    const idx = state.mood.punIndex % CAT_PUN_BANK.length;
    if (punText) {
      punText.textContent = CAT_PUN_BANK[idx];
    }
    if (punCounter) {
      punCounter.textContent = '🐾 Frase gatuna tierna #' + (idx + 1) + ' de ' + CAT_PUN_BANK.length;
    }

    if (histList) {
      if (!state.mood.history || state.mood.history.length === 0) {
        histList.innerHTML = '<div class="stat-tile"><p>Aún no hay registros de ánimo.</p></div>';
      } else {
        histList.innerHTML = state.mood.history.slice(0, 7).map(function (entry) {
          return (
            '<div class="schedule-item">' +
              '<strong>' + escapeHtml(entry.label) + '</strong>' +
              '<span class="badge badge-blue">' + escapeHtml(entry.date) + '</span>' +
            '</div>'
          );
        }).join('');
      }
    }
  }

  function selectMood(moodKey) {
    const meta = MOOD_META[moodKey] || MOOD_META.motivada;
    const todayStr = new Date().toISOString().slice(0, 10);

    if (state.mood.lastDate !== todayStr) {
      const yesterday = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
      if (state.mood.lastDate === yesterday) {
        state.mood.streak += 1;
      } else if (!state.mood.lastDate) {
        state.mood.streak = Math.max(1, state.mood.streak);
      } else {
        state.mood.streak = 1;
      }
      state.mood.lastDate = todayStr;
    }

    state.mood.punIndex = (state.mood.punIndex + 1) % CAT_PUN_BANK.length;
    state.mood.history.unshift({
      id: 'm_' + Date.now(),
      date: todayStr,
      mood: moodKey,
      label: meta.label,
      updatedAt: Date.now(),
      deleted: false
    });
    state.mood.history = state.mood.history.slice(0, 20);
    boostWilconHappiness(5);
    saveState();

    document.querySelectorAll('#mood-buttons-grid .mood-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-mood') === moodKey ? 'true' : 'false');
    });

    const pun = CAT_PUN_BANK[state.mood.punIndex];
    setWilconReaction(meta.reaction, '💙 ' + pun, 3800);
    spawnWilconHearts();
    renderMoodModule();
    renderTodayPanel();
    showToast('Ánimo registrado: ' + meta.label);
  }

  /* ========================================================================
     MÓDULO 8: RESPALDO (EXPORTAR E IMPORTAR JSON)
     ======================================================================== */
  function exportBackupJson() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateTag = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'respaldo_wilcon_mecatronica_' + dateTag + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const statusBox = document.getElementById('backup-status-box');
    if (statusBox) {
      statusBox.textContent = '✅ Respaldo JSON descargado correctamente (' + dateTag + ').';
    }
    showToast('⬇️ Archivo JSON de respaldo descargado.');
  }

  function importBackupJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const parsed = JSON.parse(String(ev.target.result));
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.schedule)) {
          throw new Error('Formato de respaldo inválido.');
        }
        state = Object.assign(createDefaultState(), parsed);
        saveState();
        renderAll();
        const statusBox = document.getElementById('backup-status-box');
        if (statusBox) {
          statusBox.textContent = '✅ Respaldo importado con éxito. ¡Todos tus datos están al día!';
        }
        launchPawConfetti();
        showToast('🎉 ¡Datos importados correctamente!');
      } catch (err) {
        const statusBox = document.getElementById('backup-status-box');
        if (statusBox) {
          statusBox.textContent = '⚠️ No se pudo importar el archivo JSON: verifica que sea un respaldo válido.';
        }
        showToast('⚠️ Archivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  }

  /* ========================================================================
     CONEXIÓN DE EVENTOS Y RENDERIZADO INICIAL
     ======================================================================== */
  function renderAll() {
    applyTheme();
    renderWilconAccessoryAndMeter();
    renderLetterAndProfile();
    renderTodayPanel();
    renderSchedule();
    renderTasks();
    renderPomodoro();
    renderGradesModule();
    runOhmCalc();
    runVoltageDividerCalc();
    runLedCalc();
    runResistorColorCalc();
    runRCCalc();
    runPWMCalc();
    runMechanicsCalc();
    renderMoodModule();
  }

  function bindEvents() {
    document.querySelectorAll('.nav-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        saveState();
        applyTheme();
      });
    }

    const openLetterBtn = document.getElementById('btn-open-letter');
    const closeLetterBtn = document.getElementById('btn-close-letter');
    const closeLetterTop = document.getElementById('btn-close-letter-top');
    const toggleOrigBtn = document.getElementById('btn-toggle-original-msg');
    const saveLetterPrefsBtn = document.getElementById('btn-save-letter-prefs');

    if (openLetterBtn) openLetterBtn.addEventListener('click', openLetterModal);
    if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetterModal);
    if (closeLetterTop) closeLetterTop.addEventListener('click', closeLetterModal);

    if (toggleOrigBtn) {
      toggleOrigBtn.addEventListener('click', function () {
        state.showOriginalLetter = !state.showOriginalLetter;
        saveState();
        renderLetterAndProfile();
      });
    }

    if (saveLetterPrefsBtn) {
      saveLetterPrefsBtn.addEventListener('click', function () {
        const nameIn = document.getElementById('input-her-name');
        const msgIn = document.getElementById('input-custom-letter');
        if (nameIn && nameIn.value.trim()) {
          state.herName = nameIn.value.trim();
        }
        if (msgIn && msgIn.value.trim()) {
          state.letterMessage = msgIn.value.trim();
          state.showOriginalLetter = false;
        }
        saveState();
        renderLetterAndProfile();
        renderTodayPanel();
        showToast('💜💙 Personalización guardada en tu dispositivo.');
      });
    }

    window.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        closeLetterModal();
      }
    });

    const nextQuoteBtn = document.getElementById('btn-next-quote');
    if (nextQuoteBtn) {
      nextQuoteBtn.addEventListener('click', function () {
        state.quoteIndex = (state.quoteIndex + 1) % DAILY_QUOTES.length;
        saveState();
        renderTodayPanel();
      });
    }

    const quickPomoBtn = document.getElementById('btn-quick-pomodoro');
    if (quickPomoBtn) {
      quickPomoBtn.addEventListener('click', function () {
        switchTab('pomodoro');
      });
    }

    const goSchedBtn = document.getElementById('btn-go-schedule');
    if (goSchedBtn) {
      goSchedBtn.addEventListener('click', function () { switchTab('horario'); });
    }
    const goTasksBtn = document.getElementById('btn-go-tasks');
    if (goTasksBtn) {
      goTasksBtn.addEventListener('click', function () { switchTab('horario'); });
    }
    const goMoodBtn = document.getElementById('btn-go-mood');
    if (goMoodBtn) {
      goMoodBtn.addEventListener('click', function () { switchTab('animo'); });
    }

    document.querySelectorAll('#schedule-day-pills .day-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        state.scheduleFilterDay = pill.getAttribute('data-day') || 'Todos';
        document.querySelectorAll('#schedule-day-pills .day-pill').forEach(function (p) {
          p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
        });
        renderSchedule();
      });
    });

    const saveSchedBtn = document.getElementById('btn-save-sched');
    const cancelSchedBtn = document.getElementById('btn-cancel-sched');
    function clearScheduleForm() {
      document.getElementById('sched-id').value = '';
      document.getElementById('sched-subject').value = '';
      document.getElementById('sched-room').value = '';
      document.getElementById('sched-start').value = '08:00';
      document.getElementById('sched-end').value = '10:00';
      document.getElementById('sched-form-title').textContent = '➕ Agregar o editar clase';
    }
    if (cancelSchedBtn) cancelSchedBtn.addEventListener('click', clearScheduleForm);

    if (saveSchedBtn) {
      saveSchedBtn.addEventListener('click', function () {
        const idVal = document.getElementById('sched-id').value;
        const subject = document.getElementById('sched-subject').value.trim();
        const day = document.getElementById('sched-day').value;
        const start = document.getElementById('sched-start').value;
        const end = document.getElementById('sched-end').value;
        const room = document.getElementById('sched-room').value.trim();

        if (!subject) {
          showToast('⚠️ Escribe el nombre de la materia.');
          return;
        }
        if (idVal) {
          const existing = state.schedule.find(function (s) { return s.id === idVal; });
          if (existing) {
            existing.subject = subject;
            existing.day = day;
            existing.start = start;
            existing.end = end;
            existing.room = room;
            existing.updatedAt = Date.now();
            existing.deleted = false;
          }
        } else {
          state.schedule.push({
            id: 's_' + Date.now(),
            subject: subject,
            day: day,
            start: start,
            end: end,
            room: room,
            updatedAt: Date.now(),
            deleted: false
          });
        }
        saveState();
        clearScheduleForm();
        renderSchedule();
        renderTodayPanel();
        showToast('📅 Clase guardada en tu horario.');
      });
    }

    const saveTaskBtn = document.getElementById('btn-save-task');
    const cancelTaskBtn = document.getElementById('btn-cancel-task');
    const taskFilterEl = document.getElementById('task-filter-status');

    function clearTaskForm() {
      document.getElementById('task-id').value = '';
      document.getElementById('task-title').value = '';
      document.getElementById('task-course').value = '';
      document.getElementById('task-priority').value = 'media';
      document.getElementById('task-status').value = 'pendiente';
      document.getElementById('task-form-title').textContent = '➕ Nueva entrega o tarea';
    }
    if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', clearTaskForm);
    if (taskFilterEl) taskFilterEl.addEventListener('change', renderTasks);

    if (saveTaskBtn) {
      saveTaskBtn.addEventListener('click', function () {
        const idVal = document.getElementById('task-id').value;
        const title = document.getElementById('task-title').value.trim();
        const course = document.getElementById('task-course').value.trim();
        const due = document.getElementById('task-due').value || new Date(Date.now() + 86400000).toISOString().slice(0, 16);
        const priority = document.getElementById('task-priority').value;
        const status = document.getElementById('task-status').value;

        if (!title) {
          showToast('⚠️ Escribe el título de la entrega o tarea.');
          return;
        }
        const wasDone = idVal ? (state.tasks.find(function (t) { return t.id === idVal; }) || {}).status === 'completada' : false;

        if (idVal) {
          const t = state.tasks.find(function (x) { return x.id === idVal; });
          if (t) {
            t.title = title;
            t.course = course;
            t.due = due;
            t.priority = priority;
            t.status = status;
            t.updatedAt = Date.now();
            t.deleted = false;
          }
        } else {
          state.tasks.push({
            id: 't_' + Date.now(),
            title: title,
            course: course,
            due: due,
            priority: priority,
            status: status,
            updatedAt: Date.now(),
            deleted: false
          });
        }
        if (!wasDone && status === 'completada') {
          launchPawConfetti();
        }
        saveState();
        clearTaskForm();
        renderTasks();
        renderTodayPanel();
        showToast('📝 Entrega guardada.');
      });
    }

    document.body.addEventListener('click', function (ev) {
      const btn = ev.target.closest('button');
      if (!btn) return;

      const completeId = btn.getAttribute('data-complete-task');
      if (completeId) {
        completeOrToggleTask(completeId);
        return;
      }

      const editSchedId = btn.getAttribute('data-edit-sched');
      if (editSchedId) {
        const item = state.schedule.find(function (s) { return s.id === editSchedId; });
        if (item) {
          document.getElementById('sched-id').value = item.id;
          document.getElementById('sched-subject').value = item.subject;
          document.getElementById('sched-day').value = item.day;
          document.getElementById('sched-start').value = item.start;
          document.getElementById('sched-end').value = item.end;
          document.getElementById('sched-room').value = item.room || '';
          document.getElementById('sched-form-title').textContent = '✏️ Editando: ' + item.subject;
        }
        return;
      }

      const delSchedId = btn.getAttribute('data-del-sched');
      if (delSchedId) {
        const targetS = state.schedule.find(function (s) { return s.id === delSchedId; });
        if (targetS) {
          targetS.deleted = true;
          targetS.updatedAt = Date.now();
        }
        saveState();
        renderSchedule();
        renderTodayPanel();
        showToast('Clase eliminada del horario.');
        return;
      }

      const editTaskId = btn.getAttribute('data-edit-task');
      if (editTaskId) {
        const t = state.tasks.find(function (x) { return x.id === editTaskId; });
        if (t) {
          document.getElementById('task-id').value = t.id;
          document.getElementById('task-title').value = t.title;
          document.getElementById('task-course').value = t.course || '';
          document.getElementById('task-due').value = t.due;
          document.getElementById('task-priority').value = t.priority;
          document.getElementById('task-status').value = t.status;
          document.getElementById('task-form-title').textContent = '✏️ Editando entrega: ' + t.title;
        }
        return;
      }

      const delTaskId = btn.getAttribute('data-del-task');
      if (delTaskId) {
        const targetT = state.tasks.find(function (x) { return x.id === delTaskId; });
        if (targetT) {
          targetT.deleted = true;
          targetT.updatedAt = Date.now();
        }
        saveState();
        renderTasks();
        renderTodayPanel();
        showToast('Entrega eliminada.');
        return;
      }

      const delEvalIdx = btn.getAttribute('data-del-eval');
      if (delEvalIdx !== null && delEvalIdx !== undefined) {
        syncCourseFromInputs();
        const course = getActiveGradeCourse();
        if (course && course.evals.length > 1) {
          course.evals.splice(Number(delEvalIdx), 1);
          saveState();
          renderGradesModule();
        } else {
          showToast('Debe quedar al menos una evaluación en la materia.');
        }
      }
    });

    // Controles del Pomodoro
    const pomoStartBtn = document.getElementById('btn-pomo-start');
    const pomoResetBtn = document.getElementById('btn-pomo-reset');
    const pomoFocusBtn = document.getElementById('btn-pomo-mode-focus');
    const pomoBreakBtn = document.getElementById('btn-pomo-mode-break');
    const pomoApplyBtn = document.getElementById('btn-pomo-apply-cfg');
    const pomoTaskIn = document.getElementById('pomo-task-input');

    if (pomoStartBtn) pomoStartBtn.addEventListener('click', togglePomodoroStart);
    if (pomoResetBtn) {
      pomoResetBtn.addEventListener('click', function () {
        switchPomodoroMode(pomoRuntime.mode);
      });
    }
    if (pomoFocusBtn) {
      pomoFocusBtn.addEventListener('click', function () { switchPomodoroMode('focus'); });
    }
    if (pomoBreakBtn) {
      pomoBreakBtn.addEventListener('click', function () { switchPomodoroMode('break'); });
    }
    if (pomoTaskIn) {
      pomoTaskIn.addEventListener('input', function () {
        state.pomodoro.currentTask = pomoTaskIn.value;
        saveState();
      });
    }
    if (pomoApplyBtn) {
      pomoApplyBtn.addEventListener('click', function () {
        const fMins = Math.max(1, Math.min(120, Number(document.getElementById('pomo-focus-mins').value) || 25));
        const bMins = Math.max(1, Math.min(60, Number(document.getElementById('pomo-break-mins').value) || 5));
        state.pomodoro.focusMins = fMins;
        state.pomodoro.breakMins = bMins;
        saveState();
        switchPomodoroMode(pomoRuntime.mode);
        showToast('🍅 Configuración de Pomodoro actualizada.');
      });
    }

    // Módulo 5: Promedios
    const courseSelect = document.getElementById('grade-course-select');
    const addCourseBtn = document.getElementById('btn-add-grade-course');
    const delCourseBtn = document.getElementById('btn-del-grade-course');
    const addEvalBtn = document.getElementById('btn-add-eval-row');
    const calcGradesBtn = document.getElementById('btn-calc-grades');
    const autoFinalWBtn = document.getElementById('btn-auto-final-weight');
    const loadGradeExBtn = document.getElementById('btn-load-grade-example');

    if (courseSelect) {
      courseSelect.addEventListener('change', function () {
        state.grades.activeCourseId = courseSelect.value;
        saveState();
        renderGradesModule();
      });
    }
    if (addCourseBtn) {
      addCourseBtn.addEventListener('click', function () {
        const nameIn = document.getElementById('grade-new-course-name');
        const name = nameIn ? nameIn.value.trim() : '';
        if (!name) {
          showToast('Escribe el nombre de la nueva materia.');
          return;
        }
        const newId = 'c_' + Date.now();
        state.grades.courses.push({
          id: newId,
          name: name,
          minPass: 6.0,
          targetGoal: 9.0,
          finalWeight: 0.40,
          updatedAt: Date.now(),
          deleted: false,
          evals: [
            { id: 'ev1', name: 'Parcial 1', grade: 8.5, weight: 0.30 },
            { id: 'ev2', name: 'Parcial 2', grade: 9.0, weight: 0.30 }
          ]
        });
        state.grades.activeCourseId = newId;
        if (nameIn) nameIn.value = '';
        saveState();
        renderGradesModule();
        showToast('📊 Materia «' + name + '» agregada.');
      });
    }
    if (delCourseBtn) {
      delCourseBtn.addEventListener('click', function () {
        const activeCourses = state.grades.courses.filter(function (c) { return !c.deleted; });
        if (activeCourses.length <= 1) {
          showToast('Debe existir al menos una materia en la calculadora.');
          return;
        }
        const targetC = state.grades.courses.find(function (c) { return c.id === state.grades.activeCourseId; });
        if (targetC) {
          targetC.deleted = true;
          targetC.updatedAt = Date.now();
        }
        const remaining = state.grades.courses.filter(function (c) { return !c.deleted; });
        state.grades.activeCourseId = remaining[0].id;
        saveState();
        renderGradesModule();
        showToast('Materia eliminada.');
      });
    }
    if (addEvalBtn) {
      addEvalBtn.addEventListener('click', function () {
        syncCourseFromInputs();
        const course = getActiveGradeCourse();
        if (!course) return;
        course.evals.push({
          id: 'ev_' + Date.now(),
          name: 'Parcial ' + (course.evals.length + 1),
          grade: 8.0,
          weight: 0.20
        });
        saveState();
        renderGradesModule();
      });
    }
    if (autoFinalWBtn) {
      autoFinalWBtn.addEventListener('click', function () {
        syncCourseFromInputs();
        const course = getActiveGradeCourse();
        if (!course) return;
        const sumPartials = course.evals.reduce(function (acc, ev) { return acc + Number(ev.weight || 0); }, 0);
        const rem = Math.max(0.05, Number((1 - sumPartials).toFixed(4)));
        course.finalWeight = rem;
        saveState();
        renderGradesModule();
      });
    }
    if (calcGradesBtn) {
      calcGradesBtn.addEventListener('click', calculateAndRenderGrades);
    }
    if (loadGradeExBtn) {
      loadGradeExBtn.addEventListener('click', function () {
        const course = getActiveGradeCourse();
        if (!course) return;
        course.minPass = 6.0;
        course.targetGoal = 9.0;
        course.finalWeight = 0.30;
        course.evals = [
          { id: 'e1', name: 'Parcial 1', grade: 9.0, weight: 0.35 },
          { id: 'e2', name: 'Parcial 2', grade: 8.5, weight: 0.35 }
        ];
        saveState();
        renderGradesModule();
        showToast('📋 Ejemplo cargado en la calculadora de promedios.');
      });
    }

    // Módulo 6: Caja de herramientas de mecatrónica
    document.getElementById('btn-ohm-calc').addEventListener('click', runOhmCalc);
    document.getElementById('btn-ohm-clear').addEventListener('click', function () {
      document.getElementById('ohm-v').value = '';
      document.getElementById('ohm-i').value = '';
      document.getElementById('ohm-r').value = '';
      document.getElementById('ohm-p').value = '';
      document.getElementById('ohm-output').textContent = 'Ingresa cualesquiera 2 valores y presiona Calcular.';
    });
    document.getElementById('btn-ohm-example').addEventListener('click', function () {
      document.getElementById('ohm-v').value = '12';
      document.getElementById('ohm-i').value = '0.5';
      document.getElementById('ohm-r').value = '';
      document.getElementById('ohm-p').value = '';
      runOhmCalc();
    });

    document.getElementById('btn-vdiv-calc').addEventListener('click', runVoltageDividerCalc);
    document.getElementById('btn-vdiv-example').addEventListener('click', function () {
      document.getElementById('vdiv-vin').value = '12';
      document.getElementById('vdiv-r1').value = '1000';
      document.getElementById('vdiv-r2').value = '2000';
      runVoltageDividerCalc();
    });

    document.getElementById('btn-led-calc').addEventListener('click', runLedCalc);
    document.getElementById('btn-led-example').addEventListener('click', function () {
      document.getElementById('led-vs').value = '9';
      document.getElementById('led-vf').value = '2.1';
      document.getElementById('led-if').value = '15';
      document.getElementById('led-if-unit').value = 'mA';
      runLedCalc();
    });

    ['res-bands-mode', 'res-b1', 'res-b2', 'res-b3', 'res-mult', 'res-tol'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', runResistorColorCalc);
    });
    document.getElementById('btn-res-example').addEventListener('click', function () {
      document.getElementById('res-bands-mode').value = '4';
      document.getElementById('res-b1').value = '4';
      document.getElementById('res-b2').value = '7';
      document.getElementById('res-mult').value = '100';
      document.getElementById('res-tol').value = '5';
      runResistorColorCalc();
    });

    document.getElementById('btn-rc-calc').addEventListener('click', runRCCalc);
    document.getElementById('btn-rc-example').addEventListener('click', function () {
      document.getElementById('rc-r').value = '4.7';
      document.getElementById('rc-r-unit').value = '1000';
      document.getElementById('rc-c').value = '220';
      document.getElementById('rc-c-unit').value = '0.000001';
      document.getElementById('rc-v').value = '5';
      runRCCalc();
    });

    document.getElementById('btn-pwm-calc').addEventListener('click', runPWMCalc);
    document.getElementById('btn-pwm-example').addEventListener('click', function () {
      document.getElementById('pwm-vcc').value = '12';
      document.getElementById('pwm-d').value = '0.65';
      document.getElementById('pwm-d-mode').value = 'fraction';
      runPWMCalc();
    });

    document.getElementById('btn-mec-calc').addEventListener('click', runMechanicsCalc);
    document.getElementById('btn-mec-example').addEventListener('click', function () {
      document.getElementById('mec-rpm').value = '1800';
      document.getElementById('mec-torque').value = '1.5';
      document.getElementById('mec-n1').value = '15';
      document.getElementById('mec-n2').value = '45';
      runMechanicsCalc();
    });

    document.getElementById('btn-conv-examples').addEventListener('click', function () {
      document.getElementById('conv-dec').value = '255';
      document.getElementById('conv-bin').value = '11111111';
      document.getElementById('conv-hex').value = 'FF';
      document.getElementById('conv-base-out').textContent = '255₁₀ = 11111111₂ = 0xFF₁₆';
      document.getElementById('conv-rpm').value = '1800';
      document.getElementById('conv-rads').value = Formulas.rpmToRadS(1800).toFixed(4);
      document.getElementById('conv-deg').value = '90';
      document.getElementById('conv-rad').value = Formulas.degToRad(90).toFixed(4);
      document.getElementById('conv-kgf').value = '2.5';
      document.getElementById('conv-n').value = Formulas.kgfToNewton(2.5).toFixed(5);
      showToast('🔄 Ejemplos cargados en los 4 convertidores.');
    });

    // Módulo 7: Ánimo del día
    document.querySelectorAll('#mood-buttons-grid .mood-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectMood(btn.getAttribute('data-mood'));
      });
    });
    const newPunBtn = document.getElementById('btn-new-cat-pun');
    if (newPunBtn) {
      newPunBtn.addEventListener('click', function () {
        state.mood.punIndex = (state.mood.punIndex + 1) % CAT_PUN_BANK.length;
        saveState();
        renderMoodModule();
        spawnWilconHearts();
      });
    }

    // Módulo 8: Respaldo JSON
    const exportBtn = document.getElementById('btn-export-json');
    const triggerImpBtn = document.getElementById('btn-trigger-import');
    const fileImpIn = document.getElementById('input-import-json');
    const resetDemoBtn = document.getElementById('btn-reset-demo');
    const resetBox = document.getElementById('reset-confirm-box');
    const confirmYes = document.getElementById('btn-confirm-reset-yes');
    const confirmNo = document.getElementById('btn-confirm-reset-no');

    if (exportBtn) exportBtn.addEventListener('click', exportBackupJson);
    if (triggerImpBtn && fileImpIn) {
      triggerImpBtn.addEventListener('click', function () { fileImpIn.click(); });
      fileImpIn.addEventListener('change', function () {
        if (fileImpIn.files && fileImpIn.files[0]) {
          importBackupJson(fileImpIn.files[0]);
          fileImpIn.value = '';
        }
      });
    }
    if (resetDemoBtn && resetBox) {
      resetDemoBtn.addEventListener('click', function () {
        resetBox.style.display = 'block';
      });
    }
    if (confirmNo && resetBox) {
      confirmNo.addEventListener('click', function () {
        resetBox.style.display = 'none';
      });
    }
    if (confirmYes && resetBox) {
      confirmYes.addEventListener('click', function () {
        state = createDefaultState();
        state.letterSeen = true;
        saveState();
        resetBox.style.display = 'none';
        renderAll();
        showToast('🔄 Datos iniciales de ejemplo restaurados.');
      });
    }
  }

  /* ========================================================================
     INICIALIZACIÓN AL CARGAR EL DOM
     ======================================================================== */
  window.WilconApp = {
    getState: function () { return state; },
    setStateFromSync: function (newState) {
      isApplyingRemoteChanges = true;
      try {
        state = newState;
        saveState(true);
        renderAll();
      } finally {
        isApplyingRemoteChanges = false;
      }
    },
    isWilconBusy: function () {
      return wilconTempTimer !== null;
    },
    exportBackup: exportBackupJson,
    setWilconReaction: setWilconReaction,
    showToast: showToast
  };

  function initApp() {
    loadState();
    initResistorSelects();
    setupWilconInteractions();
    setupConverters();
    bindEvents();
    pomoRuntime.secondsLeft = state.pomodoro.focusMins * 60;
    renderAll();

    if (!state.letterSeen) {
      setTimeout(openLetterModal, 350);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
