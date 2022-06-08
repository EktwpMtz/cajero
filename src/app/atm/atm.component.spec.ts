import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IBillete } from '../ibillete';

import { AtmComponent } from './atm.component';

describe('AtmComponent', () => {
  let component: AtmComponent;
  let fixture: ComponentFixture<AtmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debería retirar 1 billete de cada denominación', () => {
    component.monto = 850;

    const esperado: IBillete[] = [
      { valor: 500, cantidad: 9 },
      { valor: 200, cantidad: 14 },
      { valor: 100, cantidad: 19 },
      { valor: 50, cantidad: 49 }
    ];

    component.retirar();
    expect(component.efectivo).toEqual(esperado);
  });

  it('Debería sumar 1 billete de cada denominación', () => {
    const copia = [...component.efectivo]
    const esperado: IBillete[] = copia.map(den => {
      den.cantidad = den.cantidad + 1;
      return den;
    });
    component.deposito = [
      { valor: 500, cantidad: 1 },
      { valor: 200, cantidad: 1 },
      { valor: 100, cantidad: 1 },
      { valor: 50, cantidad: 1 }
    ];
    component.depositar();

    expect(component.efectivo).toEqual(esperado);
  });

  it('Debería lanzar una alerta que diga que el monto no es multiplo de $50', () => {
    spyOn(window, "alert");

    component.monto = 75;
    component.retirar();

    expect(window.alert).toHaveBeenCalledWith("La cantidad a retirar debe ser multiplo de $50")
  })
});
