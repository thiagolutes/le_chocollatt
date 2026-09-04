import { Component, inject } from '@angular/core';
import { DadosLojaServico } from '../../servicos/dados-loja-servico';
import { Marca } from '../marca/marca';
import { Ornamento } from '../ornamento/ornamento';

@Component({
  selector: 'app-rodape',
  imports: [Marca, Ornamento],
  templateUrl: './rodape.html',
  styleUrl: './rodape.css',
})
export class Rodape {
  protected readonly config = inject(DadosLojaServico).configuracaoLoja();
}
