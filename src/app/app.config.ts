import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      },
      ripple: true,
      inputVariant: 'outlined',
      zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100
      },
      translation: {
        startsWith: 'Começa com',
        contains: 'Contém',
        notContains: 'Não contém',
        endsWith: 'Termina com',
        equals: 'Igual',
        notEquals: 'Diferente',
        noFilter: 'Sem Filtro',
        lt: 'Menor que',
        lte: 'Menor ou igual a',
        gt: 'Maior que',
        gte: 'Maior ou igual a',
        is: 'É',
        isNot: 'Não é',
        before: 'Antes',
        after: 'Depois',
        dateIs: 'Data é',
        dateIsNot: 'Data não é',
        dateBefore: 'Data é antes',
        dateAfter: 'Data é depois',
        clear: 'Limpar',
        apply: 'Aplicar',
        matchAll: 'Corresponder Todos',
        matchAny: 'Corresponder Qualquer',
        addRule: 'Adicionar Regra',
        removeRule: 'Remover Regra',
        accept: 'Sim',
        reject: 'Não',
        choose: 'Escolher',
        upload: 'Upload',
        cancel: 'Cancelar',
        pending: 'Pendente',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sá'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        chooseYear: 'Escolher Ano',
        chooseMonth: 'Escolher Mês',
        chooseDate: 'Escolher Data',
        prevDecade: 'Década Anterior',
        nextDecade: 'Próxima Década',
        prevYear: 'Ano Anterior',
        nextYear: 'Próximo Ano',
        prevMonth: 'Mês Anterior',
        nextMonth: 'Próximo Mês',
        prevHour: 'Hora Anterior',
        nextHour: 'Próxima Hora',
        prevMinute: 'Minuto Anterior',
        nextMinute: 'Próximo Minuto',
        prevSecond: 'Segundo Anterior',
        nextSecond: 'Próximo Segundo',
        am: 'AM',
        pm: 'PM',
        today: 'Hoje',
        weekHeader: 'Sem',
        firstDayOfWeek: 0,
        dateFormat: 'dd/mm/yy',
        weak: 'Fraca',
        medium: 'Média',
        strong: 'Forte',
        passwordPrompt: 'Digite uma senha',
        emptyFilterMessage: 'Nenhum resultado encontrado',
        emptyMessage: 'Nenhuma opção disponível'
      }
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    AuthService,
    CookieService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
