import { JSX } from "react";
import Cursor from "@/components/cursor";
import { clamp } from "./functions";

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
    start?: number
  ): [string, number, number, string] {
    // Parenteses
    if (/\(.+\)/.test(v) && !/\(\-[0-9]+\)/.test(v)) {
      const between = this.between(v, "(", ")");

      const sub = this.getPriority(
        between[0],
        start ? start + between[1] + 1 : between[1] + 1
      );

      return [sub[0], sub[1], sub[2], sub[3]];
    }

    // Potencia
    if (/\[.+\]/.test(v) && !/\[\(?\-?[0-9]+\)?\]/.test(v)) {
      const between = this.between(v, "[", "]");

      const sub = this.getPriority(
        between[0],
        start ? start + between[1] : between[1] + 1
      );

      return [sub[0], sub[1], sub[2], sub[3]];
    } else if (/\(?\-?[0-9]+\)?\[\(?\-?[0-9]+\)?\]/.test(v)) {
      let match: RegExpMatchArray;
      if (/\(\-[0-9]+\)\[\(?\-?[0-9]+\)?\]/.test(v)) {
        match = v.match(
          /\((\-[0-9]+)\)\[\(?(\-?[0-9]+)\)?\]/
        ) as RegExpMatchArray;
      } else {
        match = v.match(/([0-9]+)\[\(?(\-?[0-9]+)\)?\]/) as RegExpMatchArray;
      }

      const calc = match[1] + "^" + match[2];

      const startI = start
        ? start + (match.index as number)
        : (match.index as number);
      const endI = startI + match[0].length;

      return [calc, startI, endI - 1, "^"];
    }

    // Multiplicação e Divisão
    if (/\(?\-?[0-9]+\)?[*/]\(?\-?[0-9]+\)?/.test(v)) {
      const match = v.match(
        /\(?(\-?[0-9]+)\)?([*/])\(?(\-?[0-9]+)\)?/
      ) as RegExpMatchArray;

      const calc = match[1] + match[2] + match[3];

      const startI = start || (match.index as number);

      const endI = startI + match[0].length;

      return [calc, startI, endI - 1, match[2]];
    }

    // Adição e Subtração
    if (/\(?\-?[0-9]+\)?[+-]\(?\-?[0-9]+\)?/.test(v)) {
      const match = v.match(
        /\(?(\-?[0-9]+)\)?([+-])\(?(\-?[0-9]+)\)?/
      ) as RegExpMatchArray;

      const calc = match[1] + match[2] + match[3];

      const startI = start || (match.index as number);

      const endI = startI + match[0].length;

      return [calc, startI, endI - 1, match[2]];
    }

    return [v, 0, 0, ""];
  }

  private between(
    v: string,
    start: string,
    end: string = start
  ): [string, number, number] {
    let countOpen = 0;
    let countClose = 0;
    let i = v.indexOf(start);
    let inside = "";

    do {
      if (v[i] == start) countOpen++;
      else if (v[i] == end) countClose++;
      inside += v[i];
      i++;
    } while (countOpen != countClose);

    return [
      inside.replace(new RegExp(`\\${start}(.*)\\${end}`), "$1"),
      v.indexOf(start),
      i - 1,
    ];
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
    if (this.checkParentesis(this.valueS())) {
      let base = this.valueS();

      while (this.getPriority(base)[3] != "") {
        const priority = this.getPriority(base);

        const op = priority[3];
        const [n1, n2] = priority[0].split(op).map((v) => Number(v));
        let res;

        if (op == "+") res = n1 + n2;
        else if (op == "-") res = n1 - n2;
        else if (op == "*") res = n1 * n2;
        else if (op == "/") res = n1 / n2;
        else if (op == "^") res = n1 ** n2;

        base = (
          base.slice(0, priority[1]) +
          res +
          base.slice(priority[2] + 1)
        ).replaceAll(/\(([0-9]+)\)/g, "$1");
      }

      r = base;
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
