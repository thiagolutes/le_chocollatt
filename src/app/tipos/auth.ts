/** Espelha `LoginDTO` da API. */
export interface LoginPayload {
  email: string;
  senha: string;
}

/** Espelha `UsuarioLogadoDTO` da API. */
export interface UsuarioLogado {
  token: string;
  nome: string;
  email: string;
  expiraEm: string;
}
