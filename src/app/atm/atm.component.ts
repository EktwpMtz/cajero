import { Component, OnInit } from '@angular/core';
import { IBillete } from '../ibillete';

@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.css']
})
export class AtmComponent implements OnInit {
  efectivo: IBillete[] = [
    { valor: 500, cantidad: 10 },
    { valor: 200, cantidad: 15 },
    { valor: 100, cantidad: 20 },
    { valor: 50, cantidad: 50 }
  ]
  monto = 0;

  deposito: IBillete[] = [
    { valor: 500, cantidad: 0 },
    { valor: 200, cantidad: 0 },
    { valor: 100, cantidad: 0 },
    { valor: 50, cantidad: 0 }
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.efectivo = this.ordenarPorDenominacion(this.efectivo);
    this.deposito = this.ordenarPorDenominacion(this.deposito);
  }

  validarInput(event: Event) {
    console.log((<HTMLInputElement>event.target).value);
  }

  retirar() {
    try {
      // Revisar sí alcanza el efectivo en el cajero
      if (this.valorBilletes(this.efectivo) < this.monto)
        throw new Error("No alcanza el efectivo en el cajero para dispensar el retiro");
      // Revisar sí es divisible por el billete de menor denominación existente
      const existentes = this.efectivo.filter(billete => billete.cantidad > 0 );
      if (this.monto%existentes[existentes.length-1].valor != 0)
        throw new Error(`La cantidad a retirar debe ser multiplo de $${existentes[existentes.length-1].valor}`)

      if (this.monto < existentes[existentes.length-1].valor)
        throw new Error(`La cantidad mínima a retirar debe ser $${existentes[existentes.length-1].valor}`)
      
      // Entregar dinero por billetes más grandes primero
      const retiro: IBillete[] = [];
      for (let i = 0; i < this.efectivo.length; i++) {
        if(this.efectivo[i].cantidad <= 0) continue;

        const restante = this.monto - this.valorBilletes(retiro);

        const cantidad = Math.floor(restante / this.efectivo[i].valor);
        if (cantidad < this.efectivo[i].cantidad) {
          retiro.push({ valor: this.efectivo[i].valor, cantidad: cantidad});
          this.efectivo[i].cantidad -= cantidad;

          continue;
        }

        retiro.push({ valor: this.efectivo[i].valor, cantidad: this.efectivo[i].cantidad });
        this.efectivo[i].cantidad -= this.efectivo[i].cantidad;
      }
    } catch (error) {
      console.error(error);
      alert((<Error>error).message);
    }
  }

  depositar() {
    try {
      for (let i = 0; i < this.deposito.length; i++) {
        // Verificar que la cantidad de billetes sea un número natural
        if (this.deposito[i].cantidad < 0 || this.deposito[i].cantidad % 1 != 0) 
          throw new Error("La cantidad de billetes a depositar debe ser un valor entero positivo")
        this.efectivo[i].cantidad += this.deposito[i].cantidad;
        this.deposito[i].cantidad = 0;
      }
    } catch (error) {
      console.error(error);
      alert((<Error>error).message);
    }
  }

  valorBilletes(billetes: IBillete[]): number {
    let valor = 0;
    for (let billete of billetes) {
      valor += billete.valor * billete.cantidad;
    }
    return valor;
  }
  ordenarPorDenominacion(billetes: IBillete[]): IBillete[] {
    return billetes.sort((a, b) => {
        return b.valor - a.valor;
      });
  }
}
