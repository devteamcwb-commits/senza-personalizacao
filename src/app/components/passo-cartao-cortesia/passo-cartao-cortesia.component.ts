import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizacaoService } from '../../core/services/personalizacao.service';

/**
 * Componente para o Passo 2: Escolha da cor do cartão cortesia
 */
@Component({
  selector: 'app-passo-cartao-cortesia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passo-cartao-cortesia.component.html',
  styleUrls: ['./passo-cartao-cortesia.component.scss']
})
export class PassoCartaoCortesiaComponent implements OnInit {
  @Output() concluido = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();

  coresCartao: Array<{ id: string; nome: string; cor: string; padrao: string }> = [
    { id: '1', nome: 'Vermelho Floral', cor: '#c62828', padrao: 'floral' },
    { id: '2', nome: 'Rosa', cor: '#e91e63', padrao: 'solid' },
    { id: '3', nome: 'Verde', cor: '#4caf50', padrao: 'solid' },
    { id: '4', nome: 'Azul', cor: '#2196f3', padrao: 'solid' },
    { id: '5', nome: 'Bege', cor: '#d7ccc8', padrao: 'solid' },
    { id: '6', nome: 'Dourado', cor: '#ffc107', padrao: 'metallic' },
    { id: '7', nome: 'Roxo', cor: '#9c27b0', padrao: 'solid' },
    { id: '8', nome: 'Marrom', cor: '#8d6e63', padrao: 'solid' },
    { id: '9', nome: 'Coral', cor: '#ff5722', padrao: 'solid' }
  ];

  corSelecionada: string = '';

  constructor(private personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    // Carrega cor selecionada se houver
    const dados = this.personalizacaoService.obterDados();
    this.corSelecionada = dados.cartaoCortesiaCor || this.coresCartao[0].id;
  }

  /**
   * Seleciona uma cor de cartão
   */
  selecionarCor(corId: string): void {
    this.corSelecionada = corId;
  }

  /**
   * Obtém o nome da cor selecionada
   */
  obterNomeCorSelecionada(): string {
    const cor = this.coresCartao.find(c => c.id === this.corSelecionada);
    return cor?.nome || '';
  }

  /**
   * Avança para o próximo passo
   */
  avancar(): void {
    this.personalizacaoService.atualizarDados({
      cartaoCortesiaCor: this.corSelecionada
    });
    this.concluido.emit();
  }

  /**
   * Volta para o passo anterior
   */
  voltarPasso(): void {
    this.voltar.emit();
  }
}

