export interface EntryPayload {
  quantity: number;  // Quantidade da entrada
  cost: number;     // Custo unitário
}

export interface ProductEntry extends EntryPayload {
  id: number;
  product_id: number;
  entry_date: Date;
  name: string;
}
