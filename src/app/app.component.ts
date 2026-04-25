import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CompetitionService } from './services/competition.service';
import { TranslateService } from './services/translate.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { WhatsappButtonComponent } from './components/whatsapp-button/whatsapp-button.component';
import { APP_VERSION } from './app-version';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    WhatsappButtonComponent,
  ],
  template: `
    <app-loading-spinner *ngIf="!(todoListo$ | async)"></app-loading-spinner>
    <div *ngIf="errorCarga$ | async as error" class="error-message">
      {{ error }}
    </div>
    <div class="app-shell" *ngIf="todoListo$ | async">
      <main class="app-shell__main">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer" role="contentinfo">
        <div class="app-footer__primary">
          <div class="app-footer__logos">
            <img
              class="app-footer__logo"
              src="assets/images/fvh-logo.png"
              alt="Federación Vasca de Hípica"
              loading="lazy"
            />
          </div>
          <div class="app-footer__meta">
            <span class="app-footer__title">Federación Vasca de Hípica</span>
            <span class="app-footer__sep" aria-hidden="true">·</span>
            <span class="app-footer__version">v{{ appVersion }}</span>
          </div>
          <a
            class="app-footer__powered"
            href="https://in2strides.com/2024/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Instrides S.L.
          </a>
        </div>
      </footer>
    </div>
    <app-whatsapp-button></app-whatsapp-button>
  `,
  styles: [
    `
      .error-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ff4444;
        color: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        z-index: 10000;
      }

      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .app-shell__main {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .app-footer {
        flex-shrink: 0;
        margin-top: auto;
        padding: 14px 18px max(12px, env(safe-area-inset-bottom, 0px));
        border-top: 1px solid var(--border-soft);
        background: linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%);
      }

      .app-footer__primary {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 12px 16px;
        max-width: 1100px;
        margin: 0 auto;
      }

      .app-footer__logos {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .app-footer__logo {
        height: 34px;
        width: auto;
        object-fit: contain;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12));
      }

      .app-footer__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 6px 8px;
        font-size: 0.8rem;
        color: var(--text-soft);
        text-align: center;
      }

      .app-footer__title {
        font-weight: 600;
        color: var(--text-main);
      }

      .app-footer__sep {
        color: #9fb0bf;
      }

      .app-footer__version {
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
      }

      .app-footer__powered {
        justify-self: end;
        text-align: right;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--primary-strong);
        text-decoration: none;
        border-bottom: 1px dashed transparent;
        white-space: nowrap;
      }

      .app-footer__powered:hover {
        color: var(--brand-navy);
        border-bottom-color: var(--brand-navy);
      }

      @media (max-width: 720px) {
        .app-footer__primary {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
        }

        .app-footer__powered {
          justify-self: center;
          text-align: center;
          white-space: normal;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  readonly appVersion = APP_VERSION;
  title = 'campeonato';
  categoriaSeleccionada: string = '0.65m';
  categorias: string[] = ['0.65m', '0.80m', '1.00m', '1.10m', '1.20m', '1.30m'];

  mostrarPopupResultados = false;

  datosListos$: Observable<boolean>;
  traduccionesListas$: Observable<boolean>;
  todoListo$: Observable<boolean>;
  errorCarga$: Observable<string | null>;

  constructor(
    private competitionService: CompetitionService,
    private translateService: TranslateService
  ) {
    this.datosListos$ = this.competitionService.datosListos$;
    this.traduccionesListas$ = this.translateService.getTranslationsLoaded$();
    this.todoListo$ = combineLatest([
      this.datosListos$,
      this.traduccionesListas$
    ]).pipe(
      map(([datosListos, traduccionesListas]) => datosListos && traduccionesListas)
    );
    this.errorCarga$ = this.competitionService.errorCarga;
  }

  ngOnInit() {
    // La carga de datos ya se inicia en el constructor del servicio
  }

  cambiarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  abrirPopupResultados() {
    this.mostrarPopupResultados = true;
  }

  cerrarPopupResultados() {
    this.mostrarPopupResultados = false;
  }
}
