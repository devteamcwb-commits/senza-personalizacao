import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interface para os dados de personalização
 * Este objeto será enviado via postMessage para o WordPress/WooCommerce
 */
export interface DadosPersonalizacao {
  tipo: 'personalizacao-finalizada';
  destinatarioNome: string;
  remetenteNome: string;
  cartaoCortesiaCor: string;
  tipoMensagem: 'inspirar' | 'pessoal';
  mensagemPessoal?: string;
  intencao?: string;
  intencaoSignificado?: string;
  mensagemPronta?: string;
  embalagem: {
    tipo: 'nenhuma' | 'caixa' | 'sacola';
    valor: number;
    nome: string;
  };
  produtos: Array<{
    id: string;
    nome: string;
    valor: number;
  }>;
  valorTotal: number;
  timestamp: string;
}

/**
 * Serviço para gerenciar os dados de personalização
 * Armazena temporariamente os dados durante o fluxo multi-step
 */
@Injectable({
  providedIn: 'root'
})
export class PersonalizacaoService {
  private dadosSubject = new BehaviorSubject<Partial<DadosPersonalizacao>>({});
  public dados$: Observable<Partial<DadosPersonalizacao>> = this.dadosSubject.asObservable();

  private produtosPadrao: Array<{ id: string; nome: string; valor: number }> = [
    { id: '1', nome: 'Sabonete Líquido Sândalo & Rosa', valor: 89.90 },
    { id: '2', nome: 'Manteiga Corporal Sândalo & Figo', valor: 79.20 }
  ];

  constructor() {
    // Inicializa com valores padrão
    this.dadosSubject.next({
      tipo: 'personalizacao-finalizada',
      produtos: this.produtosPadrao,
      embalagem: {
        tipo: 'nenhuma',
        valor: 0,
        nome: 'Não, obrigada'
      }
    });
  }

  /**
   * Atualiza os dados de personalização
   */
  atualizarDados(dados: Partial<DadosPersonalizacao>): void {
    const dadosAtuais = this.dadosSubject.value;
    this.dadosSubject.next({ ...dadosAtuais, ...dados });
  }

  /**
   * Obtém os dados atuais de personalização
   */
  obterDados(): Partial<DadosPersonalizacao> {
    return this.dadosSubject.value;
  }

  /**
   * Calcula o valor total baseado nos produtos e embalagem
   */
  calcularValorTotal(): number {
    const dados = this.obterDados();
    const valorProdutos = dados.produtos?.reduce((sum, p) => sum + p.valor, 0) || 0;
    const valorEmbalagem = dados.embalagem?.valor || 0;
    return valorProdutos + valorEmbalagem;
  }

  /**
   * Envia os dados de personalização para o WordPress/WooCommerce via postMessage
   * @param urlDominioWP URL do domínio WordPress (ex: http://127.0.0.1:5500 para testes locais)
   */
  enviarParaWordPress(urlDominioWP: string): void {
    const dadosCompletos: DadosPersonalizacao = {
      ...this.obterDados(),
      tipo: 'personalizacao-finalizada',
      valorTotal: this.calcularValorTotal(),
      timestamp: new Date().toISOString()
    } as DadosPersonalizacao;

    // Validação básica
    if (!dadosCompletos.destinatarioNome || !dadosCompletos.remetenteNome) {
      console.error('Dados incompletos: destinatarioNome e remetenteNome são obrigatórios');
      return;
    }

    // Envia via postMessage para a janela pai (WordPress)
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(dadosCompletos, urlDominioWP);
      console.log('Dados enviados via postMessage:', dadosCompletos);
    } else {
      console.warn('Não foi possível enviar postMessage: window.parent não está disponível');
    }

    // TODO: Aqui seria integrada a lógica de backend (WooCommerce/Tray)
    // Exemplo: chamada AJAX para adicionar ao carrinho
    // this.http.post('/wp-json/wc/v3/cart/add-item', dadosCompletos).subscribe(...)
  }

  /**
   * Reinicia os dados de personalização
   */
  reiniciar(): void {
    this.dadosSubject.next({
      tipo: 'personalizacao-finalizada',
      produtos: this.produtosPadrao,
      embalagem: {
        tipo: 'nenhuma',
        valor: 0,
        nome: 'Não, obrigada'
      }
    });
  }
}

