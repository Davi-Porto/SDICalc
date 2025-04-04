import { JSX } from "react";
import Cursor from "@/components/cursor";
import { clamp } from "./functions";
import { multDivPad, nNumPad, nPowPad, powPad, sumSubPad, terms } from "./pads";

export class Calc {
  private value: string = "||";
  private cursorPoint: number = 0;
  private cursorPoints: number[] = [];

  answer: string = "";

  constructor() {
    this.checkPoints();
  }

  private checkPoints() {
    this.cursorPoints = [];

    this.value.split("").forEach((char, index) => {
      if (
        char === "|" &&
        this.cursorPoints[this.cursorPoints.length - 1] != index - 1
      )
        this.cursorPoints.push(index);
    });

    this.cursorPoint = this.cursorPoints.indexOf(this.value.indexOf("||"));

    return this.cursorPoints;
  }

  private cursorMove(n: number, set?: boolean) {
    this.checkPoints();

    this.value = this.value.replace("||", "|");

    if (set) this.cursorPoint = clamp(n, 0, this.cursorPoints.length - 1);
    else this.cursorPoint += n;

    this.value =
      this.value.slice(0, this.cursorPoints[this.cursorPoint]) +
      "|" +
      this.value.slice(this.cursorPoints[this.cursorPoint]);

    this.checkPoints();
  }

  private toE(value: string, cursor?: boolean) {
    const v = value.trim().replaceAll(/\|(?!\|)/g, "");
    const r: JSX.Element[] = [];
    let exp = false;
    let nestInd = 0;

    v.split("").forEach((char, index) => {
      if (char === "|" && !cursor) return;
      if (char === "|") {
        r.push(<Cursor exp={exp} expI={nestInd} key="cursor" />);
        return;
      }
      // Fim do expoente
      if (char == "]" && nestInd == 1) {
        exp = false;
        nestInd--;
        return;
      }
      // Início do expoente
      if (!exp && char === "[") {
        exp = true;
        nestInd++;
        return;
      }
      if (exp) {
        // Início de novo aninhamento
        if (char === "[") {
          nestInd++;
          return;
        }
        // Fim do aninhamento atual
        if (char === "]") {
          nestInd--;
          return;
        }
        // Carácter dentro do aninhamento atual
        r.push(
          <span
            key={index}
            className="text-sm"
            style={{ marginBottom: `${12 * nestInd}px` }}
          >
            {char}
          </span>
        );
        return;
      }
      r.push(<span key={index}>{char}</span>);
    });
    return r;
  }

  private getPriority(
    v: string,
    config: {
      parentheses?: boolean;
      exp?: boolean;
      pow?: boolean;
      multDiv?: boolean;
      sumSub?: boolean;
    } = {
      parentheses: true,
      exp: true,
      pow: true,
      multDiv: true,
      sumSub: true,
    },
    start?: number
  ): [string, number, number, string] {
    // Parenteses
    if (config.parentheses) {
      const aux = this.getBetween(v);
      if (aux[0] != "") {
        return this.getPriority(
          aux[0],
          undefined,
          start ? start + aux[1] + 1 : aux[1] + 1
        );
      }
    }

    // Potência
    if (config.pow && powPad.test(v)) {
      const match: RegExpMatchArray = v.match(powPad) as RegExpMatchArray;

      const calc = (match[1] || match[2]) + "^" + match[3];

      const startI = start
        ? start + (match.index as number)
        : (match.index as number);
      const endI = startI + match[0].length;

      return [calc, startI, endI - 1, "^"];
    }

    // Cálculos dentro do expoente
    if (config.exp) {
      const aux = this.getBetween(v, "exp");
      if (aux[0] != "") {
        return this.getPriority(
          aux[0],
          undefined,
          start ? start + aux[1] : aux[1] + 1
        );
      }
    }

    // Multiplicação e Divisão
    if (config.multDiv && multDivPad.test(v)) {
      const match = v.match(multDivPad) as RegExpMatchArray;

      const calc = (match[1] || match[2]) + match[3] + (match[4] || match[5]);

      const startI = start || (match.index as number);

      const endI = startI + match[0].length;

      return [calc, startI, endI - 1, match[3]];
    }

    // Adição e Subtração
    if (config.sumSub && sumSubPad.test(v)) {
      const match = v.match(sumSubPad) as RegExpMatchArray;

      const calc = (match[1] || match[2]) + match[3] + (match[4] || match[5]);

      const startI = start || (match.index as number);

      const endI = startI + match[0].length;

      return [calc, startI, endI - 1, match[3]];
    }

    return [v, 0, 0, ""];
  }

