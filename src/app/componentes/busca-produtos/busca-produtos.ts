import { Component, model } from '@angular/core';

@Component({
  selector: 'app-busca-produtos',
  imports: [],
  templateUrl: './busca-produtos.html',
  styleUrl: './busca-produtos.css',
})
export class BuscaProdutos {
  readonly termo = model('');
}
