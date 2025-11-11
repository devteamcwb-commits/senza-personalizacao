import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizacaoService } from '../../core/services/personalizacao.service';
import { CartaoVisualizacaoComponent } from '../cartao-visualizacao/cartao-visualizacao.component';

/**
 * Componente para o Passo 4: Escolha da intenção e mensagem
 * Permite selecionar uma intenção ou escrever mensagem pessoal
 */
@Component({
  selector: 'app-passo-intencao',
  standalone: true,
  imports: [CommonModule, FormsModule, CartaoVisualizacaoComponent],
  templateUrl: './passo-intencao.component.html',
  styleUrls: ['./passo-intencao.component.scss']
})
export class PassoIntencaoComponent implements OnInit {
  @Output() concluido = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();

  intencoes: Array<{ id: string; nome: string; mensagem: string }> = [
    { id: 'total', nome: 'Total', mensagem: 'Que este presente traga alegria e felicidade ao seu coração.' },
    { id: 'aniversario', nome: 'Aniversário', mensagem: 'Feliz aniversário! Que este novo ciclo seja repleto de realizações e momentos especiais.' },
    { id: 'casamento', nome: 'Casamento', mensagem: 'Parabéns pelo seu casamento! Que a união de vocês seja eterna e cheia de amor.' },
    { id: 'nascimento', nome: 'Nascimento', mensagem: 'Bem-vindo ao mundo! Que sua vida seja repleta de amor, saúde e felicidade.' },
    { id: 'agradecimento', nome: 'Agradecimento', mensagem: 'Muito obrigado por tudo. Sua presença em minha vida é um presente.' },
    { id: 'reconhecimento', nome: 'Reconhecimento', mensagem: 'Reconheço seu esforço e dedicação. Você é especial e importante.' },
    { id: 'reconciliacao', nome: 'Reconciliação', mensagem: 'Espero que este presente simbolize um novo começo e a renovação de nossa relação.' }
  ];

  intencaoSelecionada: string = '';
  intencaoSignificado: string = '';
  mensagemPessoal: string = '';
  mostrarPreview: boolean = false;
  destinatarioNome: string = '';
  remetenteNome: string = '';
  corCartao: string = '';

  constructor(public personalizacaoService: PersonalizacaoService) {}

  ngOnInit(): void {
    // Carrega dados existentes se houver
    const dados = this.personalizacaoService.obterDados();
    this.intencaoSelecionada = dados.intencao || '';
    this.intencaoSignificado = dados.intencaoSignificado || '';
    this.mensagemPessoal = dados.mensagemPessoal || '';
    this.destinatarioNome = dados.destinatarioNome || '';
    this.remetenteNome = dados.remetenteNome || '';
    this.corCartao = dados.cartaoCortesiaCor || '';

    // Se já tem tipo de mensagem definido, mostra preview
    if (dados.tipoMensagem) {
      this.mostrarPreview = true;
    }
  }

  /**
   * Obtém o tipo de mensagem selecionado
   */
  getTipoMensagem(): 'inspirar' | 'pessoal' {
    const dados = this.personalizacaoService.obterDados();
    return dados.tipoMensagem || 'pessoal';
  }

  /**
   * Obtém a mensagem a ser exibida no cartão
   */
  obterMensagemCartao(): string {
    if (this.getTipoMensagem() === 'pessoal') {
      return this.mensagemPessoal;
    } else {
      const intencao = this.intencoes.find(i => i.id === this.intencaoSelecionada);
      return intencao?.mensagem || '';
    }
  }

  /**
   * Atualiza os dados quando houver mudanças
   */
  atualizarDados(): void {
    const dados = this.personalizacaoService.obterDados();
    this.destinatarioNome = dados.destinatarioNome || '';
    this.remetenteNome = dados.remetenteNome || '';
    this.corCartao = dados.cartaoCortesiaCor || '';
    
    // Mostra preview se tiver dados suficientes
    if (this.destinatarioNome && this.remetenteNome && this.corCartao) {
      this.mostrarPreview = true;
    }
  }

  /**
   * Atualiza preview quando a mensagem pessoal muda
   */
  onMensagemChange(): void {
    this.atualizarDados();
  }

  /**
   * Atualiza preview quando a intenção muda
   */
  onIntencaoChange(): void {
    this.atualizarDados();
  }

  /**
   * Verifica se pode avançar
   */
  podeAvancar(): boolean {
    if (this.getTipoMensagem() === 'pessoal') {
      return this.mensagemPessoal.trim().length > 0;
    } else {
      return this.intencaoSelecionada.length > 0;
    }
  }

  /**
   * Avança para o próximo passo
   */
  avancar(): void {
    if (this.podeAvancar()) {
      const dadosAtualizacao: any = {};

      if (this.getTipoMensagem() === 'pessoal') {
        dadosAtualizacao.mensagemPessoal = this.mensagemPessoal.trim();
      } else {
        dadosAtualizacao.intencao = this.intencaoSelecionada;
        dadosAtualizacao.intencaoSignificado = this.intencaoSignificado.trim();
        const intencao = this.intencoes.find(i => i.id === this.intencaoSelecionada);
        dadosAtualizacao.mensagemPronta = intencao?.mensagem || '';
      }

      this.personalizacaoService.atualizarDados(dadosAtualizacao);
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