  private getBetween(
    v: string,
    type: "par" | "exp" = "par"
  ): [string, number, number] {
    const cOpen = type == "par" ? "(" : "[";
    const cClose = type == "par" ? ")" : "]";

    const find: [string, number, number][] = [];
    let opened = 0;
    let closed = 0;
    let start = 0;
    let txt = "";

    v.split("").forEach((c, i) => {
      if (c == cOpen) {
        opened++;
        if (opened == 1) start = i;
      } else if (c == cClose) closed++;
      else if (opened > 0) txt += c;

      if (opened > 0 && opened == closed) {
        find.push([txt, start, i]);
        txt = "";
        opened = 0;
        closed = 0;
      }
    });

    for (let i = 0; i < find.length; i++) {
      if (!nNumPad.test(find[i][0]) && !nPowPad.test(find[i][0])) {
        return find[i];
      }
    }
    return ["", 0, 0];
  }

  private checkParentesis(v: string): boolean {
    let r = true;
    if (/\(|\)/.test(v)) {
      const parentesisMatch = v.matchAll(/\(|\)/g);
      const parentesis: string[] = [];

      for (const p of parentesisMatch) {
        parentesis.push(p[0]);
      }

      const countOpen = parentesis.filter((p) => p === "(").length;
      const countClose = parentesis.filter((p) => p === ")").length;

      if (countOpen != countClose) return false;

      let open = 0;

      parentesis.forEach((p) => {
        if (p == "(") open++;
        else if (p == ")" && open > 0) open--;
        else if (p == ")" && open == 0) {
          r = false;
        }
      });
    }

    return r;
  }

  private executeCalc(config?: {
    parentheses?: boolean;
    exp?: boolean;
    pow?: boolean;
    multDiv?: boolean;
    sumSub?: boolean;
  }) {
    config = {
      parentheses: true,
      exp: true,
      pow: true,
      multDiv: true,
      sumSub: true,
      ...config,
    };
    let base = this.valueS();
    const steps = [];

    while (this.getPriority(base, config)[3] != "") {
      const priority = this.getPriority(base, config);

      const op = priority[3];
      const [n1, n2] = priority[0].split(op).map((v) => Number(v));
      let res;

      if (op == "+") res = n1 + n2;
      else if (op == "-") res = n1 - n2;
      else if (op == "*") res = n1 * n2;
      else if (op == "/") res = n1 / n2;
      else if (op == "^") res = n1 ** n2;

      steps.push([base, priority[0], res]);

      base = (
        base.slice(0, priority[1]) +
        res +
        base.slice(priority[2] + 1)
      ).replaceAll(/\(([0-9]+)\)/g, "$1");
    }

    console.log(steps);

    return base;
  }

  private organizeTherms(v: string) {
    const parts = v.split("=");
    const before = [...parts[0].matchAll(terms).map((m) => m[0])];
    const after = [...parts[1].matchAll(terms).map((m) => m[0])];

    const newBefore = [...before.filter((t) => /[xyz]/.test(t))];
    const newAfter = [...after.filter((t) => !/[xyz]/.test(t))];

    after.forEach((t) => {
      if (/[xyz]/.test(t)) {
        if (t[0] == "-") newBefore.push(`+${t.slice(1)}`);
        else if (t[0] == "+") newBefore.push(`-${t.slice(1)}`);
        else newBefore.push(`-${t}`);
      }
    });

    before.forEach((t) => {
      if (!/[xyz]/.test(t)) {
        if (t[0] == "-") newAfter.push(`+${t.slice(1)}`);
        else if (t[0] == "+") newAfter.push(`-${t.slice(1)}`);
        else newAfter.push(`-${t}`);
      }
    });

    console.log(v, "->", newBefore, newAfter);
  }

  rawValue(add?: string): string {
    if (add != undefined) {
      this.value = this.value.replace("||", "|" + add);
      this.value = this.value.replace("|]|[|", "|");
      this.checkPoints();
    }
    return this.value;
  }

