import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizacaoService } from '../../core/services/personalizacao.service';

/**
 * Componente para o Passo 3: Escolha do tipo de mensagem
 * Opções: "Deixe a Senza inspirar" ou "Escrever mensagem pessoal"
 */
@Component({
  selector: 'app-passo-tipo-mensagem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passo-tipo-mensagem.component.html',
  styleUrls: ['./passo-tipo-mensagem.component.scss']
})
export class PassoTipoMensagemComponent implements OnInit {
  @Output() concluido = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();

  tipoMensagem: 'inspirar' | 'pessoal' | null = null;

  constructor(private personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    // Carrega tipo de mensagem selecionado se houver
    const dados = this.personalizacaoService.obterDados();
    this.tipoMensagem = dados.tipoMensagem || null;
  }

  /**
   * Seleciona o tipo de mensagem
   */
  selecionarTipo(tipo: 'inspirar' | 'pessoal'): void {
    this.tipoMensagem = tipo;
  }

  /**
   * Verifica se pode avançar
   */
  podeAvancar(): boolean {
    return this.tipoMensagem !== null;
  }

  /**
   * Avança para o próximo passo
   */
  avancar(): void {
    if (this.podeAvancar()) {
      this.personalizacaoService.atualizarDados({
        tipoMensagem: this.tipoMensagem!
      });
      this.concluido.emit();
    }
  }

  /**
   * Volta para o passo anterior
   */
  voltarPasso(): void {
    this.voltar.emit();
  }
}

