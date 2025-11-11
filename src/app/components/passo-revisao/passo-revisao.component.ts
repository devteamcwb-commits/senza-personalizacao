import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalizacaoService, DadosPersonalizacao } from '../../core/services/personalizacao.service';
import { CartaoVisualizacaoComponent } from '../cartao-visualizacao/cartao-visualizacao.component';

/**
 * Componente para o Passo 6: Revisão e Finalização
 * Exibe todos os itens selecionados e aciona o postMessage
 */
@Component({
  selector: 'app-passo-revisao',
  standalone: true,
  imports: [CommonModule, CartaoVisualizacaoComponent],
  templateUrl: './passo-revisao.component.html',
  styleUrls: ['./passo-revisao.component.scss']
})
export class PassoRevisaoComponent implements OnInit {
  @Output() concluido = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();
  @Input() urlDominioWP: string = 'http://127.0.0.1:5500';

  dados: Partial<DadosPersonalizacao> = {};
  valorTotal: number = 0;

  constructor(private personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    this.dados = this.personalizacaoService.obterDados();
    this.valorTotal = this.personalizacaoService.calcularValorTotal();
  }

  /**
   * Formata valor em reais
   */
  formatarValor(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Obtém o nome da cor do cartão
   */
  obterNomeCorCartao(): string {
    // Aqui você poderia mapear o ID da cor para o nome
    return 'Cartão Personalizado';
  }

  /**
   * Obtém a mensagem a ser exibida
   */
  obterMensagem(): string {
    if (this.dados.mensagemPessoal) {
      return this.dados.mensagemPessoal;
    }
    return this.dados.mensagemPronta || '';
  }

  /**
   * Finaliza a personalização e envia os dados via postMessage
   */
  finalizar(): void {
    // Envia os dados para o WordPress/WooCommerce via postMessage
    this.personalizacaoService.enviarParaWordPress(this.urlDominioWP);
    
    // TODO: Aqui seria integrada a lógica de backend (WooCommerce/Tray)
    // Exemplo: 
    // this.http.post('/wp-json/wc/v3/cart/add-item', this.dados).subscribe(
    //   response => {
    //     console.log('Item adicionado ao carrinho:', response);
    //     this.concluido.emit();
    //   },
    //   error => {
    //     console.error('Erro ao adicionar ao carrinho:', error);
    //   }
    // );

    // Por enquanto, apenas emite o evento de conclusão
    // Em produção, isso seria feito após confirmação do backend
    this.concluido.emit();
  }

  /**
   * Volta para o passo anterior
   */
  voltarPasso(): void {
    this.voltar.emit();
  }
}

