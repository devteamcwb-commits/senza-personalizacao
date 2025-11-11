import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizacaoService } from '../../core/services/personalizacao.service';

/**
 * Componente para o Passo 5: Escolha da embalagem de presente
 */
@Component({
  selector: 'app-passo-embalagem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passo-embalagem.component.html',
  styleUrls: ['./passo-embalagem.component.scss']
})
export class PassoEmbalagemComponent implements OnInit {
  @Output() concluido = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();

  opcoesEmbalagem: Array<{
    id: string;
    tipo: 'nenhuma' | 'caixa' | 'sacola';
    nome: string;
    valor: number;
    imagem: string;
  }> = [
    { id: 'nenhuma', tipo: 'nenhuma', nome: 'Não, obrigada', valor: 0, imagem: '🚫' },
    { id: 'caixa', tipo: 'caixa', nome: 'Caixa Premium', valor: 87.00, imagem: '📦' },
    { id: 'sacola', tipo: 'sacola', nome: 'Sacola', valor: 9.90, imagem: '🛍️' }
  ];

  embalagemSelecionada: string = 'nenhuma';

  constructor(private personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    // Carrega embalagem selecionada se houver
    const dados = this.personalizacaoService.obterDados();
    this.embalagemSelecionada = dados.embalagem?.tipo || 'nenhuma';
  }

  /**
   * Seleciona uma embalagem
   */
  selecionarEmbalagem(tipo: string): void {
    this.embalagemSelecionada = tipo;
  }

  /**
   * Obtém a opção de embalagem selecionada
   */
  obterEmbalagemSelecionada() {
    return this.opcoesEmbalagem.find(e => e.id === this.embalagemSelecionada);
  }

  /**
   * Formata valor em reais
   */
  formatarValor(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Avança para o próximo passo
   */
  avancar(): void {
    const embalagem = this.obterEmbalagemSelecionada();
    if (embalagem) {
      this.personalizacaoService.atualizarDados({
        embalagem: {
          tipo: embalagem.tipo,
          valor: embalagem.valor,
          nome: embalagem.nome
        }
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

