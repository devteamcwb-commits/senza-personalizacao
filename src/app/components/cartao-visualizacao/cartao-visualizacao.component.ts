import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para pré-visualização do cartão personalizado
 * Usa apenas HTML/CSS com position: absolute para posicionar os nomes
 */
@Component({
  selector: 'app-cartao-visualizacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartao-visualizacao.component.html',
  styleUrls: ['./cartao-visualizacao.component.scss']
})
export class CartaoVisualizacaoComponent {
  @Input() destinatarioNome: string = '';
  @Input() remetenteNome: string = '';
  @Input() mensagem: string = '';
  @Input() corCartao: string = '1'; // ID da cor selecionada

  /**
   * Obtém a cor do cartão baseado no ID
   */
  obterCorCartao(): string {
    const cores: { [key: string]: string } = {
      '1': '#c62828', // Vermelho Floral
      '2': '#e91e63', // Rosa
      '3': '#4caf50', // Verde
      '4': '#2196f3', // Azul
      '5': '#d7ccc8', // Bege
      '6': '#ffc107', // Dourado
      '7': '#9c27b0', // Roxo
      '8': '#8d6e63', // Marrom
      '9': '#ff5722'  // Coral
    };
    return cores[this.corCartao] || '#c62828';
  }

  /**
   * Verifica se é o padrão floral (cor 1)
   */
  isFloral(): boolean {
    return this.corCartao === '1';
  }
}