  valueS() {
    return this.value
      .replaceAll("|", "")
      .replaceAll("()", "")
      .replaceAll(/\(([0-9]+)\)/g, "$1");
  }

  valueE(): JSX.Element[] {
    return this.toE(this.value, true);
  }

  answerE(): JSX.Element[] {
    return this.toE(this.answer);
  }

  backspace() {
    this.checkPoints();

    if (/\|\]\|\|/.test(this.value)) {
      // Caso 1: Cursor depois de um aninhamento
      this.cursorLeft();
    } else if (/\[\|[^[\]]\|\|\]/.test(this.value)) {
      // Caso 2: Cursor no expoente superior
      this.value = this.value.replace(/\[\|[^[\]]\|\|\]/, "");
    } else if (/\[\|\|([^[\]])\|\]/.test(this.value)) {
      // Caso 3: Cursor antes do expoente superior
      this.value = this.value.replace(/\[\|\|([^[\]])\|\]/, "|$1");
    } else if (
      /\[\|[^[\]]\|\|[^\]]/.test(this.value) ||
      /\[\|\|[^[\]]\|[^\]]/.test(this.value)
    ) {
      // Caso 4: Cursor em um expoente que tem expoente(s)
      // e
      // Caso 5: Cursor antes do expoente que tem expoente(s)

      const parts = [];

      if (/\[\|[^[\]]\|\|\[/.test(this.value)) {
        parts.push(
          ...this.value.replace(/\[\|[^[\]]\|(\|[^\]])/, "@$1").split("@")
        );
      } else {
        parts.push(
          ...this.value.replace(/\[\|(\|[^[\]]\|[^\]])/, "$1@").split("@")
        );
      }

      const aux = parts[1].split("");

      let qEA = 0;
      let qEF = 0;
      let i = 0;
      let newV = "";

      do {
        const char = aux[i];
        if (char === "[") qEA++;
        if (char === "]") qEF++;
        i++;
        newV += char;
      } while (qEA >= qEF);

      this.value = parts[0] + newV.slice(0, -2) + parts[1].slice(i);
    } else if (/\|[^[\]]\|\|/.test(this.value)) {
      // Caso 6: Cursor em um termo normal
      this.value = this.value.replace(/\|[^[\]]\|\|/, "||");
    }

    this.checkPoints();
  }

  calc() {
    let r = "...";
    const vS = this.valueS();

    if (this.checkParentesis(vS)) {
      if (!/[xyz=]/.test(vS)) {
        // Contas básicas
        r = this.executeCalc();
      } else {
        const aux = this.executeCalc({
          pow: false,
          sumSub: false,
          multDiv: false,
        });
        if (
          /[xyz]/.test(aux) &&
          /=/.test(aux) &&
          !/[xyz]\[(?:[2-9]|(?:[1-9][0-9]+))\]/.test(aux)
        ) {
          // Equação de 1° grau
          console.log("Equação 1");
          this.organizeTherms(aux);
        } else if (
          /[xyz]/.test(aux) &&
          /=/.test(aux) &&
          !/[xyz]\[(?:[3-9]|(?:[1-9][0-9]+))\]/.test(aux) &&
          /-?(?:[1-9]|(?:[1-9][0-9]+))[xyz]\[2\]/.test(aux)
        ) {
          // Equação de 2° grau
          console.log("Equação 2");
          this.organizeTherms(aux);
        } else if (/[xyz]/.test(aux) && !/=/.test(aux)) {
          console.log("Polinômio");
        }
      }
    }
    this.answer = r;
  }

  cursorLeft() {
    if (this.cursorPoint > 0 && this.cursorPoints.length > 1) {
      this.cursorMove(-1);
    }
  }

  cursorRight() {
    if (
      this.cursorPoint < this.cursorPoints.length - 1 &&
      this.cursorPoints.length > 1
    ) {
      this.cursorMove(1);
    }
  }

  clear() {
    this.value = "||";
    this.checkPoints();
    this.cursorPoint = 0;
    this.answer = "";
  }

  home() {
    this.cursorMove(0, true);
  }

  end() {
    this.cursorMove(this.cursorPoints.length - 1, true);
  }

  del() {
    if (!/\|\|$/.test(this.value)) {
      this.cursorRight();
      this.backspace();
    }
  }
}

export const calcI = new Calc();
