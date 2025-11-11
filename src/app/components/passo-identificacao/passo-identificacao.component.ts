import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizacaoService } from '../../core/services/personalizacao.service';

/**
 * Componente para o Passo 1: Identificação
 * Coleta destinatarioNome e remetenteNome
 */
@Component({
  selector: 'app-passo-identificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passo-identificacao.component.html',
  styleUrls: ['./passo-identificacao.component.scss']
})
export class PassoIdentificacaoComponent implements OnInit {
  @Output() concluido = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();

  destinatarioNome: string = '';
  remetenteNome: string = '';

  constructor(private personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    // Carrega dados existentes se houver
    const dados = this.personalizacaoService.obterDados();
    this.destinatarioNome = dados.destinatarioNome || '';
    this.remetenteNome = dados.remetenteNome || '';
  }

  /**
   * Valida se os campos estão preenchidos
   */
  podeAvancar(): boolean {
    return this.destinatarioNome.trim().length > 0 && 
           this.remetenteNome.trim().length > 0;
  }

  /**
   * Salva os dados e avança para o próximo passo
   */
  avancar(): void {
    if (this.podeAvancar()) {
      this.personalizacaoService.atualizarDados({
        destinatarioNome: this.destinatarioNome.trim(),
        remetenteNome: this.remetenteNome.trim()
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

