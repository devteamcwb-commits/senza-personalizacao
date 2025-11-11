import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizacaoService } from '../../core/services/personalizacao.service';
import { PassoIdentificacaoComponent } from '../passo-identificacao/passo-identificacao.component';
import { PassoCartaoCortesiaComponent } from '../passo-cartao-cortesia/passo-cartao-cortesia.component';
import { PassoTipoMensagemComponent } from '../passo-tipo-mensagem/passo-tipo-mensagem.component';
import { PassoIntencaoComponent } from '../passo-intencao/passo-intencao.component';
import { PassoEmbalagemComponent } from '../passo-embalagem/passo-embalagem.component';
import { PassoRevisaoComponent } from '../passo-revisao/passo-revisao.component';

/**
 * Componente principal que gerencia o fluxo multi-step de personalização
 * Controla a navegação entre os 6 passos
 */
@Component({
  selector: 'app-personalizacao-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PassoIdentificacaoComponent,
    PassoCartaoCortesiaComponent,
    PassoTipoMensagemComponent,
    PassoIntencaoComponent,
    PassoEmbalagemComponent,
    PassoRevisaoComponent
  ],
  templateUrl: './personalizacao-main.component.html',
  styleUrls: ['./personalizacao-main.component.scss']
})
export class PersonalizacaoMainComponent implements OnInit {
  passoAtual: number = 1;
  totalPassos: number = 6;

  // URL base do WordPress para postMessage (configurável)
  // Para testes locais: http://127.0.0.1:5500
  // Para produção: deve ser configurado via input ou environment
  urlDominioWP: string = 'http://127.0.0.1:5500';

  constructor(public personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    // Tenta obter a URL do WordPress via query params
    const params = new URLSearchParams(window.location.search);
    const urlWP = params.get('wp_url');
    if (urlWP) {
      this.urlDominioWP = urlWP;
    } else {
      // Usa a URL padrão para testes locais
      // Em produção, isso deve ser configurado via environment
      this.urlDominioWP = 'http://127.0.0.1:5500';
    }
  }

  /**
   * Avança para o próximo passo
   */
  avancar(): void {
    if (this.passoAtual < this.totalPassos) {
      this.passoAtual++;
    }
  }

  /**
   * Volta para o passo anterior
   */
  voltar(): void {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  /**
   * Navega para um passo específico
   */
  irParaPasso(passo: number): void {
    if (passo >= 1 && passo <= this.totalPassos) {
      this.passoAtual = passo;
    }
  }

  /**
   * Handler para quando um passo é concluído
   */
  onPassoConcluido(): void {
    this.avancar();
  }

  /**
   * Handler para voltar de um passo
   */
  onVoltar(): void {
    this.voltar();
  }
}

