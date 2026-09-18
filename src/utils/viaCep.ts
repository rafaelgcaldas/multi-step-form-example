export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

/**
 * Busca dados de endereço a partir do CEP usando a API pública ViaCEP.
 * Retorna `null` em caso de erro ou CEP inválido/não encontrado.
 */
export async function fetchAddressByCep(
  cep: string
): Promise<ViaCepResponse | null> {
  const sanitized = cep.replace(/\D/g, "");
  if (sanitized.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
    if (!response.ok) return null;
    const data: ViaCepResponse = await response.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}
